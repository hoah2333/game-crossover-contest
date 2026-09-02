"use client";

import { useEffect, useState } from "react";

import type { ReactNode } from "react";

type ContestMessage = { type: "ping" } | { type: "logged-in" };

const PING_TIMEOUT_MS = 100;

export const LoadGuard = ({ userId, children }: { userId: number; children: ReactNode }) => {
  const isLoggedIn = userId > 0;
  const [ready, setReady] = useState(isLoggedIn);

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

    const timeoutId = globalThis.setTimeout(() => {
      setReady(true);
    }, PING_TIMEOUT_MS);

    channel.addEventListener("message", (event: MessageEvent) => {
      if (isContestMessage(event.data) && event.data.type === "logged-in") {
        globalThis.clearTimeout(timeoutId);
        location.replace("about:blank");
      }
    });

    return () => {
      globalThis.clearTimeout(timeoutId);
      channel.close();
    };
  }, [isLoggedIn]);

  if (!ready) {
    return null;
  }
  return children;
};

const isContestMessage = (data: unknown): data is ContestMessage => {
  return (
    typeof data === "object" && data !== null && "type" in data && (data.type === "ping" || data.type === "logged-in")
  );
};
