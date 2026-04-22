import { NextResponse } from "next/server";
import {
  buildSchoolPrompt,
  normalizeResult,
  safeJsonParse,
  type ChatMessage,
  type Intent,
} from "@/constants/constants";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-flash-latest";

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { message: "Missing GEMINI_API_KEY" },
        { status: 500 },
      );
    }

    const body = await req.json();

    const summary = typeof body.summary === "string" ? body.summary : "";
    const intent = body.intent as Intent;
    const input = typeof body.input === "string" ? body.input : "";

    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (m: any) => m && (m.role === "user" || m.role === "assistant"),
          )
          .map((m: any) => ({
            role: m.role,
            content: String(m.content ?? ""),
          }))
      : [];

    const prompt = buildSchoolPrompt({
      messages,
      summary,
      intent,
      input,
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1200,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return NextResponse.json(
        {
          message: `Gemini HTTP ${response.status}`,
          detail,
        },
        { status: 500 },
      );
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join(
        "",
      ) || "{}";

    const parsed = safeJsonParse(text, {});
    return NextResponse.json(normalizeResult(parsed));
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}