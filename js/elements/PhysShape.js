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
        m_geometry: null,          //凸メッシュ
        m_offsetPosition: null,    //オフセット位置
        m_offsetOrientation: null, //オフセット姿勢
        userData: null,            //ユーザーデータ

        reset: function () {
            this.m_geometry = new PhysJS.ConvexMesh();
            this.m_offsetPosition = vec3(0.0);
            this.m_offsetOrientation = quat();
            usetData = {};
        }
    };

}(window, document, PhysJS));
