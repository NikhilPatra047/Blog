//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const ejs = require("ejs");
const mongoose = require('mongoose')

const contactContent = "If you are looking for me, you know where to find me. Visit the following social links and see for yourself how awesome I am!";

const app = express();
mongoose.connect('mongodb+srv://admin-nikhil:test123@cluster0.awk6q.mongodb.net/blogDB', {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title: String,
  post: String
})

const Post = mongoose.model('Post', postSchema)

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    res.render("home", {
      posts: posts
    });
  });
});

app.get('/about', (req, res) => {
  res.render("about")
})

app.get('/contact', (req, res) => {
  res.render("contact", {contactContent: contactContent})
})

app.get('/postblog', (req, res) => {
  res.render("compose")
})

app.post('/hello', (req, res) => {
  const title = req.body.postTitle
  const post = req.body.postBody

  const newPost = new Post({
    title: title,
    post: post
  })

  Post.insertMany([newPost], (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("Inserted successfully");
    }
  }) 

  res.redirect('/')
})

app.get('/posts/:postTitle', (req, res) => {
  let flag = 0;
  const postTitle = _.lowerCase(req.params.postTitle)

  Post.find({}, (err, posts) => {
    if(err) {
      console.log(err);
    } else {
      posts.forEach((post) => {
        const title = _.lowerCase(post.title)
        if(title === postTitle) {
          flag = 1
          res.render("post", {title: post.title, post: post.post})
        }
      })

      if(flag == 0) {
        res.render("error", {msg: "Sorry. The Post that you are looking for is not here."})
      }
    }
  })
})

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000
}
app.listen(port, function() {
  console.log("Server started successfully");
});
