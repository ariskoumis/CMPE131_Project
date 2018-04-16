/**
 * Module dependencies.
 */
const events = {};
import routing from "./routing.js";
export default events;

/**
 * Activate Login Clicked Function
 */
events.loginClicked = function() {
  var data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  routing.sendPostRequest("attempt-login", data);
};

/**
 * Activate Signup Clicked Function
 */
events.createAccountClicked = function() {
  var data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  routing.sendPostRequest("create-account", data);
};

// /**
//  * Get Post Page
//  */
// events.getPostClicked = function(req, res) {
//   res.redirect("/post");
// };

/**
 * Activate Create A Post Clicked Function
 */
events.createAPostClicked = function() {
  var data = {
    title: document.getElementById("title").value,
    content: document.getElementById("content").value,
    // Working on where to put the currentUser
  };
  //Need Raul build the Create-Post Web Page that has these:
  // Title, Content
  console.log("clicked");
  routing.sendPostRequest("create-post", data);
};


events.SSEReceived = function(data) {
  //exit function if data doesn't have event property
  if (!data.hasOwnProperty('event')) {
    return;
  }

  switch(data.event) {

    case "login_result":
      if (data.result) {
        alert("Login Successful!");
      } else {
        alert("Login Failed");
      }
      break;

    case "create_account_result":
      if (data.result) {
        alert("Account Creation Successful!");
      } else {
        alert("Account Creation Failed");
      }
      break;
  }
};
