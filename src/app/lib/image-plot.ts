import * as d3 from 'd3';
import * as THREE from 'three';

import ImageHistogram from './image-histogram';

export default class ImagePlot {
  imageWidth = 2048;
  imageHeight = 2048;
  imageArray;

  margin = {
    top: 10,
    right: 10,
    bottom: 30,
    left: 60
  };

  histogramWidth = 150;
  #canvasWidth = 600;
  #canvasHeight = 400;

  fixedAspectRatio = true;

  rootSVG;
  SVG;
  x;
  xAxis;
  y;
  yAxis;

  plane;

  mouseX;
  mouseY;

  #histogram;
  #clip;
  #canvas;
  #canvasContext;
  #webGlCanvas;
  #foreignObject; // used to embed for the webgl Canvas
  #scene;
  #camera;
  #renderer;
  #imageGeometry;
  #imageTexture;
  #imageMaterial;
  #brush;
  #brushLayer;
  #brushContext;

  get width(): number {
    return (
      this.canvasWidth +
      this.margin.left +
      this.margin.right +
      this.histogramWidth
    );
  }

  set width(newWidth) {
    this.#canvasWidth =
      newWidth - this.margin.left - this.margin.right - this.histogramWidth;
  }

  get height(): number {
    return this.canvasHeight + this.margin.top + this.margin.bottom;
  }

  set height(newHeight) {
    this.#canvasHeight = newHeight - this.margin.top - this.margin.bottom;
  }

  get canvasWidth(): number {
    if (this.fixedAspectRatio) {
      if (this.#canvasWidth > this.#canvasHeight) {
        // noinspection JSSuspiciousNameCombination
        return this.#canvasHeight;
      }
    }
    return this.#canvasWidth;
  }

  get canvasHeight(): number {
    if (this.fixedAspectRatio) {
      if (this.#canvasHeight > this.#canvasWidth) {
        // noinspection JSSuspiciousNameCombination
        return this.#canvasWidth;
      }
    }
    return this.#canvasHeight;
  }

  constructor(selector, width = 600, height = 400, fixedAspectRatio = true) {
    this.fixedAspectRatio = fixedAspectRatio;
    this.width = width;
    this.height = height;

    this._initImagePlot(selector);
    this._initHistogram(selector);
  }

  plotImage(imageArray, width, height): void {
    let updateDomain = false;
    if (width !== this.imageWidth || height !== this.imageHeight) {
      updateDomain = true;
    }
    this.imageArray = imageArray;
    this.imageWidth = width;
    this.imageHeight = height;

    this.#histogram.updateImage(imageArray);
    const colorImageArray = this.#histogram.calcColorImage(imageArray);

    this._updateTexture(colorImageArray, width, height);
    if (updateDomain) {
      this._updateDomain(0, this.imageWidth, 0, this.imageHeight);
    }
    this._update();
  }

  zoom(factor): void {
    const currentWidth = this.x.domain()[1] - this.x.domain()[0];
    const currentHeight = this.y.domain()[1] - this.y.domain()[0];
    const mouseXFrac = (this.mouseX - this.x.domain()[0]) / currentWidth;
    const mouseYFrac = (this.mouseY - this.y.domain()[0]) / currentHeight;
    const newLeft = this.x.domain()[0] - mouseXFrac * currentWidth * factor;
    const newRight = this.x.domain()[1] + (1 - mouseXFrac) * currentWidth * factor;
    const newBottom = this.y.domain()[0] - mouseYFrac * currentHeight * factor;
    const newTop = this.y.domain()[1] + (1 - mouseYFrac) * currentHeight * factor;
    this._updateDomain(newLeft, newRight, newBottom, newTop);
    this._update();
  }

  _initImagePlot(selector): void {
    this._initSVG(selector);
    this._initAxes();
    this._initImage();
    this._initClip();
    this._initBrush();
    this._initMousePosition();
    this._initWheel();
    this._initRightClickBehavior();
  }

