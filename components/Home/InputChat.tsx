import { ArrowRight, Search } from "lucide-react";
import React from "react";

interface InputChatProps {
  value: string;
  loading?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

const InputChat = ({ value, loading, onChange, onSend }: InputChatProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="fixed  bottom-4 z-20 w-[calc(100%-2rem)] left-[58%] -translate-x-1/2 max-w-[900px] mx-auto bg-[#FAFAFA] px-0">
      <div className="flex h-14 w-full flex-1 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        <button type="button" className="pl-5 pr-3">
          <Search className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi mình về trường, ngành, điểm số..."
          className="w-full bg-transparent text-[16px] text-slate-800 outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          disabled={loading}
          onClick={onSend}
          className="mr-1 inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 text-[16px] font-semibold text-white shadow-lg shadow-blue-200 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Gửi
          <ArrowRight className="h-4.5 w-4.5" />
        </button>
      </div>

      <p className="mt-4 text-center text-[14px] text-slate-400">
        Kết quả chỉ mang tính tham khảo, vui lòng kiểm tra lại thông tin.
      </p>
    </div>
  );
};

export default InputChat;
