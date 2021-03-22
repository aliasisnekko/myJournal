const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;

const { static } = require("express");

const homeStartingContent = "Hello! You have now entered the awesome zone. Everything that you once thought real will be proven outright blasphemy after you journey through the page that is Nekko's mind.";
const aboutContent = "Welcome! This site is used as Nekko's personal diary, read at your own peril.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public/"));
//Initializing and creating Database before creating collections inside said DB
mongoose.connect('mongodb://localhost:27017/postsDB', { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Database Connected');
});

const postsSchema = new mongoose.Schema({
    name: String
});

const Post = mongoose.model('Post', postsSchema);

let posts = [];


app.get('/', function(req, res) {

    res.render('home', { startingContent: homeStartingContent, posts: posts })


});

app.get('/compose', function(req, res) {
    res.render('compose')
});


app.post('/compose', function(req, res) {

    const post = {
            title: req.body.postTitle,
            content: req.body.postBody
        } //good job making your first js object and remebering how to push to an array

    posts.push(post);
    res.redirect("/");

});

app.get('/about', function(req, res) {

    res.render('about', { aboutContent: aboutContent })

});

app.get('/contact', function(req, res) {
    const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae.  Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
    res.render('contact', { contactContent: contactContent })

});


app.get('/post/', function(req, res) {

    res.render('post', { posts: posts })


});

app.get("/posts/:postName", function(req, res) {
    const requestedTitle = _.lowerCase(req.params.postName);

    posts.forEach(function(post) {

        const storedTitle = _.lowerCase(post.title);

        if (storedTitle === requestedTitle) {
            res.render('post', {
                title: post.title,
                content: post.content
            });

        }
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is up and running boss!")
});