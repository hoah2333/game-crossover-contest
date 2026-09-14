"use client";

import Image from "next/image";

import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useParseFtml } from "@/app/lib/hooks/useParseFtml";
import { parseSideBar } from "./parseSideBar";

import type { KeyboardEvent } from "react";
import type { SideBarLicenseBlock, SideBarMediaBlock, SideBarNavBlock } from "./types";

export const SideBar = ({ cnSideNavFtml }: { cnSideNavFtml: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sideBarRef = useRef<HTMLDivElement>(null);

  const cnSideNavHtml = useParseFtml(cnSideNavFtml);
  const cnSideNav = parseSideBar(cnSideNavHtml);

  return (
    <>
      <div className="fixed top-0 left-0 z-20 bg-dark-bg text-white">
        <button
          className="cursor-pointer px-3 py-1 text-4xl"
          onClick={() => {
            setIsOpen(true);
            sideBarRef.current?.focus();
          }}
        >
          ≡
        </button>
      </div>
      <div
        ref={sideBarRef}
        dir="rtl"
        className={clsx(
          "border-dark-border fixed top-0 z-20 flex max-h-dvh w-76 scrollbar-thin scrollbar-thumb-white scrollbar-track-dark-bg flex-col overflow-y-auto border-r bg-dark-bg px-2 py-2 text-white transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-77",
        )}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
        role="menu"
        tabIndex={0}
      >
        {cnSideNav.map((sideBlock, index) => (
          // oxlint-disable-next-line react/no-array-index-key
          <div dir="ltr" className="mb-2 bg-dark-bg-2 p-2" key={`${sideBlock.type}-${index}`}>
            {sideBlock.type === "nav" &&
              (sideBlock.collapsible ? (
                <details className="group">
                  <summary className="mb-1 cursor-pointer group-not-open:px-1 group-open:border-b group-open:border-blue-3 group-open:text-sm group-open:font-bold group-open:text-blue-3 marker:content-[''] group-not-open:hover:bg-white/30">
                    {sideBlock.collapsible.show}
                  </summary>
                  <NavBlock sideBlock={sideBlock} />
                </details>
              ) : (
                <NavBlock sideBlock={sideBlock} />
              ))}
            {sideBlock.type === "media" && <MediaBlock sideBlock={sideBlock} />}
            {sideBlock.type === "license" && <LicenseBlock sideBlock={sideBlock} />}
          </div>
        ))}
      </div>
      {isOpen && (
        <button
          className="fixed top-0 left-0 z-10 h-screen w-screen bg-black/50 transition-colors duration-300 starting:bg-transparent"
          onClick={() => setIsOpen(false)}
          onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === "Escape" || event.key === " " || event.key === "Enter") {
              setIsOpen(false);
            }
          }}
          tabIndex={0}
        >
          <span className="sr-only">Close sidebar</span>
        </button>
      )}
    </>
  );
};

const NavBlock = ({ sideBlock }: { sideBlock: SideBarNavBlock }) => {
  const t = useTranslations();

  return sideBlock.rows.map((row, rIndex) => (
    <div
      className={clsx("flex gap-2", { "mt-2 mb-1 border-b border-blue-3 first-of-type:mt-0": row.type === "heading" })}
      // oxlint-disable-next-line react/no-array-index-key
      key={`${row.type}-${rIndex}`}
    >
      {row.type === "heading" && <div className="text-sm font-bold text-blue-3">{row.name}</div>}
      {row.type === "item" && (
        <div className="flex w-full">
          {row.links.map((link) => (
            <a
              className="w-full px-1 whitespace-nowrap transition-colors duration-200 hover:bg-white/30"
              href={link.href.startsWith("/") ? `${t("siteUrl")}${link.href}` : link.href}
              key={`${link.name}-${link.href}`}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  ));
};

const MediaBlock = ({ sideBlock }: { sideBlock: SideBarMediaBlock }) => (
  <>
    {sideBlock.heading && (
      <div className="mb-1 border-b border-blue-3 text-sm font-bold text-blue-3">{sideBlock.heading}</div>
    )}
    <div className="mt-2 flex justify-center gap-2">
      {sideBlock.links.map((link) => (
        <a href={link.href} target="_blank" rel="noopener noreferrer" key={`${link.src}-${link.href}`}>
          <Image src={link.src} width={30} height={30} alt={link.alt} className="w-auto" />
        </a>
      ))}
    </div>
  </>
);

const LicenseBlock = ({ sideBlock }: { sideBlock: SideBarLicenseBlock }) => (
  <div className="flex flex-col items-center">
    <a href={sideBlock.image.href} target="_blank" rel="noopener noreferrer">
      <Image src={sideBlock.image.src} width={120} height={42} alt={sideBlock.image.alt} />
    </a>
    <div>{sideBlock.text}</div>
    <div>
      {sideBlock.links.map((link) => (
        <a href={link.href} target="_blank" rel="noopener noreferrer" key={`${link.name}-${link.href}`}>
          {link.name}
        </a>
      ))}
    </div>
  </div>
);
