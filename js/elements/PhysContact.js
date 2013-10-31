(function (win, doc, PhysJS) {

    'use strict';

    var NUM_CONTACTS = 4;

    PhysJS.Contact = function () {
        this.reset();
    };

    /**
     * 衝突点
     * @class
     */
    PhysJS.ContactPoint.prototype = {
        constructor: PhysJS.ContactPoint,

        distance: 0,  //貫通震度
        pointA: null, //衝突点（剛体Aのローカル座標系）
        pointB: null, //衝突点（剛体Bのローカル座標系）
        normal: null, //衝突点の法線ベクトル（ワールド座標系）
        constraints: null, //拘束（3つの配列）
    
        reset: function () {
            //TODO Constraintクラスの初期化にまわしてもいいかも。
            this.constraints = [
                new PhysJS.Constraint(),
                new PhysJS.Constraint(),
                new PhysJS.Constraint()
            ];

            this.constraints[0].accumImpulse = 0.0;
            this.constraints[1].accumImpulse = 0.0;
            this.constraints[2].accumImpulse = 0.0;
        }
    };

    /**
     * 衝突情報
     */
    PhysJS.Contact = function () {
        this.m_contactPoints = [];

        for (var i = 0; i < NUM_CONTACTS; i++) {
            this.m_contactPoints.push(new PhysJS.ContactPoint());
        }
    };

    PhysJS.Contact.prototype = {
        constructor: PhysJS.Contact,

        m_numContacts  : null, //衝突の数
        m_friction     : null, //摩擦
        m_contactPoints: null, //衝突点の配列。数はNUM_CONTACTS
    
        /**
         * 同一衝突点を探索する
         * @param newPointA 衝突点（剛体Aのローカル座標系）
         * @param newPointB 衝突点（剛体Bのローカル座標系）
         * @param newNormal 衝突点の法線ベクトル（ワールド座標系）
         * @return 同じ衝突点を見つけた場合はそのインデックスを返す。
         * 見つからなかった場合は -1 を返す。
         */
        findNearestContactPoint: function (newPointA, newPointB, newNormal) {

        },

        /**
         * 衝突点を入れ替える
         * @param newPoint 衝突点（剛体Aのローカル座標系）
         * @param newDistance 貫通震度
         * @return 破棄する衝突点のインデックスを返す
         */
        sort4ContactPoints: function (newPoint, newDistance) {
            // body...
        },

        /**
         * 衝突点を破棄する
         * @param i 破棄する衝突点のインデックス
         */
        removeContactPoint: function (i) {

        },

        /**
         * 初期化
         */
        reset: function () {

        },

        /**
         * 衝突点をリフレッシュする
         * @param pA 剛体Aの位置
         * @param qA 剛体Aの姿勢
         * @param pB 剛体Bの位置
         * @param qB 剛体Bの姿勢
         */
        refresh: function (pA, qA, pB, qB) {

        },

        /**
         * 衝突点をマージする
         * @param contact 合成する衝突情報
         */
        merge: function (contact) {

        },

        /**
         * 衝突点を追加する
         * @param penetrationDepth 貫通震度
         * @param normal 衝突点の法線ベクトル（ワールド座標系）
         * @param contactPointA 衝突点（剛体Aのローカル座標系）
         * @param contactPointB 衝突点（剛体Bのローカル座標系）
         */
        addContact: function (penetrationDepth, normal, contactPointA, contactPointB) {

        }
    };

}(window, document, PhysJS));
