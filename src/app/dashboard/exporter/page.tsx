import { redirect } from "next/navigation";

export default function ExporterRedirect() {
  redirect("/dashboard/agent-logs/exporter");
}
