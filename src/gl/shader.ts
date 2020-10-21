import { gl } from 'gl'

/**
 * Represents a WebGL shader.
 * */
export default class Shader {
    private _name: string;
    private _program: WebGLProgram;
    private _attributes: { [name: string]: number } = {};
    private _uniforms: { [name: string]: WebGLUniformLocation } = {};

    /**
     * Creates a new shader.
     * @param name The name of shader.
     * @param vertexSource The source of the vertex shader.
     * @param fragmentSource The source of the fragment shader.
     */
    public constructor(name: string, vertexSource: string, fragmentSource: string) {
        this._name = name;
        let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

        this.createProgram(vertexShader, fragmentShader);
        this.detectAttributes();
        this.detectUniforms();
    }

    /** The name of this shader */
    public get name(): string {
        return this._name;
    }

    /**
     * Use this shader
     * */
    public use(): void {
        gl.useProgram(this._program);
    }

    /**
     * Get the location of an attribute with the provided name.
     * @param name The name of attribute
     */
    public getAttributeLocation(name: string): number {
        if (this._attributes[name] === undefined) {
            throw new Error(`Unable to find attribute named '${name}' in shader named '${this._name}`);
        }
        return this._attributes[name];
    }
    /**
     * Get the location of an uniform with the provided name.
     * @param name The name of uniform
     */
    public getUniformLocation(name: string): WebGLUniformLocation {
        if (this._uniforms[name] === undefined) {
            throw new Error(`Unable to find uniform named '${name}' in shader named '${this._name}`);
        }
        return this._uniforms[name];
    }


    private loadShader(source: string, shaderType: number): WebGLShader {
        let shader: WebGLShader = gl.createShader(shaderType);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let error = gl.getShaderInfoLog(shader);
        if (error !== "") {
            throw new Error("Error compiling shader: '" + this._name + "': " + error);
        }

        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        this._program = gl.createProgram();
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);
        let error = gl.getProgramInfoLog(this._program);
        if (error !== "") {
            throw new Error("Error linking shader: '" + this._name + "': " + error);
        }
    }

    private detectAttributes(): void {
        let attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; ++i) {
            let attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
            if (!attributeInfo) {
                break;
            }
            this._attributes[attributeInfo.name] = gl.getAttribLocation(this._program, attributeInfo.name);
        }
    }

    private detectUniforms(): void {
        let uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; ++i) {
            let uniformInfo: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
            if (!uniformInfo) {
                break;
            }
            this._uniforms[uniformInfo.name] = gl.getUniformLocation(this._program, uniformInfo.name);
        }
    }
}