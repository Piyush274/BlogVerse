import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Flame,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  MessageSquare,
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
    <div className="my-6 rounded-2xl bg-zinc-950/80 border border-purple-500/20 overflow-hidden shadow-xl backdrop-blur-md">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-purple-950/30 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h4 className="text-xs font-bold text-white tracking-tight">
                AI Community Pulse & Discussion Synthesis
              </h4>
              {data.hasEnoughData && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold tracking-wide">
                  {data.overallSentiment}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchSummary}
            disabled={isLoading}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-lg transition"
            title="Refresh Synthesis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-purple-400" : ""}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-lg transition"
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
              {/* Consensus Statement */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  Community Consensus
                </div>
                <p className="text-zinc-200 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 text-xs shadow-inner">
                  {data.consensus}
                </p>
              </div>

              {/* Differing Perspectives */}
              {data.perspectives && data.perspectives.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Differing Perspectives
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.perspectives.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/30 transition-colors space-y-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between text-zinc-100 font-semibold text-xs">
                          <span>{p.title}</span>
                          <span className="text-purple-300 font-mono text-[11px]">{p.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full shadow-sm"
                            style={{ width: `${p.percentage}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed">{p.viewpoint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Discussion Starter if 0 or 1 comment */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-purple-950/20 border border-purple-800/30">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-100 text-xs">
                    AI Conversation Prompt:
                  </div>
                  <div className="text-zinc-300 text-[11px] mt-0.5 italic">
                    "{data.discussionStarter || data.consensus}"
                  </div>
                </div>
              </div>
              {onSelectStarterPrompt && data.discussionStarter && (
                <button
                  type="button"
                  onClick={() => onSelectStarterPrompt(data.discussionStarter!)}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition shadow-md shadow-purple-600/20"
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
