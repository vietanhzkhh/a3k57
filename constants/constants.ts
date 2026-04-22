export type Intent =
  | "by_major"
  | "by_score"
  | "by_budget"
  | "compare"
  | "public"
  | "private"
  | "near_home"
  | "scholarship"
  | "transcript"
  | "exam"
  | "hot_major"
  | "easy_admit"
  | "free_text";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type StoredMessage = ChatMessage & {
  id: string;
  createdAt: string;
};

export type SchoolItem = {
  name: string;
  location: string;
  reason: string;
  note?: string;
};

export type SchoolResult = {
  title: string;
  summary: string;
  schools: SchoolItem[];
  followUpQuestions: string[];
};

export const INTENT_LABELS: Record<Intent, string> = {
  by_major: "Tìm trường theo ngành",
  by_score: "Tìm trường theo điểm",
  by_budget: "Tìm trường theo học phí",
  compare: "So sánh trường",
  public: "Trường công lập",
  private: "Trường tư thục",
  near_home: "Trường gần nhà",
  scholarship: "Trường có học bổng",
  transcript: "Xét học bạ",
  exam: "Xét điểm thi",
  hot_major: "Ngành hot",
  easy_admit: "Dễ trúng tuyển",
  free_text: "Tìm trường tổng quát",
};

export function buildSchoolPrompt({
  messages,
  summary,
  intent,
  input,
}: {
  messages: ChatMessage[];
  summary?: string;
  intent: Intent;
  input: string;
}) {
  const recentMessages = messages
    .slice(-8)
    .map((m) => `${m.role === "user" ? "Người dùng" : "Trợ lý"}: ${m.content}`)
    .join("\n");

  return `
Bạn là trợ lý chọn trường tại Việt Nam.

MỤC TIÊU:
- Trả lời tự nhiên như đang chat thật.
- Nếu có đủ thông tin, PHẢI đưa ra gợi ý trường ngay.
- Chỉ hỏi lại khi thật sự thiếu dữ liệu quan trọng.
- Không trả lời kiểu "Kết quả" chung chung.
- Không dùng tiêu đề rỗng hoặc câu mở đầu vô nghĩa.

NGỮ CẢNH TỔNG QUAN:
${summary ? summary : "(chưa có tóm tắt hội thoại)"}

INTENT HIỆN TẠI:
${INTENT_LABELS[intent]}

INPUT HIỆN TẠI:
${input?.trim() ? input.trim() : "(không có input)"}

TIN NHẮN GẦN NHẤT:
${recentMessages || "(chưa có lịch sử tin nhắn)"}

LUẬT SUY LUẬN:
- Nếu input có ngành, điểm, học phí, khu vực, tên trường, hoặc tiêu chí rõ ràng → trả về danh sách trường luôn.
- Nếu user bấm intent và không nhập gì, hãy trả lời theo intent đó.
- Nếu input rỗng và không suy ra được gì, mới hỏi lại tối đa 2 câu ngắn.
- Nếu user đang nói tiếp từ hội thoại trước, hãy dùng ngữ cảnh trước đó.
- Không bịa thông tin nếu không chắc chắn.
- Ưu tiên trả về ít nhất 3 trường nếu có thể.

PHONG CÁCH TRẢ LỜI:
- Trực tiếp, ngắn gọn, dễ đọc.
- Không trả lời bằng kiểu "Mình đã tìm được một số gợi ý phù hợp." rồi dừng lại.
- Nếu phù hợp, có thể thêm 1 câu mở đầu tự nhiên trước danh sách trường.

ĐẦU RA:
Trả về JSON hợp lệ, không bọc markdown, đúng schema này:
{
  "title": "Tiêu đề ngắn, cụ thể",
  "summary": "Một câu trả lời trực tiếp, tự nhiên",
  "schools": [
    {
      "name": "Tên trường",
      "location": "Khu vực",
      "reason": "Vì sao phù hợp",
      "note": "Ghi chú thêm nếu cần"
    }
  ],
  "followUpQuestions": ["Câu hỏi ngắn 1", "Câu hỏi ngắn 2"]
}
`.trim();
}

export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

export function normalizeResult(data: any): SchoolResult {
  return {
    title: typeof data?.title === "string" ? data.title : "Gợi ý trường phù hợp",
    summary:
      typeof data?.summary === "string"
        ? data.summary
        : "Mình gợi ý cho bạn một số trường phù hợp dưới đây.",
    schools: Array.isArray(data?.schools)
      ? data.schools.map((item: any) => ({
          name: String(item?.name || ""),
          location: String(item?.location || ""),
          reason: String(item?.reason || ""),
          note: item?.note ? String(item.note) : undefined,
        }))
      : [],
    followUpQuestions: Array.isArray(data?.followUpQuestions)
      ? data.followUpQuestions.map((q: any) => String(q))
      : [],
  };
}

export function formatSchoolResult(result: SchoolResult) {
  const lines: string[] = [];

  const summary = result.summary?.trim();
  if (summary) {
    lines.push(summary);
  }

  if (result.schools.length > 0) {
    if (lines.length > 0) lines.push("");
    lines.push("Mình gợi ý cho bạn:");

    result.schools.forEach((school, index) => {
      lines.push(`${index + 1}. ${school.name}`);
      if (school.location) lines.push(`- Địa điểm: ${school.location}`);
      if (school.reason) lines.push(`- Lý do phù hợp: ${school.reason}`);
      if (school.note) lines.push(`- Ghi chú: ${school.note}`);
      lines.push("");
    });
  }

  if (result.schools.length === 0 && result.followUpQuestions.length > 0) {
    if (lines.length > 0) lines.push("");
    lines.push("Mình cần thêm chút thông tin để gợi ý chính xác hơn:");
    result.followUpQuestions.forEach((q) => lines.push(`- ${q}`));
  }

  if (lines.length === 0) {
    return "Mình chưa có đủ thông tin để gợi ý ngay lúc này.";
  }

  return lines.join("\n").trim();
}

export async function getRecommendation(params: {
  summary?: string;
  messages: ChatMessage[];
  intent: Intent;
  input: string;
}): Promise<SchoolResult> {
  const response = await fetch("/api/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `HTTP ${response.status}`);
  }

  return (await response.json()) as SchoolResult;
}