"use client";

import { useState, useRef, useEffect } from "react";
import { NDAFormData, ChatMessage, defaultFormData } from "@/lib/types";
import { sendChatMessage } from "@/lib/chatApi";
import { mergeNDAFields } from "@/lib/mergeFields";

interface NDAChatProps {
  formData: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

const WELCOME =
  "Hi! I'm here to help you draft your Mutual NDA. Let's start — what are the names of the two companies involved in this agreement?";

export default function NDAChat({ formData, onChange }: NDAChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formDataRef = useRef(formData);
  // Only fields explicitly extracted by the AI — never includes defaultFormData values.
  // This prevents the AI from thinking pre-filled defaults are user-confirmed answers.
  const extractedRef = useRef<Record<string, unknown>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        nextMessages,
        extractedRef.current
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.message },
      ]);
      const { message: _msg, ...fields } = response;
      // Accumulate only non-null extracted fields
      Object.entries(fields).forEach(([k, v]) => {
        if (v !== null && v !== undefined) extractedRef.current[k] = v;
      });
      onChange(mergeNDAFields(formDataRef.current, fields));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([{ role: "assistant", content: WELCOME }]);
    extractedRef.current = {};
    onChange(defaultFormData);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-stone-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-stone-800">
              AI Assistant
            </p>
            <p className="text-[11px] text-[#888888] leading-relaxed mt-0.5">
              Chat to fill in your NDA. The preview updates automatically.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-[11px] text-[#888888] hover:text-stone-600 underline underline-offset-2 transition-colors duration-150 shrink-0 ml-3"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-form px-4 py-4 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                msg.role === "user"
                  ? "max-w-[85%] bg-[#032147] text-white text-[13px] rounded-2xl rounded-tr-sm px-4 py-2.5 leading-relaxed"
                  : "max-w-[90%] bg-white border border-stone-200 text-stone-700 text-[13px] rounded-2xl rounded-tl-sm px-4 py-2.5 leading-relaxed shadow-sm"
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-stone-100 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message… (Enter to send)"
            rows={2}
            disabled={isLoading}
            className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-[13px] text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-[#ecad0a] focus:ring-1 focus:ring-[#ecad0a]/15 transition-all duration-150 resize-none leading-relaxed disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="shrink-0 bg-[#753991] hover:bg-[#8b44a5] disabled:opacity-40 text-white text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150 h-[50px]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
