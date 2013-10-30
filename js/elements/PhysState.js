(function (win, doc, PhysJS) {

    'use strict';

    var MAX_LINEAR_VELOCITY = 340.0;
    var MAX_ANGULAR_VELOCITY = Math.PI * 60.0;

    /**
     * Rigid body structure.
     * @class
     */
    PhysJS.State = function () {
        this.reset();
    };

    PhysJS.State.MotionType = {
        MotionTypeActive: 0, //アクティブ
        MotionTypeStatic: 1  //固定
    };

    PhysJS.State.prototype = {
        m_position: null,        //位置
        m_orientation: null,     //姿勢
        m_linearVelocity: null,  //並進速度
        m_angularVelocity: null, //回転速度
        m_motionType: null,      //ふるまい

        reset: function () {
            this.m_position = vec3(0.0);
            this.m_orientation = quat();
            this.m_linearVelocity = vec3(0.0);
            this.m_angularVelocity = vec3(0.0);
            this.m_motionType = PhysJS.State.MotionType.MotionTypeActive;
        }
    };

}(window, document, PhysJS));
