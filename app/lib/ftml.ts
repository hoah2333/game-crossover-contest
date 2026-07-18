import { init, loading, ready, renderHTML } from "@vscode-ftml/ftml-wasm";

export const parseFtml = async (ftml: string): Promise<string> => {
  await init();
  if (!ready) {
    await loading;
  }
  return renderHTML(ftml, undefined, "page", "wikidot").html;
};
