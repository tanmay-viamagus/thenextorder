"use client";

import { useLayoutEffect } from "react";

/** Marks <html class="js"> as soon as the app hydrates; without JavaScript every reveal stays visible. */
export function JsFlag() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("js");
  }, []);
  return null;
}
