var models;
(function (models) {
    /**
     * 各種定数定義
     */
    var Constant = /** @class */ (function () {
        function Constant() {
        }
        /**
         * 遠征タスクの横幅
         */
        Constant.TASK_WIDTH = 150;
        /**
         * 遠征タスクの縦幅(/分)
         */
        Constant.TASK_HEIGHT_PER_TIME = 1;
        /**
         * 遠征の総艦隊数
         */
        Constant.FLEET_COUNT = 3;
        /**
         * 1日の分数
         */
        Constant.ALL_TIMES = 60 * 24;
        /**
         * 時間を表示するための余白
         */
        Constant.CANVAS_HOUR_MARGIN = 40;
        /**
         * 上下方向の余白
         */
        Constant.CANVAS_HEIGHT_MARGIN = 20;
        /**
         * 左右方向の余白
         */
        Constant.CANVAS_WIDTH_MARGIN = 20;
        /**
         * スケジュール表示の横幅
         */
        Constant.CANVAS_WIDTH = Constant.TASK_WIDTH * Constant.FLEET_COUNT + Constant.CANVAS_HOUR_MARGIN + Constant.CANVAS_WIDTH_MARGIN * 2;
        /**
         * スケジュール表示の縦幅
         */
        Constant.CANVAS_HEIGHT = Constant.TASK_HEIGHT_PER_TIME * Constant.ALL_TIMES + Constant.CANVAS_HEIGHT_MARGIN * 2;
        return Constant;
    }());
    models.Constant = Constant;
    ;
})(models || (models = {}));
//# sourceMappingURL=Constant.js.map