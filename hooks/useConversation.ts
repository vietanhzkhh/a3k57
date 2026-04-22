"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatSchoolResult,
  getRecommendation,
  INTENT_LABELS,
  type ChatMessage,
  type Intent,
  type SchoolResult,
  type StoredMessage,
} from "@/constants/constants";

export type Conversation = {
  id: string;
  title: string;
  intent?: Intent;
  messages: StoredMessage[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "school_conversations_v1";
const ACTIVE_KEY = "school_active_conversation_id_v1";

const genId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2)}`;

function toChatMessages(messages: StoredMessage[]): ChatMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

function createConversation(params: {
  title: string;
  intent?: Intent;
}): Conversation {
  const now = new Date().toISOString();

  return {
    id: genId(),
    title: params.title,
    intent: params.intent,
    summary: "",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const rawList = localStorage.getItem(STORAGE_KEY);
      const list: Conversation[] = rawList ? JSON.parse(rawList) : [];

      const activeId = localStorage.getItem(ACTIVE_KEY);
      const active =
        list.find((item) => item.id === activeId) ?? list[0] ?? null;

      setConversations(list);
      setCurrentConversation(active);
    } catch {
      setConversations([]);
      setCurrentConversation(null);
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  // }, [conversations]);

  const messages = useMemo(
    () => currentConversation?.messages ?? [],
    [currentConversation],
  );

  const persistList = (nextList: Conversation[]) => {
    setConversations(nextList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
  };

  const upsertConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    localStorage.setItem(ACTIVE_KEY, conversation.id);

    setConversations((prev) => {
      const exists = prev.some((item) => item.id === conversation.id);
      const next = exists
        ? prev.map((item) =>
            item.id === conversation.id ? conversation : item,
          )
        : [conversation, ...prev];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const createNewConversation = (
    title = "Cuộc trò chuyện mới",
    intent?: Intent,
  ) => {
    const conv = createConversation({ title, intent });
    upsertConversation(conv);
    return conv;
  };

  const switchConversation = (id: string) => {
    const conv = conversations.find((item) => item.id === id);
    if (!conv) return;

    setCurrentConversation(conv);
    localStorage.setItem(ACTIVE_KEY, conv.id);
  };

  const addMessage = (
    message: Omit<StoredMessage, "id" | "createdAt"> &
      Partial<Pick<StoredMessage, "id" | "createdAt">>,
  ) => {
    const target = currentConversation;
    if (!target) return null;

    const newMessage: StoredMessage = {
      id: message.id ?? genId(),
      role: message.role,
      content: message.content,
      createdAt: message.createdAt ?? new Date().toISOString(),
    };

    const updatedConversation: Conversation = {
      ...target,
      messages: [...target.messages, newMessage],
      updatedAt: new Date().toISOString(),
    };

    upsertConversation(updatedConversation);
    return newMessage;
  };

  const loadConversation = (id: string) => {
    switchConversation(id);
  };

  const clearCurrentConversation = () => {
    setCurrentConversation(null);
    localStorage.removeItem(ACTIVE_KEY);
  };

  const deleteConversation = (id: string) => {
    const next = conversations.filter((item) => item.id !== id);
    persistList(next);

    if (currentConversation?.id === id) {
      const nextActive = next[0] ?? null;
      setCurrentConversation(nextActive);

      if (nextActive) {
        localStorage.setItem(ACTIVE_KEY, nextActive.id);
      } else {
        localStorage.removeItem(ACTIVE_KEY);
      }
    }
  };

  const runTurn = async (params: { intent: Intent; input: string }) => {
    const input = params.input.trim();
    const intent = params.intent;

    if (!input && !intent) {
      throw new Error("EMPTY_INPUT");
    }

    setLoading(true);

    try {
      const current =
        currentConversation ??
        createNewConversation(
          input || INTENT_LABELS[intent] || "Cuộc trò chuyện mới",
          intent,
        );

      const userMessage: StoredMessage = {
        id: genId(),
        role: "user",
        content: input || INTENT_LABELS[intent],
        createdAt: new Date().toISOString(),
      };

      const nextMessages = [...current.messages, userMessage];
      const chatMessages = toChatMessages(nextMessages);

      const result: SchoolResult = await getRecommendation({
        summary: current.summary,
        messages: chatMessages,
        intent,
        input,
      });

      const assistantMessage: StoredMessage = {
        id: genId(),
        role: "assistant",
        content: formatSchoolResult(result),
        createdAt: new Date().toISOString(),
      };

      const finalMessages = [...nextMessages, assistantMessage];
      const isDefaultTitle = current.title === "Cuộc trò chuyện mới";
      const updatedConversation: Conversation = {
        ...current,
        title: isDefaultTitle
          ? (input || INTENT_LABELS[intent]).slice(0, 40)
          : current.title,
        intent: current.intent ?? intent,
        summary: result.summary || current.summary,
        messages: finalMessages,
        updatedAt: new Date().toISOString(),
      };

      upsertConversation(updatedConversation);
      return {
        result,
        conversationId: updatedConversation.id,
      };
    } catch (error) {
      const errorMessage: StoredMessage = {
        id: genId(),
        role: "assistant",
        content: "Có lỗi xảy ra, vui lòng thử lại.",
        createdAt: new Date().toISOString(),
      };

      if (currentConversation) {
        const updatedConversation: Conversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, errorMessage],
          updatedAt: new Date().toISOString(),
        };
        upsertConversation(updatedConversation);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendKeyword = (keyword: string) => {
    return runTurn({
      intent: "free_text",
      input: keyword,
    });
  };

  const sendIntent = (intent: Intent, label: string) => {
    return runTurn({
      intent,
      input: label,
    });
  };

  return {
    conversations,
    currentConversation,
    currentConversationId: currentConversation?.id ?? null,
    messages,
    loading,
    createNewConversation,
    switchConversation,
    addMessage,
    loadConversation,
    clearCurrentConversation,
    deleteConversation,
    sendKeyword,
    sendIntent,
  };
}
