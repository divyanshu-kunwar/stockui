const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;

window.addEventListener('DOMContentLoaded', () => {

  var ewmaSetting = {
    name: "Exponential Moving Average",
    id:"EWMA",
    number:3,
    applied:false,
    hidden:true,
    controls:{
      0:{label:"EWMA Length",
      numInput : { value:9 , minValue:2, maxValue:300}},
      1:{label:"Source",
    selectInput:{0:"open",1:"high",2:"low",3:"close"},
    selectedValue:3,},
    2:{ label: "EWMA Color",
      color1:{value:"#0000ff"}},
    3:{label: "Add",
        btn:"ewma_add"},
    }
  }

  var maSetting = {
    name: "Moving Average",
    id:"MA",
    number:1,
    applied:false,
    hidden:true,
    controls:{
      0:{label:"MA Length",
      numInput : { value:10 , minValue:2, maxValue:300}},
      1:{label:"Source",
    selectInput:{0:"open",1:"high",2:"low",3:"close"},
    selectedValue:3,},
    2:{ label: "MA Color",
      color1:{value:"#0000ff"}},
    3:{label: "Add",
        btn:"sma_add"},
    }
  }

  var mmSetting = {
    name: "Moving Median",
    id:"MM",
    number:2,
    applied:false,
    hidden:true,
    controls:{
      0:{label:"MM Length",
      numInput : { value:10 , minValue:2, maxValue:300}},
      1:{label:"Source",
    selectInput:{0:"open",1:"high",2:"low",3:"close"},
    selectedValue:3,},
    2:{ label: "MM Color",
      color1:{value:"#0000ff"}},
    3:{label: "Add",
        btn:"mm_add"},
    }
  }

  var smmaSetting = {
    name: "Smooth Moving Average",
    id:"smma",
    number:2,
    applied:false,
    hidden:true,
    controls:{
      0:{label:"smma Length",
      numInput : { value:10 , minValue:2, maxValue:300}},
      1:{label:"Source",
    selectInput:{0:"open",1:"high",2:"low",3:"close"},
    selectedValue:3,},
    2:{ label: "smma Color",
      color1:{value:"#0000ff"}},
    3:{label: "Add",
        btn:"smma_add"},
    }
  }


  var volSettings = {
      name : "Volume",
      id : "Volume",
      number : 0,
      applied : true,
      hidden : false,
      controls : {
        0 :{ label: "Volume Colors",
        checkbox :false,
        color1:{value:"#00ff00"}, 
        color2:{value:"#ff0000"}},
        1:{label: "Show MA",
        checkbox:true,
        color1:{ value:"#0000ff"}},
        2:{ label:"MA Length",
        numInput : { value:20 , minValue:2, maxValue:300}
      }
      }
  }

  addIndicators(ewmaSetting);
  addIndicators(maSetting);
  addIndicators(mmSetting);
  addIndicators(smmaSetting);
  addIndicators(volSettings);

  setSettingClick(ewmaSetting);
  setSettingClick(maSetting);
  setSettingClick(mmSetting);
  setSettingClick(smmaSetting);
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
  function _button(id , label){
    return "<button id='"+id+"' type='submit'  class='btn btn-primary'>"+label+"</button>";
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
          hasButton = (settings.controls[i].btn!=null);
        if(hasButton){
                formHTML += _controlsRow + _column50 +_button(indicator_id+"btn"+i,labelsName) + _divTagClose + _divTagClose;
        }
        else{
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
               settings.controls[i].numInput.value = parseInt(document.getElementById(indicator_id+"numInput"+i).value);
               if(hasSliderInput)
               settings.controls[i].sliderInput.value = parseInt(document.getElementById(indicator_id+"sliderInput"+i).value);
               if(hasSelectInput)
               settings.controls[i].selectedValue = (document.getElementById(indicator_id+"selectInput"+i).value);
            }}
          ipcRenderer.send("indicator",settings);
        });
        if(no_of_controls>=0){
          for(let i =0; i<no_of_controls;i++){
            console.log(i);
            hasButton = (settings.controls[i].btn!=null);
            if(hasButton){
            document.getElementById(indicator_id+"btn"+i).addEventListener('click',function(e){
              if(settings.controls[i].btn == "sma_add") sma_add();
              else if(settings.controls[i].btn == "mm_add") smm_add();
              else if(settings.controls[i].btn == "ewma_add") ewma_add();
              else if(settings.controls[i].btn == "smma_add") smma_add();
            });              
            }
          }
        } 
}

