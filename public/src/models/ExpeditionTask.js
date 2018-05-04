var models;
(function (models) {
    /**
    * 遠征タスクを表すクラス
    */
    var ExpeditionTask = /** @class */ (function () {
        /**
        * コンストラクタ
        * @param expedition 遠征情報
        * @param timing 遠征が始まるタイミング
        * @param fleetIndex 艦隊番号
        */
        function ExpeditionTask(expedition, timing, fleetIndex) {
            this._expedition = expedition;
            this.timing = timing;
            this.fleetIndex = fleetIndex;
            this.rx = models.Utility.fleetIndexToX(fleetIndex);
            this.ry = models.Utility.timingToY(timing);
            this.tx = this.rx;
            this.ty = this.ry + 18 + 2;
        }
        Object.defineProperty(ExpeditionTask.prototype, "expedition", {
            get: function () { return this._expedition; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExpeditionTask.prototype, "endTiming", {
            /**
            * 遠征の終了タイミング
            */
            get: function () { return this.timing + this.expedition.time; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExpeditionTask.prototype, "hash", {
            /**
            * 比較用ハッシュ関数
            */
            get: function () { return this.timing + this.fleetIndex * models.Constant.ALL_TIMES; },
            enumerable: true,
            configurable: true
        });
        /**
        * 遠征タスクの座標を、艦隊番号とタイミングから設定する
        * @param fleetIndex 艦隊番号
        * @param timing タイミング
        */
        ExpeditionTask.prototype.setTaskPosition = function (fleetIndex, timing) {
            this.rx = models.Utility.fleetIndexToX(fleetIndex);
            this.ry = models.Utility.timingToY(timing);
            this.tx = this.rx;
            this.ty = this.ry + 18 + 2;
            this.fleetIndex = fleetIndex;
            this.timing = timing;
        };
        /**
        * 遠征タスクの座標をドラッグ前に戻す
        */
        ExpeditionTask.prototype.rewindTaskPosition = function () {
            this.setTaskPosition(this.fleetIndex, this.timing);
        };
        return ExpeditionTask;
    }());
    models.ExpeditionTask = ExpeditionTask;
    ;
})(models || (models = {}));
//# sourceMappingURL=ExpeditionTask.js.map