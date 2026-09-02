import mongoose, { Document, Schema, Types } from "mongoose";

export interface IArticle extends Document {
  title: string;
  content: string;
  category: string;
  featuredImage: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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

articleSchema.index({ title: "text", category: "text" });
articleSchema.index({ createdAt: -1 });

export const Article = mongoose.model<IArticle>("Article", articleSchema);
