(function (win, doc, PhysJS) {

    'use strict';

    var NUM_SHAPES = 5;

    PhysJS.Collidable = function () {
        this.m_shapes = new Array(NUM_SHAPES);
        this.reset();
    };

    PhysJS.Collidable.prototype = {
        constructor: PhysJS.Collidable,

        /**
         * 保持する形状数
         * @type {number}
         */
        m_numShapes: null,

        /**
         * 形状の配列
         * @type {Array.<PhysJS.Shape>[NUM_SHAPES]}
         */
        m_shapes: null,

        /**
         * AABBの中心
         * @type {vec3}
         */
        m_center: null,

        /**
         * AABBのサイズの半分
         * @type {vec3}
         */
        m_half: null,

        /**
         * 初期化
         */
        reset: function () {
            this.m_numShapes = 0;
            this.m_center = vec3(0.0);
            this.m_half   = vec3(0.0);
        },

        /**
         * 形状を登録する
         * 空きがなければ無視される
         * @param {PhysJS.Shape} shape 形状
         */
        addShape: function (shape) {
            if (this.m_numShapes < NUM_SHAPES) {
                this.m_shapes[this.m_numShapes++] = shape;
            }
        },

        /**
         * 形状登録の完了を通知する
         * すべての形状を登録したあとに呼び出し、全体を囲むAABBを作成する
         */
        finish: function () {

            //AABBを計算する
            var aabbMax = vec3(-PhysJS.FLT_MAX),
                aabbMin = vec3(PhysJS.FLT_MAX);

            for (var i = 0; i < this.m_numShapes; i++) {
                var mesh = this.m_shapes[i].m_geometry;

                for (var v = 0; v < mesh.m_numVertices; v++) {
                    aabbMax = PhysJS.maxPerElem(
                        aabbMax,
                        vec3.add(
                            this.m_shapes[i].m_offsetPosition,
                            quat.rotateQt(
                                this.m_shapes[i].m_offsetOrientation,
                                mesh.m_vertices[v]
                            )
                        )
                    );

                    aabbMin = PhysJS.minPerElem(
                        aabbMin,
                        vec3.add(
                            this.m_shapes[i].m_offsetPosition,
                            quat.rotateQt(
                                this.m_shapes[i].m_offsetOrientation,
                                mesh.m_vertices[v]
                            )
                        )
                    );
                }
            }

            this.m_center = vec3.multiplyScalar(vec3.add(aabbMax, aabbMin), 0.5);
            this.m_half   = vec3.multiplyScalar(vec3.sub(aabbMax, aabbMin), 0.5);
        }
    };

}(window, document, PhysJS));
