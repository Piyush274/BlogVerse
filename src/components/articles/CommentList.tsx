import type { Prisma } from "@/generated/prisma";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageSquareDashed } from "lucide-react";

type CommentListProps = {
  comments: Prisma.CommentGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>[];
};

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border/80 bg-muted/20">
        <MessageSquareDashed className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
        <h4 className="text-base font-medium text-foreground">No comments yet</h4>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          Start the conversation by posting the first comment above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-card/40 border border-border/50 hover:border-border transition-colors"
        >
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-1 ring-primary/20 shrink-0 mt-0.5">
            <AvatarImage src={comment.author.imageUrl as string} alt={comment.author.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {comment.author.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
              <span className="font-semibold text-foreground text-sm truncate">
                {comment.author.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed break-words whitespace-pre-wrap">
              {comment.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
