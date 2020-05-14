const canvas = document.getElementById('canvas') as HTMLCanvasElement
canvas.width = 500
canvas.height = 500

const gl = canvas.getContext('webgl') as WebGLRenderingContext
gl.clearColor(0.8, 0.2, 0.3, 1.0)
gl.clearDepth(1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
