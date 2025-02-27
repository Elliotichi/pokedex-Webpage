const MongoClient = require('mongodb-legacy').MongoClient; //npm install mongodb-legacy
const url = 'mongodb://127.0.0.1:27017'; // the url of our database
const client = new MongoClient(url); // create the mongo client
const dbname = 'profiles'; // the data base we want to access

const express = require('express'); //npm install express
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser
const e = require('express');


const app = express();
var lastPage;


// this tells express we are using sesssions. These are variables that only belong to one user of the site at a time.
app.use(session({ secret: 'example', resave: true, saveUninitialized: false }));

// code to define the public "static" folder
app.use(express.static('public'))

// code to tell express we want to read POSTED forms
app.use(bodyParser.urlencoded({
  extended: true
}))

// parses json body request
app.use(bodyParser.json())

// set the view engine to ejs
app.set('view engine', 'ejs');

// variable to hold our Database
var db;

// run the connect method.
connectDB();
//this is our connection to the mongo db, ts sets the variable db as our database
async function connectDB() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbname);
  //everything is good lets start
  app.listen(8080);
  console.log('Listening for connections on port 8080');
}



// SERVER CODE
// set the view engine to ejs
app.set('view engine', 'ejs');

// route get function
app.get('/', function (req, res) {
  res.render('pages/index');
})

// updates the users teams property in the database
app.post('/postTeams', function (req, res) {
  let datatostore = req.body;
  console.table(datatostore)
  let user = req.session.currentuser;

  console.log(user)
  db.collection('people').updateOne({ 'login.username': user }, { $set: { 'teams': datatostore } }, function () {
    console.log(datatostore)
    console.log("db updated")
  });

})

// updates the users darkmode preference property in the database
app.post('/postDark', function (req, res) {
  let datatostore = req.body.darkToggle;
  console.table(datatostore)
  let user = req.session.currentuser;

  console.log(user)
  db.collection('people').updateOne({ 'login.username': user }, { $set: { 'darkmode': datatostore } }, function () {
    console.log(datatostore)
    console.log("db updated")
  });

})

// retrieves user data from the database and returns the user object matching currentuser
app.get('/getData', function (req, res) {
  let currentuser = req.session.currentuser


  db.collection('people').find().toArray(function (err, result) {
    if (err) throw err;

    db.collection('people').findOne({ "login.username": currentuser }, function (err, userresult) {
      if (err) throw err;
      console.table(userresult)
      res.json(userresult)
    })
  })

})

// attemps to render users, if req.session.loggedin is false redirect to login instead and set last page to users
app.get('/users', function (req, res) {
  if (!req.session.loggedin) {
    lastPage = "users"
    res.redirect('/login');
    return;
  }

  else {

    let user = req.session.currentuser;

    db.collection('people').find().toArray(function (err, result) {
      if (err) throw err;
      // the result of the query is sent to the users page as the "users" array
      db.collection('people').findOne({ "login.username": user }, function (err, userresult) {
        if (err) throw err;

        res.render('pages/users', {
          user: userresult
        })
      })
    })
  }
})


// renders inventory, if the user is not logged in redirect to login with last page set to inventory
app.get('/inventory', function (req, res) {

  if (!req.session.loggedin) {
    lastPage = 'inventory'
    res.render('pages/login');
    return;
  }

  else {
    res.render('pages/inventory')
  }

});

// renders pokesearch
app.get('/pokesearch', function (req, res) {
  res.render('pages/pokesearch');
});

// renders login
app.get('/login', function (req, res) {
  res.render('pages/login');
});

// Login function, finds the user from db and sets session.loggedin to true
app.post('/dologin', function (req, res) {
  console.log(JSON.stringify(req.body))
  var uname = req.body.username;
  var pword = req.body.password;

  db.collection('people').findOne({
    "login.username": uname
  }, function (err, result) {
    if (err) throw err;


    if (!result) {
      res.send("<script>alert('invalid Username')</script>;window.location.href = '/login';")
    }

    // if the user login matches a database entry set logged in to true and current user to the username
    else if (result.login.password == pword && result.login.username == uname) {
      req.session.loggedin = true;
      req.session.currentuser = uname;

      // redirect to last page visited
      switch (lastPage) {

        case "inventory":
          res.redirect('/inventory')
          break;

        case "users":
          res.redirect('/users')
          break;

        default:
          res.redirect('pages/index')
          break;

      }

    }
    else{res.send("<script>alert('invalid Username')</script>")}
  })
});

// Account deletion function which removes the user from the db
app.delete('/delete', function (req, res) {
  // if so get the username variable
  var username = req.session.currentuser;
  // check for the username added in the form, if one exists then you can delete that doccument
  db.collection('people').deleteOne({ "login.username": username }, function (err, result) {
    if (err) throw err;




  });
  console.log("Account deleted", username)
  req.session.loggedin = false;
  req.session.currentuser = null;
  console.log(req.session.loggedin)

  req.method = "GET"

  res.redirect(203, "/")

});

// Add user function to add new users
app.post('/adduser', function (req, res) {
  console.log('Its working till at least here');

  // checks if the user exists in the db, if yes, gives pop up
  // once the pop up is clicked, will send you back to login
  db.collection('people').findOne({
    $or: [
      { "email": req.body.email },
      { "login.username": req.body.username }
    ]
  }, function (err, existingUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (existingUser) {
      res.send("<script>alert('Error: User with the same email or username already exists');window.location.href = '/login';</script>")
        ;
    } else {

      // user object created 
      var datatostore = {
        "email": req.body.email,
        "login": {
          "username": req.body.username,
          "password": req.body.password
        },
        "teams": [],
        "darkmode": false
      }
      console.table(datatostore);

      //adds the user to the db
      db.collection('people').insertOne(datatostore, function (err, result) {
        if (err) throw err;
        console.log('saved to database')
        res.render('pages/login')

      })
    }
  })
})

// log out function 
app.get('/logout', function (req, res) {
  req.session.loggedin = false
  req.session.currentuser = null
  res.redirect(203, '/login')
})

// 404 render
app.use(function (req, res,) {
  res.status(404)
  res.render('pages/404')
})