"use client";

import { useState } from "react";
import {
  useBuyerAccountStore,
} from "@/store/buyer-account-store";

export function BuyerMessageCenter() {
  const conversations = useBuyerAccountStore(
    (state) => state.conversations,
  );

  const activeConversationId =
    useBuyerAccountStore(
      (state) =>
        state.activeConversationId,
    );

  const setActiveConversation =
    useBuyerAccountStore(
      (state) =>
        state.setActiveConversation,
    );

  const sendMessage =
    useBuyerAccountStore(
      (state) => state.sendMessage,
    );

  const [message, setMessage] =
    useState("");

  const active =
    conversations.find(
      (conversation) =>
        conversation.id ===
        activeConversationId,
    ) ?? conversations[0];

  return (
    <div className="message-center">
      <aside>
        <div className="message-center-heading">
          <span>المحادثات</span>
          <strong>
            {conversations.length}
          </strong>
        </div>

        {conversations.map(
          (conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={
                conversation.id ===
                active?.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveConversation(
                  conversation.id,
                )
              }
            >
              <img
                src={
                  conversation.vehicleImage
                }
                alt={
                  conversation.vehicleTitle
                }
              />
              <div>
                <strong>
                  {conversation.sellerName}
                </strong>
                <span>
                  {conversation.vehicleTitle}
                </span>
              </div>
              {conversation.unreadCount >
              0 ? (
                <b>
                  {
                    conversation.unreadCount
                  }
                </b>
              ) : null}
            </button>
          ),
        )}
      </aside>

      <section>
        {active ? (
          <>
            <header>
              <div>
                <strong>
                  {active.sellerName}
                </strong>
                <span>
                  {active.online
                    ? "متصل الآن"
                    : "غير متصل"}
                </span>
              </div>
              <button type="button">
                حجز موعد
              </button>
            </header>

            <div className="message-thread">
              {active.messages.map(
                (item) => (
                  <div
                    key={item.id}
                    className={`message-bubble ${item.sender}`}
                  >
                    <span>
                      {item.sender === "buyer"
                        ? "أنت"
                        : item.sender ===
                            "avos"
                          ? "AVOS"
                          : active.sellerName}
                    </span>
                    <p>{item.text}</p>
                  </div>
                ),
              )}
            </div>

            <div className="message-composer">
              <input
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value,
                  )
                }
                placeholder="اكتب رسالتك..."
              />
              <button
                type="button"
                onClick={() => {
                  if (!message.trim()) {
                    return;
                  }

                  sendMessage(
                    active.id,
                    message.trim(),
                  );

                  setMessage("");
                }}
              >
                إرسال
              </button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
