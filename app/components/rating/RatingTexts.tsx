"use client";

import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { match, P } from "ts-pattern";

import type { ReactNode } from "react";

export const RatingTexts = ({
  rating,
  ratingCount,
  postDate,
  className,
}: {
  rating: number;
  ratingCount: number;
  postDate: number;
  className?: string;
}) => {
  const t = useTranslations();
  const [now, setNow] = useState(0);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setNow(Date.now());
  }, []);
  return (
    <div className={clsx("flex gap-2", className)}>
      {ratingCount <= 15
        ? match(postDate > now - 24 * 60 * 60 * 1000 * 15)
            .returnType<ReactNode>()
            .with(true, () => <div className="text-[#70b590]">{t("ratingTexts.latest")}</div>)
            .with(false, () => <div className="text-[#929396]">{t("ratingTexts.cold")}</div>)
            .exhaustive()
        : match(rating / ratingCount)
            .returnType<ReactNode>()
            .with(P.number.lt(0.35), () => <div className="text-[#be5d30]">{t("ratingTexts.negative")}</div>)
            .with(P.number.gte(0.35).and(P.number.lt(0.65)), () => (
              <div className="text-[#ad9872]">{t("ratingTexts.mixed")}</div>
            ))
            .with(P.number.gte(0.65), () => <div className="text-[#5197c3]">{t("ratingTexts.positive")}</div>)
            .otherwise(() => (
              // 这个 otherwise 应该是 0/0 的情况
              <div className="text-[#929396]">{t("ratingTexts.cold")}</div>
            ))}
      ({ratingCount})
    </div>
  );
};
