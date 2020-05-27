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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/matrix.ts":
/*!***********************!*\
  !*** ./lib/matrix.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// ------------------------------------------------------------------------------------------------\r\n// minMatrix.js\r\n// version 0.0.1\r\n// Copyright (c) doxas\r\n// ------------------------------------------------------------------------------------------------\r\nfunction matIV() {\r\n    this.create = function () {\r\n        return new Float32Array(16);\r\n    };\r\n    this.identity = function (dest) {\r\n        dest[0] = 1;\r\n        dest[1] = 0;\r\n        dest[2] = 0;\r\n        dest[3] = 0;\r\n        dest[4] = 0;\r\n        dest[5] = 1;\r\n        dest[6] = 0;\r\n        dest[7] = 0;\r\n        dest[8] = 0;\r\n        dest[9] = 0;\r\n        dest[10] = 1;\r\n        dest[11] = 0;\r\n        dest[12] = 0;\r\n        dest[13] = 0;\r\n        dest[14] = 0;\r\n        dest[15] = 1;\r\n        return dest;\r\n    };\r\n    this.multiply = function (mat1, mat2, dest) {\r\n        const a = mat1[0], b = mat1[1], c = mat1[2], d = mat1[3], e = mat1[4], f = mat1[5], g = mat1[6], h = mat1[7], i = mat1[8], j = mat1[9], k = mat1[10], l = mat1[11], m = mat1[12], n = mat1[13], o = mat1[14], p = mat1[15], A = mat2[0], B = mat2[1], C = mat2[2], D = mat2[3], E = mat2[4], F = mat2[5], G = mat2[6], H = mat2[7], I = mat2[8], J = mat2[9], K = mat2[10], L = mat2[11], M = mat2[12], N = mat2[13], O = mat2[14], P = mat2[15];\r\n        dest[0] = A * a + B * e + C * i + D * m;\r\n        dest[1] = A * b + B * f + C * j + D * n;\r\n        dest[2] = A * c + B * g + C * k + D * o;\r\n        dest[3] = A * d + B * h + C * l + D * p;\r\n        dest[4] = E * a + F * e + G * i + H * m;\r\n        dest[5] = E * b + F * f + G * j + H * n;\r\n        dest[6] = E * c + F * g + G * k + H * o;\r\n        dest[7] = E * d + F * h + G * l + H * p;\r\n        dest[8] = I * a + J * e + K * i + L * m;\r\n        dest[9] = I * b + J * f + K * j + L * n;\r\n        dest[10] = I * c + J * g + K * k + L * o;\r\n        dest[11] = I * d + J * h + K * l + L * p;\r\n        dest[12] = M * a + N * e + O * i + P * m;\r\n        dest[13] = M * b + N * f + O * j + P * n;\r\n        dest[14] = M * c + N * g + O * k + P * o;\r\n        dest[15] = M * d + N * h + O * l + P * p;\r\n        return dest;\r\n    };\r\n    this.scale = function (mat, vec, dest) {\r\n        dest[0] = mat[0] * vec[0];\r\n        dest[1] = mat[1] * vec[0];\r\n        dest[2] = mat[2] * vec[0];\r\n        dest[3] = mat[3] * vec[0];\r\n        dest[4] = mat[4] * vec[1];\r\n        dest[5] = mat[5] * vec[1];\r\n        dest[6] = mat[6] * vec[1];\r\n        dest[7] = mat[7] * vec[1];\r\n        dest[8] = mat[8] * vec[2];\r\n        dest[9] = mat[9] * vec[2];\r\n        dest[10] = mat[10] * vec[2];\r\n        dest[11] = mat[11] * vec[2];\r\n        dest[12] = mat[12];\r\n        dest[13] = mat[13];\r\n        dest[14] = mat[14];\r\n        dest[15] = mat[15];\r\n        return dest;\r\n    };\r\n    this.translate = function (mat, vec, dest) {\r\n        dest[0] = mat[0];\r\n        dest[1] = mat[1];\r\n        dest[2] = mat[2];\r\n        dest[3] = mat[3];\r\n        dest[4] = mat[4];\r\n        dest[5] = mat[5];\r\n        dest[6] = mat[6];\r\n        dest[7] = mat[7];\r\n        dest[8] = mat[8];\r\n        dest[9] = mat[9];\r\n        dest[10] = mat[10];\r\n        dest[11] = mat[11];\r\n        dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];\r\n        dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];\r\n        dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];\r\n        dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];\r\n        return dest;\r\n    };\r\n    this.rotate = function (mat, angle, axis, dest) {\r\n        let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);\r\n        if (!sq) {\r\n            return null;\r\n        }\r\n        let a = axis[0], b = axis[1], c = axis[2];\r\n        if (sq != 1) {\r\n            sq = 1 / sq;\r\n            a *= sq;\r\n            b *= sq;\r\n            c *= sq;\r\n        }\r\n        const d = Math.sin(angle), e = Math.cos(angle), f = 1 - e, g = mat[0], h = mat[1], i = mat[2], j = mat[3], k = mat[4], l = mat[5], m = mat[6], n = mat[7], o = mat[8], p = mat[9], q = mat[10], r = mat[11], s = a * a * f + e, t = b * a * f + c * d, u = c * a * f - b * d, v = a * b * f - c * d, w = b * b * f + e, x = c * b * f + a * d, y = a * c * f + b * d, z = b * c * f - a * d, A = c * c * f + e;\r\n        if (angle) {\r\n            if (mat != dest) {\r\n                dest[12] = mat[12];\r\n                dest[13] = mat[13];\r\n                dest[14] = mat[14];\r\n                dest[15] = mat[15];\r\n            }\r\n        }\r\n        else {\r\n            dest = mat;\r\n        }\r\n        dest[0] = g * s + k * t + o * u;\r\n        dest[1] = h * s + l * t + p * u;\r\n        dest[2] = i * s + m * t + q * u;\r\n        dest[3] = j * s + n * t + r * u;\r\n        dest[4] = g * v + k * w + o * x;\r\n        dest[5] = h * v + l * w + p * x;\r\n        dest[6] = i * v + m * w + q * x;\r\n        dest[7] = j * v + n * w + r * x;\r\n        dest[8] = g * y + k * z + o * A;\r\n        dest[9] = h * y + l * z + p * A;\r\n        dest[10] = i * y + m * z + q * A;\r\n        dest[11] = j * y + n * z + r * A;\r\n        return dest;\r\n    };\r\n    this.lookAt = function (eye, center, up, dest) {\r\n        const eyeX = eye[0], eyeY = eye[1], eyeZ = eye[2], upX = up[0], upY = up[1], upZ = up[2], centerX = center[0], centerY = center[1], centerZ = center[2];\r\n        if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {\r\n            return this.identity(dest);\r\n        }\r\n        let x0, x1, x2, y0, y1, y2, z0, z1, z2, l;\r\n        z0 = eyeX - center[0];\r\n        z1 = eyeY - center[1];\r\n        z2 = eyeZ - center[2];\r\n        l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);\r\n        z0 *= l;\r\n        z1 *= l;\r\n        z2 *= l;\r\n        x0 = upY * z2 - upZ * z1;\r\n        x1 = upZ * z0 - upX * z2;\r\n        x2 = upX * z1 - upY * z0;\r\n        l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);\r\n        if (!l) {\r\n            x0 = 0;\r\n            x1 = 0;\r\n            x2 = 0;\r\n        }\r\n        else {\r\n            l = 1 / l;\r\n            x0 *= l;\r\n            x1 *= l;\r\n            x2 *= l;\r\n        }\r\n        y0 = z1 * x2 - z2 * x1;\r\n        y1 = z2 * x0 - z0 * x2;\r\n        y2 = z0 * x1 - z1 * x0;\r\n        l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);\r\n        if (!l) {\r\n            y0 = 0;\r\n            y1 = 0;\r\n            y2 = 0;\r\n        }\r\n        else {\r\n            l = 1 / l;\r\n            y0 *= l;\r\n            y1 *= l;\r\n            y2 *= l;\r\n        }\r\n        dest[0] = x0;\r\n        dest[1] = y0;\r\n        dest[2] = z0;\r\n        dest[3] = 0;\r\n        dest[4] = x1;\r\n        dest[5] = y1;\r\n        dest[6] = z1;\r\n        dest[7] = 0;\r\n        dest[8] = x2;\r\n        dest[9] = y2;\r\n        dest[10] = z2;\r\n        dest[11] = 0;\r\n        dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);\r\n        dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);\r\n        dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);\r\n        dest[15] = 1;\r\n        return dest;\r\n    };\r\n    this.perspective = function (fovy, aspect, near, far, dest) {\r\n        const t = near * Math.tan((fovy * Math.PI) / 360);\r\n        const r = t * aspect;\r\n        const a = r * 2, b = t * 2, c = far - near;\r\n        dest[0] = (near * 2) / a;\r\n        dest[1] = 0;\r\n        dest[2] = 0;\r\n        dest[3] = 0;\r\n        dest[4] = 0;\r\n        dest[5] = (near * 2) / b;\r\n        dest[6] = 0;\r\n        dest[7] = 0;\r\n        dest[8] = 0;\r\n        dest[9] = 0;\r\n        dest[10] = -(far + near) / c;\r\n        dest[11] = -1;\r\n        dest[12] = 0;\r\n        dest[13] = 0;\r\n        dest[14] = -(far * near * 2) / c;\r\n        dest[15] = 0;\r\n        return dest;\r\n    };\r\n    this.transpose = function (mat, dest) {\r\n        dest[0] = mat[0];\r\n        dest[1] = mat[4];\r\n        dest[2] = mat[8];\r\n        dest[3] = mat[12];\r\n        dest[4] = mat[1];\r\n        dest[5] = mat[5];\r\n        dest[6] = mat[9];\r\n        dest[7] = mat[13];\r\n        dest[8] = mat[2];\r\n        dest[9] = mat[6];\r\n        dest[10] = mat[10];\r\n        dest[11] = mat[14];\r\n        dest[12] = mat[3];\r\n        dest[13] = mat[7];\r\n        dest[14] = mat[11];\r\n        dest[15] = mat[15];\r\n        return dest;\r\n    };\r\n    this.inverse = function (mat, dest) {\r\n        const a = mat[0], b = mat[1], c = mat[2], d = mat[3], e = mat[4], f = mat[5], g = mat[6], h = mat[7], i = mat[8], j = mat[9], k = mat[10], l = mat[11], m = mat[12], n = mat[13], o = mat[14], p = mat[15], q = a * f - b * e, r = a * g - c * e, s = a * h - d * e, t = b * g - c * f, u = b * h - d * f, v = c * h - d * g, w = i * n - j * m, x = i * o - k * m, y = i * p - l * m, z = j * o - k * n, A = j * p - l * n, B = k * p - l * o, ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);\r\n        dest[0] = (f * B - g * A + h * z) * ivd;\r\n        dest[1] = (-b * B + c * A - d * z) * ivd;\r\n        dest[2] = (n * v - o * u + p * t) * ivd;\r\n        dest[3] = (-j * v + k * u - l * t) * ivd;\r\n        dest[4] = (-e * B + g * y - h * x) * ivd;\r\n        dest[5] = (a * B - c * y + d * x) * ivd;\r\n        dest[6] = (-m * v + o * s - p * r) * ivd;\r\n        dest[7] = (i * v - k * s + l * r) * ivd;\r\n        dest[8] = (e * A - f * y + h * w) * ivd;\r\n        dest[9] = (-a * A + b * y - d * w) * ivd;\r\n        dest[10] = (m * u - n * s + p * q) * ivd;\r\n        dest[11] = (-i * u + j * s - l * q) * ivd;\r\n        dest[12] = (-e * z + f * x - g * w) * ivd;\r\n        dest[13] = (a * z - b * x + c * w) * ivd;\r\n        dest[14] = (-m * t + n * r - o * q) * ivd;\r\n        dest[15] = (i * t - j * r + k * q) * ivd;\r\n        return dest;\r\n    };\r\n}\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (matIV);\r\n\n\n//# sourceURL=webpack:///./lib/matrix.ts?");

/***/ }),

