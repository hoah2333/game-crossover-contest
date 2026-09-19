import Image from "next/image";

import { Carousel } from "@/app/components/carousel";
import { Footer } from "@/app/components/footer";
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
    <div className="relative flex flex-col bg-page-bg">
      <div className="h-20" />
      <Header />
      <header className="absolute top-0">
        <div className="absolute top-0 w-full">
          <div className="mx-auto flex w-full max-w-pc justify-between">
            <Logo />
            <LoginStatus userId={userId} />
          </div>
        </div>
        <div className="absolute top-0 left-0">
          <SideBar />
        </div>
        <div>
          <Image src="/banner.png" alt="banner" loading="eager" width={3000} height={1000} />
        </div>
      </header>
      <main className="z-2 mx-auto mt-100 w-full max-w-pc">
        <Carousel />
        <div className="h-300" />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default IndexPage;
