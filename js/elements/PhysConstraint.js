(function (win, doc, PhysJS) {

    'use strict';

    PhysJS.Constraint = function () {
        //各種プロパティを初期化
        this.axis = vec3(0.0);
        this.jacDiagInv = 0.0;
        this.rhs = 0.0;
        this.lowerLimit = 0.0;
        this.upperLimit = 0.0;
        this.accumImpulse = 0.0;
    };

    PhysJS.Constraint.prototype = {
        constructor: PhysJS.Constraint,

        /**
         * 拘束軸
         * @type {vec3}
         */
        axis: null,

        /**
         * 拘束式の分母
         * @type {numer}
         */
        jacDiagInv: null,

        /**
         * 初期拘束力
         * @type {number}
         */
        rhs: null,

        /**
         * 拘束力の下限
         * @type {number}
         */
        lowerLimit: null,

        /**
         * 拘束力の上限
         * @type {number}
         */
        upperLimit: null,

        /**
         * 蓄積される拘束力
         * @type {number}
         */
        accumImpulse: null
    };

}(window, document, PhysJS));
