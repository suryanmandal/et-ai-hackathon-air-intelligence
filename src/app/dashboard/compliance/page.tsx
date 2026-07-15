import { redirect } from "next/navigation";

export default function ComplianceRedirect() {
  redirect("/dashboard/agent-logs/override");
}
