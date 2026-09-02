import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createComment, CommentItem } from "@/api/comments.api";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type CommentFormProps = {
  articleId: string;
  onCommentAdded: (comment: CommentItem) => void;
};

const CommentForm: React.FC<CommentFormProps> = ({ articleId, onCommentAdded }) => {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="p-6 my-6 rounded-2xl bg-muted/40 border border-border/60 text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-foreground text-lg">Join the Discussion</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Sign in to share your thoughts, ask questions, or connect with the author and community.
        </p>
        <div className="pt-2">
          <Link to="/sign-in">
            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 gap-1.5 text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" /> Sign In to Comment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setError("Please write a comment before posting.");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const newComment = await createComment(articleId, body.trim());
      onCommentAdded(newComment);
      setBody("");
      toast.success("Comment posted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to post comment.");
      toast.error(err.message || "Failed to post comment.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-3 sm:gap-4 items-start">
        <Avatar className="h-10 w-10 ring-2 ring-primary/20 shrink-0 mt-1">
          <AvatarImage src={user.imageUrl} alt={user.name || "User"} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div className="relative">
            <Input
              placeholder="What are your thoughts on this article?..."
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (error) setError(null);
              }}
              className="py-6 px-4 text-sm sm:text-base rounded-xl bg-background/80 border-border/80 focus-visible:ring-primary focus-visible:border-primary transition-all"
            />
          </div>
          {error && (
            <p className="text-destructive text-xs sm:text-sm font-medium">
              {error}
            </p>
          )}
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-muted-foreground">
              Commenting as <span className="font-medium text-foreground">{user.name}</span>
            </span>
            <Button
              disabled={isPending || !body.trim()}
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground gap-1.5 rounded-lg font-medium shadow-sm"
            >
              {isPending ? (
                "Posting..."
              ) : (
                <>
                  Post Comment <Send className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
