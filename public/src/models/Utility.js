var models;
(function (models) {
    /**
     * ユーティリティ関数
     */
    var Utility = /** @class */ (function () {
        function Utility() {
        }
        /**
         * 入力値を[min, max]に丸める
         * @param x 入力値
         * @param min 最小値
         * @param max 最大値
         */
        Utility.Limit = function (x, min, max) {
            return (x < min ? min : x > max ? max : x);
        };
        /**
         * タイミング→縦座標
         */
        Utility.timingToY = function (timing) {
            return models.Constant.TASK_HEIGHT_PER_TIME * timing + models.Constant.CANVAS_HEIGHT_MARGIN;
        };
        /**
         * 艦隊番号→横座標
         */
        Utility.fleetIndexToX = function (fleetIndex) {
            return models.Constant.TASK_WIDTH * fleetIndex + models.Constant.CANVAS_HOUR_MARGIN + models.Constant.CANVAS_WIDTH_MARGIN;
        };
        /**
         * 縦座標→タイミング
         */
        Utility.yToTiming = function (y) {
            return Math.floor(Utility.Limit((y - models.Constant.CANVAS_HEIGHT_MARGIN) / models.Constant.TASK_HEIGHT_PER_TIME, 0, models.Constant.ALL_TIMES - 1));
        };
        /**
         * 横座標→艦隊番号
         */
        Utility.xToFleetIndex = function (x) {
            return Math.floor(Utility.Limit((x + models.Constant.TASK_WIDTH / 2 - models.Constant.CANVAS_HOUR_MARGIN - models.Constant.CANVAS_WIDTH_MARGIN) / models.Constant.TASK_WIDTH, 0, models.Constant.FLEET_COUNT - 1));
        };
        return Utility;
    }());
    models.Utility = Utility;
    ;
})(models || (models = {}));
//# sourceMappingURL=Utility.js.map