import { init, loading, ready, renderHTML } from "@wikijump/ftml-wasm";

export const parseFtml = async (ftml: string): Promise<string> => {
  await init();
  if (!ready) {
    await loading;
  }
  return renderHTML(ftml, undefined, "page", "wikijump").html;
};
