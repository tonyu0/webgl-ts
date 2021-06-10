// import * as lodash from 'lodash'
// import { gl, GLUtilities } from './gl/gl'
// import vert from '../shader/shader.vert'
// import frag from '../shader/shader.frag'
// import bvert from '../shader/blur.vert'
// import bfrag from '../shader/blur.frag'
// import { Mat4, Quaternion, Vec3 } from '../lib/math'
// import { torus, pera, sphere } from '../lib/primitives'
// import {
//     ShaderType,
//     createShader,
//     createProgram,
//     createVbo,
//     setAttribute,
//     createIbo,
//     createFramebuffer,
// } from '../lib/shaderUtil'
// import png from '../assets/large.png'

// // setting
// // これらを動的に変更するにはJS的にはどうすればいいのだろう？
// //gl.enable(gl.CULL_FACE) // gl.CCW = face
// const canvas: HTMLCanvasElement = GLUtilities.initialize()
// canvas.addEventListener('mousemove', mouseMove, true)
// // setting
// // これらを動的に変更するにはJS的にはどうすればいいのだろう？
// // gl.enable(gl.CULL_FACE)
// gl.enable(gl.DEPTH_TEST)
// gl.depthFunc(gl.LEQUAL)
// gl.enable(gl.STENCIL_TEST)
// // cULL: gl.CCW = face, DEPTH: gl.LEQUAL, STENCIL: WEBGLにstencil bufferを使うことを通知。コンテキスト生成時にstencilができている必要あり。
// // シェーダーの生成
// const vertShader = createShader(ShaderType.vertex, vert) as WebGLShader
// const fragShader = createShader(ShaderType.fragment, frag) as WebGLShader
// const program = createProgram(vertShader, fragShader) as WebGLProgram

// const attLocation: GLint[] = [
//     gl.getAttribLocation(program, 'position'),
//     gl.getAttribLocation(program, 'normal'),
//     gl.getAttribLocation(program, 'color'),
//     gl.getAttribLocation(program, 'texCoord'),
// ]
// const attStride: number[] = [3, 3, 4, 2] // (x, y, z), (nx, ny, nz),(r, g, b, a)

// const cameraPos = new Vec3(0.0, 1.0, 20.0)
// const cameraUp = new Vec3(0.0, 1.0, 0.0)
// const center = new Vec3(0.0, 0.0, 0.0)
// let mMatrix = Mat4.identity()
// let vMatrix = Mat4.lookAt(cameraPos, center, cameraUp)
// const pMatrix = Mat4.createPerspective(45, canvas.width, canvas.height, 0.1, 200)
// let mvMatrix = Mat4.identity()
// // DirectXだとmvp行列だけど、WebGLではかける順番が逆(列オーダーなので)
// // 原点から上に1.0, 後ろに3.0、注視点は原点、上方向はy軸
// mat.multiply(pMatrix, vMatrix, vpMatrix)

// // テクスチャ用変数の宣言
// let texture0 = null,
//     texture1 = null

// // テクスチャを生成
// createTexture(
//     'https://lh3.googleusercontent.com/75feyTD9lq02u_2leJwdwkzjOj1YfYBNa5NZHPT-PQ4CSnugxeAGfdTT89uj3G2YNp2C',
//     1,
// )
// createTexture(
//     'https://lh3.googleusercontent.com/W7DcplYP9g3KP4LiCEVx6Det5dasK3B0gZaY9k2jStvWlhCne3NckFrqqJIDBxj5EAM',
//     0,
// )

// let count = 0

// const input = document.getElementById('alpha') as HTMLInputElement
// function drawScene(): any {
//     // inputからどうやって値を取る？
//     // 値を取ったら100で割ってシェーダーに送る。
//     ++count
//     const vertexAlpha: number = Number(input.value) / 100.0
//     console.log(vertexAlpha)

//     gl.clearColor(0.0, 0.0, 0.0, 1.0) // canvas初期化の色
//     gl.clearDepth(1.0) // canvas初期化の深度
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // canvas初期化
//     const rad: number = ((count % 360.0) * Math.PI) / 180.0
//     const x: number = Math.cos(rad)
//     const y: number = Math.sin(rad)

