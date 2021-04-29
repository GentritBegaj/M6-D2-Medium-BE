import { Router } from "express";
import q2m from "query-to-mongo";
import AuthorModel from "./schema.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await AuthorModel.countDocuments(query.criteria);

    const authors = await AuthorModel.find(query.criteria, query.options.fields)
      .populate("articles")
      .sort(query.options.sort)
      .limit(query.options.limit)
      .skip(query.options.skip);

    res.send({ links: query.links("/author", total), authors });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.params.id).populate(
      "articles"
    );
    res.send(author);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);
    const author = await newAuthor.save();
    res.status(201).send(author._id);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const modifiedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifiedAuthor) {
      res.send(modifiedAuthor);
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

router.delete("/:id", async (req, res, next) => {
  try {
    const author = await AuthorModel.findByIdAndDelete(req.params.id);
    if (author) {
      res.status(204).send("Author deleted");
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
