import Image from "next/image";

import { Bell } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/app/lib/getUserInfo";
import { Dropdown } from "./Dropdown";

export const LoginStatus = async ({ userId }: { userId: number }) => {
  const userInfo = userId > 0 ? await getUserInfo(userId) : null;
  const t = await getTranslations();

  return (
    <div className="text-sm text-text-dark">
      <div className="flex items-start gap-2 bg-dark-bg/50 px-2 py-1">
        {userInfo === null ? (
          <>
            <a
              href={`https://www.wikidot.com/default--flow/login__LoginPopupScreen?openerUri=${t("siteUrl")}`}
              target="_blank"
              className="cursor-pointer transition-colors hover:text-white"
            >
              {t("loginStatus.login")}
            </a>
            <span>|</span>
            <a
              href={`https://www.wikidot.com/default--flow/login__CreateAccountScreen?openerUri=${t("siteUrl")}`}
              target="_blank"
              className="cursor-pointer transition-colors hover:text-white"
            >
              {t("loginStatus.register")}
            </a>
          </>
        ) : (
          <>
            <button className="flex w-12 justify-center bg-menu-bg py-1.5 text-white">
              <Bell size={14} />
            </button>
            <div className="mt-0.5 flex flex-col items-end gap-1 text-xs">
              <Dropdown username={userInfo.displayName} />
              <a
                href="https://www.wikidot.com/account/activity"
                target="_blank"
                className="cursor-pointer transition-colors hover:text-white"
              >
                {t("loginStatus.myAccount")}
              </a>
            </div>

            <div className="flex items-center border border-online">
              <Image
                src={`http://www.wikidot.com/avatar.php?userid=${userInfo.wikidotId}`}
                alt={`the Avatar of ${userInfo.displayName}`}
                width={40}
                height={40}
                className="size-10"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
