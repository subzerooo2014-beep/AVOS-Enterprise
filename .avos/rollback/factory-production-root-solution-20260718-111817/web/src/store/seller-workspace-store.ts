"use client";

import { create } from "zustand";
import {
  LeadStage,
  sellerLeads,
} from "@/data/leads";

interface SellerWorkspaceState {
  leads: typeof sellerLeads;
  setLeadStage: (
    leadId: string,
    stage: LeadStage,
  ) => void;
}

export const useSellerWorkspaceStore =
  create<SellerWorkspaceState>((set) => ({
    leads: sellerLeads,
    setLeadStage: (leadId, stage) =>
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === leadId
            ? { ...lead, stage }
            : lead,
        ),
      })),
  }));
