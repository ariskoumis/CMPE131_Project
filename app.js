/**
 * Module dependencies.
 */
var express             = require('express'),
    bodyParser          = require('body-parser');

/**
 * Route Handler
 */
var database            = require('./global/database.js'),
    user                = require('./routes/user.js'),
    commentRoute        = require('./routes/comment.js'),
    postRoute           = require('./routes/post.js');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
database.init();

/**
 * Express configuration.
 */
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Primary app routes.
 */
app.get('/', user.rootHandler);

// User Routes
app.post('/login', user.login);
app.get("/signup", user.getSignup);
app.post('/signup', user.postSignup);
app.get("/logout", user.logout);

// Reset Password
app.get("/send-email", user.getSendEmail);
app.post("/send-email", user.postSendEmail);

app.get("/reset/:token", user.getNewPassword);
app.post("/reset/:token", user.postNewPassword);

// Post Routes
app.get('/post/show-post', postRoute.showPost);
app.get('/post/new-post', postRoute.newPost);
app.post('/post/create-post', postRoute.createPost);

// Comment Routes
app.get('/post/:id/comment/new-comment', commentRoute.getNewComment);
app.post('/post/:id/comment/create-comment', commentRoute.createNewComment);



/**
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Start Express server.
 */
var PORT = process.env.PORT || 8000;
app.listen(PORT, process.env.IP, function() {
  console.log('Project hosted on port 8000');
});

module.exports = app;
