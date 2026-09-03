import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  FileText,
  Search,
  CheckCheck,
  Tag,
  X,
  Sliders,
  Layers,
} from "lucide-react";
import {
  streamEditorialPipeline,
  AgentStepLog,
  EditorialResult,
} from "../../api/ai.api";

interface AgentEditorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDraft: (data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    suggestedCoverPrompt?: string;
  }) => void;
}

export const AgentEditorialModal: React.FC<AgentEditorialModalProps> = ({
  isOpen,
  onClose,
  onApplyDraft,
}) => {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tone, setTone] = useState<"technical" | "conversational" | "beginner-friendly" | "deep-dive">("technical");
  const [isRunning, setIsRunning] = useState(false);
  const [stepLogs, setStepLogs] = useState<AgentStepLog[]>([]);
  const [result, setResult] = useState<EditorialResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsRunning(true);
    setError(null);
    setStepLogs([]);
    setResult(null);

    await streamEditorialPipeline(
      { topic, category, tone },
      (newLog) => {
        setStepLogs((prev) => {
          const filtered = prev.filter((p) => p.step !== newLog.step);
          return [...filtered, newLog];
        });
      },
      (finalResult) => {
        setIsRunning(false);
        setResult(finalResult);
      },
      (err) => {
        setIsRunning(false);
        setError(err);
      }
    );
  };

  const handleApply = () => {
    if (result) {
      onApplyDraft({
        title: result.title,
        content: result.content,
        category: result.category,
        tags: result.tags,
        suggestedCoverPrompt: result.suggestedCoverPrompt,
      });
      onClose();
    }
  };

  const steps = [
    { id: "research", label: "Researcher Agent", desc: "Core concepts & best practices", icon: Search },
    { id: "drafting", label: "Drafter Agent", desc: "Semantic markdown & code", icon: FileText },
    { id: "critique", label: "Critic & Fact-Checker", desc: "Quality score & rigor", icon: CheckCheck },
    { id: "seo", label: "SEO & Visuals Agent", desc: "Tags, metadata & cover prompt", icon: Tag },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden text-zinc-100">
        
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Multi-Agent Editorial Team
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
                  LangGraph
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Autonomous 4-stage pipeline: Research ➔ Drafting ➔ Fact-Checking ➔ SEO & Cover
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRunning}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!result && (
            <form onSubmit={handleStartPipeline} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Article Topic or Core Technical Problem
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Distributed Caching Strategies with Redis and Node.js"
                    disabled={isRunning}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none text-zinc-100 placeholder-zinc-500 text-sm transition shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isRunning}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none text-zinc-100 text-sm transition"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Architecture">Architecture</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Editorial Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    disabled={isRunning}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none text-zinc-100 text-sm transition"
                  >
                    <option value="technical">Technical & Practical</option>
                    <option value="deep-dive">Deep Dive / Architecture</option>
                    <option value="beginner-friendly">Beginner-Friendly Guide</option>
                    <option value="conversational">Conversational / Opinion</option>
                  </select>
                </div>
              </div>

              {!isRunning && (
                <button
                  type="submit"
                  disabled={!topic.trim()}
                  className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border border-purple-400/30 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                  Launch Multi-Agent Editorial Pipeline
                </button>
              )}
            </form>
          )}

          {/* Stepper Status during execution */}
          {(isRunning || stepLogs.length > 0) && (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/90 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Agent Orchestration Trace
                </h3>
                {isRunning && (
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                    Streaming execution...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {steps.map((step) => {
                  const log = stepLogs.find((l) => l.step === step.id);
                  const isCompleted = log?.status === "completed";
                  const isCurrent = log?.status === "started";
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all duration-200 ${
                        isCompleted
                          ? "bg-emerald-950/20 border-emerald-700/40 text-emerald-300 shadow-sm"
                          : isCurrent
                          ? "bg-purple-950/30 border-purple-600/60 text-purple-200 shadow-md shadow-purple-950/40 animate-pulse"
                          : "bg-zinc-900/40 border-zinc-800/60 text-zinc-500"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        ) : (
                          <StepIcon className="w-4 h-4 text-zinc-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-zinc-200">{step.label}</div>
                        <div className="text-[11px] truncate opacity-75 mt-0.5">
                          {log ? log.summary : step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              {error}
            </div>
          )}

          {/* Final Generated Result Preview */}
          {result && (
            <div className="space-y-4 pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                    Draft Ready
                  </span>
                  <h3 className="text-base font-bold text-white truncate">{result.title}</h3>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    Score: {result.critiqueScore}/100
                  </div>
                </div>
              </div>

              {/* Tags preview */}
              <div className="flex flex-wrap gap-1.5">
                {result.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-900 text-purple-300 border border-zinc-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Formatted Markdown Preview */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 max-h-56 overflow-y-auto text-xs text-zinc-200 leading-relaxed prose prose-invert prose-xs max-w-none shadow-inner">
                <ReactMarkdown>{result.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 transition"
          >
            Cancel
          </button>

          {result ? (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition border border-purple-400/30"
            >
              Apply to Editor
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            isRunning && (
              <div className="text-xs text-purple-300 font-medium flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                Multi-Agents collaborating...
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
