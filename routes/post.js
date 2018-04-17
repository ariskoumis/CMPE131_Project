/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
    database 				= require('../global/database.js'),
    Stream 					= new EventEmitter(),
    handler_map 		= {};

/**
 * Show All the Posts in the Database
 */
handler_map.showPost = function(req, res) {
  res.render('post/show-post', {data: database.listOfPost});
};

/**
 * Get /new-post
 * Go to New Post Form
 */
handler_map.newPost = function (req, res) {
  res.render('post/new-post');
};

/**
 * POST /Create-post
 * Allow the User to create a post if and only if he/she is logged in
 * Create a Post Function
 */
handler_map.createPost = function (req) {
  var data = req.body;

  // Information of the Post
  var name                = data.name,
      content             = data.content;

  // Information of the user
  var author          = {
    id: database.currentUser.id,
    username: database.currentUser.username
  };

  // A new Post
  var newPost   = {
      name: name,
      content: content,
      author: author
  };

  // Add The Post to the Database
  if (database.currentUser.existed === true) {
    database.mongoclient.connect(database.url, function (err, client) {
      if (err) throw err;
      var db = client.db("mydb");
      //second parameter of following callback function is typically called res, but I changed it to mongo_res to avoid losing node.js's res parameter.
      db.collection("posts").insertOne(newPost, function (err, mongo_res) {
        if (err) {
          console.log("err found when insert the post to db.");
          Stream.emit("push", "message", {event: "create_post_result", result: false});
          throw err;
        } else {
          database.listOfPost.push(newPost);
          Stream.emit("push", "message", {event: "create_post_result", result: true});
          console.log("The Post is in the db");
        }
      });
      client.close();
    });
  } else {
    console.log(database.currentUser);
    console.log("User needs to login first!");
    Stream.emit("push", "message", {event: "create_post_result", result: false, logged_in: 0});
  }
};

/**
 * Initialize SSE Handler
 */
handler_map.initializeSSEHandler = function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  Stream.on("push", function (event, data) {
    res.write("event: " + String(event) + "\n" + "data: " + JSON.stringify(data) + "\n\n");
  });
};

module.exports = handler_map;
