/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine */ \"./src/engine.ts\");\n\nlet engine;\n// The main entry point of app\nwindow.onload = function () {\n    engine = new _engine__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    engine.loop();\n};\nwindow.onresize = function () {\n    engine.resize();\n};\n\n\n//# sourceURL=webpack:///./src/app.ts?");

/***/ }),

/***/ "./src/engine.ts":
/*!***********************!*\
  !*** ./src/engine.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Engine; });\n/* harmony import */ var _gl_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gl/gl */ \"./src/gl/gl.ts\");\n/* harmony import */ var _gl_shader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gl/shader */ \"./src/gl/shader.ts\");\n/* harmony import */ var _gl_glBuffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gl/glBuffer */ \"./src/gl/glBuffer.ts\");\n\n\n\n/** 中枢 */\nclass Engine {\n    /** メインループを開始する */\n    constructor() {\n        this._canvas = _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"GLUtilities\"].initialize();\n        _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].clearColor(0.5, 0, 0.6, 1);\n        this.loadShaders();\n        this._shader.use();\n        this.createBuffer();\n        this.resize();\n        this.loop();\n    }\n    /** 画面のリサイズに対応する */\n    resize() {\n        if (this._canvas !== undefined) {\n            this._canvas.width = window.innerWidth;\n            this._canvas.height = window.innerHeight;\n            _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].viewport(0, 0, this._canvas.width, this._canvas.height);\n        }\n    }\n    // javascript is single-threaded, and for inifinite loop, we need an event based loop.\n    /** main loop */\n    loop() {\n        _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].clear(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].COLOR_BUFFER_BIT);\n        // set uniforms\n        const colorPosition = this._shader.getUniformLocation('u_color');\n        _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].uniform4f(colorPosition, 1, 0.5, 0, 1);\n        this._buffer.bind();\n        this._buffer.draw();\n        requestAnimationFrame(this.loop.bind(this));\n    }\n    createBuffer() {\n        this._buffer = new _gl_glBuffer__WEBPACK_IMPORTED_MODULE_2__[\"GLBuffer\"](3);\n        const positionAttribute = new _gl_glBuffer__WEBPACK_IMPORTED_MODULE_2__[\"AttrInfo\"]();\n        positionAttribute.location = this._shader.getAttributeLocation('position');\n        positionAttribute.offset = 0;\n        positionAttribute.size = 3;\n        this._buffer.addAttributeLocation(positionAttribute);\n        const vertices = [\n            // x, y, z\n            0,\n            0,\n            0,\n            0,\n            0.5,\n            0,\n            0.5,\n            0.5,\n            0,\n            0.5,\n            0.5,\n            0,\n            0.5,\n            0,\n            0,\n            0,\n            0,\n            0,\n        ];\n        this._buffer.pushBackData(vertices);\n        this._buffer.upload();\n        console.log(this._buffer);\n        this._buffer.unbind();\n    }\n    loadShaders() {\n        const vertexShaderSource = `\nattribute vec3 position;\nuniform   mat4 mvpMatrix;\nvoid main() {\n    gl_Position =  vec4(position, 1.0);\n}`;\n        const fragmentShaderSource = `\nprecision mediump float;\n\nuniform vec4 u_color;\nvoid main() {\n    gl_FragColor = u_color;\n}`;\n        this._shader = new _gl_shader__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('basic', vertexShaderSource, fragmentShaderSource);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/engine.ts?");

/***/ }),

/***/ "./src/gl/gl.ts":
/*!**********************!*\
  !*** ./src/gl/gl.ts ***!
  \**********************/
/*! exports provided: gl, GLUtilities */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"gl\", function() { return gl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GLUtilities\", function() { return GLUtilities; });\n/** WebGL rendering  */\nvar gl;\n/** Responsible for setting up a WebGL rendering context. */\nclass GLUtilities {\n    /**\n     * Initializes WebGL, potentially using the canvas with an assigned id\n     * @param elementId The id for the element to search for\n     */\n    static initialize() {\n        const canvas = document.createElement('canvas');\n        let content = document.getElementById('content');\n        content.appendChild(canvas);\n        // document.body.appendChild(canvas)\n        gl = canvas.getContext('webgl', { stencil: true });\n        if (gl === undefined) {\n            throw new Error('Unable to initialize WebGL!!!');\n        }\n        return canvas;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/gl/gl.ts?");

