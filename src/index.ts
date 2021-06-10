import * as lodash from 'lodash'
import { gl, GLUtilities } from './gl/gl'
import vert from '../shader/cubemap.vert'
import frag from '../shader/cubemap.frag'
import { Mat4, Quaternion, Vec3 } from '../lib/math'
import { torus, pera, sphere, cube } from '../lib/primitives'
import {
    ShaderType,
    createShader,
    createProgram,
    createVbo,
    setAttribute,
    createIbo,
    createFramebuffer,
} from '../lib/shaderUtil'
import cube_NX from '../assets/cube_NX.png'
import cube_NY from '../assets/cube_NY.png'
import cube_NZ from '../assets/cube_NZ.png'
import cube_PX from '../assets/cube_PX.png'
import cube_PY from '../assets/cube_PY.png'
import cube_PZ from '../assets/cube_PZ.png'
import normalMap from '../assets/normal.png'
// 現状、onloadで出るべきところがべた書きになってり

const canvas: HTMLCanvasElement = GLUtilities.initialize()
canvas.addEventListener('mousemove', mouseMove, true)
// setting
// これらを動的に変更するにはJS的にはどうすればいいのだろう？
// gl.enable(gl.CULL_FACE)
gl.enable(gl.DEPTH_TEST)
gl.depthFunc(gl.LEQUAL)
gl.enable(gl.STENCIL_TEST)
// cULL: gl.CCW = face, DEPTH: gl.LEQUAL, STENCIL: WEBGLにstencil bufferを使うことを通知。コンテキスト生成時にstencilができている必要あり。
// シェーダーの生成
const vertShader = createShader(ShaderType.vertex, vert) as WebGLShader
const fragShader = createShader(ShaderType.fragment, frag) as WebGLShader
const program = createProgram(vertShader, fragShader) as WebGLProgram

const attLocation: GLint[] = [
    gl.getAttribLocation(program, 'position'),
    gl.getAttribLocation(program, 'normal'),
    gl.getAttribLocation(program, 'color'),
    gl.getAttribLocation(program, 'texCoord'),
]
const attStride: number[] = [3, 3, 4, 2] // (x, y, z), (nx, ny, nz),(r, g, b, a)
const trs = torus(60, 60, 1, 2, [1, 1, 1, 1])
const sph = sphere(60, 60, 2.5, [1.0, 1.0, 1.0, 1.0])
const cub = cube(2.0, [1.0, 1.0, 1.0, 1.0])
const per = pera()
// モデルデータ

// VBO/IBOを生成
const tVbo: WebGLBuffer[] = [createVbo(trs.p), createVbo(trs.n), createVbo(trs.c), createVbo(trs.t)]
const sVbo: WebGLBuffer[] = [createVbo(sph.p), createVbo(sph.n), createVbo(sph.c), createVbo(sph.t)]
const cVbo: WebGLBuffer[] = [createVbo(cub.p), createVbo(cub.n), createVbo(cub.c), createVbo(cub.t)]
const pVbo: WebGLBuffer[] = [createVbo(per.p), createVbo(per.c)]
const tIbo: WebGLBuffer = createIbo(trs.i)
const sIbo: WebGLBuffer = createIbo(sph.i)
const cIbo: WebGLBuffer = createIbo(cub.i)
const pIbo: WebGLBuffer = createIbo(per.i)

// DirectXだとmvp行列だけど、WebGLではかける順番が逆(列オーダーなので)
const mat = new Mat4()
const q = new Quaternion()
const cameraRot: Quaternion = Quaternion.identity()
const modelRot: Quaternion = Quaternion.identity()
// 球面線形補間チェック用

const cameraPos = new Vec3(0.0, 1.0, 20.0)
const cameraUp = new Vec3(0.0, 1.0, 0.0)
const center = new Vec3(0.0, 0.0, 0.0)
let mMatrix = Mat4.identity()
let vMatrix = Mat4.lookAt(cameraPos, center, cameraUp)
const pMatrix = Mat4.createPerspective(45, canvas.width, canvas.height, 0.1, 200)
let mvMatrix = Mat4.identity()

// 視野角90度、アス比はcanvasサイズ、ニアクリップ、ファークリップ

