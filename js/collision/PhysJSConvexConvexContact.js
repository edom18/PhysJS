(function (win, doc, PhysJS) {

    'use strict';

    //TODO satCountなどの変数を調べる
    PhysJS.CHECK_MINMAX = function (axis, AMin, AMax, BMin, BMax, type) {
        satCount++;
        var d1 = AMin - Bmax;
        var d2 = BMin - AMax;

        if (d1 >= 0.0 || d2 >= 0.0) {
            return false;
        }

        if (distanceMin < d1) {
            distanceMin = d1;
            axisMin = axis;
            satType = type;
            axisFlip = false;
        }
        if (distanceMin < d2) {
            distanceMin = d2;
            axisMin = vec3.multiplyScalar(axis, -1);
            satType = type;
            axisFlip = true;
        }
    };

    function convexConvexContactLocal(convexA, transformA, convexB, transformB, normal, penetrationDepth, contactPointA, contactPointB) {
        var transformAB = mat4(),
            transformBA = mat4(),
            offsetAB = vec3(0.0),
            offsetBA = vec3(0.0);

        //Bローカル→Aローカルへの変換
        transformAB = orthoInverse(transformA) * transformB;
        matrixAB = transformAB.getUpper3x3();
        offsetAB = transformAB.getTranslation();
    }


    /**
     * 2つの凸メッシュの衝突検出
     * @class
     * @param {PhysJS.ConvexMesh} convexA 凸メッシュA
     * @param {PhysJS.Transform3} transformA Aのワールド変換行列
     * @param {PhysJS.ConvexMesh} convexB 凸メッシュB
     * @param {PhysJS.Transform3} transformB Bのワールド変換行列
     * @param {vec3} normal 衝突点の法線ベクトル（ワールド座標系）
     * @parma {number} penetrationDepth 貫通深度
     * @param {vec3} contactPointA 衝突点（剛体Aのローカル座標系）
     * @param {vec3} contactPointB 衝突点（剛体Bのローカル座標系）
     * @return 衝突点を検出した場合はtrueを返す
     */
    PhysJS.ConvexConvexContact = function (convexA, transformA, convexB, transformB, normal, penetrationDepth, contactPointA, contactPointB) {

        //座標系変換の回数を減らすため、面数の多い方を座標系の基準に取る

        var ret;
        if (convexA.m_numFacets >= convexB.m_numFacets) {
            ret = convexConvexContactLocal(
                convexA, transformA,
                convexB, transformB,
                normal, penetrationDepth,
                contactPointA, contactPointB
            );
        }
        else {
            ret = convexConvexContactLocal(
                convexB, transformB,
                convexA, transformA,
                normal, penetrationDepth,
                contactPointB, contactPointA
            );
            vec3.multiplyScalar(normal, -1);
        }

        return ret;
    };

    PhysJS.ConvexConvexContact.SatType = {
        SatTypePointAFacetB: 0,
        SatTypePointBFacetA: 1,
        SatTYpeEdgeEdge    : 2
    };

}(window, document, PhysJS));
