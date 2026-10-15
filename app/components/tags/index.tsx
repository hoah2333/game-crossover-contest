import { getTranslations } from "next-intl/server";
import { splitTags } from "@/app/lib/getVisibleTags";

export const Tags = async () => {
  const t = await getTranslations();

  return (
    <p className="mt-4 text-sm text-white">
      {t("pageTagsLabel")}
      {splitTags(t("pageTags")).map((tag) => (
        <a
          className="mr-2 hover:underline"
          href={`${t("siteUrl")}/system:page-tags/tag/${tag}`}
          key={tag}
          rel="noopener noreferrer"
          target="_blank"
        >
          {tag}
        </a>
      ))}
    </p>
  );
};