// eyeとlightをmodel行列の逆で求めている例、eyeとlightはもともとワールドにあるから？
// 今の理解だと、positionはローカル座標、mMatrixをかけてワールド座標、　eyeとlightはなぜか逆行列をかけて
// invEye - posみたいにしてVを求めてるけど、わからない
const ambientLight: number[] = [0.1, 0.1, 0.1, 1.0]
const pointLightPosition: number[] = [0, 0, 0]

const uniformList = [
    'modelMatrix',
    'modelViewMatrix',
    'normalMap',
    'cubeTexture',
    'eta',
    'ambientLight',
    'projectionMatrix',
    'pointLightPosition',
    'reflection',
]
const uniformLocation: { [s: string]: WebGLUniformLocation } = {}

uniformList.forEach((s) => {
    uniformLocation[s] = gl.getUniformLocation(program, s)
})

gl.uniform4fv(uniformLocation['ambientLight'], ambientLight)
gl.uniformMatrix4fv(uniformLocation['projectionMatrix'], false, pMatrix.data)
gl.uniform3fv(uniformLocation['pointLightPosition'], pointLightPosition)

const fb = createFramebuffer(256, 256)
let texture0 = null,
    texture1 = null
// テクスチャを生成
createTexture(normalMap, 0)
// createTexture('https://google.github.io/filament/images/screenshot_normal_map_detail.jpg', 1)
// 同じ物体に複数テクスチャとかしない限りは0だけでいい

//////////////////// Cubemap さくせい
// テクスチャ用の変数を用意
let cubeTexture = null

// キューブマップ用イメージのソースを配列に格納
const cubeSourse = [cube_PX, cube_PY, cube_PZ, cube_NX, cube_NY, cube_NZ]

// キューブマップ用のターゲットを格納する配列
// それぞれのキューブマップがどこを向いているか
const cubeTarget = [
    gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
]

// キューブマップテクスチャの生成
create_cube_texture(cubeSourse, cubeTarget)
/////////////////////

console.log(gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)) // 32でた
console.log(gl.TEXTURE_2D, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y)

let count = 0
const range = document.getElementById('alpha') as HTMLInputElement
const type = document.getElementsByName('blend')

function drawScene(): any {
    ++count
    // キャンバス初期化
    {
        gl.clearColor(0.3, 0.3, 0.2, 1.0) // canvas初期化の色
        gl.clearDepth(1.0) // canvas初期化の深度
        gl.clearStencil(0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT) // canvas初期化
    }

    const rad = ((count % 360) * Math.PI) / 180
    const rad2 = (((count + 180) % 360) * Math.PI) / 180
    // let rad2 = (count % 720) * Math.PI / 360; これだとだめなの？
    const x: number = Math.cos(rad)
    const y: number = Math.sin(rad)
    gl.uniform1f(uniformLocation['eta'], Number(range.value) / 100.0)

    // カメラ回転
    {
        // q.rotate(rad2, [1, 0, 0], cameraRot)
        q.toVec3([0.0, 1.0, 20.0], cameraRot, cameraPos)
        q.toVec3([0.0, 1.0, 0.0], cameraRot, cameraUp)
        vMatrix = Mat4.lookAt(cameraPos, center, cameraUp)
    }
    {
        // texture
        // cubemap用
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture)
        gl.uniform1i(uniformLocation['cubeTexture'], 0)
        // normal map用
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, texture0)
        gl.uniform1i(uniformLocation['normalMap'], 1)
    }
    {
        // 背景
        setAttribute(cVbo, attLocation, attStride, cIbo)
        mMatrix = Mat4.identity()
        mMatrix.scale(100, 100, 100)
        mvMatrix = lodash.cloneDeep(vMatrix)
        mvMatrix.multiply(mMatrix)
        gl.uniformMatrix4fv(uniformLocation['modelMatrix'], false, mMatrix.data)
        gl.uniformMatrix4fv(uniformLocation['modelViewMatrix'], false, mvMatrix.data)
        gl.uniform1i(uniformLocation['cubeTexture'], 0)
        gl.uniform1i(uniformLocation['reflection'], 0)
        gl.drawElements(gl.TRIANGLES, cub.i.length, gl.UNSIGNED_SHORT, 0)
    }

    {
        setAttribute(sVbo, attLocation, attStride, sIbo)

        mMatrix = Mat4.identity()
        mMatrix.rotate(rad, new Vec3(0, 0, 1))
        mMatrix.translate(5, 0, 0)
        mvMatrix = lodash.cloneDeep(vMatrix)
        mvMatrix.multiply(mMatrix)
        gl.uniform1i(uniformLocation['cubeTexture'], 0)
        gl.uniform1i(uniformLocation['reflection'], 1)
        gl.uniformMatrix4fv(uniformLocation['modelMatrix'], false, mMatrix.data)
        gl.uniformMatrix4fv(uniformLocation['modelViewMatrix'], false, mvMatrix.data)
        gl.drawElements(gl.TRIANGLES, sph.i.length, gl.UNSIGNED_SHORT, 0)
    }

    {
        setAttribute(tVbo, attLocation, attStride, tIbo)
        mMatrix = Mat4.identity()
        mMatrix.rotate(rad2, new Vec3(0, 0, 1))
        mMatrix.translate(5, 0, 0)
        mMatrix.rotate(rad, new Vec3(1, 0, 1))
        mvMatrix = lodash.cloneDeep(vMatrix)
        mvMatrix.multiply(mMatrix)
        gl.uniform1i(uniformLocation['cubeTexture'], 0)
        gl.uniform1i(uniformLocation['reflection'], 1)
        gl.uniformMatrix4fv(uniformLocation['modelMatrix'], false, mMatrix.data)
        gl.uniformMatrix4fv(uniformLocation['modelViewMatrix'], false, mvMatrix.data)
        gl.drawElements(gl.TRIANGLES, trs.i.length, gl.UNSIGNED_SHORT, 0)
    }

    gl.flush()
    setTimeout(drawScene, 1000 / 30)
}

