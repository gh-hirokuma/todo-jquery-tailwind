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
      ...req.body,
      done: false
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
    const { todoId } = req.params;

    Todo.find({ _id: todoId }, (err, result) => {
      const data = result.length !== 0 ? result[0] : [];
      res.json({
        statusCode: 200,
        statusMessage: "success",
        data
      });
    });
  })
  .put((req, res, next) => {
    const { todoId } = req.params;

    Todo.update({ _id: todoId }, { ...req.body }, (err, result) => {
      res.json({
        statusCode: 200,
        statusMessage: "success",
        data: { ...result }
      });
    });
  })
  .post((req, res, next) => {})
  .delete((req, res, next) => {
    const { todoId } = req.params;

    Todo.remove({ _id: todoId }, (err, result) => {
      res.json({
        statusCode: 200,
        statusMessage: "success",
        data: { ...result }
      });
    });
  });

module.exports = router;
