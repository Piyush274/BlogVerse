import { FormEvent, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createArticle } from "@/api/articles.api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Sparkles, Bot } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AgentEditorialModal } from "@/components/articles/AgentEditorialModal";

export default function CreateArticlePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleApplyAiDraft = (draft: {
    title: string;
    content: string;
    category: string;
  }) => {
    setTitle(draft.title);
    try {
      // Parse markdown (headings, bold, lists, code blocks) into rich HTML for ReactQuill
      const htmlContent = marked.parse(draft.content, { async: false }) as string;
      setContent(htmlContent);
    } catch (e) {
      setContent(draft.content);
    }
    if (draft.category) {
      setCategory(draft.category);
    }
    toast.success("AI draft successfully formatted and applied to editor!");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("title", title);
    if (category) formData.set("category", category);
    formData.append("content", content);

    try {
      await createArticle(formData);
      toast.success("Article created and published successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Failed to create article:", err);
      toast.error(err.message || "Failed to create article.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Create New Article</h1>
              <p className="text-muted-foreground mt-1">
                Share your knowledge and ideas with the BlogVerse community.
              </p>
            </div>

            {/* AI Multi-Agent Editorial Trigger */}
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 self-start sm:self-auto transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/10"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative px-4 py-2.5 rounded-[11px] bg-zinc-950 hover:bg-zinc-900 transition-colors flex items-center gap-2.5 text-white font-medium text-sm">
                <div className="p-1 rounded-lg bg-purple-500/20 text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                </div>
                <span className="font-semibold tracking-tight text-zinc-100">AI Agent Editorial Team</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  LangGraph
                </span>
              </div>
            </button>
          </div>

          <AgentEditorialModal
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
            onApplyDraft={handleApplyAiDraft}
          />

          <Card className="bg-card/70 backdrop-blur-md border shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Article Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter article title..."
                    className="h-11 text-base"
                    required
                  />
                  {errors.title && (
                    <span className="font-medium text-sm text-destructive">
                      {errors.title[0]}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-zinc-900 dark:text-zinc-100"
                    required
                  >
                    <option value="" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Select Category</option>
                    <option value="Technology" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Technology</option>
                    <option value="Architecture" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Architecture</option>
                    <option value="AI" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Artificial Intelligence (AI)</option>
                    <option value="Web Development" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Web Development</option>
                    <option value="Machine Learning" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Machine Learning</option>
                    <option value="Data Science" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Data Science</option>
                    <option value="Cloud Computing" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Cloud Computing</option>
                    <option value="DevOps" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">DevOps</option>
                    <option value="Cybersecurity" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Cybersecurity</option>
                    <option value="UI/UX Design" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">UI/UX Design</option>
                    <option value="Blockchain" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Blockchain</option>
                    <option value="Productivity" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Productivity</option>
                    <option value="Career Advice" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Career Advice</option>
                    <option value="Open Source" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Open Source</option>
                  </select>
                  {errors.category && (
                    <span className="font-medium text-sm text-destructive">
                      {errors.category[0]}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image</Label>
                  <Input
                    id="featuredImage"
                    name="featuredImage"
                    type="file"
                    accept="image/*"
                    required
                  />
                  {errors.featuredImage && (
                    <span className="font-medium text-sm text-destructive">
                      {errors.featuredImage[0]}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content (Rich Article Body)</Label>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Write your article content here... Add headings, code blocks, lists, and quotes."
                    className="bg-background rounded-md"
                  />
                  {errors.content && (
                    <span className="font-medium text-sm text-destructive">
                      {errors.content[0]}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link to="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-md"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                      </>
                    ) : (
                      "Publish Article"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