drawScene()

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// 2次元座標から回転角？
// マウスムーブイベントに登録する処理
function mouseMove(e) {
    const cw = canvas.width
    const ch = canvas.height
    const wh = 1 / Math.sqrt(cw * cw + ch * ch)
    let x = e.clientX - canvas.offsetLeft - cw * 0.5
    let y = e.clientY - canvas.offsetTop - ch * 0.5
    let sq = Math.sqrt(x * x + y * y)
    const r = sq * 2.0 * Math.PI * wh
    if (sq != 1) {
        sq = 1 / sq
        x *= sq
        y *= sq
    }
    cameraRot.makeQuaternionFromAxis(r, new Vec3(y, x, 0.0))
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

// キューブマップテクスチャを生成する関数
function create_cube_texture(source, target) {
    // インスタンス用の配列
    const cImg = []

    for (let i = 0; i < source.length; i++) {
        // インスタンスの生成
        cImg[i] = new cubeMapImage()

        // イメージオブジェクトのソースを指定
        cImg[i].data.src = source[i]
    }

    // キューブマップ用イメージのコンストラクタ
    function cubeMapImage() {
        // イメージオブジェクトを格納
        this.data = new Image()

        // イメージロードをトリガーにする
        this.data.onload = function () {
            // プロパティを真にする
            this.imageDataLoaded = true

            // チェック関数を呼び出す
            checkLoaded()
        }
    }

    // イメージロード済みかチェックする関数
    function checkLoaded() {
        // 全てロード済みならキューブマップを生成する関数を呼び出す
        if (
            cImg[0].data.imageDataLoaded &&
            cImg[1].data.imageDataLoaded &&
            cImg[2].data.imageDataLoaded &&
            cImg[3].data.imageDataLoaded &&
            cImg[4].data.imageDataLoaded &&
            cImg[5].data.imageDataLoaded
        ) {
            generateCubeMap()
        }
    }

    // キューブマップを生成する関数
    function generateCubeMap() {
        // テクスチャオブジェクトの生成
        const tex = gl.createTexture()

        // テクスチャをキューブマップとしてバインドする
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex)

        // ソースを順に処理する
        for (let j = 0; j < source.length; j++) {
            // テクスチャへイメージを適用
            gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cImg[j].data)
        }

        // ミップマップを生成
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP)

        // テクスチャパラメータの設定
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        // キューブマップテクスチャを変数に代入
        cubeTexture = tex

        // テクスチャのバインドを無効化
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
    }
}
