var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Todo = new Schema({
  title: String,
  done: Boolean
});

// スキーマをモデルとしてコンパイルし、それをモジュールとして扱えるようにする
module.exports = mongoose.model("Todo", Todo);
