/*
http://paperjs.org/tutorials/getting-started/using-javascript-directly/
http://paperjs.org/tutorials/getting-started/using-javascript-directly/#working-with-tools
http://paperjs.org/tutorials/project-items/transforming-items/
http://paperjs.org/reference/matrix/
http://paperjs.org/reference/item/#applymatrix
http://paperjs.org/reference/
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
https://discourse.processing.org/t/svg-image-doesnt-work/32115/2
*/


let mySvg, mySvgPath = "assets/bot1.svg";
let w = 500, h = 500;
//Paperjs grey-scale colours are numbers ranging from 0 to 1.
let bgColor = 102 / 255;


function setup() {
  createCanvas(w, h);
  
  
  //Set out to use the canvas created by P5js with Paper.js
  
  //Get a reference to the canvas html node (could use "canvas" directly)
  let cv = canvas;
  //Create an empty project and a view for the canvas:
  paper.setup(cv);
  //-----------------------------------------


  //Import the SVG file into the project's active layer
  
  //First clear the project
  paper.project.clear();
  //import the SVG file, adding it to the project's active layer
  console.log("Loading SVG file...");
  paper.project.importSVG(mySvgPath, {
    onLoad: (item, svgText) => {
      console.log("SVG file successfully loaded");
//    console.log(svgText);

      //reference to the Paperjs item created from the SVG file
      mySvg = item;
      doStuff();
    },
    onError: () => {
      console.log("SVG file could not be loaded");
    }
  });
  //-------------------------------
  
  
  
  noLoop();
}

function draw() {
}


/*Position and event handler for the SVG object loaded; also create a
background.*/
function doStuff(){
  //Create a rectangle that we will use as the background color.
  let bgRect = new paper.Path.Rectangle([0, 0], [w, h]);
  bgRect.fillColor = bgColor;
  //Move it to the bottom of the stack of items of the layer.
  bgRect.sendToBack();
  
  
  //Center the SVG in the project's view (the canvas)
  mySvg.position = paper.view.center;
  /*Make transformations be stored in the transformation related properties
  of the object, instead of applying directly to the element and its children.
  Thus we can easily clear them all.*/
  mySvg.applyMatrix = false;
  
  //Create a Paperjs tool to handle the mouse interaction.
  let tool = new paper.Tool();
  tool.onMouseMove = function (event) {
    /*As P5js and Paperjs are sharing the very same canvas, we can either use
    P5js mouseX property or get the position of the mouse from the event.
    But Paperjs seems to be less precise: if the mouse is swipped fast to the
    left, leaving the canvas, the mouse position carried by the event may have
    a negative x value.
    */

    //Clear all transformations on mySvg
    mySvg.matrix.reset();
    //Carry out the new transformation
    mySvg.scale(map(mouseX, 0, w, .1, 4.5));
//  mySvg.scale(map(event.point.x, 0, w, .1, 4.5));
  }
}