/***/ "./shader/shader.frag":
/*!****************************!*\
  !*** ./shader/shader.frag ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"#define GLSLIFY 1\\nvoid main (void) {\\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\\n}\");\n\n//# sourceURL=webpack:///./shader/shader.frag?");

/***/ }),

/***/ "./shader/shader.vert":
/*!****************************!*\
  !*** ./shader/shader.vert ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"#define GLSLIFY 1\\nattribute vec3 position;\\nuniform mat4 mvpMatrix;\\n\\nvoid main (void) {\\n    gl_Position = mvpMatrix * vec4(position, 1.0);\\n}\");\n\n//# sourceURL=webpack:///./shader/shader.vert?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shader_shader_frag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shader/shader.frag */ \"./shader/shader.frag\");\n/* harmony import */ var _shader_shader_vert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader/shader.vert */ \"./shader/shader.vert\");\n/* harmony import */ var _lib_matrix_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/matrix.ts */ \"./lib/matrix.ts\");\n\r\n\r\n\r\nvar ShaderType;\r\n(function (ShaderType) {\r\n    ShaderType[ShaderType[\"vertex\"] = 0] = \"vertex\";\r\n    ShaderType[ShaderType[\"fragment\"] = 1] = \"fragment\";\r\n})(ShaderType || (ShaderType = {}));\r\nconst canvas = document.getElementById('canvas');\r\ncanvas.width = 500;\r\ncanvas.height = 500;\r\nconst gl = canvas.getContext('webgl');\r\ngl.clearColor(0.8, 0.5, 0.2, 1.0); // canvas初期化の色\r\ngl.clearDepth(1.0); // canvas初期化の深度\r\ngl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // canvas初期化\r\nconst createShader = (shaderType, shaderText) => {\r\n    const glType = shaderType === ShaderType.vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;\r\n    const shader = gl.createShader(glType);\r\n    // vert or fragでシェーダの受け皿を作る？\r\n    gl.shaderSource(shader, shaderText);\r\n    // sourceの割り当て、shader programのロードかな？\r\n    gl.compileShader(shader);\r\n    // コンパイル、vertもfragも同じ関数でできる。\r\n    // コンパイルしたらGPUに読み込まれるんだろうか？\r\n    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : alert(gl.getShaderInfoLog(shader));\r\n};\r\n// programオブジェクト---varyingではvertからfragに値を渡すよね？それをやってくれるやつ。\r\nconst createProgram = (vs, fs) => {\r\n    const program = gl.createProgram();\r\n    gl.attachShader(program, vs);\r\n    gl.attachShader(program, fs);\r\n    gl.linkProgram(program);\r\n    // shaderのリンクが正しく行われたか✓\r\n    if (!gl.getProgramParameter(program, gl.LINK_STATUS))\r\n        return alert(gl.getProgramInfoLog(program));\r\n    // use programするとどこに何がロードされるんだろうか。\r\n    gl.useProgram(program);\r\n    return program;\r\n};\r\nconst createVbo = (data) => {\r\n    // バッファを操作する場合は、まずバッファをWebGLにバインドする。\r\n    const vbo = gl.createBuffer();\r\n    // バインド\r\n    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);\r\n    // バッファにデータをセット\r\n    // STATIC_DRAW: このバッファがどのような頻度で内容を更新されるか\r\n    // VBOの場合はモデルデータはそのままで何度も利用することになる。\r\n    // のでSTATIC_DRAW?\r\n    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);\r\n    // バインド解除\r\n    gl.bindBuffer(gl.ARRAY_BUFFER, null);\r\n    return vbo;\r\n};\r\n// 自作関数: シェーダーの生成\r\nconst vertShader = createShader(ShaderType.vertex, _shader_shader_vert__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\r\nconst fragShader = createShader(ShaderType.fragment, _shader_shader_frag__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\r\n// 自作関数: プログラムの生成とリンク\r\nconst program = createProgram(vertShader, fragShader);\r\n// attributeLocationの取得(シェーダー内でのattribute変数)\r\nconst attLocation = gl.getAttribLocation(program, 'position');\r\n// 頂点シェーダーにデータを渡す際のインデックスを返す\r\nconst attStride = 3; // (x, y, z)\r\nconst vertexPosition = [0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0];\r\n// モデルデータ\r\n// 自作関数: VBOを生成\r\nconst vbo = createVbo(vertexPosition);\r\ngl.bindBuffer(gl.ARRAY_BUFFER, vbo); // VBOをバインド\r\ngl.enableVertexAttribArray(attLocation); // attribute属性を有効に\r\ngl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0); // attribute属性を登録\r\n// DirectXだとmvp行列だけど、WebGLではかける順番が逆(列オーダーなので)\r\nconst mat = new _lib_matrix_ts__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\r\nconst mMatrix = mat.identity(mat.create());\r\nconst vMatrix = mat.identity(mat.create());\r\nconst pMatrix = mat.identity(mat.create());\r\nconst mvpMatrix = mat.identity(mat.create());\r\n// ビュー座標変換(カメラを動かす)\r\n// 原点から上に1.0, 後ろに3.0、注視点は原点、上方向はy軸\r\nmat.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);\r\n// プロジェクション座標変換(透視投影でクリッピング)\r\n// 視野角90度、アス比はcanvasサイズ、ニアクリップ、ファークリップ\r\nmat.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix);\r\nmat.multiply(pMatrix, vMatrix, mvpMatrix);\r\nmat.multiply(mvpMatrix, mMatrix, mvpMatrix);\r\n// uniform: 頂点シェーダーが呼ばれるタイミングで変わらない値\r\n// 頂点シェーダーは頂点ごとに呼ばれるので、もちろん座標は違うが、変換行列は同じ\r\nconst uniLocation = gl.getUniformLocation(program, 'mvpMatrix');\r\ngl.uniformMatrix4fv(uniLocation, false, mvpMatrix);\r\ngl.drawArrays(gl.TRIANGLES, 0, 3);\r\ngl.flush();\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });