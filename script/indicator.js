const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;

window.addEventListener('DOMContentLoaded', () => {

  var volSettings = {
      name : "Volume",
      id : "Volume",
      number : 0,
      applied : false,
      hidden : false,
      controls : {
        0 :{ label: "Volume Colors",
        checkbox :false,
        color1:{value:"#00ff00"}, 
        color2:{value:"#ff0000"}},
      }
  }



  addIndicators(volSettings);
  setSettingClick(volSettings);


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
  const _optionsClose = "</option>" ;

  function _bottomControl(id){
    return "<div  class='bottom_fixed'><div class='column-65 layoutTest'>"
    +"<Button id='reset"+id+"' class='btn btn-sm btn-outline-Danger '>Reset Settings</Button>"
    +"</div><div class='column-35 layoutTest'>"
    +"<Button id='apply"+id+"' class='btn btn-Primary btn-sm apply_btn'>Apply</Button>"
    +"</div></div>";
  }

  function _colorInput(id,colorValue){
    return "<input id='"+id+"' type='color' class='form-control form-control-color' value="+colorValue+" title='Choose color' />";
  }
  function  _numInput(id,numberValue, numMin, numMax){
      return "<input id='"+id+"' type='number' class='form-control form-control-sm'  placeholder='"+numberValue+"' min='"+numMin+"' max="+numMax+" />";
  }
  function _sliderInput(id,sliderValue,sliderMin,sliderMax,sliderStep){
    return "<input id='"+id+"' type='range' class='form-range form-control-sm' value='"+sliderValue+"' min='"+sliderMin+"' max='"+sliderMax+"' step='"+sliderStep+"'>";
  }
  function _selectInput(id){
    return "<select id='"+id+"' class='form-control form-control-sm'>";
  } 
  function _checkBox(id) {
    return "<input id='"+id+"' type='checkbox'  class='form-check-input'/>";
  }
  
  function addIndicators(settings){
      var ind_table = document.getElementById("selected_ind_table");
      var indicator_name = settings.name;
      var indicator_id = settings.id;


      //append the indicator to list of indicators with close hide and settings icon
      ind_table.innerHTML = ind_table.innerHTML+
      "<tr><td id='"+indicator_id+"'>"
      +indicator_name
      +"</td><td class='rightMenu'><img id='"+indicator_id+"visibility' src='../icon/eyehide.svg' class='eye_indicator'>"
      +"<img id='"+indicator_id+"setting' src='../icon/setting.svg'>"
      +"<img id='"+indicator_id+"close' src='../icon/closebtn.svg' class='close_indicator'></td></tr>";
  }

function setSettingClick(setting){
  setting_id = setting.id+"setting";
  indicator_id = setting.id;
  visibility_id = setting.id +"visibility";
  remove_id = setting.id +"close";
  document.getElementById(setting_id).addEventListener('click',function(e){
    implementSetting(setting);
    get_and_set_value(setting);
  });
  document.getElementById(visibility_id).addEventListener('click',function(e){
      setting.hidden = !setting.hidden;
      ipcRenderer.send("indicator",setting);
  });
  document.getElementById(remove_id).addEventListener('click',function(e){
      setting.applied = !setting.applied;
      ipcRenderer.send("indicator",setting);
  });
  document.getElementById(indicator_id).addEventListener('click',function(e){
     setting.hidden = false;
     setting.applied = true;
     ipcRenderer.send("indicator",setting);
  });

}

 document.getElementById("back_btn").addEventListener("click", ()=>{
    document.getElementById("ind_search").style.display ="block";
    document.getElementById("indicator_scroll").style.display ="block";
    document.getElementById("indicator_settings").style.display = "none";
 })

  function implementSetting(settings){
    var indicator_name = settings.name;
    var indicator_id = settings.id;
    document.getElementById("ind_search").style.display ="none";
    document.getElementById("indicator_scroll").style.display ="none";
    document.getElementById("indicator_settings").style.display = "block";
    indicator_applied = settings.applied;
    indicator_hidden = settings.hidden;
    no_of_controls = Object.keys(settings.controls).length;
    var formHTML = "";
      if(no_of_controls>=0){
        for(var i=0; i<no_of_controls; i++){
          labelsName = settings.controls[i].label;
          labels_with_check = settings.controls[i].checkbox;
          hasColor1 = (settings.controls[i].color1!=null);
          hasColor2 = (settings.controls[i].color2!=null);
          hasNumInput = (settings.controls[i].numInput!=null);
          hasSliderInput = (settings.controls[i].sliderInput!=null);
          hasSelectInput = (settings.controls[i].selectInput!=null);
          formHTML += _controlsRow + _column35 + _checkBoxDiv;
          if(labels_with_check){
            formHTML += _checkBox(indicator_id+"check"+i) + _labelWithCheck;
          } 
          else formHTML+= _labelWithoutCheck;
          formHTML += labelsName + _spanClose + _divTagClose + _divTagClose +
           _column65 + _column50 ;
          if(hasColor1) formHTML += _column50 + _colorInput(indicator_id+"color1"+i,settings.controls[i].color1.value) +_divTagClose;

          if(hasColor2) formHTML += _column50 + _colorInput(indicator_id+"color2"+i,settings.controls[i].color2.value) +_divTagClose;
          if(!hasColor1 && !hasColor2){
              if(hasNumInput){ 
                formHTML += _numInput(indicator_id+"numInput"+i,settings.controls[i].numInput.value,settings.controls[i].numInput.minValue,settings.controls[i].numInput.maxValue);
                hasNumInput = false;
              }
              else if(hasSliderInput){
                formHTML += _sliderInput(indicator_id+"sliderInput"+i,settings.controls[i].sliderInput.value,settings.controls[i].sliderInput.minValue,settings.controls[i].sliderInput.maxValue)
                hasSliderInput = false;
              }
              else if(hasSelectInput){
                formHTML += _selectInput(indicator_id+"selectInput"+i) ;
                const options_len = Object.keys(settings.controls[i].selectInput).length;
                for(var j=0; j < options_len; j++){
                  if(settings.controls[i].selectedValue==j){
                    formHTML += _options_default + settings.controls[i].selectInput[j] + _optionsClose;
                  }else{
                    formHTML += _options + settings.controls[i].selectInput[j] + _optionsClose;
                  }
                }
                formHTML += _selectInputClose;
                hasSelectInput = false;
            }
          }
          formHTML += _divTagClose + _column50;
          if(hasNumInput){ 
            formHTML += _numInput(indicator_id+"numInput"+i,settings.controls[i].numInput.value,settings.controls[i].numInput.minValue,settings.controls[i].numInput.maxValue);
          }
          else if(hasSliderInput){
            formHTML += _sliderInput(indicator_id+"sliderInput"+i,settings.controls[i].sliderInput.value,settings.controls[i].sliderInput.minValue,settings.controls[i].sliderInput.maxValue);
          }
          else if(hasSelectInput){
            formHTML += _selectInput(indicator_id+"selectInput"+i) ;
            const options_len = Object.keys(settings.controls[i].selectInput).length;
            for(var j=0; j < options_len; j++){
              formHTML += _options + settings.controls[i].selectInput[j] + _optionsClose;
            }
            formHTML += _selectInputClose;
          }

          formHTML += _divTagClose + _divTagClose + _divTagClose;
        }
        formHTML += _bottomControl(indicator_id);
        document.getElementById("form_setting").innerHTML = formHTML;
        //setting the name of indicator on top head
        document.getElementById("indicator_settings_name").innerHTML= indicator_name;
      }
  }

  function get_and_set_value(settings){
        let indicator_id = settings.id;
        let apply_btn = document.getElementById("apply"+indicator_id);
        let reset_btn = document.getElementById("reset"+indicator_id);
        no_of_controls = Object.keys(settings.controls).length;
        apply_btn.addEventListener('click', ()=>{
          if(no_of_controls>=0){
            for(var i=0; i<no_of_controls; i++){
                labelsName = settings.controls[i].label;
                labels_with_check = settings.controls[i].checkbox;
                hasColor1 = (settings.controls[i].color1!=null);
                hasColor2 = (settings.controls[i].color2!=null);
                hasNumInput = (settings.controls[i].numInput!=null);
                hasSliderInput = (settings.controls[i].sliderInput!=null);
                hasSelectInput = (settings.controls[i].selectInput!=null);
                if(labels_with_check)
                settings.controls[i].checkValue = document.getElementById(indicator_id+"check"+i).checked;
                if(hasColor1) 
               settings.controls[i].color1.value = document.getElementById(indicator_id+"color1"+i).value;
               if(hasColor2) 
               settings.controls[i].color2.value = document.getElementById(indicator_id+"color2"+i).value;
               if(hasNumInput)
               settings.controls[i].numInput.value = document.getElementById(indicator_id+"numInput"+i).value;
               if(hasSliderInput)
               settings.controls[i].sliderInput.value = document.getElementById(indicator_id+"sliderInput"+i).value;
               if(hasSelectInput)
               settings.controls[i].selectedValue = document.getElementById(indicator_id+"selectInput"+i).value;
            }}
          ipcRenderer.send("indicator",settings);
        });
        
}

    var close_btn = document.getElementById('close_indictor');
    close_btn.addEventListener('click', function (e) {
        e.preventDefault();
        var window_ = remote.getCurrentWindow();
        window_.close();
      });
});