var t = window.TrelloPowerUp.iframe();

return t.board("all").then(function (board) {
    console.log(JSON.stringify(board, null, 2));
  });