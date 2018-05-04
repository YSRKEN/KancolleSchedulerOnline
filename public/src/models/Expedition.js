var models;
(function (models) {
    /**
     * 遠征情報を表すクラス
     */
    var Expedition = /** @class */ (function () {
        /**
         * コンストラクタ
         * @param area_name 遠征海域名
         * @param name 遠征名
         * @param time 遠征時間
         * @param color1 色1
         * @param color2 色2
         */
        function Expedition(areaName, name, time, color1, color2) {
            this._areaName = areaName;
            this._name = name;
            this._time = time;
            this._color = [color1, color2];
        }
        Object.defineProperty(Expedition.prototype, "areaName", {
            get: function () { return this._areaName; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Expedition.prototype, "name", {
            get: function () { return this._name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Expedition.prototype, "time", {
            get: function () { return this._time; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Expedition.prototype, "color", {
            get: function () { return this._color; },
            enumerable: true,
            configurable: true
        });
        return Expedition;
    }());
    models.Expedition = Expedition;
    ;
})(models || (models = {}));
//# sourceMappingURL=Expedition.js.map