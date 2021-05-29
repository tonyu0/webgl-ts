export class Vec3 {

}

export class Mat4 {
    private mData: number[] = [];

    constructor()
    constructor(inputData?: number[])

    // make 4x4 zero matrix
    constructor(inputData?: number[]) {
        if (inputData) {
            this.mData = inputData
        } else {
            this.mData = [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ]
        }
    }

    get data(): number[] {
        return this.mData;
    }
    set data(inputData: number[]) {
        this.mData = inputData
    }

    public static identity(): Mat4 {
        return new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }

    // src1 *= src2という感じに
    // 現状srcとdstが同じだと壊れる
    public multiply(rhs: Mat4): void {
        // dst = src2 * src1
        // init dst data
        let data: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                for (let k = 0; k < 4; ++k) {
                    data[i * 4 + j] += rhs.data[i * 4 + k] * this.data[k * 4 + j]
                }
            }
        }
        this.data = data
    };
    public scale(scaleX: number, scaleY: number, scaleZ: number): void {
        const scalemat: Mat4 = new Mat4([
            scaleX, 0, 0, 0,
            0, scaleY, 0, 0,
            0, 0, scaleZ, 0,
            0, 0, 0, 1
        ])
        this.multiply(scalemat)
    };
    public translate(moveX: number, moveY: number, moveZ: number): void {
        const transmat: Mat4 = new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            moveX, moveY, moveZ, 1
        ])
        this.multiply(transmat)
    };

    // make quaternion and toMat4
    public rotate(angle: number, axis: number[]): void {
        let quaternion: Quaternion = new Quaternion;
        quaternion.makeQuaternionFromAxis(angle, axis)
        let rotmat = quaternion.toMat4()
        this.multiply(rotmat)
    };
    public lookAt(eye: number[], center: number[], up: number[], dst: Mat4): Mat4 {
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
            return Mat4.identity();
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
    public static createPerspective(fovy: number, width: number, height: number, near: number, far: number): Mat4 {
        const t = near * Math.tan((fovy * Math.PI) / 360);
        const r = t * width / height;
        return new Mat4(
            [
                near / r, 0, 0, 0,
                0, near / t, 0, 0,
                0, 0, -(far + near) / (far - near), -1,
                0, 0, -(far * near * 2) / (far - near), 0
            ]
        )
    };
    public static createOrtho(left: number, right: number, top: number, bottom: number, near: number, far: number): Mat4 {
        return new Mat4(
            [
                2 / (right - left), 0, 0, 0,
                0, 2 / (top - bottom), 0, 0,
                0, 0, -2 / (far - near), 0,
                -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1]
        )
    };
    public transpose(src: Mat4, dst: Mat4): void {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                dst.data[i * 4 + j] = src.data[i + j * 4]
            }
        }
    };
    public inverse(src: Mat4, dst: Mat4): void {
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



export class Quaternion {
    public x: number
    public y: number
    public z: number
    public w: number
    constructor()
    constructor(inX?: number, inY?: number, inZ?: number, inW?: number)

    constructor(inX?: number, inY?: number, inZ?: number, inW?: number) {
        if (inX && inY && inZ && inW) {
            this.x = inX
            this.y = inY
            this.z = inZ
            this.w = inW
        } else {
            this.x = 0
            this.y = 0
            this.z = 0
            this.w = 1
        }
    }
    public static identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1)
    }
    // Get rotate Quaternion
    // Axis needs to be normalized
    public makeQuaternionFromAxis(angle: number, axis: number[]): void {
        let length = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2])
        if (length == 0) { return }
        axis[0] /= length
        axis[1] /= length
        axis[2] /= length

        let scalar: number = Math.sin(angle / 2.0)
        this.x = axis[0] * scalar
        this.y = axis[1] * scalar
        this.z = axis[2] * scalar
        this.w = Math.cos(angle / 2.0)
    }

    public conjugate(): void {
        this.x *= -1.
        this.y *= -1.
        this.z *= -1.
    }

    public normalize(): void {
        let length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        this.x /= length
        this.y /= length
        this.z /= length
        this.w /= length
    }
    // multiply rhs to this Quaternion
    public multiply(rhs: Quaternion): void {
        let x = this.x, y = this.y, z = this.z, w = this.w
        this.x = x * rhs.w + w * rhs.x + y * rhs.z - z * rhs.y
        this.y = y * rhs.w + w * rhs.y + z * rhs.x - x * rhs.z
        this.z = z * rhs.w + w * rhs.z + x * rhs.y - y * rhs.x
        this.w = w * rhs.w - x * rhs.x - y * rhs.y - z * rhs.z
    }

    // convert vec using quaternion
    public toVec3(vec: number[], qtn: Quaternion, dst: number[]): void {
        let qp: Quaternion = new Quaternion
        let qr: Quaternion = new Quaternion(qtn.x, qtn.y, qtn.z, 1)
        qr.conjugate()
        qp.x = vec[0]
        qp.y = vec[1]
        qp.z = vec[2]
        qr.multiply(qp)
        qr.multiply(qtn)
        dst[0] = qr.x
        dst[1] = qr.y
        dst[2] = qr.z
    }
    public toMat4(): Mat4 {
        let x = this.x, y = this.y, z = this.z, w = this.w;
        return new Mat4(
            [
                1. - 2. * (y * y + z * z), 2. * (x * y + w * z), 2. * (x * z - w * y), 0,
                2. * (x * y - w * z), 1. - 2. * (x * x + z * z), 2. * (y * z + w * x), 0,
                2. * (x * z + w * y), 2. * (y * z - w * x), 1 - 2. * (x * x + y * y), 0,
                0, 0, 0, 1
            ]
        )
    }
    public slerp(qtn1, qtn2, time, dest) {
        var ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3];
        var hs = 1.0 - ht * ht;
        if (hs <= 0.0) {
            dest[0] = qtn1[0];
            dest[1] = qtn1[1];
            dest[2] = qtn1[2];
            dest[3] = qtn1[3];
        } else {
            hs = Math.sqrt(hs);
            if (Math.abs(hs) < 0.0001) {
                dest[0] = (qtn1[0] * 0.5 + qtn2[0] * 0.5);
                dest[1] = (qtn1[1] * 0.5 + qtn2[1] * 0.5);
                dest[2] = (qtn1[2] * 0.5 + qtn2[2] * 0.5);
                dest[3] = (qtn1[3] * 0.5 + qtn2[3] * 0.5);
            } else {
                var ph = Math.acos(ht);
                var pt = ph * time;
                var t0 = Math.sin(ph - pt) / hs;
                var t1 = Math.sin(pt) / hs;
                dest[0] = qtn1[0] * t0 + qtn2[0] * t1;
                dest[1] = qtn1[1] * t0 + qtn2[1] * t1;
                dest[2] = qtn1[2] * t0 + qtn2[2] * t1;
                dest[3] = qtn1[3] * t0 + qtn2[3] * t1;
            }
        }
        return dest;
    }
}