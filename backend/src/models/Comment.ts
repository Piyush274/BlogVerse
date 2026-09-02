import mongoose, { Document, Schema, Types } from "mongoose";

export interface IComment extends Document {
  body: string;
  article: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
