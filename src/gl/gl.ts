/** WebGL rendering  */
export var gl: WebGLRenderingContext

/** Responsible for setting up a WebGL rendering context. */
export class GLUtilities {
    /**
     * Initializes WebGL, potentially using the canvas with an assigned id
     * @param elementId The id for the element to search for
     */
    public static initialize(): HTMLCanvasElement {
        const canvas = document.createElement('canvas') as HTMLCanvasElement
        document.body.appendChild(canvas)

        gl = canvas.getContext('webgl', { stencil: true })
        if (gl === undefined) {
            throw new Error('Unable to initialize WebGL!!!')
        }
        return canvas
    }
}
