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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page0.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/page0.ts":
/*!**********************!*\
  !*** ./src/page0.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// import * as lodash from 'lodash'\n// import { gl, GLUtilities } from './gl/gl'\n// import vert from '../shader/shader.vert'\n// import frag from '../shader/shader.frag'\n// import bvert from '../shader/blur.vert'\n// import bfrag from '../shader/blur.frag'\n// import { Mat4, Quaternion, Vec3 } from '../lib/math'\n// import { torus, pera, sphere } from '../lib/primitives'\n// import {\n//     ShaderType,\n//     createShader,\n//     createProgram,\n//     createVbo,\n//     setAttribute,\n//     createIbo,\n//     createFramebuffer,\n// } from '../lib/shaderUtil'\n// import png from '../assets/large.png'\n// // setting\n// // これらを動的に変更するにはJS的にはどうすればいいのだろう？\n// //gl.enable(gl.CULL_FACE) // gl.CCW = face\n// const canvas: HTMLCanvasElement = GLUtilities.initialize()\n// canvas.addEventListener('mousemove', mouseMove, true)\n// // setting\n// // これらを動的に変更するにはJS的にはどうすればいいのだろう？\n// // gl.enable(gl.CULL_FACE)\n// gl.enable(gl.DEPTH_TEST)\n// gl.depthFunc(gl.LEQUAL)\n// gl.enable(gl.STENCIL_TEST)\n// // cULL: gl.CCW = face, DEPTH: gl.LEQUAL, STENCIL: WEBGLにstencil bufferを使うことを通知。コンテキスト生成時にstencilができている必要あり。\n// // シェーダーの生成\n// const vertShader = createShader(ShaderType.vertex, vert) as WebGLShader\n// const fragShader = createShader(ShaderType.fragment, frag) as WebGLShader\n// const program = createProgram(vertShader, fragShader) as WebGLProgram\n// const attLocation: GLint[] = [\n//     gl.getAttribLocation(program, 'position'),\n//     gl.getAttribLocation(program, 'normal'),\n//     gl.getAttribLocation(program, 'color'),\n//     gl.getAttribLocation(program, 'texCoord'),\n// ]\n// const attStride: number[] = [3, 3, 4, 2] // (x, y, z), (nx, ny, nz),(r, g, b, a)\n// const cameraPos = new Vec3(0.0, 1.0, 20.0)\n// const cameraUp = new Vec3(0.0, 1.0, 0.0)\n// const center = new Vec3(0.0, 0.0, 0.0)\n// let mMatrix = Mat4.identity()\n// let vMatrix = Mat4.lookAt(cameraPos, center, cameraUp)\n// const pMatrix = Mat4.createPerspective(45, canvas.width, canvas.height, 0.1, 200)\n// let mvMatrix = Mat4.identity()\n// // DirectXだとmvp行列だけど、WebGLではかける順番が逆(列オーダーなので)\n// // 原点から上に1.0, 後ろに3.0、注視点は原点、上方向はy軸\n// mat.multiply(pMatrix, vMatrix, vpMatrix)\n// // テクスチャ用変数の宣言\n// let texture0 = null,\n//     texture1 = null\n// // テクスチャを生成\n// createTexture(\n//     'https://lh3.googleusercontent.com/75feyTD9lq02u_2leJwdwkzjOj1YfYBNa5NZHPT-PQ4CSnugxeAGfdTT89uj3G2YNp2C',\n//     1,\n// )\n// createTexture(\n//     'https://lh3.googleusercontent.com/W7DcplYP9g3KP4LiCEVx6Det5dasK3B0gZaY9k2jStvWlhCne3NckFrqqJIDBxj5EAM',\n//     0,\n// )\n// let count = 0\n// const input = document.getElementById('alpha') as HTMLInputElement\n// function drawScene(): any {\n//     // inputからどうやって値を取る？\n//     // 値を取ったら100で割ってシェーダーに送る。\n//     ++count\n//     const vertexAlpha: number = Number(input.value) / 100.0\n//     console.log(vertexAlpha)\n//     gl.clearColor(0.0, 0.0, 0.0, 1.0) // canvas初期化の色\n//     gl.clearDepth(1.0) // canvas初期化の深度\n//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // canvas初期化\n//     const rad: number = ((count % 360.0) * Math.PI) / 180.0\n//     const x: number = Math.cos(rad)\n//     const y: number = Math.sin(rad)\n//     // ループごとに登録しないといけないっぽい\n//     // 有効にするテクスチャユニットを指定\n//     // 有向になっているテクスチャは一つのみ、以下の3つをセットにするのは重要、なぜかは確認してないが\n//     gl.activeTexture(gl.TEXTURE0)\n//     gl.bindTexture(gl.TEXTURE_2D, texture0)\n//     gl.uniform1i(uniLocation[1], 0) // uniform変数にテクスチャを登録\n//     gl.activeTexture(gl.TEXTURE1)\n//     gl.bindTexture(gl.TEXTURE_2D, texture1)\n//     // 聞いてるのか？よくわからない\n//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)\n//     gl.uniform1i(uniLocation[2], 1)\n//     // いつもの\n//     mMatrix = Mat4.identity()\n//     mat.translate(mMatrix, 0.25, 0.25, -0.25, mMatrix)\n//     mat.rotate(mMatrix, rad, [0, 1, 0], mMatrix)\n//     mat.multiply(vpMatrix, mMatrix, mvpMatrix)\n//     gl.disable(gl.BLEND)\n//     gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix.data)\n//     gl.uniform1f(uniLocation[3], 1.0)\n//     gl.uniform1i(uniLocation[4], 1)\n//     gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0)\n//     // にこめ\n//     mMatrix = Matrix4.identity()\n//     mat.translate(mMatrix, -0.25, -0.25, 0.25, mMatrix)\n//     mat.rotate(mMatrix, rad, [0, 0, 1], mMatrix)\n//     mat.multiply(vpMatrix, mMatrix, mvpMatrix)\n//     gl.bindTexture(gl.TEXTURE_2D, null)\n//     gl.enable(gl.BLEND)\n//     const type = document.getElementsByName('blend')\n//     console.log((type[0] as HTMLInputElement).checked)\n//     console.log((type[1] as HTMLInputElement).checked)\n//     // これを飛ばすと、そもそもalphaの計算が入らない？(白く描画)\n//     if ((type[0] as HTMLInputElement).checked) blendType(0)\n//     else blendType(1)\n//     gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix.data)\n//     gl.uniform1f(uniLocation[3], vertexAlpha)\n//     gl.uniform1i(uniLocation[4], 0)\n//     gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0)\n//     gl.flush()\n//     // (async () => {\n//     //     delay(1000)\n//     // })()\n//     // requestAnimationFrame(drawScene())\n//     setTimeout(drawScene, 1000 / 30)\n// }\n// // 2次元座標から回転角？\n// // マウスムーブイベントに登録する処理\n// function mouseMove(e) {\n//     const cw = canvas.width\n//     const ch = canvas.height\n//     const wh = 1 / Math.sqrt(cw * cw + ch * ch)\n//     let x = e.clientX - canvas.offsetLeft - cw * 0.5\n//     let y = e.clientY - canvas.offsetTop - ch * 0.5\n//     let sq = Math.sqrt(x * x + y * y)\n//     const r = sq * 2.0 * Math.PI * wh\n//     if (sq != 1) {\n//         sq = 1 / sq\n//         x *= sq\n//         y *= sq\n//     }\n//     cameraRot.makeQuaternionFromAxis(r, new Vec3(y, x, 0.0))\n// }\n// // テクスチャを生成する関数\n// function createTexture(source, num) {\n//     // イメージオブジェクトの生成\n//     const img = new Image()\n//     img.crossOrigin = 'anonymous'\n//     // データのオンロードをトリガーにする\n//     img.onload = function () {\n//         // テクスチャオブジェクトの生成\n//         const tex = gl.createTexture()\n//         // テクスチャをバインドする\n//         gl.bindTexture(gl.TEXTURE_2D, tex)\n//         // テクスチャへイメージを適用\n//         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)\n//         // ミップマップを生成\n//         gl.generateMipmap(gl.TEXTURE_2D)\n//         // テクスチャパラメータの設定\n//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)\n//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)\n//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)\n//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)\n//         // テクスチャのバインドを無効化\n//         gl.bindTexture(gl.TEXTURE_2D, null)\n//         switch (num) {\n//             case 0:\n//                 texture0 = tex\n//             case 1:\n//                 texture1 = tex\n//             default:\n//                 break\n//         }\n//     }\n//     // イメージオブジェクトのソースを指定\n//     img.src = source\n// }\n// // ブレンドタイプを設定する関数\n// function blendType(prm) {\n//     switch (prm) {\n//         // 透過処理\n//         case 0:\n//             // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);\n//             // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);\n//             gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE)\n//             break\n//         // 加算合成\n//         case 1:\n//             // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);\n//             gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE)\n//             break\n//         default:\n//             break\n//     }\n// }\n\n\n//# sourceURL=webpack:///./src/page0.ts?");

/***/ })

/******/ });