const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;

window.addEventListener('DOMContentLoaded', () => {

  // function to add indicators in main list
  function addIndicators(settings) {
    let ind_table = document.getElementById("selected_ind_table");
    let indicator_name = settings.name;
    let indicator_id = settings.id;


    //append the indicator to list of indicators with close hide and settings icon
    ind_table.innerHTML = ind_table.innerHTML +
      "<tr><td id='" + indicator_id + "'>"
      + indicator_name
      + "</td><td class='rightMenu'><img id='" + indicator_id + "visibility' src='../icon/eyehide.svg' class='eye_indicator'>"
      + "<img id='" + indicator_id + "setting' src='../icon/setting.svg'>"
      + "<img id='" + indicator_id + "close' src='../icon/closebtn.svg' class='close_indicator'></td></tr>";
  }

  //function to add setting page and send message to changeGraph.js on buttons click
  function setSettingClick(settings) {
    let setting_id = settings.id + "setting";
    let indicator_id = settings.id;
    let visibility_id = settings.id + "visibility";
    let remove_id = settings.id + "close";
    document.getElementById(setting_id).addEventListener('click', function (e) {
      implementSetting(settings);
      get_and_set_value(settings);
    });
    document.getElementById(visibility_id).addEventListener('click', function (e) {
      settings.hidden = !settings.hidden;
      ipcRenderer.send("indicator", settings);
    });
    document.getElementById(remove_id).addEventListener('click', function (e) {
      settings.applied = !settings.applied;
      ipcRenderer.send("indicator", settings);
    });
    document.getElementById(indicator_id).addEventListener('click', function (e) {
      settings.hidden = false;
      settings.applied = true;
      ipcRenderer.send("indicator", settings);
    });

  }
  
  // function to create setting page onclick of setting button
  function implementSetting(settings) {
    indicator_name = settings.name;
    indicator_id = settings.id;
    document.getElementById("ind_search").style.display = "none";
    document.getElementById("indicator_scroll").style.display = "none";
    document.getElementById("indicator_settings").style.display = "block";
    indicator_applied = settings.applied;
    indicator_hidden = settings.hidden;
    no_of_controls = Object.keys(settings.controls).length;
    let formHTML = "";
    if (no_of_controls >= 0) {
      for (var i = 0; i < no_of_controls; i++) {
        labelsName = settings.controls[i].label;
        labels_with_check = settings.controls[i].checkbox;
        hasColor1 = (settings.controls[i].color1 != null);
        hasColor2 = (settings.controls[i].color2 != null);
        hasNumInput = (settings.controls[i].numInput != null);
        hasSliderInput = (settings.controls[i].sliderInput != null);
        hasSelectInput = (settings.controls[i].selectInput != null);
        hasButton = (settings.controls[i].btn != null);
        if (hasButton) {
          formHTML += _controlsRow + _column50 + _button(indicator_id + "btn" + i, labelsName) + _divTagClose + _divTagClose;
        }
        else {
          formHTML += _controlsRow + _column35 + _checkBoxDiv;
          if (labels_with_check) {
            formHTML += _checkBox(indicator_id + "check" + i) + _labelWithCheck;
          }
          else formHTML += _labelWithoutCheck;
          formHTML += labelsName + _spanClose + _divTagClose + _divTagClose +
            _column65 + _column50;
          if (hasColor1) formHTML += _column50 + _colorInput(indicator_id + "color1" + i, settings.controls[i].color1.value) + _divTagClose;

          if (hasColor2) formHTML += _column50 + _colorInput(indicator_id + "color2" + i, settings.controls[i].color2.value) + _divTagClose;
          if (!hasColor1 && !hasColor2) {
            if (hasNumInput) {
              formHTML += _numInput(indicator_id + "numInput" + i, settings.controls[i].numInput.value, settings.controls[i].numInput.minValue, settings.controls[i].numInput.maxValue);
              hasNumInput = false;
            }
            else if (hasSliderInput) {
              formHTML += _sliderInput(indicator_id + "sliderInput" + i, settings.controls[i].sliderInput.value, settings.controls[i].sliderInput.minValue, settings.controls[i].sliderInput.maxValue)
              hasSliderInput = false;
            }
            else if (hasSelectInput) {
              formHTML += _selectInput(indicator_id + "selectInput" + i);
              const options_len = Object.keys(settings.controls[i].selectInput).length;
              for (var j = 0; j < options_len; j++) {
                if (settings.controls[i].selectedValue == j) {
                  formHTML += _options_default + settings.controls[i].selectInput[j] + _optionsClose;
                } else {
                  formHTML += _options + settings.controls[i].selectInput[j] + _optionsClose;
                }
              }
              formHTML += _selectInputClose;
              hasSelectInput = false;
            }
          }
          formHTML += _divTagClose + _column50;
          if (hasNumInput) {
            formHTML += _numInput(indicator_id + "numInput" + i, settings.controls[i].numInput.value, settings.controls[i].numInput.minValue, settings.controls[i].numInput.maxValue);
          }
          else if (hasSliderInput) {
            formHTML += _sliderInput(indicator_id + "sliderInput" + i, settings.controls[i].sliderInput.value, settings.controls[i].sliderInput.minValue, settings.controls[i].sliderInput.maxValue);
          }
          else if (hasSelectInput) {
            formHTML += _selectInput(indicator_id + "selectInput" + i);
            const options_len = Object.keys(settings.controls[i].selectInput).length;
            for (var j = 0; j < options_len; j++) {
              formHTML += _options + settings.controls[i].selectInput[j] + _optionsClose;
            }
            formHTML += _selectInputClose;
          }

          formHTML += _divTagClose + _divTagClose + _divTagClose;
        }

      }
      formHTML += _bottomControl(indicator_id);
      document.getElementById("form_setting").innerHTML = formHTML;
      //setting the name of indicator on top head
      document.getElementById("indicator_settings_name").innerHTML = indicator_name;
    }
  }

// function to implement click listener on button and get values from input and
  function get_and_set_value(settings) {
    let indicator_id = settings.id;
    let apply_btn = document.getElementById("apply" + indicator_id);
    let reset_btn = document.getElementById("reset" + indicator_id);
    no_of_controls = Object.keys(settings.controls).length;
    apply_btn.addEventListener('click', () => {
      if (no_of_controls >= 0) {
        for (var i = 0; i < no_of_controls; i++) {
          labelsName = settings.controls[i].label;
          labels_with_check = settings.controls[i].checkbox;
          hasColor1 = (settings.controls[i].color1 != null);
          hasColor2 = (settings.controls[i].color2 != null);
          hasNumInput = (settings.controls[i].numInput != null);
          hasSliderInput = (settings.controls[i].sliderInput != null);
          hasSelectInput = (settings.controls[i].selectInput != null);
          if (labels_with_check)
            settings.controls[i].checkValue = document.getElementById(indicator_id + "check" + i).checked;
          if (hasColor1)
            settings.controls[i].color1.value = document.getElementById(indicator_id + "color1" + i).value;
          if (hasColor2)
            settings.controls[i].color2.value = document.getElementById(indicator_id + "color2" + i).value;
          if (hasNumInput)
            settings.controls[i].numInput.value = parseInt(document.getElementById(indicator_id + "numInput" + i).value);
          if (hasSliderInput)
            settings.controls[i].sliderInput.value = parseInt(document.getElementById(indicator_id + "sliderInput" + i).value);
          if (hasSelectInput)
            settings.controls[i].selectedValue = (document.getElementById(indicator_id + "selectInput" + i).value);
        }
      }
      ipcRenderer.send("indicator", settings);
    });

    for (var i = 0; i < no_of_controls; i++) {
      if (hasButton) {
        if (settings.controls[i].btn == "add") {
          document.getElementById(indicator_id + "btn" + i).addEventListener('click', function (e) {
            addMoreField(settings);
          }
          )
        };
      }
    }
  }

  //function for add button to add more indicators
  function addMoreField(settings) {
    list_of_field = settings.btn_add;
    no_of_controls = Object.keys(settings.controls).length;
    for (var i = 0; i < list_of_field.length; i++) {
      settings.controls[no_of_controls + i-1] = settings.controls[list_of_field[i]];
    }
    no_of_controls = Object.keys(settings.controls).length;
    if(no_of_controls<8){
    settings.controls[no_of_controls] ={label: "Add", btn: "add" };
    }
    implementSetting(settings);
    get_and_set_value(settings);
  }




  /*  Different properties for Indicator are 
  name:String
  id:String
  number:int
  applied:boolean
  hidden:boolean
  subplot:boolean
  controls is the json array of different inputs can be 
  label , numInput , color1 , color2 ,btn , selectInput (with a select value), sliderInput,
  */

  //Creation of all the indicators begins here
  // ------------------------------| A |-------------------------
  var atrSetting = {
    name: "Average True Range (ATR)",
    id: "atr",
    number: 0,
    applied: false,
    hidden: true,
    subplot: true,
    controls: {
      0: {
        label: "Length",
        numInput: { value: 10, minValue: 2, maxValue: 300 }
      },
      1: {
        label: "Color",
        color1: { value: "#0000ff" }
      },
      2: {
        label: "Add",
        btn: "add",
      }

    },
    btn_add : [0,1],
    data:{}
  }
  // ------------------------------| D |-------------------------
  var demaSetting = {
    name: "Double Exponential Moving Average (DEMA)",
    id: "dema",
    number: 1,
    applied: false,
    hidden: true,
    controls: {
      0: {
        label: "DEMA Length",
        numInput: { value: 10, minValue: 2, maxValue: 300 }
      },
      1: {
        label: "Source",
        selectInput: { 0: "open", 1: "high", 2: "low", 3: "close" },
        selectedValue: "close",
      },
      2: {
        label: "Color",
        color1: { value: "#0000ff" }
      },
      3: {
        label: "Add",
        btn: "add"
      }
    },
    btn_add: [0, 1, 2],
    data:{}
  }
  //  ------------------------------| E |-------------------------
  var emaSetting = {
    name: "Exponential Weighted Moving Average (EWMA)",
    id: "ema",
    number: 2,
    applied: false,
    hidden: true,
    controls: {
      0: {
        label: "Length",
        numInput: { value: 9, minValue: 2, maxValue: 300 }
      },
      1: {
        label: "Source",
        selectInput: { 0: "open", 1: "high", 2: "low", 3: "close" },
        selectedValue: "close",
      },
      2: {
        label: "Color",
        color1: { value: "#0000ff" }
      },
      3: {
        label: "Add",
        btn: "add"
      },
    },
    btn_add: [0, 1, 2],
    data:{}
  }

  addIndicators(atrSetting);
  addIndicators(demaSetting);
  addIndicators(emaSetting);

  setSettingClick(atrSetting);
  setSettingClick(demaSetting);
  setSettingClick(emaSetting);

  // back button listener for indicator settings
  document.getElementById("back_btn").addEventListener("click", () => {
    document.getElementById("ind_search").style.display = "block";
    document.getElementById("indicator_scroll").style.display = "block";
    document.getElementById("indicator_settings").style.display = "none";
  })

  var close_btn = document.getElementById('close_indictor');
  close_btn.addEventListener('click', function (e) {
    e.preventDefault();
    var window_ = remote.getCurrentWindow();
    window_.close();
  });
});

