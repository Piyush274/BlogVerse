"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Share2, ThumbsUp, Check, Heart } from "lucide-react";
import React, { useOptimistic, useTransition, useState } from "react";
import { likeUnlikeArticle } from "@/actions/likeUnlikeArticle";
import type { Like } from "@prisma/client";
import { toast } from "sonner";

type LikeButtonProps = {
  articleId: string;
  initialLikes?: number;
  likes?: any[];
  isLiked: boolean;
};

const LikeUnlikeButton: React.FC<LikeButtonProps> = ({
  articleId,
  initialLikes,
  likes,
  isLiked: initialIsLiked,
}) => {
  const countValue = initialLikes !== undefined ? initialLikes : (likes?.length || 0);
  const [optimisticState, setOptimisticState] = useOptimistic(
    { count: countValue, liked: initialIsLiked },
    (state) => ({
      count: state.liked ? state.count - 1 : state.count + 1,
      liked: !state.liked,
    })
  );

  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    startTransition(async () => {
      setOptimisticState(undefined); // toggle
      try {
        await likeUnlikeArticle(articleId);
      } catch (error) {
        toast.error("Please log in to like this article");
      }
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        // user dismissed share or fallback
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(!isSaved ? "Saved to your bookmarks!" : "Removed from bookmarks");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 my-10 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={optimisticState.liked ? "default" : "outline"}
          size="sm"
          className={`gap-2 rounded-full transition-all duration-300 ${
            optimisticState.liked
              ? "bg-gradient-to-r from-red-500 to-pink-600 text-white border-transparent hover:from-red-600 hover:to-pink-700 shadow-md shadow-red-500/20"
              : "hover:border-red-500/50 hover:text-red-500"
          }`}
          onClick={handleLike}
          disabled={isPending}
        >
          <Heart
            className={`h-4 w-4 transition-transform active:scale-125 ${
              optimisticState.liked ? "fill-current" : ""
            }`}
          />
          <span className="font-semibold">{optimisticState.count}</span>
          <span className="hidden sm:inline text-xs">
            {optimisticState.count === 1 ? "Like" : "Likes"}
          </span>
        </Button>

        <Button
          variant={isSaved ? "secondary" : "ghost"}
          size="sm"
          className={`gap-2 rounded-full transition-colors ${
            isSaved ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={handleSave}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          <span className="text-xs sm:text-sm">{isSaved ? "Saved" : "Save"}</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full text-muted-foreground hover:text-foreground transition-all"
          onClick={handleShare}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
          <span className="text-xs sm:text-sm">{copied ? "Copied!" : "Share Article"}</span>
        </Button>
      </div>
    </div>
  );
};

export default LikeUnlikeButton;
