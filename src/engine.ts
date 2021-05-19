import { gl, GLUtilities } from './gl/gl'
import Shader from './gl/shader'
import { AttrInfo, GLBuffer } from './gl/glBuffer'

/** 中枢 */
export default class Engine {
    // canvas, shader, bufferをくらすとして管理
    private _canvas: HTMLCanvasElement
    private _shader: Shader
    private _buffer: GLBuffer

    /** メインループを開始する */
    public constructor() {
        this._canvas = GLUtilities.initialize()
        gl.clearColor(0.5, 0, 0.6, 1)
        this.loadShaders()
        this._shader.use()

        this.createBuffer()

        this.resize()
        this.loop()
    }

    /** 画面のリサイズに対応する */
    public resize(): void {
        if (this._canvas !== undefined) {
            this._canvas.width = window.innerWidth
            this._canvas.height = window.innerHeight
            gl.viewport(0, 0, this._canvas.width, this._canvas.height)
        }
    }

    // javascript is single-threaded, and for inifinite loop, we need an event based loop.
    /** main loop */
    public loop(): void {
        gl.clear(gl.COLOR_BUFFER_BIT)
        // set uniforms
        const colorPosition = this._shader.getUniformLocation('u_color')
        gl.uniform4f(colorPosition, 1, 0.5, 0, 1)

        this._buffer.bind()
        this._buffer.draw()
        requestAnimationFrame(this.loop.bind(this))
    }

    private createBuffer(): void {
        this._buffer = new GLBuffer(3)
        const positionAttribute = new AttrInfo()
        positionAttribute.location = this._shader.getAttributeLocation('position')
        positionAttribute.offset = 0
        positionAttribute.size = 3
        this._buffer.addAttributeLocation(positionAttribute)

        const vertices = [
            // x, y, z
            0,
            0,
            0,
            0,
            0.5,
            0,
            0.5,
            0.5,
            0,
            0.5,
            0.5,
            0,
            0.5,
            0,
            0,
            0,
            0,
            0,
        ]
        this._buffer.pushBackData(vertices)
        this._buffer.upload()
        console.log(this._buffer)
        this._buffer.unbind()
    }

    private loadShaders(): void {
        const vertexShaderSource = `
attribute vec3 position;
uniform   mat4 mvpMatrix;
void main() {
    gl_Position =  vec4(position, 1.0);
}`
        const fragmentShaderSource = `
precision mediump float;

uniform vec4 u_color;
void main() {
    gl_FragColor = u_color;
}`
        this._shader = new Shader('basic', vertexShaderSource, fragmentShaderSource)
    }
}
