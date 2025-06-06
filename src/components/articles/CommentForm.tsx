"use client";
import React, { useActionState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createComments } from "@/actions/createComments";

type CommentFormProps = {
    articleId:string
}
const CommentForm : React.FC<CommentFormProps> = ({articleId}) => {
  const [formState, action, isPending] = useActionState(createComments.bind(null, articleId), {
    errors: {},
  });
  return (
    <form action={action} className="mb-8">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage/>
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input placeholder="Add a comment..." name="body" className="py-6 text-base" />
          {formState.errors.body && <p className="text-red-600 text-sm font-medium">{formState.errors.body}</p>}
          <div className="mt-4 flex justify-end">
            <Button disabled={isPending} type="submit">
              {isPending ? "Loading..." : "Post Comment"}
            </Button>
          </div>
          {
            formState.errors.formErrors && <div className="p-2 border border-red-600 bg-red-100 ">{formState.errors.formErrors[0]}</div>
          }
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
