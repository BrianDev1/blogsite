//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to my blog site. This site has been developed using Node.js - express.js - EJS - mongoDB";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [];
const app = express();

/**************** MongoDB stuff and things ******************/

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PostSchema = {
  title: {
    type : String,
    required: [true, "Your Post needs to have a title"]
  },
  post: {
    type: String,
    required: [true, "What's a post without any content, not a post. Please enter content"]
  }
};

const Post = mongoose.model("Post", PostSchema);

const dummyPost = new Post({
  title: "No Posts Yet",
  post: "This is just a placeholder post. Why dont you try composing your own post"
});

/**************** END --> MongoDB stuff and things ******************/

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


/******** All the get requests ************/

app.get("/", function(req, res){

  Post.find({}, function(error, foundPosts){
    if(error){
      console.log(error);
    } else {
      res.render("home", { homeContent: homeStartingContent, Posts: foundPosts });
    }
  });
  
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/about", function(req, res){
  res.render("about", {content: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {content: contactContent});
});

/* URL management */
app.get("/posts/:postTitle", function(req,res){
  const aTitle = req.params.postTitle;
  console.log(aTitle);
  Post.findOne({title: aTitle}, function(error, foundPost){
    const storedPostTitle = lodash.lowerCase(foundPost.title);
    if(error) {
      console.log(error);
    } else {
        res.render("post", { title: foundPost.title, body: foundPost.post });
    }
  });

});

/******** END All the get requests ************/

/* Composing */
app.post("/compose", function(req, res){
  // const post = {
  //   title: req.body.postTitle,
  //   body: req.body.postText
  // }
  //posts.push(post);

  const post = new Post({
    title: req.body.postTitle,
    post: req.body.postText,
  });

  post.save();
  res.redirect("/");
});




/* Function set */
function truncateAnyString(aString) {
  const newStringLength = aString.length * 0.5; //Half the length of original

//   return aString.slice(0, newStringLength) + "...";

};



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
