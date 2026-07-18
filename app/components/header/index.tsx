import { getSourceFtml } from "@/app/lib/getSourceFtml";
import { Header as HeaderClient } from "./HeaderClient";

export const Header = async () => {
  const cnTopNavFtml: string = await getSourceFtml("nav:top");
  return <HeaderClient cnTopNavFtml={cnTopNavFtml} />;
};
