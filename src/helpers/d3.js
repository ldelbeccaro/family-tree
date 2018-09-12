import * as d3 from 'd3-3'
import { event as currentEvent } from 'd3-3'

function buildTree(getTreeData, onClickNode) {
  const oldGraph = document.querySelector('#graph svg')
  if (oldGraph) {
    oldGraph.remove()
  }

  const { data, spouses, specialLinks } = getTreeData()

  var zoom = d3.behavior.zoom()
    .scale(1.0)
    .scaleExtent([0.15, 2])
    .on("zoom", () => zoomed(svg));

  // create SVG
  var svg = d3.select("#graph")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .call(zoom)
    .append("g")
    .attr("transform", "translate(12, 12)")

  var root = data
  var allNodes = flatten(root);

  var tree = d3.layout.tree().nodeSize([70, 120])
  var nodes = tree.nodes(root)
  var links = tree.links(nodes)

  // Create the link lines.
  svg.selectAll(".link")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", elbow);

  var nodes = svg.selectAll(".node")
    .data(nodes)
    .enter()

  // spouse lines
  svg.selectAll(".spouse")
    .data(spouses)
    .enter().append("path")
    .attr("class", "spouse")
    .attr("d", d => spouseLine(allNodes, d));

  // special links to link Ed and Anne to their parents
  svg.selectAll('.special-link')
    .data(specialLinks)
    .enter().append("path")
    .attr("class", "special-link")
    .attr("d", d => specialElbow(allNodes, d));

  // create node images
  nodes.append("svg:image")
    // .attr("class", "node")
    .attr("xlink:href",  function(d) { return d.photo;})
    .attr("height", 50)
    .attr("width", 50)
    .attr("id", function (d) {
      return d.id;
    })
    .attr("display", function(d) {
      return d.hidden ? 'none' : ''
    })
    .attr("x", d => d.x - 25)
    .attr("y", d => d.y - 25)
    .on( 'click', function (d) {
      onClickNode(d.id)
    })
    .on( 'mouseenter', function() {
      // select element in current context
      d3.select( this )
        .transition()
        .attr("x", function(d) { return d.x -30;})
        .attr("y", function(d) { return d.y -30;})
        .attr("height", 60)
        .attr("width", 60);
    })
    // set back
    .on( 'mouseleave', function() {
      d3.select( this )
        .transition()
        .attr("x", function(d) { return d.x -25;})
        .attr("y", function(d) { return d.y -25;})
        .attr("height", 50)
        .attr("width", 50);
    });

  // add selection rectangles
  nodes.append("rect")
    .attr("height", 60)
    .attr("width", 60)
    .attr("x", d => d.x - 30)
    .attr("y", d => d.y - 30)
    .attr("stroke", d => d.selected ? "yellow" : "none")
    .attr("stroke-width", 10)
    .attr("fill", "none");

  // add text labels
  nodes.append("text")
    .text(function(d) {
      return d.name;
    })
    .attr('width', 70)
    .attr('text-anchor', 'middle')
    .attr("x", d => d.x)
    .attr("y", d => d.y + 40)
    .call(wrap)

  return { svg, zoom, allNodes }
}

// adjust for zoom
function zoomed(svg) {
  svg.attr("transform", "translate(" + currentEvent.translate + ")" + " scale(" + currentEvent.scale + ")")
}

// create array of all nodes
function flatten(root) {
  var n = [],
      i = 0;

  function recurse(node) {
      if (node.children) node.children.forEach(recurse);
      if (!node.id) node.id = ++i;
      n.push(node);
  }
  recurse(root);
  return n;
}

// spouse links
function spouseLine(allNodes, d) {
  var start = allNodes.filter(n => n.id === d.source.id)
  var end = allNodes.filter(n => n.id === d.target.id)
  if (!start[0] || !end[0]) return

  // define start and and end coordinates
  var linedata = [{
    x: start[0].x,
    y: start[0].y
  }, {
    x: end[0].x,
    y: end[0].y
  }];
  var fun = d3.svg.line()
    .x(d => d.x)
    .y(d => d.y)
    .interpolate("linear");
  return fun(linedata);
}

