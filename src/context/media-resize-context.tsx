"use client";

import { createContext, useContext } from "react";

type MediaResizeContextValue = {
	onResize: (src: string, newWidth: number) => void;
} | null;

export const MediaResizeContext = createContext<MediaResizeContextValue>(null);

export const useMediaResize = () => useContext(MediaResizeContext);
