export const getVisibleTags = (tags: string[]) =>
  tags.filter(
    (tag) => !(tag.startsWith("_") || ["2026电子游戏竞赛", "crossover项目", "原创", "合著", "故事"].includes(tag)),
  );
