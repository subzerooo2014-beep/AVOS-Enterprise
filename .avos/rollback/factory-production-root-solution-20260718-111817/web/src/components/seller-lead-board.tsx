"use client";

import {
  leadStageLabels,
  LeadStage,
} from "@/data/leads";
import {
  useSellerWorkspaceStore,
} from "@/store/seller-workspace-store";

const stages: readonly LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "offer",
  "negotiation",
  "won",
];

export function SellerLeadBoard() {
  const leads = useSellerWorkspaceStore(
    (state) => state.leads,
  );

  const setLeadStage = useSellerWorkspaceStore(
    (state) => state.setLeadStage,
  );

  return (
    <div className="lead-board">
      {stages.map((stage) => (
        <section key={stage}>
          <header>
            <strong>{leadStageLabels[stage]}</strong>
            <span>
              {
                leads.filter(
                  (lead) => lead.stage === stage,
                ).length
              }
            </span>
          </header>

          <div>
            {leads
              .filter((lead) => lead.stage === stage)
              .map((lead) => (
                <article key={lead.id}>
                  <div className="lead-card-top">
                    <span>أولوية {lead.score}</span>
                    <b>{lead.source}</b>
                  </div>

                  <h3>{lead.customerName}</h3>
                  <p>{lead.vehicleTitle}</p>
                  <small>{lead.phone}</small>

                  <select
                    value={lead.stage}
                    onChange={(event) =>
                      setLeadStage(
                        lead.id,
                        event.target.value as LeadStage,
                      )
                    }
                  >
                    {stages.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {leadStageLabels[option]}
                      </option>
                    ))}
                  </select>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
