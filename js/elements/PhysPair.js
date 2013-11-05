(function (win, doc, PhysJS) {

    'use strict';

    /**
     * Pair structure
     * @class
     */
    PhysJS.Pair = function () {
        this.contact = new PhysJS.Contact();
    };

    PhysJS.Pair.PairType = {
        pairTypeNew:  0, //新規
        pairTypeKeep: 1  //維持
    };

    PhysJS.Pair.prototype = {
        constructor: PhysJS.Pair,

        /**
         * ペアの種類
         * @type {PhysJS.Pair.PairType}
         */
        pairType: null,

        /**
         * ユニークなキー
         * @type {number}
         */
        key: -1,

        /**
         * 剛体Aのインデックス
         * @type {number}
         */
        rigidBodyA: -1,

        /**
         * 剛体Bのインデックス
         * @type {number}
         */
        rigidBodyB: -1,

        /**
         * 衝突情報
         * @type {PhysJS.Contact}
         */
        contact: null
    };

}(window, document, PhysJS));
