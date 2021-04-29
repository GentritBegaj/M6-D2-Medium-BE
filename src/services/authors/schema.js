import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AuthorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
});

export default model("Author", AuthorSchema);
