(function (win, doc, PhysJS) {

    'use strict';

    var NUM_CONTACTS = 4;
    var CONTACT_SAME_POINT        = 0.01;
    var CONTACT_THRESHOLD_NORMAL  = 0.01;	// 衝突点の閾値（法線方向）
    var CONTACT_THRESHOLD_TANGENT = 0.002;	// 衝突点の閾値（平面上）

    PhysJS.Contact = function () {
        this.reset();
    };

    /**
     * 衝突点
     * @class
     */
    PhysJS.ContactPoint.prototype = {
        constructor: PhysJS.ContactPoint,

        /**
         * 貫通深度
         * @type {number}
         */
        distance: 0,

        /**
         * 衝突点（剛体Aのローカル座標系）
         * @type {vec3}
         */
        pointA: null,

        /**
         * 衝突点（剛体Bのローカル座標系）
         * @type {vec3}
         */
        pointB: null,

        /**
         * 衝突点の法線ベクトル（ワールド座標系）
         * @type {vec3}
         */
        normal: null,

        /**
         * 拘束（3つの配列）
         * @type {Array.<PhysJS.Constraint>[3]}
         */
        constraints: null,
    
        reset: function () {
            this.constraints = [
                new PhysJS.Constraint(),
                new PhysJS.Constraint(),
                new PhysJS.Constraint()
            ];

            //コンストラクタで初期化
            //this.constraints[0].accumImpulse = 0.0;
            //this.constraints[1].accumImpulse = 0.0;
            //this.constraints[2].accumImpulse = 0.0;
        }
    };

    /**
     * 衝突情報
     * @class
     */
    PhysJS.Contact = function () {
        this.m_contactPoints = [];

        for (var i = 0; i < NUM_CONTACTS; i++) {
            this.m_contactPoints.push(new PhysJS.ContactPoint());
        }
    };

    PhysJS.Contact.prototype = {
        constructor: PhysJS.Contact,

        /**
         * 衝突の数
         * @type {number}
         */
        m_numContacts: null,

        /**
         * 摩擦
         * @type {number}
         */
        m_friction: null,

        /**
         * 衝突点の配列。数はNUM_CONTACTS
         * @type {Array.<PhysJS.ContactPoint>[NUM_CONTACTS]}
         */
        m_contactPoints: null,
    
        /**
         * 同一衝突点を探索する
         * @param newPointA 衝突点（剛体Aのローカル座標系）
         * @param newPointB 衝突点（剛体Bのローカル座標系）
         * @param newNormal 衝突点の法線ベクトル（ワールド座標系）
         * @return 同じ衝突点を見つけた場合はそのインデックスを返す。
         * 見つからなかった場合は -1 を返す。
         */
        findNearestContactPoint: function (newPointA, newPointB, newNormal) {

            var nearestIdx = -1;
            var minDiff = CONTACT_SAME_POINT;

            for (var i = 0; i < this.m_numContacts; i++) {
                var diffA = PhysJS.lengthSqr(
                        vec3.sub(this.m_contactPoints[i].pointA, newPointA)
                    );

                var diffB = PhysJS.lengthSqr(
                        vec3.sub(this.m_contactPoints[i].pointB, newPointB)
                    );

                if (diffA < minDiff && diffB < minDiff && vec3.dot(newNormal, this.m_contactPoints[i].normal) > 0.99) {
                    minDiff = Math.max(diffA, diffB);
                    nearestIdx = i;
                }
            }

            return nearestIdx;
        },

        /**
         * 衝突点を入れ替える
         * @param {vec3} newPoint 衝突点（剛体Aのローカル座標系）
         * @param {number} newDistance 貫通震度
         * @return {number} 破棄する衝突点のインデックスを返す
         */
        sort4ContactPoints: function (newPoint, newDistance) {

            var maxPenetrationIndex = -1;
            var maxPenetration = newDistance;

            //最も深い衝突点は排除対象からはずす
            for (var i = 0; i < this.m_numContacts; i++) {
                if (this.m_contactPoints[i].distance < maxPenetration) {
                    maxPenetrationIndex = i;
                    maxPenetration = this.m_contactPoints[i].distance;
                }
            }

            var res = [0.0, 0.0, 0.0, 0.0];

            //各点を除いたときの衝突点が作る面積のうち、最も大きくなるものを選択
            var newp = vec3(newPoint);
            var p = [
                this.m_contactPoints[0].pointA,
                this.m_contactPoints[1].pointA,
                this.m_contactPoints[2].pointA,
                this.m_contactPoints[3].pointA
            ];

            //newPointを追加し、その点とその他の点の結ぶベクトルから、
            //一番大きな面積のものを選択する
            if (maxPenetrationIndex !== 0) {
                res[0] = PhysJS.calcArea4Points(newp, p[1], p[2], p[3]);
            }
            if (maxPenetrationIndex !== 1) {
                res[1] = PhysJS.calcArea4Points(newp, p[0], p[2], p[3]);
            }
            if (maxPenetrationIndex !== 2) {
                res[2] = PhysJS.calcArea4Points(newp, p[0], p[1], p[3]);
            }
            if (maxPenetrationIndex !== 3) {
                res[3] = PhysJS.calcArea4Points(newp, p[0], p[1], p[2]);
            }

            var maxIndex = 0;
            var maxVal = res[0];

            if (res[1] > maxVal) {
                maxIndex = 1;
                maxVal = res[1];
            }

            if (res[2] > maxVal) {
                maxIndex = 2;
                maxVal = res[2];
            }

            if (res[3] > maxVal) {
                maxIndex = 3;
                maxVal = res[3];
            }

            return maxIndex;
        },

        /**
         * 衝突点を破棄する
         * @param {number} i 破棄する衝突点のインデックス
         */
        removeContactPoint: function (i) {
            //配列最後の点を引数のインデックスの位置に移動
            this.m_contactPoints[i] = this.m_contactPoints[this.m_numContacts - 1];

            //全体の衝突点数を-1
            this.m_numContacts--;
        },

        /**
         * 初期化
         */
        reset: function () {
            this.m_numContacts = 0;
            for (var i = 0; i < NUM_CONTACTS; i++) {
                this.m_contactPoints[i].reset();
            }
        },

        /**
         * 衝突点をリフレッシュする
         * @param {vec3} pA 剛体Aの位置
         * @param {quat} qA 剛体Aの姿勢
         * @param {vec3} pB 剛体Bの位置
         * @param {quat} qB 剛体Bの姿勢
         */
        refresh: function (pA, qA, pB, qB) {

            //衝突点の更新
            //両衝突点間の距離が閾値（CONTACT_THRESHOLD_*）を超えたら消去
            for (var i = 0; i < this.m_numContacts; i++) {
                var normal = this.m_contactPoints[i].normal;
                var cpA = vec3.add(pA, quat.rotateQt(qA, this.m_contactPoints[i].pointA));
                var cpB = vec3.add(pB, quat.rotateQt(qB, this.m_contactPoints[i].pointB));

                //貫通深度がプラスに転じたかどうかをチェック
                var distance = vec3.dot(normal, vec3.sub(cpA, cpB));

                if (distance > CONTACT_THRESHOLD_NORMAL) {
                    this.removeContactPoint(i);
                    i--;
                    continue;
                }

                this.m_contactPoints[i].distance = distance;

                //深度方向を除去して両点の距離をチェック
                //接ベクトル方向？
                cpA = vec3.sub(cpA, vec3.multiplyScalar(normal, this.m_contactPoints[i].distance));
                var distanceAB = PhysJS.lengthSqr(vec3.sub(cpA, cpB));

                if (distanceAB > CONTACT_THRESHOLD_TANGENT) {
                    removeContactPoint(i);
                    i--;
                    continue;
                }
            }
        },

        /**
         * 衝突点をマージする
         * @param {PhysJS.Contact} contact 合成する衝突情報
         */
        merge: function (contact) {

            for (var i = 0; i < contact.m_numContacts; i++) {
                /** @type {PhysJS.ContactPoint} */
                var cp = this.m_contactPoints[i];

                /** @type {number} */
                var id = this.findNearestContactPoint(cp.pointA, cp.pointB, cp.normal);

                if (id >= 0) {
                    if (Math.abs(vec3.dot(cp.normal, this.m_contactPoints[id].normal)) > 0.99) {
                        //同一点を発見、蓄積された情報を引き継ぐ
                        this.m_contactPoints[id].distance = cp.distance;
                        this.m_contactPoints[id].pointA = cp.pointA;
                        this.m_contactPoints[id].pointB = cp.pointB;
                        this.m_contactPoints[id].normal = cp.normal;
                    }
                    else {
                        //同一点ではあるが法線が違うために更新
                        this.m_contactPoints[id] = cp;
                    }
                }
                else if (this.m_numContacts < NUM_CONTACTS) {
                    //衝突点を新規追加
                    this.m_contactPoints[this.m_numContacts++] = cp;
                }
                else {
                    //ソート
                    id = this.sort4ContactPoints(cp.pointA, cp.distance);

                    //コンタクトポイント入れ替え
                    this.m_contactPoints[id] = cp;
                }
            }
        },

        /**
         * 衝突点を追加する
         * @param {number} penetrationDepth 貫通震度
         * @param {vec3} normal 衝突点の法線ベクトル（ワールド座標系）
         * @param {vec3} contactPointA 衝突点（剛体Aのローカル座標系）
         * @param {vec3} contactPointB 衝突点（剛体Bのローカル座標系）
         */
        addContact: function (penetrationDepth, normal, contactPointA, contactPointB) {
            var id = this.findNearestContactPoint(contactPointA, contactPointB, normal);

            if (id < 0 && this.m_numContacts < NUM_CONTACTS) {
                //衝突点を新規追加
                id = this.m_numContacts++;
                this.m_contactPoints[id].reset();
            }
            else if (id < 0) {
                id = this.sort4ContactPoints(contactPointA, penetrationDepth);
                this.m_contactPoints[id].reset();
            }

            this.m_contactPoints[id].distance = penetrationDepth;
            this.m_contactPoints[id].pointA = contactPointA
            this.m_contactPoints[id].pointB = contactPointB
            this.m_contactPoints[id].normal = normal;
        }
    };

}(window, document, PhysJS));
