import { redirect } from "next/navigation";

export default function AgentLogsRedirect() {
  redirect("/dashboard/agent-logs/topology");
}
