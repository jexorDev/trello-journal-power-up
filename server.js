var cors = require('cors');
var express = require('express');
var app = express();

app.listen(5000);
app.use(cors({ origin: 'https://trello.com' }));

app.getCardComments("/", (req, res) => {
    res.send('hiya');
  })