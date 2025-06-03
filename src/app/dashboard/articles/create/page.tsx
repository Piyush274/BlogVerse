"use client";
import { FormEvent, startTransition, useActionState, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createArticle } from "@/actions/createArticle";
import Link from "next/link";

//Only when the page is rendered in the browser, not on the server(server side rendering is false) else crashes
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
 
export default function page() 
{
  const [content, setContent] = useState("");

  const [formState, action, isPending] = useActionState(createArticle, {
    errors: {},
  });
 

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    //Addnd the content to the FormData object because ReactQuill does not submit the content as part of the form data
    formData.append("content", content);

    // Wrap the action call in startTransition so that content also goes to the server
    startTransition(() => {
      action(formData);
    });
  };
 
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter article title"
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

              {formState.errors.category && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.category}
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
                value={content}
                onChange={setContent} 
              />
              {formState.errors.content && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.content[0]}
                </span>
              )}
            </div>
            {formState.errors.formErrors && (
              <div className="dark:bg-transparent bg-red-100 p-2 border border-red-600">
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.formErrors}
                </span>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <Link href="/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              </Link>
              <Button disabled={isPending} type="submit">
                {isPending ? "Loading..." : "Publish Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}