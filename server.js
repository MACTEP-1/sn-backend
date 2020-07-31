var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');

var User = require('./models/User.js');
var Post = require('./models/Post.js');
var auth = require('./auth.js');

// below line to avoid deprecation warning
// which isn't there
mongoose.Promise = Promise;

app.use(cors());
app.use(bodyParser.json());

/* app.get('/', (req,res) => {
    res.send('hello world')
}); */

app.get('/posts/:id', async (req, res) => {
    var author = req.params['id'];
    var posts = await Post.find({author});
    res.send(posts);
})

app.post('/post', auth.checkAuthenticated, (req, res) => {
    var postData = req.body;
    postData.author = req.userId;

    var post = new Post(postData);

    post.save((err, result) => {
        if (err) {
            console.error('post save error');
            return res.status(500).send({message: 'Error saving a post'});
        }

        res.sendStatus(200);
    })
})

app.get('/users', async (req, res) => {
    try {
        var users = await User.find({}, '-pwd -__v');
        res.send(users);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

app.get('/profile/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params['id'], '-pwd -__v');
        res.send(user);
    } catch (error) {
        console.error(error);
        res.sendStatus(200);
    }
})

// app.post('/register', auth.register);

// app.post('/login', auth.login);

//mongoose.connect('mongodb+srv://MACTEP:jokers12@cluster0.8owk1.mongodb.net/SocialApp?retryWrites=true&w=majority', 
mongoose.connect(process.env.MONGOLAB_ROSE_URI || 'mongodb+srv://MACTEP:jokers12@cluster0.8owk1.mongodb.net/SocialApp?retryWrites=true&w=majority', 
    {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (!err)
            console.log('connected to mongo');
})

app.use('/auth', auth.router);
app.listen(process.env.PORT || 3000);