export interface TopBarItem {
  name: string;
  children: TopBarItemChild[];
}
export interface TopBarItemChild {
  name: string;
  href: string;
}
