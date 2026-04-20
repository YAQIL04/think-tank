"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Character } from "@/config/characters";
import CharacterAvatar from "@/components/CharacterAvatar";

interface Props {
  character: Character;
}

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  "elon-musk": [
    "如何用五步算法优化一个产品流程？",
    "你怎么看待现在的AI发展趋势？",
    "我的创业项目成本太高，怎么思考这个问题？",
  ],
  naval: [
    "我同时想做很多事，但精力不够，怎么办？",
    "如何判断一个机会是否有真正的杠杆？",
    "大厂干了5年，要不要出来创业？",
  ],
  trump: [
    "如何在谈判中占据主动？",
    "面对批评和攻击，应该怎么应对？",
    "如何建立一个强大的个人品牌？",
  ],
  munger: [
    "如何避免在投资中犯愚蠢的错误？",
    "大家都在追某个热点，我该跟风吗？",
    "如何培养多元思维模型的能力？",
  ],
};

export default function ChatClient({ character }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, setMessages } =
    useChat({
      api: "/api/chat",
      body: { characterId: character.id },
      onFinish: () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestedQuestion = (question: string) => {
    setHasStarted(true);
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    setTimeout(() => {
      const form = document.getElementById("chat-form") as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 50);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setHasStarted(true);
    handleSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = document.getElementById("chat-form") as HTMLFormElement;
      if (form) form.requestSubmit();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStarted(false);
  };

  const suggestions = SUGGESTED_QUESTIONS[character.id] || [];

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f]">
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0d0d14] shrink-0"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          智囊团
        </Link>

        {/* Character info */}
        <div className="flex items-center gap-3">
          <CharacterAvatar character={character} size={32} />
          <div>
            <p className="text-sm font-semibold text-white leading-tight">{character.name}</p>
            <p className="text-[11px] text-white/40 leading-tight">{character.title}</p>
          </div>
        </div>

        {/* New chat */}
        <button
          onClick={handleNewChat}
          className="text-white/40 hover:text-white/70 transition-colors text-sm flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          新对话
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            {/* Avatar large */}
            <CharacterAvatar character={character} size={80} className="mb-4 ring-2 ring-white/10" />
            <h2 className="text-xl font-bold text-white mb-1">{character.name}</h2>
            <p className="text-sm text-white/40 mb-8 max-w-xs leading-relaxed">
              {character.description}
            </p>

            {/* Suggested questions */}
            <div className="w-full max-w-lg space-y-2">
              <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">试试问他</p>
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 text-sm text-white/70 hover:text-white transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <CharacterAvatar character={character} size={32} className="mt-0.5" />
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-white/10 text-white/90 rounded-tr-sm"
                      : "bg-white/[0.05] text-white/85 rounded-tl-sm border border-white/8"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose-chat">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <CharacterAvatar character={character} size={32} className="mt-0.5" />
                <div className="bg-white/[0.05] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-3">
                  <span>发送失败，请重试</span>
                  <button
                    onClick={() => reload()}
                    className="text-red-300 hover:text-red-100 underline"
                  >
                    重试
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-white/8 bg-[#0d0d14] px-4 py-4">
        <form
          id="chat-form"
          onSubmit={handleFormSubmit}
          className="max-w-2xl mx-auto flex gap-3 items-end"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`和 ${character.name} 聊聊…`}
            rows={1}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-white/25 transition-colors leading-relaxed"
            style={{ maxHeight: "160px", overflowY: "auto" }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 disabled:opacity-30"
            style={{
              background: input.trim() && !isLoading ? character.accentColor : undefined,
              backgroundColor: !input.trim() || isLoading ? "rgba(255,255,255,0.05)" : undefined,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8h12M10 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
        <p className="text-center text-white/20 text-[11px] mt-2 max-w-2xl mx-auto">
          Enter 发送 · Shift+Enter 换行
        </p>
      </div>
    </div>
  );
}
