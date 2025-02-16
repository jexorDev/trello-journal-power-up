async function getCardComments(apiKey, token, cardId) {
    try {
      const response = await fetch(`https://api.trello.com/1/cards/${cardId}/actions?filter=commentCard&key=${apiKey}&token=${token}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("error fetching card comments", error);
    }
  }

async function getCompletedCardChecklistItems(apiKey, token, cardId) {
  try {
    const response = await fetch(`https://api.trello.com/1/cards/${cardId}/actions?filter=updateCheckItemStateOnCard&key=${apiKey}&token=${token}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error fetching competed card checklist items", error)
  }
}

  function hasHadActivitySinceSelectedDate(first, second) {
    return new Date(first) >= new Date(second);
  }

  function isSameDay(first, second) {
    const firstDate = new Date(first)
    const secondDate = new Date(second)

    return firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate();
  }

  function getCurrentDateTime() {
    return new Date(Date.now());    
  }

  function getLocalDateFromUTC(utcDate) {
    return new Date(new Date(Date.parse(utcDate)).toLocaleDateString());
  }

  async function refreshData() {

    const selectedDateString = document.getElementById("journal-date").value;
    const selectedDateArray = selectedDateString.split("-");
    const selectedDate = new Date(selectedDateArray[0], selectedDateArray[1] - 1, selectedDateArray[2])

    let apiToken = "";
    const appKey = "ab51919adb28cfb83270a0d6ee991d38";

    if (apiToken === "") {
      await t.getRestApi().getToken().then((token) => {
        apiToken = token;
      });

    }

  const cards = t.arg("cards");
  let goalMap = new Map();     
  
  for (var i = 0; i < cards.length; i++){
    const cardDateLastActivity = getLocalDateFromUTC(cards[i]["dateLastActivity"]);
  
    if (!hasHadActivitySinceSelectedDate(cardDateLastActivity, selectedDate)) {
      continue;
    }

    let activityEntriesJson = "";
    let checklistUpdatesJson = "";
    await Promise.all([
      getCardComments(appKey, apiToken, cards[i]["id"]).then((data) => activityEntriesJson = data),
      getCompletedCardChecklistItems(apiKey, apiToken, cards[i]["id"]).then((data => checklistUpdatesJson = data))]);
    
    const activityEntries = [];

    for (var commentIndex = 0; commentIndex < activityEntriesJson.length; commentIndex++) {
      if (!isSameDay(getLocalDateFromUTC(activityEntriesJson[commentIndex]["date"]), selectedDate)) {
        continue;
      }
      activityEntries.push(activityEntriesJson[commentIndex]["data"]["text"]);
    }

    const completedChecklistItems = [];

    for (var checklistIndex = 0; checklistIndex < checklistUpdatesJson.length; checklistIndex++) {
      if (!isSameDay(getLocalDateFromUTC(checklistUpdatesJson[checklistIndex]["date"]), selectedDate)) {
        continue
      }
      
      const checklistItem = checklistUpdatesJson[checklistIndex]["data"]["checkItem"];
      
      if (checklistItem["state"] === "complete") {
        completedChecklistItems.push({
          checklistName: checklistUpdatesJson[checklistIndex]["data"]["checklist"]["name"],
          checklistItemName: checklistItem["name"]
        })
      }
    }

    if (activityEntries.length === 0 &&
        completedChecklistItems.length === 0) {
      continue;
    }


    let goalName = "Journal Entries";

    if (cards[i]["labels"] !== undefined) {
      for (var j = 0; j < cards[i]["labels"].length; j++) {
        goalName = cards[i]["labels"][j]["name"];
      }
    }  
    
    const goalActivity = {
      activityName: cards[i]["name"],
      entries: activityEntries,
      completedChecklistItems: completedChecklistItems,
      dateLastActivity: cards[i]["dateLastActivity"]
    }

    if (goalMap.has(goalName)) {
      goalMap.set(goalName, [...goalMap.get(goalName), goalActivity]);
    } else {
      goalMap.set(goalName, [goalActivity]);
    }
  }
  
  const html = []
  goalMap.forEach(function(value, key, map) {
        
    html.push("<br><div class='w3-bar w3-green'><div class='w3-bar-item'><h2>" + key + "</h2></div></div>");

    for (var i = 0; i < value.length; i++) {     

      html.push("<ul class='w3-ul w3-card-4'><li class='w3-bar'><div class='w3-bar-item'><span class='w3-large' style='font-weight:bold;'>" + value[i]["activityName"] + "</span>");
      
      for (var j = 0; j < value[i]["entries"].length; j++) {
        html.push("<br><span>" + value[i]["entries"][j] + "</span>");
      }    

      for (var k = 0; k < value[i]["completedChecklistItems"][k]; k++) {
        const completedChecklistItem = value[i]["completedChecklistItems"][k];
        html.push("<br><span>Completed " + completedChecklistItem["checklistItemName"] + " on " + completedChecklistItem["checklistName"] + "</span>");
      }

      html.push("</div></li></ul>")

    }
  })
  
  document.getElementById("journal").innerHTML = html.join(" ");
}

function onLoad() {
  document.getElementById("journal-date").value = getCurrentDateTime().toISOString().substring(0, 10);
  refreshData()
}

onLoad();