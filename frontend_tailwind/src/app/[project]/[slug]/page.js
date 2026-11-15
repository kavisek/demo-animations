import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Replayable from "@/components/Replayable";
import { demos } from "@/components/demoRegistry";
import { animations, getAnimation, getProject } from "@/lib/animations";

export const dynamicParams = false;

export function generateStaticParams() {
  return animations.map((a) => ({ project: a.project, slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { project, slug } = await params;
  const animation = getAnimation(project, slug);
  return animation ? { title: animation.title, description: animation.description } : {};
}

export default async function AnimationPage({ params }) {
  const { project: projectId, slug } = await params;
  const project = getProject(projectId);
  const animation = getAnimation(projectId, slug);
  const Demo = demos[slug];
  if (!project || !animation || !Demo) notFound();

  // "Next" cycles through this project's demos only
  const siblings = animations.filter((a) => a.project === projectId);
  const next = siblings[(siblings.indexOf(animation) + 1) % siblings.length];

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <Link href={`/${project.id}`} className="hover:text-blue-700 hover:underline">
          {project.name}
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
          href={`/${next.project}/${next.slug}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
        >
          Next: {next.title}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </>
  );
}
