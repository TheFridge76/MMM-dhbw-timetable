Module.register("MMM-dhbw-timetable", {
  defaults: {
    course: "TINF17ITIN"
  },
  start: function () {
    var courses = {
      "TINF17ITIN": "7150001",
      "TINF18IT1": "7432001"
    }
    this.timetable = {
      lectures: []
    };
    this.url = "https://vorlesungsplan.dhbw-mannheim.de/index.php?action=view&gid=3067001&uid=" + courses[this.config.course];
  },
  getHeader: function() {
    return "Vorlesungen für " + this.config.course;
  },
  getDom: function() {
    var element = document.createElement("div");
    this.timetable.lectures.forEach((l) => {
      var lectureElement = document.createElement("div");
      lectureElement.innerHTML = l;
      element.appendChild(lectureElement);
    });
    return element;
  },
  notificationReceived: function(notification, payload, sender) {
    switch(notification) {
      case "DOM_OBJECTS_CREATED":
        var timer = setInterval(()=>{
          this.sendSocketNotification("GET_TIMETABLE", this.url);
        }, 1000);
        break;
    }
  },
  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
      case "GOT_TIMETABLE":
        var el = document.createElement("html");
        el.innerHTML = payload.content;
        el = el.getElementsByClassName("ui-grid-e")[0];
        var date = new Date();
        el = el.children[date.getDay() - 1];
        var lectures = [];
        for (var i = 0; i < el.getElementsByClassName("cal-time").length; i++) {
          lectures.push(el.getElementsByClassName("cal-time")[i].innerHTML + ": " + el.getElementsByClassName("cal-title")[i].innerHTML);
        }
        this.timetable = {
          lectures: lectures
        };
        this.updateDom();
        break;
    }
  }
});