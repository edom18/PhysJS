(function (win, doc, PhysJS) {

    'use strict';

    var CONVEX_MESH_MAX_VERTICS = 34;
    var CONVEX_MESH_MAX_EDGES   = 96;
    var CONVEX_MESH_MAX_FACETS  = 64;

    PhysJS.Edge = function () {

    };

    /**
     * Edge structure
     * @class
     */
    PhysJS.Edge = function () {
        this.vertId  = new Array(2);
        this.facetId = new Array(2);
    };
    PhysJS.Edge.prototype = {
        constructor: PhysJS.Edge,
        type:    null,   //エッジの種類
        vertId:  null, //端点の頂点インデックス
        facetId: null //共有する面のインデックス
    };

    //////////////////////////////////////////////////////////

    /**
     * Facet structure
     * @class
     */
    PhysJS.Facet = function () {
        this.vertId = new Array(3);
        this.edgeId = new Array(3);
        this.normal = vec3();
    };
    PhysJS.Facet.prototype = {
        constructor: PhysJS.Facet,
        vertId: null, //頂点インデックス
        edgeId: null, //エッジインデックス
        normal: null  //面法線ベクトル
    };

    //////////////////////////////////////////////////////////

    /**
     * ConvexMesh structure.
     * @class
     */
    PhysJS.ConvexMesh = function () {
        this.reset();
    };

    PhysJS.ConvexMesh.EdgeType = {
        EdgeTypeConvex : 0, //凸エッジ
        EdgeTypeConcave: 1, //凹エッジ
        EdgeTypeFlat   : 2  //平坦エッジ
    };

    PhysJS.ConvexMesh.prototype = {
        constructor: PhysJS.ConvexMesh,

        m_numVertices: null, //頂点数
        m_numFacets  : null, //面数
        m_numEdges   : null, //エッジ数
        m_vertices   : null, //頂点配列
        m_edges      : null, //エッジ配列
        m_facets     : null, //面配列

        reset: function () {
            this.m_numVertices = 0;
            this.m_numFacets   = 0;
            this.m_numEdges    = 0;

            //各情報分の配列を確保
            this.m_vertices = new Array(CONVEX_MESH_MAX_VERTICS);
            this.m_edges    = new Array(CONVEX_MESH_MAX_EDGES);
            this.m_facets   = new Array(CONVEX_MESH_MAX_FACETS);
        }
    };

    /**
     * Get projection from an axis.
     *
     * 軸上に凸メッシュを投影し、最小値と最大値を得る
     *
     * pmin_ 投影領域の最小値
     * pmax_ 投影領域の最大値
     *
     * @param {Physjs.ConvexMesh} convexMesh 凸メッシュ
     * @param {vec3} axis 投影軸
     * @param {Object.<number>} 最小値と最大値を返す
     */
    PhysJS.getProjection = function (convexMesh, axis) {

        console.log(convexMesh);

        var pmin_ =  PhysJS.FLT_MAX;
        var pmax_ = -PhysJS.FLT_MAX;

        for (var i = 0; i < convexMesh.m_numVertices; i++) {
            var prj = vec3.dot(axis, convexMesh.m_vertices[i]);
            pmin_ = Math.min(pmin_, prj);
            pmax_ = Math.max(pmax_, prj);
        }

        return {
            min: pmin_,
            max: pmax_
        };
    };

    /**
     * Create convex mesh.
     *
     * 凸メッシュを作成する
     * ・入力データがすでに凸包になっていること
     * ・3平面から共有されるエッジ、穴あき面は禁止
     * ・縮退面は自動的に削除される
     *
     * @param {Physjs.ConvexMesh} convexMesh 凸メッシュ
     * @param {Array.<number>} vertices 頂点配列
     * @param {Array.<number>} numvertices 頂点数
     * @param {Array.<number>} indices 面インデックス配列
     * @param {number} numIndeces 面インデックス数
     * @param {vec3} scale(= vec3(1.0)) スケール
     * @return {boolean} 凸メッシュの作成に成功した場合はtrueを返す
     */
    PhysJS.createConvexMesh = function (convexMesh, vertices, numVertices, indices, numIndeces, scale) {
        console.log(convexMesh);
        console.log(vertices);
        console.log(indices);
        console.log(dot(scale, scale) > 0.0);

        if (numVertices > CONVEX_MESH_MAX_VERTICS || numIndeces > CONVEX_MESH_MAX_FACETS * 3) {
            return false;
        }

        //頂点バッファ作成
        for (var i = 0; i < numVertices; i++) {
            convexMesh.m_vertices[i][0] = vertices[i * 3 + 0];
            convexMesh.m_vertices[i][1] = vertices[i * 3 + 1];
            convexMesh.m_vertices[i][2] = vertices[i * 3 + 2];
            convexMesh.m_vertices[i]    = vec3.multiply(scale, convexMesh.m_vertices[i]);
        }
        convexMesh.m_numVertices = numVertices;

        //面バッファの作成
        var nf = 0;
        for (var i = 0; i < numIndeces / 3; i++) {
            var p = [
                convexMesh.m_vertices[indices[i * 3 + 0]],
                convexMesh.m_vertices[indices[i * 3 + 1]],
                convexMesh.m_vertices[indices[i * 3 + 2]]
            ];

            var normal = vec3.cross(
                    vec3.sub(p[1], p[0]),
                    vec3.sub(p[2], p[0])
                );
            var areaSqr = vec3.lengthSqr(normal); //面積

            if (areaSqr > PhysJS.EPSILON * PhysJS.EPSILON) { //縮退面は登録しない
                convexMesh.m_facets[nf].vertId[0] = indexces[i * 3 + 0];
                convexMesh.m_facets[nf].vertId[1] = indexces[i * 3 + 1];
                convexMesh.m_facets[nf].vertId[2] = indexces[i * 3 + 2];
                convexMesh.m_facets[nf].normal = vec3.multiplyScalar(normal, 1 / Math.sqrt(areaSqr));
                nf++;
            }
        }
        convexMesh.m_numFacets = nf;

        //エッジバッファ作成
        var edgeIdTable = new Array(CONVEX_MESH_MAX_VERTICS * CONVEX_MESH_MAX_VERTICS / 2);
        //memset(edgeIdTable,0xff,sizeof(edgeIdTable));

        var ne = 0;
        for (var i = 0; i < convexMesh.m_numFacets; i++) {
            var facet = convexMesh.m_facets[i];

            for (var e = 0; e < 3; e++) {
                var vertId0 = Math.min(facet.vertId[e % 3], facet.vertId[(e + 1) % 3]);
                var vertId1 = Math.max(facet.vertId[e % 3], facet.vertId[(e + 1) % 3]);
                var tableId = vertId1 * (vertId1 - 1) / 2 + vertId0;

                if (edgeIdTable[tableId] === 0xff) {
                    convexMesh.m_edges[ne].facetId[0] = i;
                    convexMesh.m_edges[ne].facetId[1] = i;
                    convexMesh.m_edges[ne].vertId[0] = vertId0;
                    convexMesh.m_edges[ne].vertId[1] = vertId1;
                    convexMesh.m_edges[ne].type = PhysJS.ConvexMesh.EdgeType.EdgeTypeConvex; //凸エッジで初期化
                    facet.edgeId[e] = ne;
                    edgeIdTable[tableId] = ne;
                    ne++;

                    if (ne > CONVEX_MESH_MAX_EDGES) {
                        return false;
                    }
                }
                else {
                    //共有面を見つけたので、エッジの角度を判定
                    console.log(edgeIdTable[tableId] < CONVEX_MESH_MAX_EDGES);
                    var edge = convexMesh.m_edges[edgeIdTable[tableId]];
                    var facetB = convexMesh.m_facets[edge.facetId[0]];

                    console.log(edge.facetId[0] === edge.facetId[1]);

                    //エッジに含まれないA面の頂点がB面の表か裏かで判断
                    var s = convexMesh.m_vertices[facet.vertId[(e + 2) % 3]];
                    var q = convexMesh.m_vertices[facetB.vertId[0]];
                    var d = vec3.dot(vec3.sub(s, q), facetB.normal);

                    if (d < -PhysJS.EPSILON) {
                        edge.type = PhysJS.ConvexMesh.EdgeType.EdgeTypeConvex;
                    }
                    else if (d > PhysJS.EPSILON) {
                        //本来ここに来てはいけない
                        edge.type = PhysJS.ConvexMesh.EdgeType.EdgeTypeConcave;
                    }
                    else {
                        edge.type = PhysJS.ConvexMesh.EdgeType.EdgeTypeFlat;
                    }

                    edge.facetId[1] = i;
                }
            }
        }
        convexMesh.m_numEdges = ne;

        return true;
    };

}(window, document, PhysJS));
