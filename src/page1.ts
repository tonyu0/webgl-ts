import * as lodash from 'lodash'
import { gl, GLUtilities } from './gl/gl'
import vert from '../shader/shader.vert'
import frag from '../shader/shader.frag'
import bvert from '../shader/blur.vert'
import bfrag from '../shader/blur.frag'
import { Mat4, Quaternion, Vec3 } from '../lib/math'
import { torus, pera, sphere } from '../lib/primitives'
import {
    ShaderType,
    createShader,
    createProgram,
    createVbo,
    setAttribute,
    createIbo,
    createFramebuffer,
} from '../lib/shaderUtil'
import png from '../assets/large.png'

const canvas: HTMLCanvasElement = GLUtilities.initialize()
// canvas.addEventListener('mousemove', mouseMove, true)
// setting
// これらを動的に変更するにはJS的にはどうすればいいのだろう？
// gl.enable(gl.CULL_FACE)
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.STENCIL_TEST)
// cULL: gl.CCW = face, DEPTH: gl.LEQUAL, STENCIL: WEBGLにstencil bufferを使うことを通知。コンテキスト生成時にstencilができている必要あり。
// シェーダーの生成
const vertShader = createShader(ShaderType.vertex, vert) as WebGLShader
const fragShader = createShader(ShaderType.fragment, frag) as WebGLShader
const program = createProgram(vertShader, fragShader) as WebGLProgram
const blurVert = createShader(ShaderType.vertex, bvert) as WebGLShader
const blurFrag = createShader(ShaderType.fragment, bfrag) as WebGLShader
const bprogram = createProgram(blurVert, blurFrag) as WebGLProgram

const attLocation: GLint[] = [
    gl.getAttribLocation(program, 'position'),
    gl.getAttribLocation(program, 'normal'),
    gl.getAttribLocation(program, 'color'),
    gl.getAttribLocation(program, 'texCoord'),
]
const bAttrLoc: GLint[] = [gl.getAttribLocation(bprogram, 'position'), gl.getAttribLocation(bprogram, 'color')]
const attStride: number[] = [3, 3, 4, 2] // (x, y, z), (nx, ny, nz),(r, g, b, a)
const bAttrStride: number[] = [3, 4]
const trs = torus(60, 60, 1, 2, null)
const sph = sphere(60, 60, 1, [1.0, 1.0, 1.0, 1.0])
const per = pera()
// モデルデータ

// VBO/IBOを生成
const tVbo: WebGLBuffer[] = [createVbo(trs.p), createVbo(trs.n), createVbo(trs.c), createVbo(trs.t)]
const sVbo: WebGLBuffer[] = [createVbo(sph.p), createVbo(sph.n), createVbo(sph.c), createVbo(sph.t)]
const pVbo: WebGLBuffer[] = [createVbo(per.p), createVbo(per.c)]
const tIbo: WebGLBuffer = createIbo(trs.i)
const sIbo: WebGLBuffer = createIbo(sph.i)
const pIbo: WebGLBuffer = createIbo(per.i)

// DirectXだとmvp行列だけど、WebGLではかける順番が逆(列オーダーなので)
const cameraRot = Quaternion.identity()
const modelRot = Quaternion.identity()
// 球面線形補間チェック用

let mMatrix = Mat4.identity()
const cameraPos = new Vec3(0.0, 1.0, 5.0)
const cameraUp = new Vec3(0.0, 1.0, 0.0)
const center = new Vec3(0, 0, 0)
let vMatrix = Mat4.lookAt(cameraPos, center, cameraUp)
const pMatrix = Mat4.createPerspective(90, canvas.width, canvas.height, 0.1, 100)
// 視野角90度、アス比はcanvasサイズ、ニアクリップ、ファークリップ
let mvMatrix = Mat4.identity()
let invMatrix = Mat4.identity()


