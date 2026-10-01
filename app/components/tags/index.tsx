import { getTranslations } from "next-intl/server";

const TAGS = ["2026电子游戏竞赛", "中心", "原创", "合著", "竞赛"] as const;

export const Tags = async () => {
  const t = await getTranslations();

  return (
    <p className="mt-4 text-sm text-white">
      标签：
      {TAGS.map((tag) => (
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
