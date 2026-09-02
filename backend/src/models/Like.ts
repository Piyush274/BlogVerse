import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILike extends Document {
  user: Types.ObjectId;
  article: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

likeSchema.index({ user: 1, article: 1 }, { unique: true });

export const Like = mongoose.model<ILike>("Like", likeSchema);
