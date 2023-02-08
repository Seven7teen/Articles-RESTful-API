const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view-engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.get("/", function(req,res) {
  res.send("Hello");
})

app.route("/article")
  .get(function(req,res) {

    Article.find({}, function(err, foundArticles) {
      if(!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req,res) {

    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });

    article.save(function(err) {
      if(!err) {
        res.redirect("/article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req,res) {
    Article.deleteMany(function(err) {
      if(!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });



  /////////////////Targeting specific article////////////////

app.route("/article/:articleTitle")
  .get(function(req,res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
      if(foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article matching the title was found");
      }
    })
  })
  .put(function(req,res) {
    Article.replaceOne({title: req.params.articleTitle},{title: req.body.title, content: req.body.content}, function(err, foundArticle) {
      if(!err) {
        res.send("Successfully updated article");
      } else {
        res.send(err);
      }
    })
  })
  .patch(function(req,res) {
      Article.updateOne({title: req.params.articleTitle},
      {$set:req.body},
      function(err) {
        if (err) {
          res.send("err" + err)
        } else {
          res.send("patch successful")
        }
      }
    )
  })
  .delete(function(req,res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
      if(!err) {
        res.send("Successfully deleted specific article");
      } else res.send(err);
    })
  })


app.listen(3000, function(err) {
  if(!err) {
    console.log("server is running at port 3000");
  }
})
