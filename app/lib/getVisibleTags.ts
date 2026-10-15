export const splitTags = (value: string) => value.split(" ").filter((tag) => tag !== "");

export const getVisibleTags = (tags: string[], hiddenTags: string) => {
  const hidden = splitTags(hiddenTags);
  return tags.filter((tag) => !(tag.startsWith("_") || hidden.includes(tag)));
};
