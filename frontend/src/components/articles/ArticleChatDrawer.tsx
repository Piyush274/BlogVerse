import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquareText,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  Loader2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  askArticleAssistant,
  ChatMessage,
  Citation,
} from "../../api/ai.api";

interface ArticleChatDrawerProps {
  articleId: string;
  articleTitle: string;
}

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export const ArticleChatDrawer: React.FC<ArticleChatDrawerProps> = ({
  articleId,
  articleTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuestion, setInputQuestion] = useState("");
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I am your AI reader companion for **${articleTitle}**. Ask me any technical questions, request code breakdowns, or explore architectural trade-offs discussed in this article.`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    "What are the core technical trade-offs?",
    "Explain the code implementation in simple terms",
    "What are the key architectural takeaways?",
  ];

  const handleSend = async (queryText?: string) => {
    const question = queryText || inputQuestion;
    if (!question.trim() || isLoading) return;

    const userMsg: DisplayMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsLoading(true);

    try {
      const history: ChatMessage[] = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await askArticleAssistant(articleId, question.trim(), history);

      const assistantMsg: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        citations: response.citations,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an issue retrieving the article context. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-medium text-sm shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition duration-200 border border-purple-400/30"
      >
        <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
        <span>Ask Article AI</span>
      </button>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Chat Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out text-zinc-100 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                Article Assistant
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  RAG
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 truncate max-w-[240px]">
                {articleTitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-bl-none shadow-sm"
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Grounding Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-1.5">
                    <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-purple-400" />
                      Grounded Article Sources
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cit) => (
                        <button
                          key={cit.chunkIndex}
                          onClick={() => setSelectedCitation(cit)}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-purple-300 text-[10px] border border-zinc-700 transition flex items-center gap-1"
                        >
                          <span>Source [{cit.chunkIndex}]</span>
                          <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Analyzing article context & synthesizing answer...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-950/40 space-y-1.5">
            <div className="text-[10px] text-zinc-400 font-medium">Suggested Questions:</div>
            <div className="flex flex-col gap-1">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="text-left text-[11px] text-zinc-300 hover:text-purple-300 hover:bg-zinc-800/60 px-2.5 py-1.5 rounded-lg border border-zinc-800 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Citation Modal / Popover */}
        {selectedCitation && (
          <div className="px-4 py-3 bg-zinc-950 border-t border-purple-900/50 text-xs space-y-1">
            <div className="flex items-center justify-between text-purple-400 font-semibold text-[11px]">
              <span>Grounding Passage [Source {selectedCitation.chunkIndex}]</span>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-zinc-300 text-[11px] italic bg-zinc-900/90 p-2 rounded border border-zinc-800 max-h-24 overflow-y-auto">
              "{selectedCitation.text}"
            </p>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything about this post..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-zinc-100 placeholder-zinc-500 text-xs transition"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition shadow-md shadow-purple-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
