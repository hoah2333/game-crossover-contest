import Image from "next/image";
import Header from "./components/header";

import { LoginStatus } from "./components/login-status";

import type { ReactElement } from "react";

const IndexPage = (): ReactElement => {
  return (
    <div className="flex flex-col">
      <header>
        <div>
          <LoginStatus />
          <Header />
        </div>
        <div>
          <Image src="/banner.png" alt="banner" loading="eager" width={3000} height={1000} />
        </div>
      </header>
      <main>1</main>
    </div>
  );
};

export default IndexPage;