// eyeとlightをmodel行列の逆で求めている例、eyeとlightはもともとワールドにあるから？
// 今の理解だと、positionはローカル座標、mMatrixをかけてワールド座標、　eyeとlightはなぜか逆行列をかけて
// invEye - posみたいにしてVを求めてるけど、わからない
const lightDirection: number[] = [-0.5, 0.5, 0.5]
const ambientLight: number[] = [0.1, 0.1, 0.1, 1.0]
const pointLightPosition: number[] = [0, 0, 0]

const uniformList = [
    'modelViewMatrix',
    'invMatrix',
    'texture',
    'lightDirection',
    'ambientLight',
    'projectionMatrix',
    'pointLightPosition',
    'outline',
    'useLight',
    'useTexture',
]
const buniformList = ['modelViewMatrix', 'texture', 'projectionMatrix', 'useBlur']
const uniformLocation: { [s: string]: WebGLUniformLocation } = {}
const buniformLocation: { [s: string]: WebGLUniformLocation } = {}

uniformList.forEach((s) => {
    uniformLocation[s] = gl.getUniformLocation(program, s)
})
buniformList.forEach((s) => {
    buniformLocation[s] = gl.getUniformLocation(bprogram, s)
})

gl.useProgram(program)
gl.uniform3fv(uniformLocation['lightDirection'], lightDirection)
gl.uniform4fv(uniformLocation['ambientLight'], ambientLight)
gl.uniformMatrix4fv(uniformLocation['projectionMatrix'], false, pMatrix.data)
gl.uniform3fv(uniformLocation['pointLightPosition'], pointLightPosition)

const fb = createFramebuffer(256, 256)
let texture0 = null,
    texture1 = null
// テクスチャを生成
createTexture(png, 0)
createTexture('https://google.github.io/filament/images/screenshot_normal_map_detail.jpg', 1)
// 同じ物体に複数テクスチャとかしない限りは0だけでいい
gl.activeTexture(gl.TEXTURE0)

let count = 0
const range = document.getElementById('alpha') as HTMLInputElement
const type = document.getElementsByName('blend')
console.log(gl.RENDERBUFFER)

