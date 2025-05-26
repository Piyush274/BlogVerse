"use client";
import { FormEvent, startTransition, useActionState, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { updateArticle } from "@/actions/updateArticle";
import Image from "next/image";
import type {Articles} from "@/generated/prisma"

type EditArticlePageProps = {  //Get types from prisma (which is generated from the database schema)
  article: Articles;
};

const EditArticlePage: React.FC<EditArticlePageProps> = ({ article }) => {
  const [content, setContent] = useState(article.content);
  const [formState, action, isPending] = useActionState(
    updateArticle.bind(null, article.id),
    { errors: {} }
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("content", content);

    // Wrap the action call in startTransition
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Article</CardTitle>
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
              {formState.errors.title && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.title}
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
                <option value="technology">Technology</option>
                <option value="programming">Programming</option>
                <option value="web-development">Web Development</option>
              </select>
              {formState.errors.category && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.category}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              {article.featuredImage && (
                <div className="mb-4">
                  <Image
                    src={article.featuredImage}
                    alt="Current featured"
                    width={192}
                    height={128}  
                    className="object-cover rounded-md"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Current featured image
                  </p>
                </div>
              )}
              <Input
                id="featuredImage"
                name="featuredImage"
                type="file"
                accept="image/*"
              />
              {formState.errors.featuredImage && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.featuredImage}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill
                theme="snow"
                // defaultValue={}
                value={content}
                onChange={setContent}
              />
              {formState.errors.content && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.content[0]}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Discard Changes
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? "Loading..." : "Update Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default EditArticlePage;