/***/ }),

/***/ "./src/gl/glBuffer.ts":
/*!****************************!*\
  !*** ./src/gl/glBuffer.ts ***!
  \****************************/
/*! exports provided: AttrInfo, GLBuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AttrInfo\", function() { return AttrInfo; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GLBuffer\", function() { return GLBuffer; });\n/* harmony import */ var gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl */ \"./src/gl/gl.ts\");\n\n/**\n * Represent the information needed for a GLBuffer attributes\n * */\nclass AttrInfo {\n}\n/**\n * Represents a WebGL buffer\n * */\nclass GLBuffer {\n    /**\n     * Creates a WebGL buffer.\n     * @param elementSize The size of each element in this buffer\n     * @param dataType The data type of this buffer. Default: gl.FLOAT\n     * @param targetBufferType The buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. Default: gl.ARRAY_BUFFER\n     * @param mode The drawing mode of this buffer. (i.e. gl.TRIANGLES or gl.LINES). Default: gl.TRIANGLES\n     */\n    constructor(elementSize, dataType = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FLOAT, targetBufferType = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ARRAY_BUFFER, mode = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TRIANGLES) {\n        this._hasAttributeLocation = false;\n        this._data = [];\n        this._attributes = [];\n        this._elementSize = elementSize;\n        this._dataType = dataType;\n        this._targetBufferType = targetBufferType;\n        this._mode = mode;\n        // Determine byte size\n        switch (this._dataType) {\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FLOAT:\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].INT:\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_INT:\n                this._typeSize = 4;\n                break;\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].SHORT:\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_SHORT:\n                this._typeSize = 2;\n                break;\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].BYTE:\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_BYTE:\n                this._typeSize = 1;\n                break;\n            default:\n                throw new Error('Unrecognized data type: ' + dataType.toString());\n        }\n        this._stride = this._elementSize * this._typeSize;\n        this._buffer = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createBuffer();\n    }\n    destroy() {\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].deleteBuffer(this._buffer);\n    }\n    /**\n     * Bind buffer\n     * @param normalized Indicates if the data should be normalized.\n     */\n    bind(normalized = false) {\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(this._targetBufferType, this._buffer);\n        if (this._hasAttributeLocation) {\n            for (const itr of this._attributes) {\n                gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].vertexAttribPointer(itr.location, itr.size, this._dataType, normalized, this._stride, itr.offset * this._dataType);\n                gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].enableVertexAttribArray(itr.location);\n            }\n        }\n    }\n    /**\n     * Unbind this buffer.\n     * */\n    unbind() {\n        for (const itr of this._attributes) {\n            gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].disableVertexAttribArray(itr.location);\n        }\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ARRAY_BUFFER, undefined);\n    }\n    /**\n     * Adds ab attribute with the provided information to this buffer.\n     * @param info\n     */\n    addAttributeLocation(info) {\n        this._hasAttributeLocation = true;\n        this._attributes.push(info);\n    }\n    /**\n     * Adds data to this buffer.\n     *\n     * @param data\n     */\n    pushBackData(data) {\n        for (const d of data) {\n            this._data.push(d);\n        }\n    }\n    // データ追加は何回もするかもしれんが、GPUへのデータuploadは一回なので、分離する。\n    /**\n     * Uploads this buffer's data to the GPU.\n     * */\n    upload() {\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(this._targetBufferType, this._buffer);\n        // ArrabufferView: Float32ArrayとかFloat64Arrayとかの上位種->抽象化可能\n        let bufferData;\n        switch (this._dataType) {\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FLOAT:\n                bufferData = new Float32Array(this._data);\n                break;\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].INT:\n                bufferData = new Int32Array(this._data);\n                break;\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_INT:\n                bufferData = new Uint32Array(this._data);\n                break;\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].SHORT:\n                bufferData = new Int16Array(this._data);\n                break;\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_SHORT:\n                bufferData = new Uint16Array(this._data);\n                break;\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].BYTE:\n                bufferData = new Int8Array(this._data);\n                break;\n            case gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_BYTE:\n                bufferData = new Uint8Array(this._data);\n                break;\n        }\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bufferData(this._targetBufferType, bufferData, gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].STATIC_DRAW);\n    }\n    /**\n     * Draws this buffer\n     * */\n    draw() {\n        if (this._targetBufferType === gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ARRAY_BUFFER) {\n            gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].drawArrays(this._mode, 0, this._data.length / this._elementSize);\n        }\n        else if (this._targetBufferType === gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ELEMENT_ARRAY_BUFFER) {\n            gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].drawElements(this._mode, this._data.length, this._dataType, 0);\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/gl/glBuffer.ts?");

