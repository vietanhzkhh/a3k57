import React from "react";
import {
  BookOpen,
  CircleCheckBig,
  GraduationCap,
  Link2,
  School,
  ShieldCheck,
  Sparkles,
  Wallet,
  Scale,
} from "lucide-react";
import type { Intent } from "@/constants/constants";

type RecommendProps = {
  onSelectIntent: (intent: Intent, label: string) => void;
  loading?: boolean;
};

const Recommend = ({ onSelectIntent, loading }: RecommendProps) => {
  const primaryCards = [
    {
      intent: "by_major" as const,
      title: "Tìm theo ngành",
      desc: "Khám phá các trường đào tạo ngành bạn quan tâm",
      icon: BookOpen,
    },
    {
      intent: "by_score" as const,
      title: "Theo điểm của bạn",
      desc: "Gợi ý trường phù hợp với mức điểm hiện tại",
      icon: GraduationCap,
    },
    {
      intent: "by_budget" as const,
      title: "Theo học phí",
      desc: "Lọc trường theo ngân sách bạn có thể chi trả",
      icon: Wallet,
    },
    {
      intent: "compare" as const,
      title: "So sánh trường",
      desc: "Đặt 2–3 trường lên bàn cân để chọn dễ hơn",
      icon: Scale,
    },
  ];

  const filters = [
    { intent: "public" as const, label: "Trường công lập" },
    { intent: "private" as const, label: "Trường tư thục" },
    { intent: "near_home" as const, label: "Gần nhà" },
    { intent: "scholarship" as const, label: "Có học bổng" },
    { intent: "transcript" as const, label: "Xét học bạ" },
    { intent: "exam" as const, label: "Xét điểm thi" },
    { intent: "hot_major" as const, label: "Ngành hot" },
    { intent: "easy_admit" as const, label: "Dễ trúng tuyển" },
  ];

  return (
    <div>
      <div className="mt-14 w-full max-w-6xl">
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {primaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                disabled={loading}
                onClick={() => onSelectIntent(item.intent, item.title)}
                className="group rounded-[28px] border border-slate-200 bg-white p-6 md:p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 ring-1 ring-sky-100">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-[22px] font-medium tracking-tight text-slate-900 md:text-lg">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[18rem] text-[15px] leading-7 text-slate-500">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-10 w-full max-w-6xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] md:mb-12 md:p-6">
          <div className="flex items-center gap-4 pb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <h2 className="whitespace-nowrap text-xl font-semibold tracking-tight text-slate-900">
              Gợi ý cho bạn
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((item, index) => (
              <button
                key={item.label}
                type="button"
                disabled={loading}
                onClick={() => onSelectIntent(item.intent, item.label)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[16px] font-medium shadow-sm ring-1 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                  index === 0
                    ? "bg-sky-50 text-sky-600 ring-sky-100"
                    : index === 1
                      ? "bg-orange-50 text-orange-500 ring-orange-100"
                      : index === 2
                        ? "bg-blue-50 text-blue-600 ring-blue-100"
                        : index === 3
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                          : index === 4
                            ? "bg-slate-50 text-slate-600 ring-slate-200"
                            : index === 5
                              ? "bg-indigo-50 text-indigo-600 ring-indigo-100"
                              : index === 6
                                ? "bg-amber-50 text-amber-600 ring-amber-100"
                                : "bg-cyan-50 text-cyan-600 ring-cyan-100"
                }`}
              >
                {item.label === "Trường công lập" && (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {item.label === "Trường tư thục" && (
                  <School className="h-4 w-4" />
                )}
                {item.label === "Gần nhà" && <Link2 className="h-4 w-4" />}
                {item.label === "Có học bổng" && (
                  <CircleCheckBig className="h-4 w-4" />
                )}
                {item.label === "Xét học bạ" && <BookOpen className="h-4 w-4" />}
                {item.label === "Xét điểm thi" && (
                  <GraduationCap className="h-4 w-4" />
                )}
                {item.label === "Ngành hot" && <Sparkles className="h-4 w-4" />}
                {item.label === "Dễ trúng tuyển" && (
                  <CircleCheckBig className="h-4 w-4" />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend;