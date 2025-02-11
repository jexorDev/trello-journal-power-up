/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

//var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

//TrelloPowerUp.initialize({
  // Start adding handlers for your capabilities here!
	// 'card-buttons': function(t, options) {
	// return t.set("member", "shared", "hello", "world")
	// .then(function(){
	// 	  return [{
	// icon: BLACK_ROCKET_ICON,
	// 		  text: 'Estimate Size',
	//       callback: function(t) {
	//         return t.popup({
	//           title: "Estimation",
	//           url: 'estimate.html',
	//         });
	//       }
	// 	  }];
	// })
	// },
//});

var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';
var BLACK_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg';


TrelloPowerUp.initialize({
  'board-buttons': function (t, opts) {
    return [{
      // we can either provide a button that has a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'View Journal',
      callback: function(t) {
        return t.cards("all").then(function (cards) {
          t.modal({
            title: "Journal",
            url: "journal.html",
            args: { cards: JSON.stringify(cards, null, 2)},
            fullscreen: true,
          }) 
        });
      },
      condition: 'edit'
    }];
  }
});