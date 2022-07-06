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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/glsl-renderer.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/shaderUtil.ts":
/*!***************************!*\
  !*** ./lib/shaderUtil.ts ***!
  \***************************/
/*! exports provided: ShaderType, createShader, createProgram, createVbo, setAttribute, createIbo, createFramebuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ShaderType\", function() { return ShaderType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createShader\", function() { return createShader; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createProgram\", function() { return createProgram; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createVbo\", function() { return createVbo; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAttribute\", function() { return setAttribute; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createIbo\", function() { return createIbo; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createFramebuffer\", function() { return createFramebuffer; });\n/* harmony import */ var _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/gl/gl */ \"./src/gl/gl.ts\");\n\nvar ShaderType;\n(function (ShaderType) {\n    ShaderType[ShaderType[\"vertex\"] = 0] = \"vertex\";\n    ShaderType[ShaderType[\"fragment\"] = 1] = \"fragment\";\n})(ShaderType || (ShaderType = {}));\nconst createShader = (shaderType, shaderText) => {\n    const glType = shaderType === ShaderType.vertex ? _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].VERTEX_SHADER : _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAGMENT_SHADER;\n    const shader = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createShader(glType);\n    // vert or fragでシェーダの受け皿を作る？\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].shaderSource(shader, shaderText);\n    // sourceの割り当て、shader programのロードかな？\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].compileShader(shader);\n    // コンパイル、vertもfragも同じ関数でできる。\n    return _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getShaderParameter(shader, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].COMPILE_STATUS) ? shader : alert(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getShaderInfoLog(shader));\n};\n// programオブジェクト---varyingではvertからfragに値を渡すよね？それをやってくれるやつ。\nconst createProgram = (vs, fs) => {\n    const program = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createProgram();\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].attachShader(program, vs);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].attachShader(program, fs);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].linkProgram(program);\n    // shaderのリンクが正しく行われたか✓\n    if (!_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getProgramParameter(program, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].LINK_STATUS))\n        return alert(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getProgramInfoLog(program));\n    // use programするとどこに何がロードされるんだろうか。\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].useProgram(program);\n    return program;\n};\nconst createVbo = (data) => {\n    // バッファを操作する場合は、まずバッファをWebGLにバインドする。\n    const vbo = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createBuffer();\n    // バインド\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ARRAY_BUFFER, vbo);\n    // バッファにデータをセット\n    // STATIC_DRAW: このバッファがどのような頻度で内容を更新されるか\n    // VBOの場合はモデルデータはそのままで何度も利用することになる。\n    // のでSTATIC_DRAW?\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bufferData(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ARRAY_BUFFER, new Float32Array(data), _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].STATIC_DRAW);\n    // バインド解除\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ARRAY_BUFFER, null);\n    return vbo;\n};\nconst setAttribute = (vbo, attributeLocation, attributeStride, ibo) => {\n    for (let i in vbo) {\n        _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ARRAY_BUFFER, vbo[i]); // VBOをバインド\n        _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].enableVertexAttribArray(attributeLocation[i]); // attribute属性を有効に\n        _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].vertexAttribPointer(attributeLocation[i], attributeStride[i], _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FLOAT, false, 0, 0); // attribute属性を登録\n    }\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ELEMENT_ARRAY_BUFFER, ibo);\n};\nconst createIbo = (data) => {\n    const ibo = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createBuffer();\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ELEMENT_ARRAY_BUFFER, ibo);\n    // インデックスなのでint16\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bufferData(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ELEMENT_ARRAY_BUFFER, new Int16Array(data), _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].STATIC_DRAW);\n    // バインド解除って、　つまりここまではCPU上とGPU上がつながっている？\n    // iboはGPU上の参照を返す？\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindBuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].ELEMENT_ARRAY_BUFFER, null);\n    return ibo;\n};\n// あえてフレームバッファのサイズを個別に変数として保持しているのは、後々、座標変換行列を生成する際にアスペクト比などを指定する処理に利用するためです。\n// フレームバッファをオブジェクトとして生成する関数\nfunction createFramebuffer(width, height) {\n    // フレームバッファの生成\n    var frameBuffer = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createFramebuffer();\n    // フレームバッファをWebGLにバインド\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindFramebuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAMEBUFFER, frameBuffer);\n    // 深度バッファ用レンダーバッファの生成とバインド\n    var depthRenderBuffer = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createRenderbuffer();\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindRenderbuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RENDERBUFFER, depthRenderBuffer);\n    // レンダーバッファを深度バッファとして設定\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].renderbufferStorage(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RENDERBUFFER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].DEPTH_COMPONENT16, width, height);\n    // フレームバッファにレンダーバッファを関連付ける\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].framebufferRenderbuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAMEBUFFER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].DEPTH_ATTACHMENT, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RENDERBUFFER, depthRenderBuffer);\n    // フレームバッファ用テクスチャの生成\n    var fTexture = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createTexture();\n    // フレームバッファ用のテクスチャをバインド\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindTexture(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_2D, fTexture);\n    // フレームバッファ用のテクスチャにカラー用のメモリ領域を確保\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].texImage2D(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_2D, 0, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RGBA, width, height, 0, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RGBA, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_BYTE, null);\n    // テクスチャパラメータ\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].texParameteri(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_2D, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_MAG_FILTER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].LINEAR);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].texParameteri(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_2D, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_MIN_FILTER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].LINEAR);\n    // フレームバッファにテクスチャを関連付ける\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].framebufferTexture2D(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAMEBUFFER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].COLOR_ATTACHMENT0, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_2D, fTexture, 0);\n    // 各種オブジェクトのバインドを解除\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindTexture(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_2D, null);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindRenderbuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RENDERBUFFER, null);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindFramebuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAMEBUFFER, null);\n    // オブジェクトを返して終了\n    return { f: frameBuffer, d: depthRenderBuffer, t: fTexture };\n}\n// まだ理解してない \n// キューブマップをフレームバッファで作成する場合は、方向づけが必要\n// **二次元のテクスチャをフレームバッファにアタッチする場合には、この関数内部でテクスチャのアタッチまで行なっていました。\n// **しかしフレームバッファにキューブマップテクスチャをアタッチする場合には、実際にレンダリングが行なわれる段階でアタッチを行ないます。\n// フレームバッファをオブジェクトとして生成する関数(キューブマップ仕様)\nfunction createCubeFramebuffer(width, height, target) {\n    // フレームバッファの生成\n    var frameBuffer = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createFramebuffer();\n    // フレームバッファをWebGLにバインド\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindFramebuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAMEBUFFER, frameBuffer);\n    // 深度バッファ用レンダーバッファの生成とバインド\n    var depthRenderBuffer = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createRenderbuffer();\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindRenderbuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RENDERBUFFER, depthRenderBuffer);\n    // レンダーバッファを深度バッファとして設定\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].renderbufferStorage(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RENDERBUFFER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].DEPTH_COMPONENT16, width, height);\n    // フレームバッファにレンダーバッファを関連付ける\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].framebufferRenderbuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAMEBUFFER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].DEPTH_ATTACHMENT, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RENDERBUFFER, depthRenderBuffer);\n    // フレームバッファ用テクスチャの生成\n    var fTexture = _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].createTexture();\n    // フレームバッファ用のテクスチャをキューブマップテクスチャとしてバインド\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindTexture(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_CUBE_MAP, fTexture);\n    // フレームバッファ用のテクスチャにカラー用のメモリ領域を 6 面分確保\n    for (var i = 0; i < target.length; i++) {\n        _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].texImage2D(target[i], 0, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RGBA, width, height, 0, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RGBA, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_BYTE, null);\n    }\n    // あとは実際にフレームバッファにレンダリングを行なう際に、どの面に対してのレンダリングなのかを明確に通知してアタッチしてやれば、動的なキューブマップの生成が行なえます。\n    // テクスチャパラメータ\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].texParameteri(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_CUBE_MAP, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_MAG_FILTER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].LINEAR);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].texParameteri(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_CUBE_MAP, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_MIN_FILTER, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].LINEAR);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].texParameteri(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_CUBE_MAP, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_WRAP_S, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].CLAMP_TO_EDGE);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].texParameteri(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_CUBE_MAP, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_WRAP_T, _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].CLAMP_TO_EDGE);\n    // 各種オブジェクトのバインドを解除\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindTexture(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_CUBE_MAP, null);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindRenderbuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].RENDERBUFFER, null);\n    _src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].bindFramebuffer(_src_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].FRAMEBUFFER, null);\n    // オブジェクトを返して終了\n    return { f: frameBuffer, d: depthRenderBuffer, t: fTexture };\n}\n\n\n//# sourceURL=webpack:///./lib/shaderUtil.ts?");

