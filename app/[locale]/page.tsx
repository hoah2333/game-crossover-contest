import Image from "next/image";

import { Header } from "@/app/components/header";
import { LoadGuard } from "@/app/components/loadGuard";
import { LoginStatus } from "@/app/components/login-status";
import { Logo } from "@/app/components/logo";
import { SideBar } from "@/app/components/side-bar";

import type { ReactElement } from "react";

const IndexPage = async ({ searchParams }: { searchParams: Promise<{ id: string }> }): Promise<ReactElement> => {
  const { id } = await searchParams;
  const userId = Number(id);

  return (
    <LoadGuard userId={userId}>
      <ContestPage userId={userId} />
    </LoadGuard>
  );
};

const ContestPage = ({ userId }: { userId: number }): ReactElement => {
  return (
    <div className="relative flex flex-col">
      <div className="h-20" />
      <Header />
      <header className="absolute top-0">
        <div className="absolute top-0 w-full">
          <div className="mx-auto flex w-full max-w-pc justify-between">
            <Logo />
            <LoginStatus userId={userId} />
          </div>
        </div>
        <div>
          <SideBar />
        </div>
        <div>
          <Image src="/banner.png" alt="banner" loading="eager" width={3000} height={1000} />
        </div>
      </header>
      <main>
        <div className="h-1000" />
      </main>
    </div>
  );
};

export default IndexPage;
