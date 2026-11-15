import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Replayable from "@/components/Replayable";
import { demos } from "@/components/demoRegistry";
import { animations, getAnimation } from "@/lib/animations";

export function generateStaticParams() {
  return animations.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const animation = getAnimation(slug);
  return animation ? { title: animation.title, description: animation.description } : {};
}

export default async function AnimationPage({ params }) {
  const { slug } = await params;
  const animation = getAnimation(slug);
  const Demo = demos[slug];
  if (!animation || !Demo) notFound();

  const index = animations.indexOf(animation);
  const next = animations[(index + 1) % animations.length];

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-700 hover:underline">
          Overview
        </Link>
        <Icon name="chevron" className="h-4 w-4" />
        <span>{animation.group}</span>
        <Icon name="chevron" className="h-4 w-4" />
        <span className="text-gray-900">{animation.title}</span>
      </nav>

      <Replayable title={animation.title} slug={animation.slug} description={animation.description}>
        <Demo />
      </Replayable>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white">
        <header className="border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-medium text-gray-900">Key Tailwind classes</h2>
        </header>
        <pre className="overflow-x-auto px-5 py-4 font-mono text-sm text-gray-800">{animation.classes}</pre>
      </section>

      <div className="mt-6 flex justify-end">
        <Link
          href={`/animations/${next.slug}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
        >
          Next: {next.title}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </>
  );
}
