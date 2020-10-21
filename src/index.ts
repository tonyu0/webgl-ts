import frag from '../shader/shader.frag'
import vert from '../shader/shader.vert'
import Matrix4 from '../lib/matrix.ts'


enum ShaderType {
    vertex,
    fragment,
}
// const canvas = document.getElementById('canvas') as HTMLCanvasElement
// canvas.width = 500
// canvas.height = 500

// とりあえず場つなぎで
let canvas = document.createElement("canvas") as HTMLCanvasElement;
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl') as WebGLRenderingContext

const createShader = (shaderType: ShaderType, shaderText: string): WebGLShader | void => {
    const glType = shaderType === ShaderType.vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
    const shader: WebGLShader = gl.createShader(glType)
    // vert or fragでシェーダの受け皿を作る？
    gl.shaderSource(shader, shaderText)
    // sourceの割り当て、shader programのロードかな？
    gl.compileShader(shader)
    // コンパイル、vertもfragも同じ関数でできる。
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : alert(gl.getShaderInfoLog(shader))
}

// programオブジェクト---varyingではvertからfragに値を渡すよね？それをやってくれるやつ。
const createProgram = (vs: WebGLShader, fs: WebGLShader): WebGLProgram | void => {
    const program: WebGLProgram = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    // shaderのリンクが正しく行われたか✓
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return alert(gl.getProgramInfoLog(program))

    // use programするとどこに何がロードされるんだろうか。
    gl.useProgram(program)
    return program
}

const createVbo = (data: number[]): WebGLBuffer => {
    // バッファを操作する場合は、まずバッファをWebGLにバインドする。
    const vbo: WebGLBuffer = gl.createBuffer()
    // バインド
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    // バッファにデータをセット
    // STATIC_DRAW: このバッファがどのような頻度で内容を更新されるか
    // VBOの場合はモデルデータはそのままで何度も利用することになる。
    // のでSTATIC_DRAW?
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    // バインド解除
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return vbo
}

// 自作関数: シェーダーの生成
const vertShader = createShader(ShaderType.vertex, vert) as WebGLShader
const fragShader = createShader(ShaderType.fragment, frag) as WebGLShader

// 自作関数: プログラムの生成とリンク
const program = createProgram(vertShader, fragShader) as WebGLProgram

// attributeLocationの取得(シェーダー内でのattribute変数)
const attLocation: GLint[] = [
    gl.getAttribLocation(program, 'position'),
    gl.getAttribLocation(program, 'color')
]
// 頂点シェーダーにデータを渡す際のインデックスを返す
const attStride: number[] = [3, 4] // (x, y, z), (r, g, b, a)
const vertexPosition: number[] = [
    0.0, 2.0, 0.0,
    1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
]
const vertexColor: number[] = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
]
// モデルデータ

// 自作関数: VBOを生成
const vbo: WebGLBuffer = createVbo(vertexPosition)
gl.bindBuffer(gl.ARRAY_BUFFER, vbo) // VBOをバインド
gl.enableVertexAttribArray(attLocation[0]) // attribute属性を有効に
gl.vertexAttribPointer(attLocation[0], attStride[0], gl.FLOAT, false, 0, 0) // attribute属性を登録
const color_vbo = createVbo(vertexColor)
gl.bindBuffer(gl.ARRAY_BUFFER, color_vbo) // ARRAY_BUFFERってなに？
gl.enableVertexAttribArray(attLocation[1])
gl.vertexAttribPointer(attLocation[1], attStride[1], gl.FLOAT, false, 0, 0)

// DirectXだとmvp行列だけど、WebGLではかける順番が逆(列オーダーなので)
const mat = new Matrix4()
let mMatrix = Matrix4.identity()
const vMatrix = Matrix4.identity()
const pMatrix = Matrix4.identity()
const vpMatrix = Matrix4.identity()
const mvpMatrix = Matrix4.identity()
// ビュー座標変換(カメラを動かす)
// 原点から上に1.0, 後ろに3.0、注視点は原点、上方向はy軸
mat.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix)
// プロジェクション座標変換(透視投影でクリッピング)
// 視野角90度、アス比はcanvasサイズ、ニアクリップ、ファークリップ
mat.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix)
mat.multiply(pMatrix, vMatrix, vpMatrix)
const uniLocation: WebGLUniformLocation = gl.getUniformLocation(program, 'mvpMatrix')

let count = 0;

function drawScene(): any {
    ++count

    gl.clearColor(0.8, 0.8, 0.2, 1.0) // canvas初期化の色
    gl.clearDepth(1.0) // canvas初期化の深度
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // canvas初期化
    let rad: number = count % 360.0 * Math.PI / 180.0
    let x: number = Math.cos(rad)
    let y: number = Math.sin(rad)
    mMatrix = Matrix4.identity()
    mat.translate(mMatrix, [x, y, 0.0], mMatrix)
    mat.multiply(vpMatrix, mMatrix, mvpMatrix)

    gl.uniformMatrix4fv(uniLocation, false, mvpMatrix)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    // 頂点シェーダーは頂点ごとに呼ばれるので、もちろん座標は違うが、変換行列は同じ
    gl.uniformMatrix4fv(uniLocation, false, mvpMatrix)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    mMatrix = Matrix4.identity()
    mat.translate(mMatrix, [0.0, -1.0, 0.0], mMatrix)
    mat.rotate(mMatrix, rad, [0.0, 1.0, 0.0], mMatrix)
    mat.multiply(vpMatrix, mMatrix, mvpMatrix)
    gl.uniformMatrix4fv(uniLocation, false, mvpMatrix)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    let s: number = Math.sin(rad) + 1.0;
    mMatrix = Matrix4.identity()
    mat.translate(mMatrix, [0.0, -3.0, 0.0], mMatrix)
    mat.scale(mMatrix, [s, s, 0.0], mMatrix)
    mat.rotate(mMatrix, rad * 2, [1.0, 0.0, 0.0], mMatrix)
    mat.multiply(vpMatrix, mMatrix, mvpMatrix)

    gl.uniformMatrix4fv(uniLocation, false, mvpMatrix) // uniform変数のindexに4*4行列を登録、第二引数は行列を転置するかどうか、いらない。
    gl.drawArrays(gl.TRIANGLES, 0, 3) // 三角形を、0番目の頂点から3個頂点を使い描画

    gl.flush();
    // (async () => {
    //     delay(1000)
    // })()
    // requestAnimationFrame(drawScene())
    setTimeout(drawScene, 1000 / 30)
}

drawScene()

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}