export type SideBar = SideBarBlock[];

export type SideBarBlock = SideBarNavBlock | SideBarMediaBlock | SideBarLicenseBlock;

export interface SideBarNavBlock {
  type: "nav";
  collapsible: { show: string; hide: string } | false;
  rows: SideBarRow[];
}
export interface SideBarMediaBlock {
  type: "media";
  heading: string;
  links: SideBarMediaLink[];
}
export interface SideBarLicenseBlock {
  type: "license";
  image: SideBarMediaLink;
  text: string;
  links: SideBarLink[];
}

export type SideBarRow = { type: "heading"; name: string } | { type: "item"; links: SideBarLink[] };

export interface SideBarLink {
  name: string;
  href: string;
}

export interface SideBarMediaLink {
  src: string;
  href: string;
  alt: string;
}