/***/ }),

/***/ "./shader/hanabi.frag":
/*!****************************!*\
  !*** ./shader/hanabi.frag ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"#ifdef GL_ES\\nprecision mediump float;\\n#endif\\n\\n#extension GL_OES_standard_derivatives : enable\\n#define GLSLIFY 1\\n\\nuniform float time;\\nuniform vec2 resolution;\\n\\n// \\\"[SH17A] Fireworks\\\" by Martijn Steinrucken aka BigWings/Countfrolic - 2017\\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\\n// Based on https://www.shadertoy.com/view/lscGRl\\n\\n#define N(h) fract(sin(vec4(6,9,1,0)*h) * 9e2)\\n\\nvoid main(void)\\n{\\n  vec4 o; \\n  vec2 u = gl_FragCoord.xy/resolution.y;\\n    \\n  float e, d, i=0.;\\n  vec4 p;\\n    \\n  for(float i=1.; i<30.; i++) {\\n    d = floor(e = i*9.1+time);\\n    p = N(d)+.3;\\n    e -= d;\\n    for(float d=0.; d<5.;d++)\\n      o += p*(2.0-e)/1e3/length(u-(p-e*(N(d*i)-.5)).xy);  \\n  }\\n\\t \\n  gl_FragColor = vec4(o.rgb, 1);\\n}\\n\");\n\n//# sourceURL=webpack:///./shader/hanabi.frag?");

/***/ }),

