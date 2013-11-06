(function (win, doc, PhysJS) {

    'use strict';

    /**
     * 2つの線分の最近接点検出
     * @param {vec3} segmentPointA0 線分Aの始点
     * @param {vec3} segmentPointA1 線分Aの終点
     * @param {vec3} segmentPointB0 線分Bの始点
     * @param {vec3} segmentPointB1 線分Bの終点
     * @param[out] {vec3} closestPointA 線分A上の最近接点
     * @param[out] {vec3} closestPointB 線分B上の最近接点
     */
    PhysJS.getClosestTwoSegments = function (
        segmentPointA0, segmentPointA1,
        segmentPointB0, segmentPointB1,
        closestPointA, closestPointB)
    {
        //線分Aのベクトル
        var v1 = vec3.sub(segmentPointA1, segmentPointA0);

        //線分Bのベクトル
        var v2 = vec3.sub(segmentPointB1, segmentPointB0);

        //最近接点のベース？
        var r  = vec3.sub(segmentPointA0, segmentPointB0);

        var a = vec3.dot(v1, v1);
        var b = vec3.dot(v1, v2);
        var c = vec3.dot(v2, v2);
        var d = vec3.dot(v1, r);
        var e = vec3.dot(v2, r);
        var det = -a * c + b * b;

        var s = 0.0,
            t = 0.0;

        //逆行列の存在をチェック
        if (det * det > PhysJS.EPSILON) {
            s = (c * d - b * e) / det;
        }

        //線分A上の再近接点を決めるパラメータsを0.0〜1.0でクランプ
        s = PhysJS.clamp(s, 0.0, 1.0);

        //線分Bのtを求める
        //線分B = P2 + tV2
        //t = dot((segmentPointA0 + s * v1) - segmentB0, v2) / dot(v2, v2);
        t = (e + s * b) / c;

        //線分B上の最近接点を決めるパラメータtを0.0〜1.0でクランプ
        t = PhysJS.clamp(t, 0.0, 1.0);

        //再度、線分A上の点を求める
        //s = dot((segmentPointB0 + t * v2) - segmentPointA0, v1) / dot(v1, v1);
        s = (-d + t * b) / a;
        s = PhysJS.clamp(s, 0.0, 1.0);

        //計算結果をclosestPointA,Bに出力
        vec3.copy(
            vec3.add(segmentPointA0, vec3.multiplyScalar(v1, s)),
            closestPointA
        );

        vec3.copy(
            vec3.add(segmentPointB0, vec3.multiplyScalar(v2, t)),
            closestPointB
        );
    };


    /**
     * @param {vec3} point
     * @param {vec3} linePoint
     * @param {vec3} lineDirection
     * @param[out] {vec3} closestPoint
     */
    PhysJS.getClosestPointLine = function (
        point,
        linePoint,
        lineDirection,
        closestPoint)
    {
        var s = vec3.dot(vec3.sub(point, linePoint), lineDirection) / vec3.dot(lineDirection, lineDirection);
        vec3.copy(
            vec3.add(linePoint, vec3.multiplyScalar(lineDirection, s)),
            closestPoint
        );
    };


    /**
     * 頂点から三角形面への最近接点検出
     * @param {vec3} point 頂点
     * @param {vec3} trianglePoint0 三角形面の頂点0
     * @param {vec3} trianglePoint1 三角形面の頂点1
     * @param {vec3} trianglePoint2 三角形面の頂点2
     * @param {vec3} triangleNormal 三角形面の法線ベクトル
     * @param[out] {vec3} closestPoint 三角形面上の最近接点
     */
    PhysJS.getClosestPointTriangle = function (
        point,
        trianglePoint0,
        trianglePoint1,
        trianglePoint2,
        triangleNormal,
        closestPoint)
    {
        /**
         * 三角形面上の投影点
         * @type {vec3}
         */
        var proj = vec3.sub(
                point,
                vec3.multiplyScalar(triangleNormal, vec3.dot(triangleNormal, vec3.sub(point, trianglePoint0)))
            );

        //エッジP0, P1のボロノイ領域

        /** @type {vec3} */
        var edgeP01 = vec3.sub(trianglePoint1, trianglePoint0);

        /** @type {vec3} */
        var edgeP01_normal = vec3.cross(edgeP01, triangleNormal);

        /** @type {number} */
        var voronoiEdgeP01_check1 = vec3.dot(vec3.sub(proj, trianglePoint0), edgeP01_normal);

        /** @type {number} */
        var voronoiEdgeP01_check2 = vec3.dot(vec3.sub(proj, trianglePoint0), edgeP01);

        /** @type {number} */
        var voronoiEdgeP01_check3 = vec3.dot(vec3.sub(proj, trianglePoint1), vec3.minus(edgeP01));

        if (voronoiEdgeP01_check1 > 0.0 && voronoiEdgeP01_check2 > 0.0 && voronoiEdgeP01_check3 > 0.0) {
            PhysJS.getClosestPointLine(trianglePoint0, edgeP01, proj, closestPoint);
            return;
        }


        //エッジP1, P2のボロノイ領域
        /** @type {vec3} */
        var edgeP12 = vec3.sub(trianglePoint2, trianglePoint1);

        /** @type {vec3} */
        var edge12_normal = vec3.cross(edgeP12, triangleNormal);

        /** @type {number} */
        var voronoiEdgeP12_check1 = vec3.dot(vec3.sub(proj, trianglePoint1), edgeP12_normal);

        /** @type {number} */
        var voronoiEdgeP12_check2 = vec3.dot(vec3.sub(proj, trianglePoint1), edgeP12);

        /** @type {number} */
        var voronoiEdgeP12_check3 = vec3.dot(vec3.sub(proj, trianglePoint2), vec3.minus(edgeP12));

        if (voronoiEdgeP12_check1 > 0.0 && voronoiEdgeP12_check2 > 0.0 && voronoiEdgeP12_check3 > 0.0) {
            PhysJS.getClosestPointLine(trianglePoint1, edgeP12, proj, closestPoint);
            return;
        }

        
        //エッジP2, P2のボロノイ領域
        /** @type {vec3} */
        var edgeP20 = vec3.sub(trianglePoint0, trianglePoint2);

        /** @type {vec3} */
        var edgeP20_normal = vec3.cross(edgeP20, triangleNormal);

        /** @type {number} */
        var voronoiEdgeP20_check1 = vec3.dot(vec3.sub(proj, trianglePoint2), edgeP20_normal);

        /** @type {number} */
        var voronoiEdgeP20_check2 = vec3.dot(vec3.sub(proj, trianglePoint2), edgeP20);

        /** @type {number} */
        var voronoiEdgeP20_check3 = vec3.dot(vec3.sub(proj, trianglePoint0), vec3.minus(edgeP20));

        if (voronoiEdgeP20_check1 > 0.0 && voronoiEdgeP20_check2 > 0.0 && voronoiEdgeP20_check3 > 0.0) {
            PhysJS.getClosestPointLine(trianglePoint2, edgeP20, proj, closestPoint);
            return;
        }

        //三角形の内側
        if (voronoiEdgeP01_check1 <= 0.0 && voronoiEdgeP12_check1 <= 0.0 && voronoiEdgeP20_check1 <= 0.0) {
            vec3.copy(proj, closestPoint);
            return;
        }

        //頂点P0のボロノイ領域
        if (voronoiEdgeP01_check2 <= 0.0 && voronoiEdgeP20_check3 <= 0.0) {
            vec3.copy(trianglePoint0, closestPoint);
            return;
        }

        //頂点P1のボロノイ領域
        if (voronoiEdgeP01_check3 <= 0.0 && voronoiEdgeP12_check2 <= 0.0) {
            vec3.copy(trianglePoint1, closestPoint);
            return;
        }

        //頂点P2のボロノイ領域
        if (voronoiEdgeP20_check2 <= 0.0 && voronoiEdgeP12_check3 <= 0.0) {
            vec3.copy(trianglePoint2, closestPoint);
            return;
        }
    };

}(window, document, PhysJS));
