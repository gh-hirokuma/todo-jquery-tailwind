var express = require("express");
var router = express.Router();
const Todo = require("../../models/todo");

router
  .route("/")
  .all((req, res, next) => {
    next();
  })
  .get((req, res, next) => {
    Todo.find({}, (err, result) => {
      res.json({
        statusCode: 200,
        statusMessage: "success",
        data: result
      });
    });
  })
  .put((req, res, next) => {
    next(new Error("not implemented"));
  })
  .post((req, res, next) => {
    const newTodo = new Todo({
      ...req.body
    });

    newTodo.save(function(err) {
      if (err) console.log(err);

      res.json({
        statusCode: 200,
        statusMessage: "success",
        data: [{ _id: newTodo._id }]
      });
    });
  })
  .delete((req, res, next) => {
    next(new Error("not implemented"));
  });

router
  .route("/:todoId")
  .all((req, res, next) => {
    next();
  })
  .get((req, res, next) => {
    res.json({ message: "GET :todoId" });
  })
  .put((req, res, next) => {
    next(new Error("not implemented"));
  })
  .post((req, res, next) => {})
  .delete((req, res, next) => {
    next(new Error("not implemented"));
  });

module.exports = router;
