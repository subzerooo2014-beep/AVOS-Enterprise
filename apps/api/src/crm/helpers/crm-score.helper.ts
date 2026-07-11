export function calculateCrmScore(record: any): number {
  let score = 0;

  if (record?.phone) score += 20;
  if (record?.email) score += 20;
  if (record?.source) score += 10;
  if (record?.assignedToId) score += 10;

  if (record?.status === "CONTACTED") score += 15;
  if (record?.status === "QUALIFIED") score += 25;
  if (record?.status === "OPPORTUNITY") score += 35;
  if (record?.status === "WON") score += 50;

  return Math.min(score, 100);
}
