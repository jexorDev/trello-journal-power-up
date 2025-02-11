var t = window.TrelloPowerUp.iframe();

return t.board("id", "name").then(function (board) {
    console.log(JSON.stringify(board, null, 2));
  });