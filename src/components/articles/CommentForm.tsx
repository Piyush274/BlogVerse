"use client";
import React, { useActionState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createComments } from "@/actions/createComments";
import { useUser, SignInButton } from "@clerk/nextjs";
import { MessageSquare, Send, Sparkles } from "lucide-react";

type CommentFormProps = {
  articleId: string;
};

const CommentForm: React.FC<CommentFormProps> = ({ articleId }) => {
  const { user, isSignedIn } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, action, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createComments(articleId, prevState, formData);
      if (!result.errors.body && !result.errors.formErrors) {
        formRef.current?.reset();
      }
      return result;
    },
    { errors: {} }
  );

  if (!isSignedIn) {
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
          <SignInButton>
            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 gap-1.5">
              <Sparkles className="h-4 w-4" /> Sign In to Comment
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="mb-8">
      <div className="flex gap-3 sm:gap-4 items-start">
        <Avatar className="h-10 w-10 ring-2 ring-primary/20 shrink-0 mt-1">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {user?.firstName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div className="relative">
            <Input
              placeholder="What are your thoughts on this article?..."
              name="body"
              className="py-6 px-4 text-sm sm:text-base rounded-xl bg-background/80 border-border/80 focus-visible:ring-primary focus-visible:border-primary transition-all"
            />
          </div>
          {formState.errors.body && (
            <p className="text-red-500 text-xs sm:text-sm font-medium">
              {formState.errors.body[0]}
            </p>
          )}
          {formState.errors.formErrors && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs sm:text-sm">
              {formState.errors.formErrors[0]}
            </div>
          )}
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-muted-foreground">
              Commenting as <span className="font-medium text-foreground">{user?.fullName || "You"}</span>
            </span>
            <Button
              disabled={isPending}
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
