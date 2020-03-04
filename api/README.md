```bash
npx express api
cd api
npm install
```

routes/index.js を修正

```js
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Todo API HOME" }); // highlight-line
});

module.exports = router;
```

```bash
npm install nodemon
```

```json
{
  "name": "api",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "nodemon ./bin/www" // highlight-line
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "morgan": "~1.9.1",
    "nodemon": "^2.0.2"
  }
}
```

```bash
mkdir routes/v1
mv routes/users.js routes/v1/todos.js
touch routes/v1/index.js
```

v1/index.js

```js
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ message: "Todo API ROOT" });
});

router.use("/todos", require("./todos.js"));

module.exports = router;
```

todos.js

```js
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.json({
    message: "reached todos"
  });
});

module.exports = router;
```

app.js

```js
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var homeRouter = require("./routes/index");
var v1Router = require("./routes/v1/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRouter);
app.use("/api/v1", v1Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
```

http://localhost:3000/api/v1

```json
{
  "message": "Todo API ROOT"
}
```

http://localhost:3000/api/v1/todos

```json
{
  "message": "reached todos"
}
```

routes/v1/todos.js

```js
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.json({
    statusCode: 200,
    statusMessage: "success",
    data: [{ title: "TODO", done: false }]
  });
});

module.exports = router;
```

http://localhost:3000/api/v1/todos

```json
{
  "statusCode": 200,
  "statusMessage": "success",
  "data": [
    {
      "title": "TODO",
      "done": false
    }
  ]
}
```

```bash
touch docker-compose.yml
```

docker-compose.yml

```yml
version: "3.7"

services:
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
    volumes:
      - db-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
      TZ: Asia/Bangkok

  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 9000:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: password
      TZ: Asia/Bangkok

volumes:
  db-data: {}
```

```bash
docker-compose up -d
```

```bash
> docker-compose.exe ps
       Name                      Command               State            Ports
---------------------------------------------------------------------------------------
api_mongo-express_1   tini -- /docker-entrypoint ...   Up      0.0.0.0:9000->8081/tcp
api_mongo_1           docker-entrypoint.sh mongod      Up      0.0.0.0:27017->27017/tc
```

```bash
npm install mongodb \
            mongoose \
            moment
```

```bash
mkdir models
touch models/todo.js
```

models/todo.js

```js
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Todo = new Schema({
  title: String,
  done: Boolean
});

module.exports = mongoose.model("Todo", Todo);
```

```js

...

var logger = require("morgan");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://root:password@localhost:27017/todo-app?authSource=admin");
mongoose.connection.on("error", function(err) {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

var homeRouter = require("./routes/index");

...

```

routes/v1/todos.js

```js
var express = require("express");
var router = express.Router();
const Todo = require("../../models/todo");

/* GET users listing. */
router.get("/", function(req, res, next) {
  Todo.find({}, (err, result) => {
    res.json({
      statusCode: 200,
      statusMessage: "success",
      data: [{ title: "TODO", done: false }]
    });
  });
});

module.exports = router;
```

マルチメソッド可能に

```js
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
        data: [{ title: "TODO", done: false }]
      });
    });
  })
  .put((req, res, next) => {
    next(new Error("not implemented"));
  })
  .post((req, res, next) => {
    res.json({
      statusCode: 200,
      statusMessage: "success",
      data: [{ _id: "TEST" }]
    });
  })
  .delete((req, res, next) => {
    next(new Error("not implemented"));
  });

module.exports = router;
```

POST http://localhost:3000/api/v1/todos

```json
{
  "statusCode": 200,
  "statusMessage": "success",
  "data": [
    {
      "_id": "TEST"
    }
  ]
}
```

```js
var express = require("express");
var router = express.Router();
const Todo = require("../../models/todo");

router
  .route("/")
  .all((req, res, next) => {
    next();
  })
...
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

...

```
