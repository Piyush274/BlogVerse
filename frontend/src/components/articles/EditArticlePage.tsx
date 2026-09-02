import React, { FormEvent, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { updateArticle, Article } from "@/api/articles.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type EditArticlePageProps = {
  article: Article;
};

const EditArticlePage: React.FC<EditArticlePageProps> = ({ article }) => {
  const navigate = useNavigate();
  const articleId = article.id || (article as any)._id;
  const [content, setContent] = useState(article.content || "");
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("content", content);

    try {
      await updateArticle(articleId, formData);
      toast.success("Article updated successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Update article error:", err);
      toast.error(err.message || "Failed to update article.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-card/70 backdrop-blur-md border border-border/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={article.title}
                placeholder="Enter article title"
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
                defaultValue={article.category}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Select Category</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps">DevOps</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Productivity">Productivity</option>
                <option value="Career Advice">Career Advice</option>
                <option value="Open Source">Open Source</option>
              </select>
              {errors.category && (
                <span className="font-medium text-sm text-destructive">
                  {errors.category[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              {article.featuredImage && (
                <div className="mb-4">
                  <img
                    src={article.featuredImage}
                    alt="Current featured"
                    className="w-48 h-32 object-cover rounded-md border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current featured image (leave empty to keep)
                  </p>
                </div>
              )}
              <Input
                id="featuredImage"
                name="featuredImage"
                type="file"
                accept="image/*"
              />
              {errors.featuredImage && (
                <span className="font-medium text-sm text-destructive">
                  {errors.featuredImage[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="bg-background rounded-md"
              />
              {errors.content && (
                <span className="font-medium text-sm text-destructive">
                  {errors.content[0]}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Discard Changes
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Update Article"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditArticlePage;
