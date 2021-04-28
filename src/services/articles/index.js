import { Router } from "express";

import ArticleModel from "./schema.js";
import ReviewModel from "../reviews/schema.js";
import mongoose from "mongoose";

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

router.get("/:articleId/reviews", async (req, res, next) => {
  try {
    const reviews = await ArticleModel.findById(req.params.articleId, {
      reviews: 1,
      _id: 0,
    });
    res.send(reviews);
  } catch (err) {
    next(err);
  }
});

router.get("/:articleId/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviews } = await ArticleModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.articleId),
      }, //QUERY
      {
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    ); // PROJECTION, elemMatch is a projection operator
    if (reviews && reviews.length > 0) {
      res.send(reviews[0]);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/:articleId", async (req, res, next) => {
  try {
    const newReview = new ReviewModel(req.body);
    const review = await newReview.save();

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.articleId,
      {
        $push: {
          reviews: review,
        },
      },
      { runValidators: true, new: true }
    );
    res.send(review);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete("/:articleId/reviews/:reviewId", async (req, res, next) => {
  try {
    console.log("HEREEEE");
    const modifiedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.articleId,
      {
        $pull: {
          reviews: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      },
      { new: true }
    );
    res.send(modifiedArticle);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.put("/:articleId/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedArticle = await ArticleModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.articleId),
        "reviews._id": mongoose.Types.ObjectId(req.params.reviewId),
      },
      { $set: { "reviews.$": req.body } },
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifiedArticle) {
      res.send(modifiedArticle);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
