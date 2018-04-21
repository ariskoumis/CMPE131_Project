/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
    database 				= require('../global/database.js'),
    Stream 					= new EventEmitter(),
    handler_map 		= {};

/**
 * Get /
 * HomePage
 */
handler_map.rootHandler = function (req, res) {
  res.render('index' , {currentUser: database.currentUser});
};

/**
 * Get /
 * signup
 */
handler_map.getSignup = function (req, res) {
  res.render('signup');
};

/**
 * Post /login
 */
handler_map.login = function (req, res) {
  var data = req.body;
  if (database.currentUser.existed === false) {
    if (data.username === "" || data.password === "") {
      Stream.emit("push", "message", {event: "login_result", result: false, message: "You're missing one section, please fill all to login."});
    } else {
      database.mongoclient.connect(database.url, function(err, client) {
        if (err) throw err;
        var db = client.db("cmpe-it");
        db.collection("users").findOne({username: data.username}, function (err, mongores) {
          if (mongores !== null && mongores.password === data.password) {
            console.log("User Does Exist, Login successfully ");
            database.currentUser = {
              id: mongores._id,
              username: mongores.username,
              password: mongores.password,
              existed: true
            };
            console.log(database.currentUser);
            Stream.emit("push", "message", {event: "login_result", result: true});
            res.redirect("/show-post");
          } else {
            console.log("Please enter a correct password");
            res.redirect("/");
            Stream.emit("push", "message", {event: "login_result", result: false});
          }
        });
        client.close();
      });
    }
  } else {
    Stream.emit("push", "message", {event: "login_result", result: false});
    console.log("You're already logged in!");
  }
};

/**
 * Post /Signup
 */
handler_map.postSignup = function (req, res) {
  var data = req.body;
  // database.signup("users", data);
  if (data.username === "" || data.password === "" || data.email === "") {
    console.log("You're missing one section, please fill all to signup.");
    Stream.emit("push", "message", {event: "create_account_result", result: false});
  } else {
    //Write to data to collection titled 'users'
    database.mongoclient.connect(database.url, function(err, client) {
      if (err) throw err;
      var db = client.db("cmpe-it");
      db.collection("users").findOne({username: data.username}, function (err, mongoRes) {
        if (mongoRes !== null) {
          console.log("User does Exist, please enter a different username");
          Stream.emit("push", "message", {event: "create_account_result", result: false});
          res.redirect("/signup");
        } else {
          console.log("Congratulation, you just create an account");
          client.db("cmpe-it").collection("users").insertOne(data);
          Stream.emit("push", "message", {event: "create_account_result", result: true});
        }
        client.close();
      })
    });
  }
};

/**
 * POST /logout
 * Log out.
 */
handler_map.logout = function(req, res) {
  database.currentUser = {
    existed: false
  };
  res.redirect("/");
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
