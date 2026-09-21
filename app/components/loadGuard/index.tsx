"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ContestMessage = { type: "ping" } | { type: "logged-in" };

export const LoadGuard = () => {
  const searchParams = useSearchParams();
  const userId = Number(searchParams.get("id"));
  const isLoggedIn = userId > 0;

  useEffect(() => {
    const channel = new BroadcastChannel("contest");

    if (isLoggedIn) {
      channel.postMessage({ type: "logged-in" } satisfies ContestMessage);
      channel.addEventListener("message", (event: MessageEvent) => {
        if (isContestMessage(event.data) && event.data.type === "ping") {
          channel.postMessage({ type: "logged-in" } satisfies ContestMessage);
        }
      });
      return () => {
        channel.close();
      };
    }

    channel.postMessage({ type: "ping" } satisfies ContestMessage);

    channel.addEventListener("message", (event: MessageEvent) => {
      if (isContestMessage(event.data) && event.data.type === "logged-in") {
        location.replace("about:blank");
      }
    });

    return () => {
      channel.close();
    };
  }, [isLoggedIn]);

  return null;
};

const isContestMessage = (data: unknown): data is ContestMessage => {
  return (
    typeof data === "object" && data !== null && "type" in data && (data.type === "ping" || data.type === "logged-in")
  );
};
