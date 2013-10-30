(function (win, doc, PhysJS) {

    'use strict';

    /**
     * Rigid body structure.
     * @class
     */
    PhysJS.RigidBody = function () {
        this.reset();
    };
    PhysJS.RigidBody.prototype = {
        m_inertia: null, //慣性テンソル
        m_mass: null, //質量
        m_restitution: null, //反発係数
        m_friction: null, //摩擦係数

        reset: function () {
            this.m_mass = 1.0;
            this.m_inertia = mat3();
            this.m_restitution = 0.2;
            this.m_friction = 0.6;
        }
    };

}(window, document, PhysJS));
