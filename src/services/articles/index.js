import { Router } from "express";

import ArticleModel from "./schema.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const articles = await ArticleModel.find();
    res.send(articles);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id);
    if (article) {
      res.send(article);
    } else {
      const error = new Error("Article not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newArticle = new ArticleModel(req.body);
    const { _id } = await newArticle.save();
    res.status(201).send(_id);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (article) {
      res.send(article);
    } else {
      const error = new Error(`Article with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id);
    if (article) {
      res.send("Article deleted!");
    } else {
      const error = new Error(`Article with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

export default router;