//     // ループごとに登録しないといけないっぽい
//     // 有効にするテクスチャユニットを指定
//     // 有向になっているテクスチャは一つのみ、以下の3つをセットにするのは重要、なぜかは確認してないが
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texture0)
//     gl.uniform1i(uniLocation[1], 0) // uniform変数にテクスチャを登録

//     gl.activeTexture(gl.TEXTURE1)
//     gl.bindTexture(gl.TEXTURE_2D, texture1)
//     // 聞いてるのか？よくわからない
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
//     gl.uniform1i(uniLocation[2], 1)

//     // いつもの
//     mMatrix = Mat4.identity()
//     mat.translate(mMatrix, 0.25, 0.25, -0.25, mMatrix)
//     mat.rotate(mMatrix, rad, [0, 1, 0], mMatrix)
//     mat.multiply(vpMatrix, mMatrix, mvpMatrix)

//     gl.disable(gl.BLEND)

//     gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix.data)
//     gl.uniform1f(uniLocation[3], 1.0)
//     gl.uniform1i(uniLocation[4], 1)
//     gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0)

//     // にこめ
//     mMatrix = Matrix4.identity()
//     mat.translate(mMatrix, -0.25, -0.25, 0.25, mMatrix)
//     mat.rotate(mMatrix, rad, [0, 0, 1], mMatrix)
//     mat.multiply(vpMatrix, mMatrix, mvpMatrix)

//     gl.bindTexture(gl.TEXTURE_2D, null)
//     gl.enable(gl.BLEND)
//     const type = document.getElementsByName('blend')
//     console.log((type[0] as HTMLInputElement).checked)
//     console.log((type[1] as HTMLInputElement).checked)
//     // これを飛ばすと、そもそもalphaの計算が入らない？(白く描画)
//     if ((type[0] as HTMLInputElement).checked) blendType(0)
//     else blendType(1)

//     gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix.data)
//     gl.uniform1f(uniLocation[3], vertexAlpha)
//     gl.uniform1i(uniLocation[4], 0)
//     gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0)

//     gl.flush()
//     // (async () => {
//     //     delay(1000)
//     // })()
//     // requestAnimationFrame(drawScene())
//     setTimeout(drawScene, 1000 / 30)
// }


// // 2次元座標から回転角？
// // マウスムーブイベントに登録する処理
// function mouseMove(e) {
//     const cw = canvas.width
//     const ch = canvas.height
//     const wh = 1 / Math.sqrt(cw * cw + ch * ch)
//     let x = e.clientX - canvas.offsetLeft - cw * 0.5
//     let y = e.clientY - canvas.offsetTop - ch * 0.5
//     let sq = Math.sqrt(x * x + y * y)
//     const r = sq * 2.0 * Math.PI * wh
//     if (sq != 1) {
//         sq = 1 / sq
//         x *= sq
//         y *= sq
//     }
//     cameraRot.makeQuaternionFromAxis(r, new Vec3(y, x, 0.0))
// }

// // テクスチャを生成する関数
// function createTexture(source, num) {
//     // イメージオブジェクトの生成
//     const img = new Image()
//     img.crossOrigin = 'anonymous'

//     // データのオンロードをトリガーにする
//     img.onload = function () {
//         // テクスチャオブジェクトの生成
//         const tex = gl.createTexture()

//         // テクスチャをバインドする
//         gl.bindTexture(gl.TEXTURE_2D, tex)

//         // テクスチャへイメージを適用
//         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

//         // ミップマップを生成
//         gl.generateMipmap(gl.TEXTURE_2D)

//         // テクスチャパラメータの設定
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

//         // テクスチャのバインドを無効化
//         gl.bindTexture(gl.TEXTURE_2D, null)
//         switch (num) {
//             case 0:
//                 texture0 = tex
//             case 1:
//                 texture1 = tex
//             default:
//                 break
//         }
//     }

//     // イメージオブジェクトのソースを指定
//     img.src = source
// }

// // ブレンドタイプを設定する関数
// function blendType(prm) {
//     switch (prm) {
//         // 透過処理
//         case 0:
//             // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//             // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//             gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE)
//             break
//         // 加算合成
//         case 1:
//             // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
//             gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE)
//             break
//         default:
//             break
//     }
// }