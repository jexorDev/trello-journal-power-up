var t = window.TrelloPowerUp.iframe();

t.get('board', 'shared', 'myKey')
.then(function (data) {
  console.log(JSON.stringify(data, null, 2));
});