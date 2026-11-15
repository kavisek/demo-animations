import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { useCurrentProject } from "@/components/ProjectPicker";
import { animations, groupsFor, projects } from "@/lib/animations";

function NavItem({ href, icon, label, active, collapsed }) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group flex h-10 items-center gap-4 rounded-r-full pl-6 pr-4 text-sm transition-colors ${
        active
          ? "bg-blue-50 font-medium text-blue-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon
        name={icon}
        className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
          active ? "text-blue-700" : "text-gray-500"
        }`}
      />
      <span className={`truncate ${collapsed ? "md:hidden" : ""}`}>{label}</span>
    </Link>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const pathname = usePathname();
  const project = useCurrentProject();
  const items = animations.filter((a) => a.project === project.id);

  return (
    <>
      {/* Backdrop for the mobile drawer */}
      <div
        onClick={onClose}
        className={`fixed inset-0 top-14 z-20 bg-gray-900/30 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <nav
        aria-label="Main navigation"
        className={`fixed bottom-0 left-0 top-14 z-30 w-64 overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-white pb-6 pt-2 transition-all duration-200 ease-out ${
          mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        } md:translate-x-0 md:shadow-none ${collapsed ? "md:w-[72px]" : "md:w-64"}`}
      >
        {/* Project switcher for small screens, where the header picker is hidden */}
        <div className="mx-4 mb-3 grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 md:hidden">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/${p.id}`}
              className={`flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[11px] font-medium transition ${
                p.id === project.id ? "bg-white text-blue-700 shadow-sm" : "text-gray-600"
              }`}
            >
              <Icon name={p.icon} className="h-4 w-4" />
              <span className="truncate">{p.name.split(" ")[0]}</span>
            </Link>
          ))}
        </div>

        <NavItem
          href={`/${project.id}`}
          icon="home"
          label="Overview"
          active={pathname === `/${project.id}`}
          collapsed={collapsed}
        />

        {/* key restarts the fade when switching projects */}
        <div key={project.id} className="animate-fade-in">
        {groupsFor(project.id).map((group) => (
          <div key={group}>
            {/* In the collapsed rail, a divider stands in for the section title */}
            <p
              className={`mb-1 mt-4 whitespace-nowrap px-6 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                collapsed ? "md:mx-4 md:h-px md:overflow-hidden md:bg-gray-200 md:px-0 md:text-transparent" : ""
              }`}
            >
              {group}
            </p>
            {items
              .filter((a) => a.group === group)
              .map((a) => (
                <NavItem
                  key={a.slug}
                  href={`/${a.project}/${a.slug}`}
                  icon={a.icon}
                  label={a.title}
                  active={pathname === `/${a.project}/${a.slug}`}
                  collapsed={collapsed}
                />
              ))}
          </div>
        ))}
        </div>
      </nav>
    </>
  );
}
