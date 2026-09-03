import React, { useState } from "react";
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
    { id: "research", label: "Researcher Agent", icon: Search },
    { id: "drafting", label: "Drafter Agent", icon: FileText },
    { id: "critique", label: "Critic & Fact-Checker", icon: CheckCheck },
    { id: "seo", label: "SEO & Visuals Agent", icon: Tag },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Multi-Agent Editorial Team
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  LangGraph Orchestration
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Autonomous agent pipeline: Research ➔ Drafting ➔ Fact-Checking ➔ SEO & Cover
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRunning}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!result && (
            <form onSubmit={handleStartPipeline} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Article Topic or Core Technical Problem
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Distributed Caching Strategies with Redis and Node.js"
                  disabled={isRunning}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-zinc-100 placeholder-zinc-500 text-sm transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isRunning}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 outline-none text-zinc-100 text-sm transition"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Architecture">Architecture</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Editorial Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    disabled={isRunning}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 outline-none text-zinc-100 text-sm transition"
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
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Multi-Agent Editorial Pipeline
                </button>
              )}
            </form>
          )}

          {/* Stepper Status during execution */}
          {(isRunning || stepLogs.length > 0) && (
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Agent Orchestration Trace
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {steps.map((step) => {
                  const log = stepLogs.find((l) => l.step === step.id);
                  const isCompleted = log?.status === "completed";
                  const isCurrent = log?.status === "started";
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                        isCompleted
                          ? "bg-emerald-950/20 border-emerald-800/50 text-emerald-300"
                          : isCurrent
                          ? "bg-purple-950/30 border-purple-700/60 text-purple-200 animate-pulse"
                          : "bg-zinc-900/40 border-zinc-800/50 text-zinc-500"
                      }`}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        ) : (
                          <StepIcon className="w-4 h-4 text-zinc-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium">{step.label}</div>
                        <div className="text-[11px] truncate opacity-80">
                          {log ? log.summary : "Pending trigger..."}
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
            <div className="space-y-4 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Draft Ready
                  </span>
                  <h3 className="text-base font-bold text-zinc-100">{result.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-medium">
                    Editorial Score: {result.critiqueScore}/100
                  </div>
                </div>
              </div>

              {/* Tags & Cover prompt preview */}
              <div className="flex flex-wrap gap-1.5">
                {result.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Content Preview Box */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 max-h-56 overflow-y-auto text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                {result.content}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition"
            >
              Apply to Editor
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            isRunning && (
              <div className="text-xs text-purple-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Agents collaborating...
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
