import { gl } from '../src/gl/gl'

export enum ShaderType {
    vertex,
    fragment,
}


export const createShader = (shaderType: ShaderType, shaderText: string): WebGLShader | void => {
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
export const createProgram = (vs: WebGLShader, fs: WebGLShader): WebGLProgram | void => {
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

export const createVbo = (data: number[]): WebGLBuffer => {
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

export const setAttribute = (vbo: WebGLBuffer[], attributeLocation: number[], attributeStride: number[], ibo: WebGLBuffer): void => {
    for (let i in vbo) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]) // VBOをバインド
        gl.enableVertexAttribArray(attributeLocation[i]) // attribute属性を有効に
        gl.vertexAttribPointer(attributeLocation[i], attributeStride[i], gl.FLOAT, false, 0, 0) // attribute属性を登録
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
}

export const createIbo = (data: number[]): WebGLBuffer => {
    const ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    // インデックスなのでint16
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW)
    // バインド解除って、　つまりここまではCPU上とGPU上がつながっている？
    // iboはGPU上の参照を返す？
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    return ibo
}


// あえてフレームバッファのサイズを個別に変数として保持しているのは、後々、座標変換行列を生成する際にアスペクト比などを指定する処理に利用するためです。
// フレームバッファをオブジェクトとして生成する関数
export function createFramebuffer(width, height) {
    // フレームバッファの生成
    var frameBuffer = gl.createFramebuffer();

    // フレームバッファをWebGLにバインド
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    // 深度バッファ用レンダーバッファの生成とバインド
    var depthRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);

    // レンダーバッファを深度バッファとして設定
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    // フレームバッファにレンダーバッファを関連付ける
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);

    // フレームバッファ用テクスチャの生成
    var fTexture = gl.createTexture();

    // フレームバッファ用のテクスチャをバインド
    gl.bindTexture(gl.TEXTURE_2D, fTexture);

    // フレームバッファ用のテクスチャにカラー用のメモリ領域を確保
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // テクスチャパラメータ
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // フレームバッファにテクスチャを関連付ける
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);

    // 各種オブジェクトのバインドを解除
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // オブジェクトを返して終了
    return { f: frameBuffer, d: depthRenderBuffer, t: fTexture };
}


// まだ理解してない 
// キューブマップをフレームバッファで作成する場合は、方向づけが必要
// **二次元のテクスチャをフレームバッファにアタッチする場合には、この関数内部でテクスチャのアタッチまで行なっていました。
// **しかしフレームバッファにキューブマップテクスチャをアタッチする場合には、実際にレンダリングが行なわれる段階でアタッチを行ないます。
// フレームバッファをオブジェクトとして生成する関数(キューブマップ仕様)
function createCubeFramebuffer(width, height, target) {
    // フレームバッファの生成
    var frameBuffer = gl.createFramebuffer();

    // フレームバッファをWebGLにバインド
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    // 深度バッファ用レンダーバッファの生成とバインド
    var depthRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);

    // レンダーバッファを深度バッファとして設定
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    // フレームバッファにレンダーバッファを関連付ける
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);

    // フレームバッファ用テクスチャの生成
    var fTexture = gl.createTexture();

    // フレームバッファ用のテクスチャをキューブマップテクスチャとしてバインド
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, fTexture);

    // フレームバッファ用のテクスチャにカラー用のメモリ領域を 6 面分確保
    for (var i = 0; i < target.length; i++) {
        gl.texImage2D(target[i], 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    // あとは実際にフレームバッファにレンダリングを行なう際に、どの面に対してのレンダリングなのかを明確に通知してアタッチしてやれば、動的なキューブマップの生成が行なえます。

    // テクスチャパラメータ
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 各種オブジェクトのバインドを解除
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // オブジェクトを返して終了
    return { f: frameBuffer, d: depthRenderBuffer, t: fTexture };
}