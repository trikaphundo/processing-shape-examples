/*
http://paperjs.org/tutorials/getting-started/using-javascript-directly/
http://paperjs.org/reference/project/#importsvg-svg
http://paperjs.org/tutorials/paths/working-with-path-items/
http://paperjs.org/reference/
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
https://discourse.processing.org/t/svg-image-doesnt-work/32115/2
---------------------------------------------------------------------


-> WHAT DOES THIS DO AND WHY?? <-

This P5js sketch tries to reproduce as closely as possible the Processing's
logic and data structures for this example. It all boils down to these two points

1. What are the vertices of a PShape created from an SVG file.
2. How to use Paperjs library to calculate or get these vertices.

Although I could not follow through the complete process, the actual parsing
of SVG files, and creation of PShapes objects, is done by the PShapeSVG class,
namely, in the methods "parseChild", "parsePath" and "parsePathVertex"
(link at the bottom of this comment).

A summary of what Processing does, tailored to what we need, is:

1. For every path element of the SVG, a new PShape is created.
2. The vertices of this new PShape are the anchor and control points (if any)
of every command of the path, i.e., lineTo, moveTo, cubicBezier, etc. 

Good news are

1. Our SVG file is made up of only path elements.
2. Paperjs provides an easy way to get anchor points and their handles via
the Segment object.


Conclusion

Fortunately, Paperjs does most of the job for us (loading, parsing, DOM), thus
we are going to do the following, in order to mimic the original Processing code

1. For every path element, create a PShape-like object.
2. The vertices (anchor and control points of the path) will be retrieved from
the Paperjs DOM for the SVG, and stored in an array, which will be then
attatched to the PShape-like object.
3. Cicle through the Shapes and through the vertices, drawing them.



https://github.com/processing/processing4/blob/fb8dfbfd9b5ac8087d80a7f13846213984e64ff6/core/src/processing/core/PShapeSVG.java#L305
https://github.com/processing/processing4/blob/fb8dfbfd9b5ac8087d80a7f13846213984e64ff6/core/src/processing/core/PShapeSVG.java#L506
https://github.com/processing/processing4/blob/fb8dfbfd9b5ac8087d80a7f13846213984e64ff6/core/src/processing/core/PShapeSVG.java#L896
*/


//Dimensions of the canvas
let w = 500, h = 500;
//background color of the canvas
let bgColor = 51;

let mySvg, mySvgPath = "assets/uk.svg";

//True only if the SVG has been successfully loaded
let dlSuccess = false;

/*An array of P5Shape. We are trying to mimic the Processing's example
logic and structure.*/
let myShapes;

/*Class for a container for vertices of an SVG path.
We are trying to mimic what Processing does when loading an SVG file.
This class makes the code resemble more how Processing makes shape objects
out of SVG files.*/
class P5Shape {
  constructor(){
    this.vertices = [];
  }
};



function setup() {
  createCanvas(w, h);
  frameRate(16);

  
  //Set out to use the canvas created by P5js with Paper.js
  
  //Get a reference to the canvas html node (could use "canvas" directly)
  let cv = canvas;
  //Create a view object attatched to the canvas created by P5js
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
      
      //Already converted SVG to P5Shape, we no longer need Paperjs stuff.
      //Note that from now on mySvg will be null
      paper.project.clear();
      
      
      dlSuccess = true;
      //Start looping again.
      if(!isLooping()){
//      console.log("looping again!")
        loop();
      }
    },
    onError: () => {
      console.log("SVG file could not be loaded");
    }
  });
  //-----------------------------------------


  //Do not loop: wait for the importSVG to finish
  if(!dlSuccess){
//  console.log("SVG file not loaded yet, calling noLoop()")
    noLoop();
  }
}

function draw() {
  //draw() will execute at least once, so make sure it does not get past here
  //until we are ready.
  if(!dlSuccess){
    return;
  }
  
  
  
  background(bgColor);
  
  //Do as in the Processing example:
  //draw sequentially every vertex of every shape
  for(let i = 0; i < myShapes.length; i++){
    for(let j = 0; j < myShapes[i].vertices.length; j++){
      let vertex = myShapes[i].vertices[j];
      
      stroke((frameCount + (i + 1) * j) % 255);
      point(vertex[0], vertex[1]);
    }
  }
  
}


/*Convert the SVG item (mySvg) to a series of P5Shape objects.
Center the SVG item in the canvas and make it invisible as well.*/
function doStuff(){
  //Center the SVG in the project's view (the canvas)
  mySvg.position = paper.view.center;
  //Make the SVG element invisible in the canvas
  mySvg.visible = false;

  svgToShapes();
}

/*Create a Processing-like array of shapes from an SVG.
The SVG item is pointed to by mySvg; the array of shapes is stored in myShapes.
The logic is as similar as possible to how Processing does it.

Fortunately Paperjs does most of the job for us (parsing, etc.), and provides
easy access to the segments of paths, from which we will be taking the vertices.

It is in order to note that Paperjs stores mySvg following this structure:
1. Every child of mySvg is a path.
2. Every child, if any, of a path is a subpath.
3. Every subpath is made up of segments. Segments are a point and its
in and out handles.

These segment points and handles are our vertices.
If a path has no subpaths, then the path holds the segments property.*/
function svgToShapes(){
  let paths = mySvg.children;
  
  
  //First child is the bounding box, so ignore it
  myShapes = new Array(paths.length - 1);
  for(let i = 1; i < paths.length; i++){
    //for every path element, create a shape
    let shp = new P5Shape();
    let vertices;
    
    //Get the vertices of the path
    if(paths[i].hasChildren()){ //current path does have subpaths
      let subpaths = paths[i].children;
      vertices = [];
      
      for(let j = 0; j < subpaths.length; j++){
        //convert every subpath's segments to vertices and append them to the
        //ones we already have
        vertices = vertices.concat(segmentsToVertices(subpaths[j].segments));
      }
    } else { //current path does not have subpaths
      vertices = segmentsToVertices(paths[i].segments);
    }
//  debugger;
    //store the vertices in the shape object
    shp.vertices = vertices;
    //Add the shape to the shape array
    myShapes[i - 1] = shp;
  }
}

/*Convert an array of segments (Paperjs object) to an array of vertices.
Vertices are anchor points and their handles.
In the returned array, every vertex is an array of 2 elements: [x, y].
*/
function segmentsToVertices(segs){
  if(!segs){
    return;
  }
  
  
  //every segment is an anchor point plus its in and out handles.
  let vertices = new Array(3 * segs.length);
  
  for(let i = 0; i < segs.length; i++){
    let x = segs[i].point.x, y = segs[i].point.y;
    
    //handleIn point
    vertices[3*i + 0] = [x + segs[i].handleIn.x, y + segs[i].handleIn.y];
    //Anchor point 
    vertices[3*i + 1] = [x, y];
    //handleOut point 
    vertices[3*i + 2] = [x + segs[i].handleOut.x, y + segs[i].handleOut.y];
  }
  
  
  return vertices;
}

