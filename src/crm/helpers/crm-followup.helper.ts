export function normalizeFollowUpDate(value: any): Date | null {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function isFollowUpOverdue(value: any, now = new Date()): boolean {
  const date = normalizeFollowUpDate(value);
  if (!date) return false;
  return date.getTime() < now.getTime();
}

export function getFollowUpBucket(value: any, now = new Date()): "NONE" | "OVERDUE" | "TODAY" | "UPCOMING" {
  const date = normalizeFollowUpDate(value);

  if (!date) return "NONE";

  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);

  const endToday = new Date(now);
  endToday.setHours(23, 59, 59, 999);

  if (date.getTime() < startToday.getTime()) return "OVERDUE";
  if (date.getTime() <= endToday.getTime()) return "TODAY";

  return "UPCOMING";
}
