"use client";

import { useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { CONVEX_URL } from "@/constants/convex";

/** Fallback so React hooks never run outside a provider before env is filled. */
const UNCONFIGURED_CONVEX_URL = "https://unconfigured.convex.cloud";

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useMemo(
    () => new ConvexReactClient(CONVEX_URL || UNCONFIGURED_CONVEX_URL),
    []
  );

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
