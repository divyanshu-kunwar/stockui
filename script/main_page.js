window.addEventListener('DOMContentLoaded', () => {

  var btn = document.getElementById("min_cri");
  var btn_ = document.getElementById("criteria_switcher");
  var btn1 = document.getElementById("indicator_drop_btn");
  var btn2 = document.getElementById("pattern_drop_btn");
  var btn3 = document.getElementById("price_drop_btn");
  var btn4 = document.getElementById("volume_drop_btn");


  var item_list = document.getElementById("criteria");
  var item_list1 = document.getElementById("ind_items");
  var item_list2 = document.getElementById("pattern_items");
  var item_list3 = document.getElementById("price_items");
  var item_list4 = document.getElementById("vol_items");


  toggleDropDown(btn, item_list);
  toggleDropDown(btn_, item_list);
  toggleDropDown(btn1, item_list1);
  toggleDropDown(btn2, item_list2);
  toggleDropDown(btn3, item_list3);
  toggleDropDown(btn4, item_list4);
  // toogle drop down menu by passing btn id and drop down id
  function toggleDropDown(btn, elementToCollapse) {
    btn.addEventListener("click", function (e) {

      // change display property on basis of previous property
      if (elementToCollapse.style.display == "none") {
        elementToCollapse.style.display = "block";
      } else {
        elementToCollapse.style.display = "none";
      }
    })
  }

  page1 = document.getElementById("home_page");
  page2 = document.getElementById("screener_page");
  page3 = document.getElementById("news_page");
  page4 = document.getElementById("settings_page");
  page5 = document.getElementById("console_page");
  page6 = document.getElementById("download_page");

  nav1 = document.getElementById("home_btn");
  nav2 = document.getElementById("screener_btn");
  nav3 = document.getElementById("news_btn");
  nav4 = document.getElementById("setting_btn");
  nav5 = document.getElementById("console_btn");
  nav6 = document.getElementById("downloads_btn");

  navigatePages(nav1, page1);
  navigatePages(nav2, page2);
  navigatePages(nav3, page3);
  navigatePages(nav4, page4);
  navigatePages(nav5, page5);
  navigatePages(nav6, page6);

  function navigatePages(button, page) {
    button.addEventListener("click", function (e) {
      page1.style.display = "none";
      page2.style.display = "none";
      page3.style.display = "none";
      page4.style.display = "none";
      page5.style.display = "none";
      page6.style.display = "none";
      page.style.display = "block";
    })
  }
  var r = document.querySelector(':root');
  var themeButton = document.getElementById("themeBtn");
  var nightMode = false;
  themeButton.addEventListener("click", function (e) {
    if (!nightMode) {
      toDark();
      var rs = getComputedStyle(r);
      r.style.setProperty('--green-text', '#DD00FF');
      document.body.style.filter = "invert(100%)";
      themeButton.setAttribute("src", "icon/changeToLight.svg");
      nightMode = true;
      console.log("dark");
    } else {
      toLight();
      var rs = getComputedStyle(r);
      r.style.setProperty('--green-text', '#22ff00');
      document.body.style.filter = "invert(0%)";
      nightMode = false;
      themeButton.setAttribute("src", "icon/changeToDark.svg");

    }
  });

  function toLight() {
    document.body.animate([
      // keyframes
      { backgroundColor: '#020204' },
      { backgroundColor: '#fffff9' }
    ], {
      // timing options
      duration: 200,
      iterations: 1
    });
    document.body.style.backgroundColor = "#fffff9";
  }
  function toDark() {
    document.body.animate([
      // keyframes
      { backgroundColor: '#fffff9' },
      { backgroundColor: '#020204' }
    ], {
      // timing options
      duration: 200,
      iterations: 1
    });

    document.body.style.backgroundColor = "#020204";
  }
  var prev_con_length = 0;
  var prevLogs = ""
  console.stdlog = console.log.bind(console);
  console.logs = [];
  console.log = function () {
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
  }
  setInterval(() =>{
    if(console.logs.length>prev_con_length){
      for(var i=prev_con_length; i<console.logs.length; i++){
        date_ = new Date();
        date_ = date_.toLocaleTimeString()
        document.getElementById("console_page").innerHTML =
        "<number>[ "+ i+ " ]" +" </number> <i>" 
        + date_ +":<i/> "+ console.logs[i] + "<br>"
        +document.getElementById("console_page").innerHTML;
      }
      prev_con_length = console.logs.length;
    }
    if(document.getElementById("hiddenLog").innerHTML != prevLogs){
      prevLogs = document.getElementById("hiddenLog").innerHTML;
      console.log(prevLogs);
    }
  },300);
});