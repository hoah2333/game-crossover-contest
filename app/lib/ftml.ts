"use client";

import { init, loading, ready, renderHTML } from "@vscode-ftml/ftml-wasm";
import { useEffect, useState } from "react";

export const useParseFTML = (ftml: string): string => {
  const [html, setHtml] = useState<string>("");

  useEffect((): void => {
    const initFTML = async (): Promise<void> => {
      await init();
      if (!ready) {
        await loading;
      }
      setHtml(renderHTML(ftml, undefined, "page", "wikidot").html);
    };
    void initFTML();
  }, [ftml]);

  return html;
};
