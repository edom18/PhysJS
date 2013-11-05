//namespace
window.PhysJS = window.PhysJS || {};

(function (win, doc, PhysJS) {

    'use strict';

    PhysJS.PI = Math.PI;
    PhysJS.EPSILON = 1e-5;
    PhysJS.FLT_MAX = Number.MAX_VALUE;

    /**
     * vをaとbの間になるようにクランプする
     * @param {number} v
     * @param {number} a
     * @param {number} b
     */
    PhysJS.clamp = function (v, a, b) {
        return Math.max(a, Math.min(v, b));
    };


    /**
     * 渡されたふたつのベクトルの各成分を比較し、大きい方を使用した新しいベクトルを作る
     * @param {vec3} vec0
     * @param {vec3} vec1
     * @return {vec3}
     */
    PhysJS.maxPerElem = function (vec0, vec1) {
        return vec3(
            (vec0.x > vec1.x) ? vec0.x : vec1.x,
            (vec0.y > vec1.y) ? vec0.y : vec1.y,
            (vec0.z > vec1.z) ? vec0.z : vec1.z
        );
    };

    /**
     * 渡されたふたつのベクトルの各成分を比較し、小さい方を使用した新しいベクトルを作る
     * @param {vec3} vec0
     * @param {vec3} vec1
     * @return {vec3}
     */
    PhysJS.minPerElem = function (vec0, vec1) {
        return vec3(
            (vec0.x < vec1.x) ? vec0.x : vec1.x,
            (vec0.y < vec1.y) ? vec0.y : vec1.y,
            (vec0.z < vec1.z) ? vec0.z : vec1.z
        );
    };

    /**
     * ベクトルの長さの平方根を得る
     */
    PhysJS.lengthSqr = function (vec) {
        var result;

        result = (vec.x * vec.x);
        result = (result + (vec.y * vec.y));
        result = (result + (vec.z * vec.z));

        return result;
    };

    /**
     * 衝突点4つから最大の面積を求める
     * @param {vec3} p0
     * @param {vec3} p1
     * @param {vec3} p2
     * @param {vec3} p3
     */
    PhysJS.calcArea4Points = function (p0, p1, p2, p3) {
        var areaSqrA = PhysJS.lengthSqr(
                vec3.cross(vec3.sub(p0, p1), vec3.sub(p2, p3))
            );
        var areaSqrB = PhysJS.lengthSqr(
                vec3.cross(vec3.sub(p0, p2), vec3.sub(p1, p3))
            );
        var areaSqrC = PhysJS.lengthSqr(
                vec3.cross(vec3.sub(p0, p3), vec3.sub(p1, p2))
            );

        return Math.max(areaSqrA, areaSqrB, areaSqrC);
    };

    /**
     * @param {vec3} normal
     * @param {vec3} tangent1
     * @param {vec3} tangent2
     */
    PhysJS.calcTangentVector = function (normal, tangent1, tangent2) {
        var vec = vec3(1.0, 0.0, 0.0);
        var n   = vec3(normal);

        n[0] = 0.0;

        if (PhysJS.lengthSqr(n) < PhysJS.EPSILON) {
            vec = vec3(0.0, 1.0, 0.0);
        }

        vec3.copy(vec3.normalize(vec3.cross(normal, vec)), tangent1);
        vec3.copy(vec3.normalize(vec3.cross(tangent1, normal)), tangent2);
    };

}(window, document, PhysJS));
