import {
  byId,
  formatCurrency,
  initialData,
  type ProjectStatus,
  type TicketPriority,
} from "@/src/domain";

export function customerName(customerId: string) {
  return byId(initialData.customers, customerId)?.name ?? "Unknown customer";
}

export function projectName(projectId: string) {
  return byId(initialData.projects, projectId)?.name ?? "Unknown project";
}

export function ticketName(ticketId: string) {
  return byId(initialData.tickets, ticketId)?.title ?? "No ticket";
}

export function colleagueName(colleagueId: string) {
  return byId(initialData.colleagues, colleagueId)?.name ?? "Unknown teammate";
}

export function formatEuro(value: number) {
  return formatCurrency(value);
}

export function projectStatusTone(status: ProjectStatus) {
  if (status === "Active") return "agency-badge--amber";
  if (status === "At risk") return "agency-badge--amber";
  if (status === "Done") return "agency-badge--green";
  return "agency-badge--blue";
}

export function ticketPriorityTone(priority: TicketPriority) {
  if (priority === "Urgent" || priority === "High") return "agency-badge--amber";
  if (priority === "Medium") return "agency-badge--blue";
  return "agency-badge--neutral";
}
