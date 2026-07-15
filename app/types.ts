import type { Dispatch, SetStateAction } from "react";

export type DataState<T> = [T, Dispatch<SetStateAction<T>>];
