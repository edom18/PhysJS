(function (win, doc, PhysJS) {

    'use strict';

    /**
     * Solver body structure.
     * @class
     */
    PhysJS.SolverBody = function () {
        this.deltaLinearVelocity  = vec3(0.0);
        this.deltaAngularVelocity = vec3(0.0);
        this.orientation = quat();
        this.inertiaInv  = mat3();
    };

    PhysJS.SolverBody.prototype = {
        constructor: PhysJS.SolverBody,

        /**
         * 並進速度成分
         * @type {vec3}
         */
        deltaLinearVelocity: null,

        /**
         * 回転速度成分
         * @type {vec3}
         */
        deltaAngularVelocity: null,

        /**
         * 姿勢
         * @type {quat}
         */
        orientation: null,

        /**
         * 慣性テンソルの逆行列
         * @type {mat3}
         */
        inertiaInv: null,

        /**
         * 質量の逆数
         * @type {number}
         */
        massInv: 0
    };

}(window, document, PhysJS));
