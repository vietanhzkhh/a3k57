"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { map } from "lodash";
import { usePathname } from "next/navigation";
import ListChats from "./ListChats";
import { useConversation } from "@/hooks/useConversation";

const nav = [
  {
    id: 1,
    title: "",
    iconlight: "chat.svg",
    icondark: "chatlight.svg",
    url: "/",
  },
  {
    id: 2,
    title: "",
    iconlight: "support.svg",
    icondark: "supportlight.svg",
    url: "/support",
  },
  {
    id: 3,
    title: "",
    iconlight: "Flash.svg",
    icondark: "FlashLight.svg",
    url: "/flash",
  },
];

const SideBarLeft = () => {
  const pathname = usePathname();
  const { messages, loading, sendIntent, sendKeyword } = useConversation();

  console.log("messages", messages);

  return (
    <div className="flex">
      <div className="h-vh w-[70px] bg-[#FCFCFC] border-r-[1px] border-gray-100 rounded-bl-xl rounded-tl-xl">
        <div className="text-center pt-4">
          <Link href="/" className="font-bold">
            A3K57
          </Link>
        </div>

        <div className="flex items-start justify-center">
          <div className="h-auto flex-row items-center justify-center gap-y-4">
            {map(nav, (itemMenu) => {
              const isActive = pathname === itemMenu.url;

              return (
                <Link
                  key={itemMenu.id}
                  href={itemMenu.url}
                  className={`mt-4 block p-2 rounded-full transition-colors ${
                    isActive ? "bg-[#040B22]" : "bg-white"
                  }`}
                >
                  <Image
                    src={`/images/${isActive ? itemMenu.icondark : itemMenu.iconlight}`}
                    width={18}
                    height={18}
                    alt=""
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <ListChats />
      </div>
    </div>
  );
};

export default SideBarLeft;
