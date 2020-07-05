const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundResults){
      if(!err){
        res.send(foundResults);
      }else {
        console.log(err);
      }
    })
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if(!err){
        res.send("Succefully added new article")
      }else {
        res.send(err)
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err){
      if(!err){
        res.send("Succefully deleted all articles")
      }else {
        res.send(err)
      }
    })
});

app.route("/articles/:articleName")
  .get(function(req, res) {
    Article.findOne({title: req.params.articleName}, function(err, foundResults){
      if(foundResults){
        res.send(foundResults);
      }else {
        res.send("No article found");
      }
    })
  })
  .put(function(req, res) {
    Article.update(
      {title: req.params.articleName},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Succefully updated");
        }else{
          res.send(err);
        }
      }
    )
  })
  .patch(function(req, res) {
    Article.update(
      {title: req.params.articleName},
      {$set: req.body},
      function(err) {
        if(!err){
          res.send("Succefully updated");
        }else{
          res.send(err);
        }
      }
    )
  })
  .delete(function(req, res) {
    Article.deleteOne({title: req.params.articleName}, function(err){
      if(!err){
        res.send("Succefully deleted the article.")
      }else {
        res.send(err)
      }
    })
});

app.listen("3000", function(req,res){
  console.log("Server started succefully");
})
