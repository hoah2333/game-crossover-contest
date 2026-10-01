import { Suspense } from "react";
import { BannerPicture } from "@/app/components/banner-picture";
import { Carousel } from "@/app/components/carousel";
import { ContestList } from "@/app/components/contest-list";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { LoadGuard } from "@/app/components/loadGuard";
import { LoginStatus } from "@/app/components/login-status";
import { Logo } from "@/app/components/logo";
import { LowRating } from "@/app/components/low-rating";
import { Recommend } from "@/app/components/recommend";
import { Rules } from "@/app/components/rules";
import { SideBar } from "@/app/components/side-bar";

import type { ReactElement } from "react";

const IndexPage = ({ searchParams }: { searchParams: Promise<{ id: string }> }): ReactElement => {
  return (
    <div className="relative flex flex-col bg-page-bg">
      <div className="z-2 h-20 w-full bg-header-bg" />
      <Header />
      <header className="absolute top-0">
        <div className="absolute top-0 z-3 w-full">
          <div className="mx-auto flex w-full max-w-pc justify-between pl-14 xl:pl-0">
            <Logo className="text-white" />
            <Suspense fallback={null}>
              <LoginStatusSuspense searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
        <div className="absolute top-0 left-0">
          <SideBar />
        </div>
        <div className="mt-48 sm:mt-20">
          <BannerPicture />
        </div>
      </header>
      <main className="z-2 mx-auto mt-70 w-full max-w-pc sm:mt-110 lg:mt-110 xl:mt-160">
        <Suspense fallback={null}>
          <Carousel />
        </Suspense>
        <Suspense fallback={null}>
          <ContestList />
        </Suspense>
        <Suspense fallback={null}>
          <Recommend />
        </Suspense>
        <Suspense fallback={null}>
          <LowRating />
        </Suspense>
        <Suspense fallback={null}>
          <Rules />
        </Suspense>
      </main>
      <footer>
        <Footer />
      </footer>
      <Suspense fallback={null}>
        <LoadGuard />
      </Suspense>
    </div>
  );
};

const LoginStatusSuspense = async ({ searchParams }: { searchParams: Promise<{ id: string }> }) => {
  const { id } = await searchParams;
  const userId = Number(id);

  return <LoginStatus userId={userId} />;
};

export default IndexPage;
