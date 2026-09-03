import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  TrendingUp,
  Flame,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { getDebateSummary, DebateSummaryResponse } from "../../api/ai.api";

interface CommunityPulseProps {
  articleId: string;
  commentsCount: number;
  onSelectStarterPrompt?: (prompt: string) => void;
}

export const CommunityPulse: React.FC<CommunityPulseProps> = ({
  articleId,
  commentsCount,
  onSelectStarterPrompt,
}) => {
  const [data, setData] = useState<DebateSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const res = await getDebateSummary(articleId);
      setData(res);
    } catch (err) {
      console.warn("Failed to fetch community pulse:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [articleId, commentsCount]);

  if (!data) return null;

  return (
    <div className="my-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-indigo-950/30 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
              AI Community Pulse & Discussion Synthesis
              {data.hasEnoughData && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  {data.overallSentiment}
                </span>
              )}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSummary}
            disabled={isLoading}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
            title="Refresh Synthesis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-purple-400" : ""}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="p-5 space-y-4 text-xs">
          {data.hasEnoughData ? (
            <>
              {/* Consensus */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Community Consensus
                </div>
                <p className="text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                  {data.consensus}
                </p>
              </div>

              {/* Perspectives distribution */}
              {data.perspectives && data.perspectives.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Differing Perspectives
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {data.perspectives.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-zinc-200 font-medium">
                          <span>{p.title}</span>
                          <span className="text-purple-400 text-[11px]">{p.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${p.percentage}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-normal">{p.viewpoint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Discussion Starter if 0 or 1 comment */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-zinc-200 text-xs">
                    AI Conversation Prompt:
                  </div>
                  <div className="text-zinc-400 text-[11px] mt-0.5 italic">
                    "{data.discussionStarter || data.consensus}"
                  </div>
                </div>
              </div>
              {onSelectStarterPrompt && data.discussionStarter && (
                <button
                  type="button"
                  onClick={() => onSelectStarterPrompt(data.discussionStarter!)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-[11px] font-medium transition"
                >
                  Answer Prompt
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
