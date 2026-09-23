import { useEffect, useState } from "react";
import { parseFtml } from "@/app/lib/ftml";

export const useParseFtml = (ftml: string): string => {
  const [html, setHtml] = useState<string>("");

  useEffect((): void => {
    void parseFtml(ftml).then((result) => {
      setHtml(result);
    });
  }, [ftml]);

  return html;
};
