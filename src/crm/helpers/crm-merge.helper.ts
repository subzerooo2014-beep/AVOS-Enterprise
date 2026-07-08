export function mergeCrmPayload(primary: any, secondary: any): any {
  return {
    ...secondary,
    ...primary,
    phone: primary?.phone ?? secondary?.phone,
    email: primary?.email ?? secondary?.email,
    source: primary?.source ?? secondary?.source,
    notes: [secondary?.notes, primary?.notes].filter(Boolean).join("\n"),
    timeline: [
      ...(Array.isArray(secondary?.timeline) ? secondary.timeline : []),
      ...(Array.isArray(primary?.timeline) ? primary.timeline : []),
    ],
    activities: [
      ...(Array.isArray(secondary?.activities) ? secondary.activities : []),
      ...(Array.isArray(primary?.activities) ? primary.activities : []),
    ],
  };
}
