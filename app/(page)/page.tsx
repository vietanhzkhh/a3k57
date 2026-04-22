"use client";

import { useEffect, useRef, useState } from "react";
import InputChat from "@/components/Home/InputChat";
import Recommend from "@/components/Home/Recommend";
import type { Intent } from "@/constants/constants";
import { useConversation } from "@/hooks/useConversation";
import { useRouter } from "next/navigation";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const { messages, loading, sendIntent, sendKeyword } = useConversation();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [conversationsCurrent, setConversationsCurrent] = useState({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSelectIntent = async (intent: Intent, label: string) => {
    try {
      const { conversationId } = await sendIntent(intent, label);
      router.push(`/${conversationId}`);
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
      const { conversationId } = await sendKeyword(keyword);
      router.push(`/${conversationId}`);
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
            className={`mx-auto  w-full max-w-4xl space-y-3 py-6 min-h-0   `}
          >
            <div className="text-center">
              <span className="text-xl font-medium">Xin Chào 👋</span>
              <p>
                Mình là trợ lý chọn trường. Nói mình biết bạn muốn gì, mình sẽ
                tìm giúp bạn.
              </p>
            </div>

            <Recommend onSelectIntent={handleSelectIntent} loading={loading} />

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
}
