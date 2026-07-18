"use client";

import clsx from "clsx";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "活动", href: "https://www.wikidot.com/account/activity" },
  { label: "消息", href: "https://www.wikidot.com/account/messages" },
  { label: "网站", href: "https://www.wikidot.com/account/sites" },
  { label: "设置", href: "https://www.wikidot.com/account/settings" },
  { label: "升级", href: "https://www.wikidot.com/account/upgrade" },
] as const;

export const Dropdown = ({ username }: { username: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <button
      className={clsx("relative flex cursor-pointer items-center gap-1 transition-colors hover:text-white", {
        "text-white": isOpen,
      })}
      onClick={() => {
        setIsOpen((open) => !open);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          setIsOpen((open) => !open);
        }
      }}
      tabIndex={0}
      onBlur={() => {
        setIsOpen(false);
      }}
    >
      <span>{username}</span>
      <span>
        <ChevronDown size={12} />
      </span>
      <div className={clsx("absolute top-full right-0 z-10", isOpen ? "flex" : "hidden")}>
        <div className="flex min-w-40 flex-col items-start bg-menu-bg text-white">
          {menuItems.map(({ href, label }) => (
            <a
              className="flex w-full px-4 py-2 transition-colors hover:bg-menu-bg-hover hover:text-black"
              key={label}
              href={href}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </button>
  );
};
