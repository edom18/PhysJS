(function (win, doc, PhysJS) {

    'use strict';

    /**
     * Shape structure.
     * @class
     */
    PhysJS.Shape = function () {
        this.reset();
    };

    PhysJS.Shape.prototype = {
        /**
         * 凸メッシュ
         * @type {PhysJS.ConvexMesh}
         */
        m_geometry: null,

        /**
         * オフセット位置
         * @type {vec3}
         */
        m_offsetPosition: null,

        /**
         * オフセット姿勢
         * @type {quat}
         */
        m_offsetOrientation: null,

        /**
         * ユーザーデータ
         * @type {}
         */
        userData: null,

        //初期化
        reset: function () {
            this.m_geometry = new PhysJS.ConvexMesh();
            this.m_offsetPosition = vec3(0.0);
            this.m_offsetOrientation = quat();
            usetData = {};
        }
    };

}(window, document, PhysJS));