/***/ "./shader/passthrough.vert":
/*!*********************************!*\
  !*** ./shader/passthrough.vert ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"#define GLSLIFY 1\\nattribute vec3 position;\\n\\nvoid main(void) { gl_Position = vec4(position, 1.0); }\");\n\n//# sourceURL=webpack:///./shader/passthrough.vert?");

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

/***/ "./src/glsl-renderer.ts":
/*!******************************!*\
  !*** ./src/glsl-renderer.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gl_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gl/gl */ \"./src/gl/gl.ts\");\n/* harmony import */ var _shader_passthrough_vert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader/passthrough.vert */ \"./shader/passthrough.vert\");\n/* harmony import */ var _shader_hanabi_frag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shader/hanabi.frag */ \"./shader/hanabi.frag\");\n/* harmony import */ var _lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/shaderUtil */ \"./lib/shaderUtil.ts\");\n\n\n\n\n// 現状、onloadで出るべきところがべた書きになってり\nfunction mouseMove(e) {\n    const cw = canvas.width;\n    const ch = canvas.height;\n    mx = e.offsetX / cw;\n    my = e.offsetY / ch;\n}\nconst canvas = _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"GLUtilities\"].initialize();\ncanvas.addEventListener('mousemove', mouseMove, true);\n// setting\n// これらを動的に変更するにはJS的にはどうすればいいのだろう？\n// gl.enable(gl.CULL_FACE)\n_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].enable(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].DEPTH_TEST);\n_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].depthFunc(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].LEQUAL);\n_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].enable(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].STENCIL_TEST);\n// cULL: gl.CCW = face, DEPTH: gl.LEQUAL, STENCIL: WEBGLにstencil bufferを使うことを通知。コンテキスト生成時にstencilができている必要あり。\n// シェーダーの生成:\n// TODO: vs, psを同じファイルにまとめてエントリーポイントで指定できないか？\nconst vertShader = Object(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"createShader\"])(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"ShaderType\"].vertex, _shader_passthrough_vert__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\nconst fragShader = Object(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"createShader\"])(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"ShaderType\"].fragment, _shader_hanabi_frag__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\nconst program = Object(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"createProgram\"])(vertShader, fragShader);\nconst attLocation = [_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getAttribLocation(program, 'position')];\nconst attStride = [3];\nconst position = [-1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0];\nconst index = [0, 2, 1, 1, 2, 3];\nconst vbo = [Object(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"createVbo\"])(position)];\nconst ibo = Object(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"createIbo\"])(index);\nObject(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"setAttribute\"])(vbo, attLocation, attStride, ibo);\nconst uniformList = ['time', 'mouse', 'resolution'];\nconst uniformLocation = {};\nuniformList.forEach((s) => {\n    uniformLocation[s] = _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getUniformLocation(program, s);\n});\nconst fb = Object(_lib_shaderUtil__WEBPACK_IMPORTED_MODULE_3__[\"createFramebuffer\"])(256, 256);\nconsole.log(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].getParameter(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].MAX_COMBINED_TEXTURE_IMAGE_UNITS)); // 32でた\nconsole.log(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_2D, _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_CUBE_MAP_NEGATIVE_X, _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TEXTURE_CUBE_MAP_NEGATIVE_Y);\nlet mx = 0.5;\nlet my = 0.5;\nconst startTime = new Date().getTime();\nconst range = document.getElementById('alpha');\nconst type = document.getElementsByName('blend');\nfunction drawScene() {\n    const time = (new Date().getTime() - startTime) * 0.001;\n    // キャンバス初期化\n    {\n        _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].clearColor(0, 0, 0, 0); // canvas初期化の色\n        _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].clearDepth(1.0); // canvas初期化の深度\n        _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].clearStencil(0);\n        _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].clear(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].COLOR_BUFFER_BIT | _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].DEPTH_BUFFER_BIT | _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].STENCIL_BUFFER_BIT); // canvas初期化\n    }\n    _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].uniform1f(uniformLocation['time'], time);\n    _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].uniform2f(uniformLocation['mouse'], mx, my);\n    _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].uniform2f(uniformLocation['resolution'], canvas.width, canvas.height);\n    _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].drawElements(_gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].TRIANGLES, 6, _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].UNSIGNED_SHORT, 0);\n    _gl_gl__WEBPACK_IMPORTED_MODULE_0__[\"gl\"].flush();\n    setTimeout(drawScene, 1000 / 30);\n}\ndrawScene();\n\n\n//# sourceURL=webpack:///./src/glsl-renderer.ts?");

/***/ })

/******/ });