function sma_add(){
    no_of_controls = Object.keys(maSetting.controls).length;
    if(no_of_controls<10){
    maSetting.controls[no_of_controls-1] = {label:"MA Length",numInput : { value:10 , minValue:2, maxValue:300} };
    maSetting.controls[no_of_controls] = {label:"Source",selectInput:{0:"open",1:"high",2:"low",3:"close"},selectedValue:3};
    maSetting.controls[no_of_controls+1] = {label: "MA Color",color1:{value:"#0000ff"}};
    if(no_of_controls<7){
    maSetting.controls[no_of_controls+2] = {label: "Add",btn: "sma_add"}; 
    }
    implementSetting(maSetting);
    get_and_set_value(maSetting);
    }
}

function smm_add(){
  no_of_controls = Object.keys(mmSetting.controls).length;
  if(no_of_controls<10){
  mmSetting.controls[no_of_controls-1] = {label:"MM Length",numInput : { value:10 , minValue:2, maxValue:300} };
  mmSetting.controls[no_of_controls] = {label:"Source",selectInput:{0:"open",1:"high",2:"low",3:"close"},selectedValue:3};
  mmSetting.controls[no_of_controls+1] = {label: "MM Color",color1:{value:"#0000ff"}};
  if(no_of_controls<7){
  mmSetting.controls[no_of_controls+2] = {label: "Add",btn: "mm_add"}; 
  }
  implementSetting(mmSetting);
  get_and_set_value(mmSetting);
  }
}
function ewma_add(){
  no_of_controls = Object.keys(ewmaSetting.controls).length;
  if(no_of_controls<10){
  ewmaSetting.controls[no_of_controls-1] = {label:"MM Length",numInput : { value:10 , minValue:2, maxValue:300} };
  ewmaSetting.controls[no_of_controls] = {label:"Source",selectInput:{0:"open",1:"high",2:"low",3:"close"},selectedValue:3};
  ewmaSetting.controls[no_of_controls+1] = {label: "MM Color",color1:{value:"#0000ff"}};
  if(no_of_controls<7){
  ewmaSetting.controls[no_of_controls+2] = {label: "Add",btn: "mm_add"}; 
  }
  implementSetting(ewmaSetting);
  get_and_set_value(ewmaSetting);
  }
}
function smma_add(){
  no_of_controls = Object.keys(smmaSetting.controls).length;
  if(no_of_controls<10){
  smmaSetting.controls[no_of_controls-1] = {label:"MM Length",numInput : { value:10 , minValue:2, maxValue:300} };
  smmaSetting.controls[no_of_controls] = {label:"Source",selectInput:{0:"open",1:"high",2:"low",3:"close"},selectedValue:3};
  smmaSetting.controls[no_of_controls+1] = {label: "MM Color",color1:{value:"#0000ff"}};
  if(no_of_controls<7){
  smmaSetting.controls[no_of_controls+2] = {label: "Add",btn: "mm_add"}; 
  }
  implementSetting(smmaSetting);
  get_and_set_value(smmaSetting);
  }
}

    var close_btn = document.getElementById('close_indictor');
    close_btn.addEventListener('click', function (e) {
        e.preventDefault();
        var window_ = remote.getCurrentWindow();
        window_.close();
      });
});