declare module "*.wasm?url" {
  const src: string;
  export default src;
}

declare module "*.ftml" {
  const content: string;
  export default content;
}
