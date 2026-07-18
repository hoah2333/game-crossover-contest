import Image from "next/image";

import { Bell } from "lucide-react";
import { getUserInfo } from "@/app/lib/getUserInfo";
import { siteDomain } from "@/app/lib/siteDomain";
import { Dropdown } from "./Dropdown";

export const LoginStatus = async ({ userId }: { userId: number }) => {
  const userInfo = await getUserInfo(userId);

  return (
    <div className="text-sm text-text-dark">
      <div className="flex items-start gap-2 bg-dark-bg/50 px-2 py-1">
        {userInfo === null ? (
          <>
            <a
              href={`https://www.wikidot.com/default--flow/login__LoginPopupScreen?openerUri=${siteDomain}`}
              target="_blank"
              className="cursor-pointer transition-colors hover:text-white"
            >
              登录
            </a>
            <span>|</span>
            <a
              href={`https://www.wikidot.com/default--flow/login__CreateAccountScreen?openerUri=${siteDomain}`}
              target="_blank"
              className="cursor-pointer transition-colors hover:text-white"
            >
              注册
            </a>
          </>
        ) : (
          <>
            <button className="flex w-12 justify-center bg-menu-bg py-1.5 text-white">
              <Bell size={14} />
            </button>
            <div className="mt-0.5 flex flex-col items-end gap-1 text-xs">
              <Dropdown username={userInfo.userName} />
              <a
                href="https://www.wikidot.com/account/activity"
                target="_blank"
                className="cursor-pointer transition-colors hover:text-white"
              >
                我的账户
              </a>
            </div>

            <div className="flex items-center border border-online">
              <Image
                src={`http://www.wikidot.com/avatar.php?userid=${userInfo.userId}`}
                alt={`the Avatar of ${userInfo.userName}`}
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
