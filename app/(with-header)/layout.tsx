import type { ReactNode } from "react";
import GlobalHeader from "@/components/layout/header/global-header";

interface IWithHeaderLayoutProps {
  children: ReactNode;
}

const WithHeaderLayout = ({ children }: IWithHeaderLayoutProps) => {
  return (
    <>
      <GlobalHeader />
      <main className="container mx-auto px-4 py-12 max-w-4xl">{children}</main>
    </>
  );
};

export default WithHeaderLayout;
