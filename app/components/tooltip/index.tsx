"use client";

import {
  flip,
  hide,
  offset,
  useFloating,
  autoUpdate,
  useHover,
  useFocus,
  useInteractions,
  arrow,
  FloatingPortal,
  FloatingArrow,
  useTransitionStyles,
} from "@floating-ui/react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { RatingTexts } from "@/app/components/rating/RatingTexts";
import { getDate } from "@/app/lib/getDate";
import { getVisibleTags } from "@/app/lib/getVisibleTags";

import type { ReactNode } from "react";
import type { ArticleItem } from "@/app/lib/types";

export const Tooltip = ({ children, articleItem }: { children: ReactNode; articleItem: ArticleItem }) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    placement: "right-start",
    strategy: "fixed",
    // oxlint-disable-next-line react/refs
    middleware: [offset(10), flip({ fallbackPlacements: ["left-start"] }), arrow({ element: arrowRef }), hide()],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
  });

  const hover = useHover(context, { mouseOnly: true });
  const focus = useFocus(context);
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, { duration: 200 });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus]);
  return (
    <div>
      {/* oxlint-disable-next-line react/refs react/jsx-props-no-spreading */}
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isMounted && (
        <FloatingPortal>
          <div
            className={clsx(
              "pointer-events-none z-10 w-72 bg-dark-bg-2 text-white",
              middlewareData.hide?.referenceHidden === true || middlewareData.hide?.escaped === true
                ? "invisible"
                : "visible",
            )}
            // oxlint-disable-next-line react/refs
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...transitionStyles }}
            // oxlint-disable-next-line react/jsx-props-no-spreading
            {...getFloatingProps()}
          >
            <FloatingArrow className="fill-dark-bg-2" ref={arrowRef} context={context} />
            <div className="flex flex-col gap-2 px-4 py-2">
              <div className="text-lg">{articleItem.title}</div>
              <div className="text-sm text-text-dark">{t("contestList.date", getDate(articleItem.postDate))}</div>
              <div className="flex flex-col bg-dark-bg p-2 text-sm text-text-dark">
                <div>{t("contestList.overall")}</div>
                <RatingTexts
                  rating={articleItem.rating}
                  ratingCount={articleItem.ratingCount}
                  postDate={articleItem.postDate}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {getVisibleTags(articleItem.tags)
                  .slice(0, 10)
                  .map((tag) => (
                    <a
                      className="cursor-pointer bg-white/10 p-1 transition-colors hover:bg-white/20"
                      href={`${t("siteUrl")}/system:page-tags/tag/${tag}#pages`}
                      key={tag}
                    >
                      {tag}
                    </a>
                  ))}
                {getVisibleTags(articleItem.tags).length > 10 && (
                  <span className="bg-white/10 p-1">
                    {t("carousel.additionalTags", { count: getVisibleTags(articleItem.tags).length - 10 })}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-end justify-end px-4 py-2 text-right text-sm text-text-dark">
                {t("carousel.createdBy", {
                  authors:
                    articleItem.authors[0] +
                    (articleItem.authors.length > 1
                      ? t("carousel.authors", { count: articleItem.authors.length - 1 })
                      : ""),
                })}
              </div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};
