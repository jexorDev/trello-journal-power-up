async function getCardComments(apiKey, token, cardId) {
    try {
      const response = await fetch(`https://api.trello.com/1/cards/${cardId}/actions?filter=commentCard&key=${apiKey}&token=${token}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function isSameDay(firstDate, secondDate) {
    return dayjs(firstDate).dayOfYear() === dayjs(secondDate).dayOfYear()
  }

  async function start() {
 
 

    let apiToken = "";
  const cards = t.arg("cards");
  let goalMap = new Map();        
  for (var i = 0; i < cards.length; i++){
    if (!isSameDay(cards[i]["dateLastActivity"], dayjs().utc())) {
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
          if (!isSameDay(activityEntriesJson[commentIndex]["date"], dayjs().utc())) {
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

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_dayOfYear);
start();