//some constant for formatting html 
const _controlsRow = "<div class='row'>";
const _column35 = "<div class='column-35 layoutTest'>";
const _column65 = "<div class='column-65 row layoutTest'>";
const _column50 = "<div class='column-50 layoutTest'>";
const _checkBoxDiv = "<div class='form-check-inline'>";
const _labelWithCheck = "<span class='with_check'>";
const _labelWithoutCheck = "<span>";
const _spanClose = "</span>";
const _divTagClose = "</div>";
const _selectInputClose = "</select>";
const _options = "<option>";
const _options_default = "<option selected>";
const _optionsClose = "</option>";

// function for adding id to html text formattings
function _bottomControl(id) {
  return "<div  class='bottom_fixed'><div class='column-65 layoutTest'>"
    + "<Button id='reset" + id + "' class='btn btn-sm btn-outline-Danger '>Reset Settings</Button>"
    + "</div><div class='column-35 layoutTest'>"
    + "<Button id='apply" + id + "' class='btn btn-Primary btn-sm apply_btn'>Apply</Button>"
    + "</div></div>";
}
function _colorInput(id, colorValue) {
  return "<input id='" + id + "' type='color' class='form-control form-control-color' value=" + colorValue + " title='Choose color' />";
}
function _numInput(id, numberValue, numMin, numMax) {
  return "<input id='" + id + "' type='number' class='form-control form-control-sm'  placeholder='" + numberValue + "' min='" + numMin + "' max=" + numMax + " />";
}
function _sliderInput(id, sliderValue, sliderMin, sliderMax, sliderStep) {
  return "<input id='" + id + "' type='range' class='form-range form-control-sm' value='" + sliderValue + "' min='" + sliderMin + "' max='" + sliderMax + "' step='" + sliderStep + "'>";
}
function _selectInput(id) {
  return "<select id='" + id + "' class='form-control form-control-sm'>";
}
function _checkBox(id) {
  return "<input id='" + id + "' type='checkbox'  class='form-check-input'/>";
}
function _button(id, label) {
  return "<button id='" + id + "' type='submit'  class='btn btn-primary'>" + label + "</button>";
}