  _initHistogram(selector, width = 400): void {
    this.#histogram = new ImageHistogram(selector, width, this.height, 'vertical');
    this.#histogram.rangeChanged.subscribe(() => {
      updateRange();
    });

    let inProgress = false;
    let timeout;

    const updateRange = () => {
      if (inProgress) {
        clearTimeout(timeout);
        timeout = setTimeout(() => updateRange(), 50);
        return;
      }
      inProgress = true;
      const colorImageArray = this.#histogram.calcColorImage(this.imageArray);
      this._updateTexture(colorImageArray, this.imageWidth, this.imageHeight);
      setTimeout(() => (inProgress = false), 10);
    };
  }

  _initSVG(selector): void {
    this.rootSVG = d3
      .select(selector)
      .append('svg')
      .attr('width', this.canvasWidth + this.margin.left + this.margin.right)
      .attr('height', this.canvasHeight + this.margin.top + this.margin.bottom);

    this.SVG = this.rootSVG
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .on('contextmenu', () => {
        d3.event.preventDefault();
      });
  }

  _initAxes(): void {
    this.x = d3
      .scaleLinear()
      .domain([0, this.imageWidth])
      .range([0, this.canvasWidth]);

    this.xAxis = this.SVG.append('g')
      .attr('transform', 'translate(0, ' + this.canvasHeight + ')')
      .call(d3.axisBottom(this.x));

    // add Y Axis
    this.y = d3
      .scaleLinear()
      .domain([0, this.imageHeight])
      .range([this.canvasHeight, 0]);

    this.yAxis = this.SVG.append('g').call(d3.axisLeft(this.y));
  }

  _initClip(): void {
    this.#clip = this.SVG.append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.canvasWidth)
      .attr('height', this.canvasHeight);
  }

  _initImage(): void {
    this._initCanvas();
    this._initTHREE();
  }

  _initCanvas(): void {
    this.#foreignObject = this.SVG.append('foreignObject')
      .attr('clip-path', 'url(#clip)')
      .style('position', 'relative')
      .style('z-index', '-1')
      .attr('id', 'foreignObject')
      .attr('width', this.canvasWidth)
      .attr('height', this.canvasHeight)
      .attr('x', 0)
      .attr('y', 0);

    this.#webGlCanvas = this.#foreignObject
      .append('xhtml:canvas')
      .attr('id', 'webglCanvas')
      .attr('ref', 'webglCanvas')
      .attr('width', this.canvasWidth)
      .attr('height', this.canvasHeight)
      .attr('x', 0)
      .attr('y', 0);

    this.#canvas = document.getElementById('webglCanvas');
    this.#canvasContext = this.#canvas.getContext('webgl');
  }

  _initTHREE(): void {
    this.#scene = new THREE.Scene();
    this.#camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 100000);
    this.#camera.position.z = 10000;
    this.#renderer = new THREE.WebGLRenderer({canvas: this.#canvas});
    // this.#renderer.setClearColor(new THREE.Color("rgb(0,0,0)"));
    // this.#renderer = new THREE.WebGLRenderer();
    // this.#renderer.setSize(this.width, this.height);
    // document
    //   .getElementById("foreignObject")
    //   .appendChild(this.#renderer.domElement);

    this._initImagePlane();
    this.#renderer.render(this.#scene, this.#camera);
  }

  _initImagePlane(): void {
    this.#imageGeometry = new THREE.PlaneGeometry(1, 1);
    this.#imageTexture = new THREE.DataTexture(
      new Uint8Array([0, 0, 0]),
      1,
      1,
      THREE.RGBFormat
    );
    this.#imageMaterial = new THREE.MeshBasicMaterial({
      map: this.#imageTexture
    });
    const plane = new THREE.Mesh(this.#imageGeometry, this.#imageMaterial);
    plane.position.x = 0.5;
    plane.position.y = 0.5;
    this.plane = plane;
    this.#scene.add(plane);
  }

  _initBrush(): void {
    this.#brushContext = this.SVG.append('g')
      .attr('id', 'brushContext')
      .attr('class', 'brushContext');

    const updateChartBrush = () => {
      const extent = d3.event.selection;
      if (extent) {
        this._updateDomain(
          this.x.invert(extent[0][0]),
          this.x.invert(extent[1][0]),
          this.y.invert(extent[1][1]),
          this.y.invert(extent[0][1])
        );
        this.#brushContext.select('.brush').call(this.#brush.move, null); // this removes the grey brush area as soon as
        // the selection has been done
      }
      this._update();
    };

    // add brushing
    this.#brush = d3
      .brush()
      .extent([
        [0, 0],
        [this.canvasWidth, this.canvasHeight]
      ])
      .on('end', updateChartBrush);

    this.#brushLayer = this.#brushContext
      .append('g')
      .attr('class', 'brush')
      .call(this.#brush);
  }

  _initMousePosition(): void {
    const updateMousePosition = () => {
      const left = this.x.domain()[0];
      const right = this.x.domain()[1];
      const bottom = this.y.domain()[0];
      const top = this.y.domain()[1];

      const currentWidth = right - left;
      const currentHeight = Math.abs(top - bottom);

      const brushContext = document.getElementById('brushContext');
      const boundingRect = brushContext.getBoundingClientRect();

      this.mouseX =
        left +
        ((d3.event.x - boundingRect.left) / boundingRect.width) * currentWidth;
      this.mouseY =
        bottom +
        ((boundingRect.height - (d3.event.y - boundingRect.top)) /
          boundingRect.height) *
        currentHeight;
    };

    this.#brushContext.on('mousemove', updateMousePosition);
  }

  _initWheel(): void {
    const wheelUpdate = () => {
      const left = this.x.domain()[0];
      const right = this.x.domain()[1];
      const bottom = this.y.domain()[0];
      const top = this.y.domain()[1];

      const currentWidth = Math.abs(right - left);
      const currentHeight = Math.abs(bottom - top);

      const brushContext = document.getElementById('brushContext');
      const boundingRect = brushContext.getBoundingClientRect();

      const mouseX =
        left +
        ((d3.event.x - boundingRect.left) / boundingRect.width) * currentWidth;
      const mouseY =
        bottom +
        ((boundingRect.height - (d3.event.y - boundingRect.top)) /
          boundingRect.height) *
        currentHeight;

      const factor = -d3.event.deltaY / 1000;

      const newLeft = left + (mouseX - left) * factor;
      const newRight = right - (right - mouseX) * factor;
      const newBottom = bottom + (mouseY - bottom) * factor;
      const newTop = top - (top - mouseY) * factor;

      this._updateDomain(newLeft, newRight, newBottom, newTop);
      this._update();
    };

    this.#brushContext.on('wheel', wheelUpdate);
  }

  _initRightClickBehavior(): void {
    let dragMouseStartX;
    let dragMouseStartY;
    let domainXDragStart;
    let domainYDragStart;
    let dragging = false;

    const rightDragStart = () => {
      const event = d3.event;
      if (event.button === 2) {
        // only for right click
        if (event.detail === 1) {
          // only for single click
          const brushContext = document.getElementById('brushContext');
          dragMouseStartX = this.mouseX;
          dragMouseStartY = this.mouseY;
          domainXDragStart = this.x.domain();
          domainYDragStart = this.y.domain();
          brushContext.addEventListener('mousemove', rightDragMove);
        } // only for single clicks
      }
    };

    let lastUpdate = Date.now();
    const fps = 30;
    const frameTime = 1000 / fps;

    const rightDragMove = event => {
      dragging = true;

      if (Date.now() - lastUpdate < frameTime) {
        return;
      }

      const left = domainXDragStart[0];
      const right = domainXDragStart[1];
      const bottom = domainYDragStart[0];
      const top = domainYDragStart[1];

      const currentWidth = right - left;
      const currentHeight = Math.abs(top - bottom);

      const brushContext = document.getElementById('brushContext');
      const boundingRect = brushContext.getBoundingClientRect();

      const mouseX =
        left +
        ((event.x - boundingRect.left) / boundingRect.width) * currentWidth;
      const mouseY =
        bottom +
        ((boundingRect.height - (event.y - boundingRect.top)) /
          boundingRect.height) *
        currentHeight;

      const deltaX = mouseX - dragMouseStartX;
      const deltaY = mouseY - dragMouseStartY;

      this._updateDomain(
        left - deltaX,
        right - deltaX,
        bottom - deltaY,
        top - deltaY
      );
      this._update(0);

      lastUpdate = Date.now();
    };

    const rightDragStop = () => {
      const event = d3.event;
      if (event.button === 2) {
        // only for right click
        if (!dragging) {
          if (event.detail === 1) {
            // single click
            this.zoom(1.7);
          } else {
            // double click
            this._updateDomain(0, this.imageWidth, 0, this.imageHeight);
            this._update();
          }
        }
        const brushContext = document.getElementById('brushContext');
        brushContext.removeEventListener('mousemove', rightDragMove);
      }
      dragging = false;
    };

    this.#brushContext.on('mousedown', rightDragStart);
    this.#brushContext.on('mouseup', rightDragStop);
  }

  _updateDomain(left, right, bottom, top): void {
    if (this.fixedAspectRatio) {
      const width = right - left;
      const height = top - bottom;

      if (width < height) {
        const centerX = left + width / 2;
        left = centerX - height / 2;
        right = centerX + height / 2;
      } else {
        const centerY = bottom + height / 2;
        bottom = centerY - width / 2;
        top = centerY + width / 2;
      }
    }
    this.x.domain([left, right]);
    this.y.domain([bottom, top]);
  }

  _update(duration = 500): void {
    this._updateAxes(duration);
    this._updateCamera();
    // this.updateData();
  }

  _updateAxes(duration = 400): void {
    this.xAxis
      .transition()
      .duration(duration)
      .call(d3.axisBottom(this.x));
    this.yAxis
      .transition()
      .duration(duration)
      .call(d3.axisLeft(this.y));
  }

  _updateCamera(): void {
    const left = this.x.domain()[0];
    const right = this.x.domain()[1];
    const bottom = this.y.domain()[0];
    const top = this.y.domain()[1];

    this.#camera.left = left / this.imageWidth;
    this.#camera.right = right / this.imageWidth;
    this.#camera.bottom = bottom / this.imageHeight;
    this.#camera.top = top / this.imageHeight;

    this.#camera.updateProjectionMatrix();
    this.#renderer.render(this.#scene, this.#camera);
  }

  _updateTexture(imageArray, width, height): void {
    this.#imageTexture.dispose();
    this.#imageTexture = new THREE.DataTexture(
      imageArray,
      width,
      height,
      THREE.RGBFormat
    );
    this.#imageMaterial.map = this.#imageTexture;
    this.#renderer.render(this.#scene, this.#camera);
  }

  resize(width, height): void {
    this.width = width;
    this.height = height;

    this.rootSVG
      .attr('width', this.canvasWidth + this.margin.left + this.margin.right)
      .attr('height', this.canvasHeight + this.margin.top + this.margin.bottom);

    this.x.range([0, this.canvasWidth]);
    this.xAxis.attr('transform', 'translate(0, ' + this.canvasHeight + ')');
    this.y.range([this.canvasHeight, 0]);

    this._updateAxes(0);

    this.#clip
      .attr('width', this.canvasWidth)
      .attr('height', this.canvasHeight);

    this.#foreignObject
      .attr('width', this.canvasWidth)
      .attr('height', this.canvasHeight);

    this.#webGlCanvas
      .attr('width', this.canvasWidth)
      .attr('height', this.canvasHeight);

    this.#renderer.setSize(this.canvasWidth, this.canvasHeight);

    this.#brush.extent([
      [0, 0],
      [this.canvasWidth, this.canvasHeight]
    ]);
    this.#brushLayer.call(this.#brush);

    this.#histogram.resize(this.histogramWidth, height);

    this.plotImage(this.imageArray, this.imageWidth, this.imageHeight);
  }
}