// regular generational links
function elbow(d) {
  if (d.target.no_parent) {
    return "M0,0L0,0";
  }
  var diff = d.source.y - d.target.y;
  var ny = d.target.y + diff * 0.40;

  var linedata = [{
    x: d.target.x,
    y: d.target.y
  }, {
    x: d.target.x,
    y: ny
  }, {
    x: d.source.x,
    y: d.source.y
  }]

  var fun = d3.svg.line().x(d => d.x).y(d => d.y).interpolate("step-after");
  return fun(linedata);
}

// special links for anne and ed
function specialElbow(allNodes, d) {
  var start = allNodes.filter(n => n.id === d.source.id)[0]
  var end = allNodes.filter(n => n.id === d.target.id)[0]
  if (!start || !end) return

  var diff = start.y - end.y;
  var ny = end.y + diff * 0.40;

  var linedata = [{
    x: start.x,
    y: start.y
  }, {
    x: start.x,
    y: ny
  }, {
    x: end.x,
    y: end.y
  }]

  var fun = d3.svg.line().x(d => d.x).y(d => d.y).interpolate("step-after");
  return fun(linedata);
}

// wrap text to fit within width
function wrap(text) {
  text.each(function() {
    var text = d3.select(this);
    var words = text.text().split(/\s+/).reverse();
    var lineHeight = 12;
    var width = parseFloat(text.attr('width'));
    var y = parseFloat(text.attr('y'));
    var x = text.attr('x');
    var anchor = text.attr('text-anchor');

    var tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('text-anchor', anchor);
    var lineNumber = 0;
    var line = [];
    var word = words.pop();

    while (word) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        lineNumber += 1;
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan').attr('x', x).attr('y', y + lineNumber * lineHeight).attr('anchor', anchor).text(word);
      }
      word = words.pop();
    }
  });
}

function findFitZoom(svg) {
  const paddingPercent = 0.9
  const bounds = svg.node().getBBox()
  const parent = svg.node().parentElement
  const fullWidth = parent.clientWidth
  const fullHeight = parent.clientHeight
  const width = bounds.width
  const height = bounds.height
  const midX = bounds.x + width / 2
  const midY = bounds.y + height / 2

  if (width == 0 || height == 0) return // nothing to fit

  const scale = (paddingPercent || 0.75) / Math.max(width / fullWidth, height / fullHeight)
  const translateX = fullWidth / 2 - scale * midX
  const translateY = fullHeight / 2 - scale * midY

  return { translateX, translateY, scale, fullWidth }
}

function zoomToFit(svg, zoom) {
  const { translateX, translateY, scale } = findFitZoom(svg)
  svg.transition().duration(500).attr("transform", `translate(${translateX},${translateY - 60}) scale(${scale})`)
  zoom
    .scale(scale)
    .translate([translateX, translateY - 60])
}

function centerRoot(svg, zoom) {
  const { translateX } = findFitZoom(svg)
  const scale = 0.9
  svg.transition().duration(500).attr("transform", `translate(${translateX},-60) scale(${scale})`)
  zoom
    .scale(scale)
    .translate([translateX, -60]);
}

function centerSelectedPerson(svg, zoom, allNodes) {
  const selectedPerson = allNodes.filter(n => !!n.selected)[0]
  
  if (selectedPerson) {
    const { fullWidth } = findFitZoom(svg)
    const scale = 0.9
    const x = fullWidth / 2 - scale * selectedPerson.x

    svg.attr("transform", `translate(${x},-60) scale(${scale})`);
    zoom
      .scale(scale)
      .translate([x, -60])
  } else {
    centerRoot(svg, zoom)
  }
}

export {
  buildTree,
  zoomToFit,
  centerRoot,
  centerSelectedPerson,
}
