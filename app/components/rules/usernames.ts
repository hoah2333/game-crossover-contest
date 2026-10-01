export const usernameFromUserHref = (href: string): string => {
  return /\/user:info\/(?<username>[^/?#]+)/u.exec(href)?.groups?.username ?? "";
};

export const usernamesIn = (html: string): string[] => {
  const names = new Set<string>();
  for (const match of html.matchAll(/href="\/user:info\/(?<username>[^"?#]+)"/gu)) {
    const username = match.groups?.username ?? "";
    if (username !== "") {
      names.add(username);
    }
  }
  return [...names];
};
