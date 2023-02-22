import { type FC, useState } from "react";
import {
  Avatar,
  Image,
  IsLogin,
  AvatarImage,
  AvatarFallback,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components";
import { signOut, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useDarkMode } from "@/hooks";

const MainNav: FC = () => {
  const { toggle } = useDarkMode();
  const { data: session } = useSession();

  return (
    <>
      <nav className="ctw-component-bg-secondary fixed top-0 z-50 flex h-[65px] w-screen items-center justify-center px-5 shadow-lg shadow-gray-200 dark:border-b dark:border-gray-700 dark:shadow-none">
        <div className="container flex w-[100%]">
          <div className="flex w-[30%] items-center justify-start">
            <Link href="/" className="ml-3">
              <Image
                src="/iihtm-700.png"
                alt="logo-1"
                width={45}
                height={45}
                loading="lazy"
                blur
              />
            </Link>
          </div>
          <ul className="mr-3 flex w-[70%] items-center justify-end gap-3">
            <li>
              <Link
                href="/"
                className="rounded bg-gray-100 p-2 dark:bg-gray-800">
                Workspace
              </Link>
            </li>
            <li>
              <IsLogin
                fallBack={
                  <Button
                    className="ml-3"
                    variant="outline"
                    onClick={() => signIn("github")}>
                    Login
                  </Button>
                }>
                <Popover>
                  <PopoverTrigger>
                    <Avatar>
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt="avator"
                        className="ctw-component-bg-secondary rounded-full"
                      />
                      <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-col gap-2">
                      <Button
                        className="ml-3"
                        variant="outline"
                        onClick={() => signOut()}>
                        Logout
                      </Button>
                      <Button
                        className="ml-3"
                        variant="outline"
                        onClick={toggle}>
                        Toggle theme
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </IsLogin>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default MainNav;
