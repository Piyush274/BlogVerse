import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Check, Heart } from "lucide-react";
import { toggleLike } from "@/api/likes.api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

type LikeButtonProps = {
  articleId: string;
  initialLikes?: number;
  isLiked?: boolean;
};

const LikeUnlikeButton: React.FC<LikeButtonProps> = ({
  articleId,
  initialLikes = 0,
  isLiked: initialIsLiked = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isPending, setIsPending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast.info("Please sign in to like this article");
      navigate("/sign-in");
      return;
    }

    // Optimistic toggle
    const prevCount = likesCount;
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    setIsPending(true);

    try {
      const res = await toggleLike(articleId);
      setIsLiked(res.isLiked);
      setLikesCount(res.count);
    } catch (error: any) {
      // Revert optimistic update
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error(error.message || "Failed to like article.");
    } finally {
      setIsPending(false);
    }
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
        // Ignored if cancelled
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
          variant={isLiked ? "default" : "outline"}
          size="sm"
          className={`gap-2 rounded-full transition-all duration-300 ${
            isLiked
              ? "bg-gradient-to-r from-red-500 to-pink-600 text-white border-transparent hover:from-red-600 hover:to-pink-700 shadow-md shadow-red-500/20"
              : "hover:border-red-500/50 hover:text-red-500"
          }`}
          onClick={handleLike}
          disabled={isPending}
        >
          <Heart
            className={`h-4 w-4 transition-transform active:scale-125 ${
              isLiked ? "fill-current" : ""
            }`}
          />
          <span className="font-semibold">{likesCount}</span>
          <span className="hidden sm:inline text-xs">
            {likesCount === 1 ? "Like" : "Likes"}
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