function drawScene(): any {
    ++count

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb.f)
    gl.clearColor(0.3, 0.3, 0.2, 1.0) // canvas初期化の色
    gl.clearDepth(1.0) // canvas初期化の深度
    gl.clearStencil(0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT) // canvas初期化

    // カウンタを元にラジアンを算出
    const rad = ((count % 360) * Math.PI) / 180
    const rad2 = ((count % 720) * Math.PI) / 360
    const x: number = Math.cos(rad)
    const y: number = Math.sin(rad)
    cameraRot.makeQuaternionFromAxis(rad2, new Vec3(1, 0, 0))
    cameraRot.toVec3([0.0, 1.0, 5.0], cameraRot, cameraPos)
    cameraRot.toVec3([0.0, 1.0, 0.0], cameraRot, cameraUp)
    vMatrix = Mat4.lookAt(cameraPos, center, cameraUp)

    gl.useProgram(program)
    {
        // outline
        // ↓これをやらないと、stencilにかく値をdepthとかにも書いてしまい、depth testで真っ黒に。
        gl.enable(gl.STENCIL_TEST)
        gl.colorMask(false, false, false, false)
        gl.depthMask(false)
        setAttribute(tVbo, attLocation, attStride, tIbo)
        gl.stencilFunc(gl.ALWAYS, 1, ~0)
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)
        mMatrix = Mat4.identity()
        mMatrix.rotate(rad, new Vec3(1, 1, 0))
        mvMatrix = lodash.cloneDeep(vMatrix)
        mvMatrix.multiply(mMatrix)
        mMatrix.inverse(invMatrix)
        gl.uniformMatrix4fv(uniformLocation['modelViewMatrix'], false, mvMatrix.data)
        gl.uniformMatrix4fv(uniformLocation['invMatrix'], false, invMatrix.data)
        gl.uniform1i(uniformLocation['outline'], 1)
        gl.uniform1i(uniformLocation['useLight'], 0)
        gl.drawElements(gl.TRIANGLES, trs.i.length, gl.UNSIGNED_SHORT, 0)

        // sphere
        gl.colorMask(true, true, true, true)
        gl.depthMask(true)
        setAttribute(sVbo, attLocation, attStride, sIbo)
        gl.stencilFunc(gl.EQUAL, 0, ~0)
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
        mMatrix = Mat4.identity()
        mMatrix.scale(50, 50, 50)
        mvMatrix = lodash.cloneDeep(vMatrix)
        mvMatrix.multiply(mMatrix)
        mMatrix.inverse(invMatrix)

        // texture 準備
        gl.bindTexture(gl.TEXTURE_2D, texture0)
        gl.uniform1i(uniformLocation['texture'], 0) // uniform変数にテクスチャを登
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

        gl.uniformMatrix4fv(uniformLocation['modelViewMatrix'], false, mvMatrix.data)
        gl.uniformMatrix4fv(uniformLocation['invMatrix'], false, invMatrix.data)
        gl.uniform1i(uniformLocation['outline'], 0)
        gl.uniform1i(uniformLocation['useLight'], 0)
        gl.drawElements(gl.TRIANGLES, sph.i.length, gl.UNSIGNED_SHORT, 0)

        // gl.bindTexture(gl.TEXTURE_2D, null)

        // main object
        setAttribute(tVbo, attLocation, attStride, tIbo)
        gl.disable(gl.STENCIL_TEST)
        mMatrix = Mat4.identity()
        mMatrix.rotate(rad, new Vec3(1, 1, 0))
        mvMatrix = lodash.cloneDeep(vMatrix)
        mvMatrix.multiply(mMatrix)
        mMatrix.inverse(invMatrix)
        // texture
        gl.bindTexture(gl.TEXTURE_2D, texture1)
        gl.uniform1i(uniformLocation['texture'], 0)
        gl.uniformMatrix4fv(uniformLocation['modelViewMatrix'], false, mvMatrix.data)
        gl.uniformMatrix4fv(uniformLocation['invMatrix'], false, invMatrix.data)
        gl.uniform1i(uniformLocation['outline'], 0)
        gl.uniform1i(uniformLocation['useLight'], 1)
        gl.drawElements(gl.TRIANGLES, trs.i.length, gl.UNSIGNED_SHORT, 0)
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    gl.clearColor(0.4, 0.1, 0.2, 1.0) // canvas初期化の色
    gl.clearDepth(1.0) // canvas初期化の深度
    gl.clearStencil(0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT) // canvas初期化
    gl.useProgram(bprogram)
    setAttribute(pVbo, bAttrLoc, bAttrStride, pIbo)
    {
        gl.bindTexture(gl.TEXTURE_2D, fb.t)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        gl.uniform1i(buniformLocation['texture'], 0)

        mMatrix = Mat4.identity()
        // mat.rotate(mMatrix, rad, [0, 1, 0], mMatrix)
        // mat.translate(mMatrix, [0, 1, -1], mMatrix)
        vMatrix = Mat4.lookAt(new Vec3(0.0, 0.0, 0.5), new Vec3(0.0, 0.0, 0.0), new Vec3(0, 1, 0))
        mvMatrix = lodash.cloneDeep(vMatrix)
        mvMatrix.multiply(mMatrix)
        gl.uniformMatrix4fv(buniformLocation['modelViewMatrix'], false, mvMatrix.data)
        // mat.ortho(-1.0, 1.0, 1.0, -1.0, 0.1, 1, pMatrix)
        gl.uniformMatrix4fv(buniformLocation['projectionMatrix'], false, pMatrix.data)
        if ((type[0] as HTMLInputElement).checked) gl.uniform1i(buniformLocation['useBlur'], 0)
        else gl.uniform1i(buniformLocation['useBlur'], 1)

        gl.drawElements(gl.TRIANGLES, per.i.length, gl.UNSIGNED_SHORT, 0)

        gl.bindTexture(gl.TEXTURE_2D, null)
    }
    // console.log((type[0] as HTMLInputElement).checked)
    // console.log((type[1] as HTMLInputElement).checked)
    // if ((type[0] as HTMLInputElement).checked) blendType(0)
    // else blendType(1)

    // let t = Number(range.value) / 100.0
    // q.rotate(rad, [1.0, 0.0, 0.0], q1)
    // q.rotate(rad, [0.0, 1.0, 0.0], q2)
    // q.slerp(q1, q2, t, q3)

    // // モデルのレンダリング
    // ambientLight = [0.5, 0.0, 0.0, 1.0];
    // draw(q1);
    // ambientLight = [0.0, 0.5, 0.0, 1.0];
    // draw(q2);
    // ambientLight = [0.0, 0.0, 0.5, 1.0];
    // draw(q3);
    // function draw(qtn) {
    //     mMatrix = Matrix4.identity()
    //     q.toMat4(qtn, mMatrix)

    //     mat.translate(mMatrix, [0.0, 0.0, -5.0], mMatrix)
    //     mat.multiply(vMatrix, mMatrix, mvMatrix)
    //     mat.inverse(mMatrix, invMatrix)
    //     gl.uniformMatrix4fv(uniLocation[0], false, mvMatrix)
    //     gl.uniformMatrix4fv(uniLocation[1], false, invMatrix)
    //     gl.uniform4fv(uniLocation[3], ambientLight)
    //     // gl.drawArrays(gl.TRIANGLES, 0, 3) // IBOを使うため、gl.drawElementsに変更
    //     gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
    // }
    // gl.drawArrays(gl.TRIANGLES, 0, 3) // 三角形を、0番目の頂点から3個頂点を使い描画
    gl.flush()
    // (async () => {
    //     delay(1000)
    // })()
    // requestAnimationFrame(drawScene())
    setTimeout(drawScene, 1000 / 30)
}

