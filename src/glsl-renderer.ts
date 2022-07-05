import { gl, GLUtilities } from './gl/gl'
import vert from '../shader/passthrough.vert'
import frag from '../shader/hanabi.frag'
import {
	ShaderType,
	createShader,
	createProgram,
	createVbo,
	setAttribute,
	createIbo,
	createFramebuffer,
} from '../lib/shaderUtil'
// 現状、onloadで出るべきところがべた書きになってり

function mouseMove(e) {
	const cw = canvas.width
	const ch = canvas.height
	mx = e.offsetX / cw
	my = e.offsetY / ch
}
const canvas: HTMLCanvasElement = GLUtilities.initialize()
canvas.addEventListener('mousemove', mouseMove, true)
// setting
// これらを動的に変更するにはJS的にはどうすればいいのだろう？
// gl.enable(gl.CULL_FACE)
gl.enable(gl.DEPTH_TEST)
gl.depthFunc(gl.LEQUAL)
gl.enable(gl.STENCIL_TEST)
// cULL: gl.CCW = face, DEPTH: gl.LEQUAL, STENCIL: WEBGLにstencil bufferを使うことを通知。コンテキスト生成時にstencilができている必要あり。
// シェーダーの生成:
// TODO: vs, psを同じファイルにまとめてエントリーポイントで指定できないか？
const vertShader = createShader(ShaderType.vertex, vert) as WebGLShader
const fragShader = createShader(ShaderType.fragment, frag) as WebGLShader
const program = createProgram(vertShader, fragShader) as WebGLProgram

const attLocation: GLint[] = [gl.getAttribLocation(program, 'position')]
const attStride: number[] = [3]

const position = [-1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0]
const index = [0, 2, 1, 1, 2, 3]
const vbo: WebGLBuffer[] = [createVbo(position)]
const ibo: WebGLBuffer = createIbo(index)
setAttribute(vbo, attLocation, attStride, ibo)

const uniformList = ['time', 'mouse', 'resolution']
const uniformLocation: { [s: string]: WebGLUniformLocation } = {}

uniformList.forEach((s) => {
	uniformLocation[s] = gl.getUniformLocation(program, s)
})

const fb = createFramebuffer(256, 256)
console.log(gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)) // 32でた
console.log(gl.TEXTURE_2D, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y)

let mx = 0.5
let my = 0.5
const startTime = new Date().getTime()
const range = document.getElementById('alpha') as HTMLInputElement
const type = document.getElementsByName('blend')

function drawScene(): any {
	const time = (new Date().getTime() - startTime) * 0.001
	// キャンバス初期化
	{
		gl.clearColor(0, 0, 0, 0) // canvas初期化の色
		gl.clearDepth(1.0) // canvas初期化の深度
		gl.clearStencil(0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT) // canvas初期化
	}

	gl.uniform1f(uniformLocation['time'], time)
	gl.uniform2f(uniformLocation['mouse'], mx, my)
	gl.uniform2f(uniformLocation['resolution'], canvas.width, canvas.height)
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

	gl.flush()
	setTimeout(drawScene, 1000 / 30)
}

drawScene()
