(function (win, doc, PhysJS) {

    'use strict';

    /**
     * Pair structure.
     * @class
     */
    PhysJS.Pair = function () {
        this.key = -1;
        this.rigidBodyA = -1;
        this.rigidBodyB = -1;
        this.contact  = null;
        this.pairType = null;
    };

    //ペアの種類
    PhysJS.Pair.PairType = {
        PairTypeNew: 0,
        PairTypeKeep: 1
    };

    PhysJS.Pair.prototype = {
        constructor: PhysJS.Pair,
        contact: null
    };

}(window, document, PhysJS));
