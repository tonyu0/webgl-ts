export default class Matrix4 {
    private _data: number[] = [];
    // (DXに比べて)OpenGLだと行列の形は変わらないが
    // 変換は前からかける

    // 行列を1次元配列で表現すると可読性が下がる
    // C++なら2次元配列で書いてshaderに渡すときにreinterpret_castとかあるけど
    // TSは普通に1次元で書いた方がいいだろうか？
    constructor()
    constructor(_in?: number[])

    // make 4x4 zero matrix
    constructor(_in?: number[]) {
        if (_in) {
            this._data = _in
        } else {
            this._data = [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ]
        }
    }

    get data(): number[] {
        return this._data;
    }
    set data(_in: number[]) {
        this._data = _in
    }

    public static identity(): Matrix4 {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }

    // src1 *= src2
    public multiply(src1: Matrix4, src2: Matrix4, dst: Matrix4): void {
        // dst = src2 * src1
        // init dst data
        dst.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                for (let k = 0; k < 4; ++k) {
                    // 変換は前からかける
                    dst.data[i * 4 + j] += src2.data[i * 4 + k] * src1.data[k * 4 + j]
                }
            }
        }
    };
    public scale(src: Matrix4, scaleX: number, scaleY: number, scaleZ: number, dst: Matrix4): void {
        const scalemat: Matrix4 = new Matrix4([
            scaleX, 0, 0, 0,
            0, scaleY, 0, 0,
            0, 0, scaleZ, 0,
            0, 0, 0, 1
        ])
        this.multiply(src, scalemat, dst)
    };
    public translate(src: Matrix4, moveX: number, moveY: number, moveZ: number, dst: Matrix4): void {
        const transmat: Matrix4 = new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            moveX, moveY, moveZ, 1
        ])
        this.multiply(src, transmat, dst)
    };
    public rotate(src: Matrix4, angle: number, axis: number[], dst: Matrix4): void {
        let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
        if (!sq) {
            return null;
        }
        let a = axis[0],
            b = axis[1],
            c = axis[2];
        if (sq != 1) {
            sq = 1 / sq;
            a *= sq;
            b *= sq;
            c *= sq;
        }
        const d = Math.sin(angle),
            e = Math.cos(angle),
            f = 1 - e,
            g = src.data[0],
            h = src.data[1],
            i = src.data[2],
            j = src.data[3],
            k = src.data[4],
            l = src.data[5],
            m = src.data[6],
            n = src.data[7],
            o = src.data[8],
            p = src.data[9],
            q = src.data[10],
            r = src.data[11],
            s = a * a * f + e,
            t = b * a * f + c * d,
            u = c * a * f - b * d,
            v = a * b * f - c * d,
            w = b * b * f + e,
            x = c * b * f + a * d,
            y = a * c * f + b * d,
            z = b * c * f - a * d,
            A = c * c * f + e;
        // 回転行列を作って投げる
        if (angle) {
            if (src.data != dst.data) {
                dst.data[12] = src.data[12];
                dst.data[13] = src.data[13];
                dst.data[14] = src.data[14];
                dst.data[15] = src.data[15];
            }
        } else {
            dst.data = src.data;
        }
        dst.data[0] = g * s + k * t + o * u;
        dst.data[1] = h * s + l * t + p * u;
        dst.data[2] = i * s + m * t + q * u;
        dst.data[3] = j * s + n * t + r * u;
        dst.data[4] = g * v + k * w + o * x;
        dst.data[5] = h * v + l * w + p * x;
        dst.data[6] = i * v + m * w + q * x;
        dst.data[7] = j * v + n * w + r * x;
        dst.data[8] = g * y + k * z + o * A;
        dst.data[9] = h * y + l * z + p * A;
        dst.data[10] = i * y + m * z + q * A;
        dst.data[11] = j * y + n * z + r * A;
    };
    public lookAt(eye: number[], center: number[], up: number[], dst: Matrix4): Matrix4 {
        const eyeX = eye[0],
            eyeY = eye[1],
            eyeZ = eye[2],
            upX = up[0],
            upY = up[1],
            upZ = up[2],
            centerX = center[0],
            centerY = center[1],
            centerZ = center[2];
        if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
            return Matrix4.identity();
        }
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
        z0 = eyeX - center[0];
        z1 = eyeY - center[1];
        z2 = eyeZ - center[2];
        l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= l;
        z1 *= l;
        z2 *= l;
        x0 = upY * z2 - upZ * z1;
        x1 = upZ * z0 - upX * z2;
        x2 = upX * z1 - upY * z0;
        l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!l) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            l = 1 / l;
            x0 *= l;
            x1 *= l;
            x2 *= l;
        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!l) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            l = 1 / l;
            y0 *= l;
            y1 *= l;
            y2 *= l;
        }
        dst.data[0] = x0;
        dst.data[1] = y0;
        dst.data[2] = z0;
        dst.data[3] = 0;
        dst.data[4] = x1;
        dst.data[5] = y1;
        dst.data[6] = z1;
        dst.data[7] = 0;
        dst.data[8] = x2;
        dst.data[9] = y2;
        dst.data[10] = z2;
        dst.data[11] = 0;
        dst.data[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
        dst.data[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
        dst.data[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
        dst.data[15] = 1;
        return dst;
    };
    // not affine
    public perspective(fovy: number, aspect: number, near: number, far: number, dst: Matrix4): void {
        const t = near * Math.tan((fovy * Math.PI) / 360);
        const r = t * aspect;
        const a = r * 2,
            b = t * 2,
            c = far - near;
        dst.data[0] = (near * 2) / a;
        dst.data[1] = 0;
        dst.data[2] = 0;
        dst.data[3] = 0;
        dst.data[4] = 0;
        dst.data[5] = (near * 2) / b;
        dst.data[6] = 0;
        dst.data[7] = 0;
        dst.data[8] = 0;
        dst.data[9] = 0;
        dst.data[10] = -(far + near) / c;
        dst.data[11] = -1;
        dst.data[12] = 0;
        dst.data[13] = 0;
        dst.data[14] = -(far * near * 2) / c;
        dst.data[15] = 0;
    };
    public ortho(left: number, right: number, top: number, bottom: number, near: number, far: number, dst: Matrix4): void {
        let h: number = (right - left);
        let v: number = (top - bottom);
        let d: number = (far - near);
        dst.data[0] = 2 / h;
        dst.data[1] = 0;
        dst.data[2] = 0;
        dst.data[3] = 0;
        dst.data[4] = 0;
        dst.data[5] = 2 / v;
        dst.data[6] = 0;
        dst.data[7] = 0;
        dst.data[8] = 0;
        dst.data[9] = 0;
        dst.data[10] = -2 / d;
        dst.data[11] = 0;
        dst.data[12] = -(left + right) / h;
        dst.data[13] = -(top + bottom) / v;
        dst.data[14] = -(far + near) / d;
        dst.data[15] = 1;
    };
    public transpose(src: Matrix4, dst: Matrix4): void {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                dst.data[i * 4 + j] = src.data[i + j * 4]
            }
        }
    };
    public inverse(src: Matrix4, dst: Matrix4): void {
        const a = src.data[0],
            b = src.data[1],
            c = src.data[2],
            d = src.data[3],
            e = src.data[4],
            f = src.data[5],
            g = src.data[6],
            h = src.data[7],
            i = src.data[8],
            j = src.data[9],
            k = src.data[10],
            l = src.data[11],
            m = src.data[12],
            n = src.data[13],
            o = src.data[14],
            p = src.data[15],
            q = a * f - b * e,
            r = a * g - c * e,
            s = a * h - d * e,
            t = b * g - c * f,
            u = b * h - d * f,
            v = c * h - d * g,
            w = i * n - j * m,
            x = i * o - k * m,
            y = i * p - l * m,
            z = j * o - k * n,
            A = j * p - l * n,
            B = k * p - l * o,
            ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
        dst.data[0] = (f * B - g * A + h * z) * ivd;
        dst.data[1] = (-b * B + c * A - d * z) * ivd;
        dst.data[2] = (n * v - o * u + p * t) * ivd;
        dst.data[3] = (-j * v + k * u - l * t) * ivd;
        dst.data[4] = (-e * B + g * y - h * x) * ivd;
        dst.data[5] = (a * B - c * y + d * x) * ivd;
        dst.data[6] = (-m * v + o * s - p * r) * ivd;
        dst.data[7] = (i * v - k * s + l * r) * ivd;
        dst.data[8] = (e * A - f * y + h * w) * ivd;
        dst.data[9] = (-a * A + b * y - d * w) * ivd;
        dst.data[10] = (m * u - n * s + p * q) * ivd;
        dst.data[11] = (-i * u + j * s - l * q) * ivd;
        dst.data[12] = (-e * z + f * x - g * w) * ivd;
        dst.data[13] = (a * z - b * x + c * w) * ivd;
        dst.data[14] = (-m * t + n * r - o * q) * ivd;
        dst.data[15] = (i * t - j * r + k * q) * ivd;
    };
}
