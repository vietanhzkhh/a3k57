"use client";
import InputChat from "@/components/Home/InputChat";
import Recommend from "@/components/Home/Recommend";
import { Intent } from "@/constants/constants";
import { useConversation } from "@/hooks/useConversation";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
// http://localhost:3000/bfa53d08-8ba2-4203-9c8e-d8f65dc487a8
const Page = () => {
  const pathname = usePathname();
  console.log(pathname);
  const [inputValue, setInputValue] = useState("");

  const {
    messages,
    loading,
    sendIntent,
    sendKeyword,
    conversations,
    switchConversation,
  } = useConversation();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const conversationId = pathname.split("/").pop();

  useEffect(() => {
    if (!conversationId) return;
    switchConversation(conversationId);
  }, [conversationId, switchConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSelectIntent = async (intent: Intent, label: string) => {
    try {
      await sendIntent(intent, label);
      setInputValue("");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleCall = async () => {
    const keyword = inputValue.trim();

    if (!keyword) {
      alert("Vui lòng nhập nội dung");
      return;
    }

    try {
      await sendKeyword(keyword);
      setInputValue("");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="h-full p-4  min-h-0">
      <div className="flex h-full  flex-col  ">
        <div className="flex-1 ">
          <div
            className={`mx-auto  w-full max-w-4xl space-y-3 py-6 min-h-0 ${messages?.length > 0 ? "pb-36" : ""}  `}
          >
            {messages?.length > 0 ? (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                      Đang tìm trường phù hợp...
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-center">
                  <span className="text-xl font-medium">Xin Chào 👋</span>
                  <p>
                    Mình là trợ lý chọn trường. Nói mình biết bạn muốn gì, mình
                    sẽ tìm giúp bạn.
                  </p>
                </div>

                <Recommend
                  onSelectIntent={handleSelectIntent}
                  loading={loading}
                />
              </>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <InputChat
          value={inputValue}
          loading={loading}
          onChange={setInputValue}
          onSend={handleCall}
        />
      </div>
    </div>
  );
};

export default Page;
