par_width = document.getElementById("graph_stats").getBoundingClientRect().width;
par_height = document.getElementById("graph_stats").getBoundingClientRect().height;
var s = function( p ) { // p could be any variable name
    p.setup = function() {
      p.createCanvas(par_width, par_height);
      p.background("#ffffff00");
    };
  
    p.draw = function() {
      p.stroke("#005bff");
      p.fill("#00000000")
      p.rect(10,10,80,200);
      p.rect(80,50,180,150);
      p.rect(180,150,280,170);
      p.rect(280,170,340,10);
      p.rect(340,130,360,140);
    };
  };
var myp5 = new p5(s, 'graph_stats');