// Turns a rendered demo back into copyable HTML and CSS.
// HTML: the demo's live DOM, pretty-printed.
// CSS: only the stylesheet rules that match elements in the demo, plus the
// @keyframes they use, so the output is the real Tailwind-generated CSS.

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

const escapeText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

function attrs(el) {
  return [...el.attributes].map((a) => (a.value === "" ? ` ${a.name}` : ` ${a.name}="${escapeAttr(a.value)}"`)).join("");
}

function formatNode(node, depth) {
  const pad = "  ".repeat(depth);
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.replace(/\s+/g, " ").trim();
    return text ? `${pad}${escapeText(text)}\n` : "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const tag = node.localName;
  const open = `<${tag}${attrs(node)}>`;
  if (VOID.has(tag)) return `${pad}${open}\n`;

  const children = [...node.childNodes].filter((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim());
  if (children.length === 0) return `${pad}${open}</${tag}>\n`;
  // Keep short text-only elements on one line: <span>Running</span>
  if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
    const text = escapeText(children[0].textContent.replace(/\s+/g, " ").trim());
    if (open.length + text.length < 120) return `${pad}${open}${text}</${tag}>\n`;
  }
  return `${pad}${open}\n${children.map((c) => formatNode(c, depth + 1)).join("")}${pad}</${tag}>\n`;
}

export function extractHtml(root) {
  return [...root.childNodes].map((n) => formatNode(n, 0)).join("").trim();
}

// Pseudo-classes that depend on interaction or position; strip them so that
// e.g. `.hover\:bg-gray-50:hover` is kept when the element exists at all.
const PSEUDO =
  /::?(hover|focus-visible|focus-within|focus|active|visited|checked|disabled|placeholder|before|after|selection|marker|first-child|last-child|first-of-type|last-of-type|-webkit-[\w-]+|-moz-[\w-]+)(?![\w-])/g;

function makeMatcher(els, root) {
  const cache = new Map();
  return (selectorText) => {
    if (cache.has(selectorText)) return cache.get(selectorText);
    const hit = selectorText.split(",").some((part) => {
      const sel = part.replace(PSEUDO, "").trim() || "*";
      try {
        return root.matches(sel) || root.querySelector(sel) !== null || els.some((el) => el.matches(sel));
      } catch {
        return false;
      }
    });
    cache.set(selectorText, hit);
    return hit;
  };
}

function animationNames(value) {
  return (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && s !== "none");
}

export function extractCss(root) {
  const els = [root, ...root.querySelectorAll("*")];
  const matches = makeMatcher(els, root);
  const used = new Set();
  const keyframes = new Map();
  const themeVars = new Map(); // Tailwind v4 theme: --color-*, --animate-*, … defined on :root
  const properties = new Map(); // Tailwind v4 @property registrations for --tw-* variables
  let twDefaults = "";

  els.forEach((el) => animationNames(el.style?.animationName).forEach((n) => used.add(n)));

  function walk(rules) {
    const out = [];
    for (const rule of rules) {
      if (typeof CSSPropertyRule !== "undefined" && rule instanceof CSSPropertyRule) {
        properties.set(rule.name, rule.cssText);
      } else if (rule instanceof CSSStyleRule) {
        if (rule.selectorText.includes(":root")) {
          for (const prop of rule.style) {
            if (prop.startsWith("--")) themeVars.set(prop, rule.style.getPropertyValue(prop).trim());
          }
          continue;
        }
        // Tailwind's per-element defaults for --tw-* variables, needed by transform/ring/shadow utilities
        if (rule.selectorText.startsWith("*") && rule.cssText.includes("--tw-")) {
          twDefaults ||= rule.cssText;
          continue;
        }
        if (!rule.selectorText.includes(".")) continue; // skip element resets
        if (!matches(rule.selectorText)) continue;
        animationNames(rule.style.animationName).forEach((n) => used.add(n));
        out.push(rule.cssText);
      } else if (rule instanceof CSSKeyframesRule) {
        keyframes.set(rule.name, rule.cssText);
      } else if (rule instanceof CSSMediaRule) {
        const inner = walk(rule.cssRules);
        if (inner.length) out.push(`@media ${rule.conditionText} {\n${inner.map((r) => `  ${r}`).join("\n")}\n}`);
      } else if (rule.cssRules) {
        out.push(...walk(rule.cssRules)); // @layer, @supports
      }
    }
    return out;
  }

  const rules = [];
  for (const sheet of document.styleSheets) {
    try {
      rules.push(...walk(sheet.cssRules));
    } catch {
      // Cross-origin stylesheet (e.g. a font CDN): its rules can't be read
    }
  }

  // Keep only the theme variables the matched rules reference, following var() chains
  const unique = [...new Set(rules)];
  const body = unique.join("\n");
  const refs = (text) => [...text.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]);
  const needed = new Set();
  const queue = refs(body);
  while (queue.length) {
    const name = queue.pop();
    if (needed.has(name) || !themeVars.has(name)) continue;
    needed.add(name);
    queue.push(...refs(themeVars.get(name)));
  }
  // v4 animations are `animation: var(--animate-x)`; the keyframe name is the first word of each part
  for (const name of needed) {
    if (name.startsWith("--animate-")) themeVars.get(name).split(",").forEach((part) => used.add(part.trim().split(/\s+/)[0]));
  }
  const rootVars = needed.size ? `:root { ${[...needed].map((n) => `${n}: ${themeVars.get(n)};`).join(" ")} }` : "";
  const props = [...properties].filter(([name]) => body.includes(name) || twDefaults.includes(name)).map(([, css]) => css);

  const frames = [...used].filter((n) => keyframes.has(n)).map((n) => keyframes.get(n));
  return [rootVars, ...props, twDefaults, ...unique, ...frames].filter(Boolean).map(prettyRule).join("\n\n");
}

// "a { b: c; d: e; }" → multi-line, for readability
function prettyRule(css) {
  return css
    .replace(/\{\s*/g, "{\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*\}/g, "\n}")
    .replace(/\n {2}\n\}/g, "\n}")
    // Keyframe selectors ("0%", "from", "to") sit at the top level, not indented as declarations
    .replace(/^ {2}((?:[\d.]+%|from|to)(?:,\s*(?:[\d.]+%|from|to))*\s*\{)/gm, "$1");
}

// Everything the Code panel shows, read from the demo's DOM at this moment
export function snapshotDemo(root, title) {
  const html = extractHtml(root);
  const css = extractCss(root);
  return { html, css, file: standaloneDocument(title, html, css) };
}

export function standaloneDocument(title, html, css) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeText(title)}</title>
<style>
/* Minimal reset (Tailwind's preflight does more) */
*, ::before, ::after { box-sizing: border-box; border: 0 solid #e5e7eb; }
body { margin: 0; padding: 24px; background: #f9fafb; color: #111827; font-family: ui-sans-serif, system-ui, sans-serif; }
table { border-collapse: collapse; }
button { font: inherit; background: none; cursor: pointer; }
h1, h2, h3, p, ol, ul { margin: 0; padding: 0; }

${css}
</style>
</head>
<body>
${html}
</body>
</html>
`;
}
