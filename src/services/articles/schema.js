import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ArticleSchema = new Schema(
  {
    headLine: String,
    subHead: String,
    content: String,
    category: {
      name: String,
      img: String,
    },
    author: {
      name: String,
      img: String,
    },
    cover: String,
    reviews: [
      {
        text: String,
        user: String,
        createdAt: Date,
        updatedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default model("Article", ArticleSchema);
