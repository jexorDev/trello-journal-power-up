async function getCardComments(apiKey, token, cardId) {
    try {
      const response = await fetch(`https://api.trello.com/1/cards/${cardId}/actions?filter=commentCard&key=${apiKey}&token=${token}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function isSameDay(first, second) {
    const firstDate = new Date(first)
    const secondDate = new Date(second)

    return firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate();
  }

  function getCurrentDateTime() {
    const currentDateTime = new Date(Date.now());
    return new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes());
  }

  function getLocalDateFromUTC(utcDate) {
    return new Date(Date.parse(utcDate)).toLocaleDateString();
  }

  async function start() {
 
 

    let apiToken = "";
  const cards = t.arg("cards");
  let goalMap = new Map();        
  for (var i = 0; i < cards.length; i++){
    if (!isSameDay(getLocalDateFromUTC(cards[i]["dateLastActivity"]), getCurrentDateTime())) {
      continue;
    }

    if (cards[i]["labels"] !== undefined) {
      for (var j = 0; j < cards[i]["labels"].length; j++) {

        const appKey = "ab51919adb28cfb83270a0d6ee991d38";

        if (apiToken === "") {
          await t.getRestApi().getToken().then((token) => {
            apiToken = token;
          });

        }
        
        let activityEntriesJson = "";
        await getCardComments(appKey, apiToken, cards[i]["id"]).then((data) => activityEntriesJson = data);
        const activityEntries = [];

        for (var commentIndex = 0; commentIndex < activityEntriesJson.length; commentIndex++) {
          if (!isSameDay(getLocalDateFromUTC(activityEntriesJson[commentIndex]["date"]), getCurrentDateTime())) {
            continue;
          }

          activityEntries.push(activityEntriesJson[commentIndex]["data"]["text"]);
        }

        const goalName = cards[i]["labels"][j]["name"];

        const goalActivity = {
          activityName: cards[i]["name"],
          entries: activityEntries,
          dateLastActivity: cards[i]["dateLastActivity"]
        }

        if (goalMap.has(goalName)) {
          goalMap.set(goalName, [...goalMap.get(goalName), goalActivity]);

        } else {
          goalMap.set(goalName, [goalActivity]);

        }
        

      }
      
    }          
  }

  goalMap.forEach(function(value, key, map) {
    
    const html = []

    html.push("<br><span class='goal-name'>" + key + "</span>");

    for (var i = 0; i < map.get(key).length; i++) {
      html.push("<br>" + value[i]["activityName"] + " " + value[i]["dateLastActivity"]);

      for (var j = 0; j < value[i]["entries"].length; j++) {
        html.push("<br>" + value[i]["entries"][j]);
      }
      //console.log(new Date(value[i]["dateLastActivity"]));

    }

    document.getElementById("journal").innerHTML = html.join(" ");
  })

}

start();