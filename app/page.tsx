import Image from "next/image";

import { Header } from "./components/header";
import { LoginStatus } from "./components/login-status";
import { Logo } from "./components/logo";

import type { ReactElement } from "react";

const IndexPage = async ({ searchParams }: { searchParams: Promise<{ id: string }> }): Promise<ReactElement> => {
  const { id } = await searchParams;
  const userId = Number(id) || 0;

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
