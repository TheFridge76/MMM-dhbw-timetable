const nodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
  start: function() {
  },
  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
      case "GET_TIMETABLE":
        https.get(payload, (res) => {
          let rawData = "";
          res.on("data", (d) => {
            rawData += d;
          });
          res.on("end", () => {
            this.sendSocketNotification("GOT_TIMETABLE", {content: rawData});
          });
        }).on("error", (e) => {
          console.error(e);
        });
        break;
    }
  }
});