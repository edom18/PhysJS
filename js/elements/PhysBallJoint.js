(function (win, doc, PhysJS) {

    'use strict';

    /**
     * ボールジョイント
     * @class
     */
    PhysJS.BallJoint = function () {
        this.constraint = new PhysJS.Constraint();
    };

    PhysJS.BallJoint.prototype = {
        constructor: PhysJS.BallJoint,

        /**
         * 拘束の強さの調整値
         * @type {number}
         */
        bias: 0,
        
        /**
         * 剛体Aへのインデックス
         * @type {number}
         */
        rigidBodyA: -1,

        /**
         * 剛体Bへのインデックス
         * @type {number}
         */
        rigidBodyB: -1,

        /**
         * 剛体Aのローカル座標系における接続点
         * @type {vec3}
         */
        anchorA: null,

        /**
         * 剛体Bのローカル座標系における接続点
         * @type {vec3}
         */
        anchorB: null,

        /**
         * 拘束
         * @type {PhysJS.Constraint}
         */
        constraint: null,

        /**
         *
         */
        reset: function () {
            this.bias = 0.1;
            this.constraint.accumImpulse = 0.0;
        }
    };

}(window, document, PhysJS));
