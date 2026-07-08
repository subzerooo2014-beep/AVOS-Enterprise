export function getNextBestAction(record: any): string {
  if (!record) return "CREATE_RECORD";

  if (!record.phone && !record.email) return "COLLECT_CONTACT_DETAILS";
  if (record.status === "NEW") return "CONTACT_CUSTOMER";
  if (record.status === "CONTACTED") return "QUALIFY_CUSTOMER";
  if (record.status === "QUALIFIED") return "CREATE_OPPORTUNITY";
  if (record.status === "OPPORTUNITY") return "FOLLOW_UP_AND_CLOSE";
  if (record.status === "WON") return "HANDOVER_TO_SALES";
  if (record.status === "LOST") return "REVIEW_LOSS_REASON";

  return "MONITOR";
}

export function enrichCrmRecord(record: any): any {
  if (!record) return null;

  return {
    ...record,
    nextBestAction: getNextBestAction(record),
  };
}
