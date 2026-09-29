import { parseFtml } from "@/app/lib/ftml";
import content from "./rules.ftml";

export const Rules = async () => {
  const rules = await parseFtml(content);
  return <div className="text-white" dangerouslySetInnerHTML={{ __html: rules }} />;
};
