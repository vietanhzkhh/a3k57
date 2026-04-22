"use client";
import { useConversation } from "@/hooks/useConversation";
import { map } from "lodash";
import Image from "next/image";
import React from "react";
import ChatItem from "./ChatItem";
import { usePathname, useRouter } from "next/navigation";

const ListChats = () => {
  const pathname = usePathname();
  const router = useRouter();

  const conversationId = pathname.split("/").pop();
  const { conversations, switchConversation, createNewConversation } =
    useConversation();
  console.log(conversations);

  const handleNewChat = () => {
    const conv = createNewConversation();
    router.push(`/${conv.id}`);
  };

  return (
    <div className="w-[250px] border-r-[1px] border-gray-100 h-full p-3">
      <div>
        <h2 className="font-medium text-lg">Chat</h2>
      </div>
      <div className="py-4 border-b-[1px] border-gray-100">
        <div
          onClick={handleNewChat}
          className="bg-[#040B22] flex items-center justify-center py-2 rounded-3xl cursor-pointer hover:opacity-85"
        >
          <div className="pr-2">
            <Image
              src={"/images/UilPlus.svg"}
              width={14}
              height={14}
              alt=""
              className=""
            />
          </div>
          <span className="text-white text-sm">Đoạn chat mới</span>
          <div className="pl-2">
            <Image
              src={"/images/IxAi.svg"}
              width={16}
              height={16}
              alt=""
              className=""
            />
          </div>
        </div>
      </div>
      <div className="pt-4">
        <div className="">
          {map(conversations, (conv) => (
            <ChatItem
              key={conv.id}
              conversationId={conversationId!}
              item={conv}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListChats;