/***/ }),

/***/ "./src/gl/shader.ts":
/*!**************************!*\
  !*** ./src/gl/shader.ts ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Shader; });\n/* harmony import */ var gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl */ \"./src/gl/gl.ts\");\n\n/**\n * Represents a WebGL shader.\n * */\nclass Shader {\n    /**\n     * Creates a new shader.\n     * @param name The name of shader.\n     * @param vertexSource The source of the vertex shader.\n     * @param fragmentSource The source of the fragment shader.\n     */\n    constructor(name, vertexSource, fragmentSource) {\n        this._attributes = {};\n        this._uniforms = {};\n        this._name = name;\n        const vertexShader = this.loadShader(vertexSource, gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].VERTEX_SHADER);\n        const fragmentShader = this.loadShader(fragmentSource, gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAGMENT_SHADER);\n        this.createProgram(vertexShader, fragmentShader);\n        this.detectAttributes();\n        this.detectUniforms();\n    }\n    /** The name of this shader */\n    get name() {\n        return this._name;\n    }\n    /**\n     * Use this shader\n     * */\n    use() {\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].useProgram(this._program);\n    }\n    /**\n     * Get the location of an attribute with the provided name.\n     * @param name The name of attribute\n     */\n    getAttributeLocation(name) {\n        if (this._attributes[name] === undefined) {\n            throw new Error(`Unable to find attribute named '${name}' in shader named '${this._name}`);\n        }\n        return this._attributes[name];\n    }\n    /**\n     * Get the location of an uniform with the provided name.\n     * @param name The name of uniform\n     */\n    getUniformLocation(name) {\n        if (this._uniforms[name] === undefined) {\n            throw new Error(`Unable to find uniform named '${name}' in shader named '${this._name}`);\n        }\n        return this._uniforms[name];\n    }\n    loadShader(source, shaderType) {\n        const shader = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createShader(shaderType);\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].shaderSource(shader, source);\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].compileShader(shader);\n        const error = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getShaderInfoLog(shader);\n        if (error !== '') {\n            throw new Error(\"Error compiling shader: '\" + this._name + \"': \" + error);\n        }\n        return shader;\n    }\n    createProgram(vertexShader, fragmentShader) {\n        this._program = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createProgram();\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].attachShader(this._program, vertexShader);\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].attachShader(this._program, fragmentShader);\n        gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].linkProgram(this._program);\n        const error = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getProgramInfoLog(this._program);\n        if (error !== '') {\n            throw new Error(\"Error linking shader: '\" + this._name + \"': \" + error);\n        }\n    }\n    detectAttributes() {\n        const attributeCount = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getProgramParameter(this._program, gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ACTIVE_ATTRIBUTES);\n        for (let i = 0; i < attributeCount; ++i) {\n            const attributeInfo = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getActiveAttrib(this._program, i);\n            if (!attributeInfo) {\n                break;\n            }\n            this._attributes[attributeInfo.name] = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getAttribLocation(this._program, attributeInfo.name);\n        }\n    }\n    detectUniforms() {\n        const uniformCount = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getProgramParameter(this._program, gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ACTIVE_UNIFORMS);\n        for (let i = 0; i < uniformCount; ++i) {\n            const uniformInfo = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getActiveUniform(this._program, i);\n            if (!uniformInfo) {\n                break;\n            }\n            this._uniforms[uniformInfo.name] = gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getUniformLocation(this._program, uniformInfo.name);\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/gl/shader.ts?");

/***/ })

/******/ });