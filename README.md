# What this repository is.

It is a container holding the port to P5js of two Processing examples, with the aid of the [Paperjs library](http://paperjs.org/about/), so that Processing's website can show live versions of those examples in their corresponding example pages.

The example pages are [scale shape](https://processing.org/examples/scaleshape.html) and [shape vertices](https://processing.org/examples/shapevertices.html), which currently show static images instead of live versions of the examples.

## Why Paperjs?

The Processing examples work with SVG files, which P5js does not currently support; thus a third-party Javascript library that can load, create and manipulate SVG files is in order. See this [issue](https://github.com/processing/processing-website/issues/314#issue-1349229125).

There are many such libraries out there, one very good option is [SVGjs](https://github.com/svgdotjs/svg.js), which is simple, full-featured, easy to use and well documented. Paperjs, though, has two **strong pros**

- It works with a canvas element, instead of injecting an SVG file in the html document. Thus allowing easier integration with P5js, which also uses a canvas html element.
- Provides very easy access to the anchor points and handles of paths, which is crucial for the "shape vertices" example.


# How to run the examples locally.

These are _minimal working examples_ that anyone can easily copy and tinker with localy, without having to deal with the complexity of the Processing's website repository. To run these examples in your web browser follow through

1. Copy this whole repository to your computer.
2. Open a terminal and move to one of the examples directory: `scale-shape` or `shape-vertices`.
3. From there, launch a local web server. If you have Python installed, issue one of the commands `python -m SimpleHTTPServer` or `python -m http.server`.
4. Open your web browser and navigate to this direction `localhost:8000`.

## Further options to launch a local web server

See this P5js [wiki page](https://github.com/processing/p5.js/wiki/Local-server#python-simplehttpserver).
