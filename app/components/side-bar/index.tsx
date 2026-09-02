import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { SideBar as SideBarClient } from "./SideBarClient";

export const SideBar = async () => {
  const cnSideNavFtml: string = await getSourceFtml("nav:side");
  return <SideBarClient cnSideNavFtml={cnSideNavFtml} />;
};
