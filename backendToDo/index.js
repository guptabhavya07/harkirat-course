const express = require('express');
const app = express();
app.get('/', function (req, res) {
    res.json({
        class:"bhavya"
    })
})
app.post("/", function (req, res) {
  res.send("hello from post");
});
app.get("/bhavya", function (req, res) {
  res.send("hello from bhavya");
});
app.listen(3000);