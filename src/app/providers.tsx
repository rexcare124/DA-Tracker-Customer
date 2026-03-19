"use client";

import StoreProvider from "@/state/redux";
import DataTypesHydrator from "@/components/DataTypesHydrator";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DataTypesHydrator />
      {children}
    </StoreProvider>
  );
};

export default Providers;
