var t = window.TrelloPowerUp.iframe();

return t.get('board', 'shared', 'myKey')
.then(function (data) {
  console.log(JSON.stringify(data, null, 2));
});