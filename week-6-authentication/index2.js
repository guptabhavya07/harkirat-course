const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET="randombhavya"
const app = express();
app.use(express.json());

const users = [];

app.post("/signup", function (req, res) {
 
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username: username,
    password: password,
  });

  //tell user that u r signed in
  res.json({
    message: "you are signed up",
  });
  console.log(users);
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let foundUser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username && users[i].password == password) {
      foundUser = users[i];
    }
  }
    if (foundUser) {
        //convert username to jwt
        //jwt.sign takes 2 arguments ,one is what do u want to encode(username),second is what is your secret.
      const token = jwt.sign({//we do not include password as if jwt gets leaked it isprbl
        username: username, // this tells what we need to sign using jwt,here we r signing only username
      } ,JWT_SECRET);
      foundUser.token = token;
      res.json({
        token: token,
      });
    } else {
    res.status(403).send({
      message: "Invalid username or password",
    });
  }
  console.log(users);
});

app.get("/me", function (req, res) {
 
    const token = req.headers.token;//jwt token to be send in headers
    const decodedInformation = jwt.verify(token, JWT_SECRET);//jwt.verify converts jwt token back to username{username:"bhavya@gmail.com"}
    const username = decodedInformation.username;//as when we are using jwt.verify it is converting in object

    //now username has been found but to get access of courses of user we still need to hit the database for password


  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      foundUser = users[i];
    }
  }
  if (foundUser) {
    res.json({
      username: foundUser.username,
      password: foundUser.password,
    });
  } else {
    res.json({
      message: "token invalid",
    });
  }
});

app.listen(3001);
//go to jwt.io to decrypt token into username
//jwt is not limited to nodejs,these can be anytype of backend like golang,java same jwt token is used to hit server .jwt secret should be same in all three cases.
//jwt secret is for admin who can issue token and needs to be kept safe
//cookies are special type of header which when server sends in response headers section in network area in inspect ,our browser stores it and with every request this cookie header is sent .
