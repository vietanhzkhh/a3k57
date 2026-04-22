import Link from "next/link";
import React from "react";

interface ChatItemProps {
  item: any;
  conversationId: string;
}

const ChatItem = ({ item, conversationId }: ChatItemProps) => {
  return (
    <Link
      href={`/${item.id}`}
      className={`cursor-pointer  px-4 py-2 rounded-3xl block mt-2 ${item.id === conversationId ? "bg-[#040B22] text-white" : "hover:bg-gray-100"}`}
    >
      <div className="">
        <h2 className="text-sm truncate">{item.title}</h2>
      </div>
    </Link>
  );
};

export default ChatItem;
