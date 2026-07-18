"use client";

import { create } from "zustand";
import {
  buyerActivities,
} from "@/data/buyer-activity";
import {
  buyerConversations,
} from "@/data/messages";
import {
  BuyerBooking,
  buyerBookings,
} from "@/data/bookings";

interface BuyerAccountState {
  activities: typeof buyerActivities;
  conversations: typeof buyerConversations;
  bookings: readonly BuyerBooking[];
  activeConversationId: string;
  markActivityRead: (activityId: string) => void;
  setActiveConversation: (
    conversationId: string,
  ) => void;
  sendMessage: (
    conversationId: string,
    text: string,
  ) => void;
  addBooking: (booking: BuyerBooking) => void;
}

export const useBuyerAccountStore =
  create<BuyerAccountState>((set) => ({
    activities: buyerActivities,
    conversations: buyerConversations,
    bookings: buyerBookings,
    activeConversationId:
      buyerConversations[0]?.id ?? "",
    markActivityRead: (activityId) =>
      set((state) => ({
        activities: state.activities.map(
          (activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  unread: false,
                }
              : activity,
        ),
      })),
    setActiveConversation: (
      conversationId,
    ) =>
      set({
        activeConversationId:
          conversationId,
      }),
    sendMessage: (
      conversationId,
      text,
    ) =>
      set((state) => ({
        conversations:
          state.conversations.map(
            (conversation) =>
              conversation.id ===
              conversationId
                ? {
                    ...conversation,
                    messages: [
                      ...conversation.messages,
                      {
                        id:
                          "message-local-" +
                          Date.now(),
                        sender:
                          "buyer" as const,
                        text,
                        sentAt:
                          new Date().toISOString(),
                        read: true,
                      },
                    ],
                  }
                : conversation,
          ),
      })),
    addBooking: (booking) =>
      set((state) => ({
        bookings: [
          ...state.bookings,
          booking,
        ],
      })),
  }));
