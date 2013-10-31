//namespace
window.PhysJS = window.PhysJS || {};

(function (win, doc, PhysJS) {

    'use strict';

    PhysJS.PI = Math.PI;
    PhysJS.EPSILON = 1e-5;

    PhysJS.clamp = function (v, a, b) {
        return Math.max(a, Math.min(v, b));
    };

    PhysJS.lengthSqr = function (vec) {
        var result;
        result = (vec.x * vec.x);
        result = (result + (vec.y * vec.y));
    };

}(window, document, PhysJS));
