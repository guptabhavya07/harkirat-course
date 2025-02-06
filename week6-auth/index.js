const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "bhavya123";//to verify that yes this username was encoded by me only or issued by me 



const app = express();//creating instance of express application
app.use(express.json())//extracts json body from request
const users = [];

function logger(req, res, next) {
    console.log(req.method + "request came");
    next();
}

//everytime the uswr comes to localhost 3000,i want to send him not json data but a file
//in simple words ,i am returning my html through backend only
//so that my frontend and backend are hosted on same domain to avoid cors 
app.get("/", function (req, res) {
  res.sendFile(__dirname+ "/public/index.html"); // Use absolute path
});
app.post("/signup",logger, function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username:username,
        password:password
    })
    res.json({
        message:"you are sign in"
    })

})

app.post("/signin", logger,function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    let founduser = null;
    for (let i = 0; i < users.length; i++){
        if (users[i].username === username && users[i].password === password) {
            founduser = users[i];
    }
    }
    if (!founduser) {
        res.json({
            message:"credentials incorrect"
        })
        return
    } else {
        const token = jwt.sign({//it takes that data which it needs to sign means it needs to convert that data in token
            username
        }, JWT_SECRET);

        //somebody asked how to send header in response 
        res.header("jwt", token);
        res.header("random", "bhavya");//after signin see in response headers in postman


        res.json({
            token:token 
        })
    }

});

function auth(req, res, next) {//middleware for checking whether user has signed in 
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    if (decodedData.username) {
        req.username = decodedData.username;
        next()
    } else {
        res.json({
            message:"you are not logged in"
        })
    }
}

app.get("/me",logger,auth, function (req, res) {//anybody who wants to hit an authenticated endpoint(means to access this u need to be signed in nd provide us with token in header and after we verify(not decoding) it u can access )
    // const token = req.headers.token;
    // const decodedData = jwt.verify(token, JWT_SECRET);//verify token with secret 
    // if (decodedData.username) {
    
    const currentUser = req.username;
        let founduser = null;
        for (let i = 0; i < users.length; i++){
            if (users[i].username === currentUser) {
              founduser = users[i];
            }
        }
        res.json({
            username: founduser.username,
            password:founduser.password
        })

    // }



});
app.listen(3000);