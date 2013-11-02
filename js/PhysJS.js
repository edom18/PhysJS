//namespace
window.PhysJS = window.PhysJS || {};

(function (win, doc, PhysJS) {

    'use strict';

    PhysJS.PI = Math.PI;
    PhysJS.EPSILON = 1e-5;
    PhysJS.FLT_MAX = Number.MAX_VALUE;

    PhysJS.clamp = function (v, a, b) {
        return Math.max(a, Math.min(v, b));
    };

    PhysJS.lengthSqr = function (vec) {
        var result;

        result = (vec.x * vec.x);
        result = (result + (vec.y * vec.y));
        result = (result + (vec.z * vec.z));

        return result;
    };

    //衝突点4つから最大の面積を求める？
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

}(window, document, PhysJS));
