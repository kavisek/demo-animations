import { notFound } from "next/navigation";
import ProjectOverview from "@/components/ProjectOverview";
import { getProject, projects } from "@/lib/animations";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ project: p.id }));
}

export async function generateMetadata({ params }) {
  const project = getProject((await params).project);
  return project ? { title: project.name, description: project.description } : {};
}

export default async function ProjectPage({ params }) {
  const project = getProject((await params).project);
  if (!project) notFound();
  return <ProjectOverview project={project} />;
}
