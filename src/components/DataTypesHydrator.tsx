"use client";

import { useEffect } from "react";
import { useDataTypesStore } from "@/store";

/**
 * Triggers data-types fetch on first app load. Renders nothing.
 * Mount this once in the root providers so reference data is available app-wide.
 */
export default function DataTypesHydrator() {
  const ensureLoaded = useDataTypesStore((s) => s.ensureLoaded);

  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);

  return null;
}
