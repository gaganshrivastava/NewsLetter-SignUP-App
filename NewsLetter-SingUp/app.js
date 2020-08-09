const myExpress = require("express");
const bodyParser = require("body-parser");
const myrequest = require("request");
const myHttps = require("https");

const myApp = myExpress();
myApp.use(bodyParser.urlencoded({
  extended: true
}));
myApp.use(myExpress.static("public")); // this will hep to find the static files like css and images to our server
//
// myApp.listen(3000, function() {
//   console.log("Server is started");
// });

// uncoment this when using heroku, process object is defined by heroku
myApp.listen(process.env.PORT || 3000, function() {
  console.log("Server is started");
});


myApp.get("/", function(req, res) {
  //  res.send("server is running");
  res.sendFile(__dirname + "/signup.html"); // to use the css and images in the server use .static method
});


myApp.post("/", function(req, res) {
  const fname = req.body.fname; // these are accesed by the "name" attribute of the input tag
  const lname = req.body.lname;
  const email = req.body.email;

  console.log(fname + lname + email);

  //------------second half in this we are sending the data fro UI to the mailchim server
  // we have to make the JSON Body to pass the mailchemp server
  const body = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };

  // converting the Java script to JSON format
  const JSONData = JSON.stringify(body);
  console.log(JSONData);
  //https://usX.api.mailchimp.com/3.0/lists/{list_id}/members/{email_id}/notes/{id}
  const url = "https://us17.api.mailchimp.com/3.0/lists/65a0edcd1b";
  const options = {
    method: "POST",
    auth: "gagan:ed430fd18600dc2c8e937d2488bcb906-us17"
    // basix auth :: string : api key
  };
  console.log(options);
  // now we have to post  data to mailchain server module.
  const request = myHttps.request(url, options, function(response) {
    // to receive the data from the mailchinp server use response "".on" menthod
    console.log("inside  the ----------");

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/sucess.html");
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  console.log("MY Request is ::" + request);
  // to send the JSON body we have to stroe the request into var then send the response to server
  request.write(JSONData);
  request.end();
});


myApp.post("/failure", function(req, res) {
  res.redirect("/"); // in this we are redirecting to the home page
});

myApp.post("/sucess", function(req, res) {
  res.redirect("/"); // in this we are redirecting to the home page
});

//api key from mailchimp
//ed430fd18600dc2c8e937d2488bcb906-us17

// unique id for audience person  or called as list id
//65a0edcd1b

//JSON BOdy which mailchimp   is expecting from users
//{"name":"Freddie's Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You're receiving this email because you signed up for updates about Freddie's newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}


// for the merge tags::
//https://us17.admin.mailchimp.com/lists/settings/merge-tags?id=1062398
