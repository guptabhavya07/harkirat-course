const express = require('express');
const app = express();

app.use(express.json());//to parse body in json
/*

[{
username:"bhavya",password:"123123",token:"12345678876434"
}]
*/
const users = [];//creating a array variable where all the details of user who is signed in is stored(as we have not learnt about databases abhi )

//return a random token
function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++){
        token += options[Math.floor(Math.random() * options.length)];//let length of options be 42
    }
    return token;
}
app.post("/signup", function (req, res) {
    // res.json({
    //     message:"you have signed up"
    // })
    const username = req.body.username;
    const password = req.body.password;



    users.push({
        username: username,
        password:password
    })

    //tell user that u r signed in
    res.json({
        message:'you are signed up'
    })
    console.log(users);
})


app.post("/signin", function (req,res) {
     const username = req.body.username;
    const password = req.body.password;
    
    let foundUser = null;
    for (let i = 0; i < users.length; i++){
        if (users[i].username == username && users[i].password == password) {
        foundUser=users[i]
    }
    }
    if (foundUser) {
        const token = generateToken();
        foundUser.token = token;
        res.json({
            token:token
        })
    } else {
        res.status(403).send({
            message:"Invalid username or password"
        })
    }
    console.log(users);
})

app.get('/me', function (req, res) {//everytime user hits /me endpoint server responds with courses that user has.They will send token along with request to identify as enrolled user .This si case of headers as we are authorizing the user first and then after verifying we are giving the courses


    //this is an authenticated endpoint which will return me something only if i am authntivcated user

    //Using JWT does not require to store data in users array as here the /signin endpoint updates user arr about username,pass,token. JWT does not require this  .   username is stored in token itself,server just needs to verify the token and converts it back to username.
    const token = req.headers.token;
    let foundUser = null;

    for (let i = 0; i < users.length; i++){
        if (users[i].token == token) {
            foundUser = users[i];
        }
    }
    if (foundUser) {
        res.json({
            username: foundUser.username,
            password:foundUser.password
        })
    } else {
        res.json({
            message:"token invalid"
        })
    }
    
})
app.listen(3000);//http port is listening on port 3000
//every time u restart your application user array becomes empty again
//right now the generated token is stored in server which we have created ,but once we create our fronted my own token will be stored in my browser//suppose we have logged out from system, next time when we will signup it will give us newly generated token.


//PROBLEM:
//everytime user hits an endpoint /me ,we request users array to check whether the user is authenticated or not bu analyzing the token to chec users username and password .to resolve this
//TOKENS->JWTs

//Resolution:
//if everytime request goes from frontend to backend ,token is itself decrypted into user's username without hitting the database ,it will take less time.[stateless behavior]->data is not stored in server as in case of tokens


//Mota-mota for auhtneticatio u do not need to verify user by hitting the database .Server apne aap token ko dekhke user ki info nikal lega .

//JWT is not encryption ,it is encoding.