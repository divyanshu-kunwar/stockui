window.addEventListener('DOMContentLoaded', () => { 

    var btn1 = document.getElementById("indicator_drop_btn");
    var btn2 = document.getElementById("pattern_drop_btn");
    var btn3 = document.getElementById("price_drop_btn");
    var btn4 = document.getElementById("volume_drop_btn");

    var item_list1 = document.getElementById("ind_items");
    var item_list2 = document.getElementById("pattern_items");
    var item_list3 = document.getElementById("price_items");
    var item_list4 = document.getElementById("vol_items");
    
    toggleDropDown(btn1 , item_list1);
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

});