drawScene()

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
// 2次元座標から回転角？
function mouseMove(e) {
    const cw = canvas.width
    const ch = canvas.height
    const wh = 1 / Math.sqrt(cw * cw + ch * ch)
    let x = e.clientX
    let y = e.clientY
    console.log(x, y)
    let sq = Math.sqrt(x * x + y * y)
    const r = sq * 2.0 * Math.PI * wh
    if (sq != 1) {
        sq = 1 / sq
        x *= sq
        y *= sq
    }
    modelRot.makeQuaternionFromAxis(r, new Vec3(y, x, 0.0))
}

// テクスチャを生成する関数
function createTexture(source, num) {
    // イメージオブジェクトの生成
    const img = new Image()
    img.crossOrigin = 'anonymous'

    // データのオンロードをトリガーにする
    img.onload = function () {
        // テクスチャオブジェクトの生成
        const tex = gl.createTexture()

        // テクスチャをバインドする
        gl.bindTexture(gl.TEXTURE_2D, tex)

        // テクスチャへイメージを適用
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

        // ミップマップを生成
        gl.generateMipmap(gl.TEXTURE_2D)

        // テクスチャパラメータの設定
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

        // テクスチャのバインドを無効化
        gl.bindTexture(gl.TEXTURE_2D, null)
        switch (num) {
            case 0:
                texture0 = tex
            case 1:
                texture1 = tex
            default:
                break
        }
    }

    // イメージオブジェクトのソースを指定
    img.src = source
}

// ブレンドタイプを設定する関数
function blendType(prm) {
    switch (prm) {
        // 透過処理
        case 0:
            // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE)
            break
        // 加算合成
        case 1:
            // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE)
            break
        default:
            break
    }
}
