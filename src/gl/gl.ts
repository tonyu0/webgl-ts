/** WebGL rendering  */
export var gl: WebGLRenderingContext;

/** Responsible for setting up a WebGL rendering context. */
export class GLUtilities {

    /**
     * Initializes WebGL, potentially using the canvas with an assigned id 
     * @param elementId The id for the element to search for
     */
    public static initialize(): HTMLCanvasElement {
        let canvas = document.createElement("canvas") as HTMLCanvasElement;
        document.body.appendChild(canvas);

        gl = canvas.getContext("webgl");
        if (gl === undefined) {
            throw new Error("Unable to initialize WebGL!!!");
        }
        return canvas;
    }
}