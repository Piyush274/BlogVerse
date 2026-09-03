import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, ArrowLeft, Calendar, Clock, Sparkles, UserCheck, BookOpen } from "lucide-react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import LikeUnlikeButton from "./LikeUnlikeButton";
import { Link } from "react-router-dom";
import { Article } from "@/api/articles.api";
import { fetchComments, CommentItem } from "@/api/comments.api";
import { fetchLikes } from "@/api/likes.api";

type ArticleDetailPageProps = {
  article: Article;
};

export function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  const articleId = article.id || (article as any)._id;
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (articleId) {
      fetchComments(articleId)
        .then((data) => setComments(data))
        .catch((err) => console.error("Error loading comments:", err));

      fetchLikes(articleId)
        .then((data) => {
          setLikesCount(data.count);
          setIsLiked(data.isLiked);
        })
        .catch((err) => console.error("Error loading likes:", err));
    }
  }, [articleId]);

  const handleCommentAdded = (newComment: CommentItem) => {
    setComments((prev) => [newComment, ...prev]);
  };

  // Dynamic reading time calculation
  const plainText = (article.content || "").replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const authorName = article.author?.name || "Author";
  const authorInitial = authorName.charAt(0) || "A";
  const hasFeaturedImage = !!(article.featuredImage && article.featuredImage.trim().length > 0);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background glow & grid pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px]">
        <div className="absolute left-1/2 -top-24 -translate-x-1/2 -z-10 h-[350px] w-[600px] rounded-full bg-gradient-to-tr from-primary/20 to-purple-600/20 blur-[120px] pointer-events-none" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl w-full">
        {/* Navigation & Category Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Articles</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {article.category || "General"}
          </span>
        </div>

        {/* Article Header */}
        <header className="mb-10 space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
            {article.title}
          </h1>

          {/* Author & Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/60">
            <div className="flex items-center gap-3.5">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={article.author?.imageUrl} alt={authorName} />
                <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-purple-600/20 text-primary font-bold">
                  {authorInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    {authorName}
                  </p>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                    Author
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 bg-muted/60 px-3 py-1.5 rounded-full border border-border/50">
                <BookOpen className="h-3.5 w-3.5" /> {wordCount} words
              </span>
              <span className="flex items-center gap-1 bg-muted/60 px-3 py-1.5 rounded-full border border-border/50">
                <MessageCircle className="h-3.5 w-3.5" /> {comments.length} comments
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image (If available) */}
        {hasFeaturedImage && (
          <div className="relative mb-12 aspect-[16/9] sm:aspect-[21/9] max-h-[520px] w-full overflow-hidden rounded-2xl border border-border/70 shadow-2xl bg-muted/30">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Article Body Content */}
        <article className="mb-12 max-w-5xl mx-auto">
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />
        </article>

        {/* Engagement Actions Bar */}
        <LikeUnlikeButton articleId={articleId} initialLikes={likesCount} isLiked={isLiked} />

        {/* Author Bio Footer Box */}
        <div className="p-6 my-10 rounded-2xl bg-card/50 backdrop-blur-md border border-border/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20 shrink-0">
            <AvatarImage src={article.author?.imageUrl} alt={authorName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {authorInitial}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-lg">{authorName}</h3>
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Writer and creator on BlogVerse. Sharing insights, stories, and ideas to inspire readers worldwide.
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <section id="comments" className="mt-12">
          <Card className="p-6 sm:p-8 bg-card/60 backdrop-blur-xl border border-border/80 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-8 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Discussion ({comments.length})
                </h2>
              </div>
            </div>

            {/* Comment Form */}
            <CommentForm articleId={articleId} onCommentAdded={handleCommentAdded} />

            {/* Comments List */}
            <CommentList comments={comments} />
          </Card>
        </section>
      </main>
    </div>
  );
}
