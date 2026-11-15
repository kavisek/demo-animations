import { redirect } from "next/navigation";
import { projects } from "@/lib/animations";

// The console opens on the first project
export default function Home() {
  redirect(`/${projects[0].id}`);
}
