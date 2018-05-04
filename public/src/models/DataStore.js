var models;
(function (models) {
    /**
     * 遠征情報および遠征タスク情報を格納するデータベース
     */
    var DataStore = /** @class */ (function () {
        function DataStore() {
        }
        /**
         * データベースを初期化
         */
        DataStore.initialize = function () {
            DataStore.expeditionList = new Array();
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "練習航海", 15, 1, 1));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "長距離練習航海", 30, 1, 4));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "警備任務", 20, 2, 2));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "対潜警戒任務", 50, 1, 4));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "海上護衛任務", 90, 0, 1));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "防空射撃演習", 40, 3, 3));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "観艦式予行", 60, 2, 3));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "観艦式", 180, 1, 1));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "兵站強化任務", 25, 0, 1));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "海峡警備行動", 55, 0, 1));
            DataStore.expeditionList.push(new models.Expedition("鎮守府海域", "長時間対潜警戒", 135, 0, 4));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "タンカー護衛任務", 240, 0, 0));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "強行偵察任務", 90, 1, 4));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "ボーキサイト輸送任務", 300, 3, 3));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "資源輸送任務", 480, 1, 2));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "鼠輸送作戦", 240, 0, 1));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "包囲陸戦隊撤収作戦", 360, 1, 2));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "囮機動部隊支援作戦", 720, 2, 3));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "艦隊決戦援護作戦", 900, 0, 1));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "南西方面航空偵察作戦", 35, 2, 3));
            DataStore.expeditionList.push(new models.Expedition("南西諸島海域", "敵泊地強襲反撃作戦", 520, 0, 1));
            DataStore.expeditionList.push(new models.Expedition("北方海域", "敵地偵察作戦", 45, 0, 1));
            DataStore.expeditionList.push(new models.Expedition("北方海域", "航空機輸送作戦", 300, 2, 4));
            DataStore.expeditionList.push(new models.Expedition("北方海域", "北号作戦", 360, 0, 0));
            DataStore.expeditionList.push(new models.Expedition("北方海域", "潜水艦哨戒任務", 120, 2, 2));
            DataStore.expeditionList.push(new models.Expedition("北方海域", "北方鼠輸送作戦", 140, 0, 1));
            DataStore.expeditionList.push(new models.Expedition("北方海域", "北方航路海上護衛", 500, 0, 0));
            DataStore.expeditionList.push(new models.Expedition("西方海域", "潜水艦通商破壊作戦", 1200, 2, 2));
            DataStore.expeditionList.push(new models.Expedition("西方海域", "潜水艦派遣演習", 1440, 3, 3));
            DataStore.expeditionList.push(new models.Expedition("西方海域", "海外艦との接触", 120, 1, 1));
            DataStore.expeditionList.push(new models.Expedition("南方海域", "MO作戦", 420, 2, 3));
            DataStore.expeditionList.push(new models.Expedition("南方海域", "水上機基地建設", 540, 0, 0));
            DataStore.expeditionList.push(new models.Expedition("南方海域", "東京急行", 165, 1, 2));
            DataStore.expeditionList.push(new models.Expedition("南方海域", "東京急行（弐）", 175, 0, 2));
            DataStore.expeditionList.push(new models.Expedition("南方海域", "水上機前線輸送", 410, 0, 1));
        };
        /**
         * 遠征名・タイミング・艦隊番号から遠征タスクを作成
         * @param name 遠征名
         * @param timing タイミング
         * @param fleetIndex 艦隊番号
         */
        DataStore.makeExpeditionTask = function (name, timing, fleetIndex) {
            var expedition = DataStore.expeditionList.filter(function (e) { return e.name == name; })[0];
            return new models.ExpeditionTask(expedition, timing, fleetIndex);
        };
        Object.defineProperty(DataStore, "makeAreaNameList", {
            /**
             * 海域名の一覧を返す
             * 参考：
             * https://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
             */
            get: function () {
                return this.expeditionList.map(function (e) { return e.areaName; }).filter(function (x, i, self) { return self.indexOf(x) === i; });
            },
            enumerable: true,
            configurable: true
        });
        DataStore.gerNameList = function (areaName) {
            return this.expeditionList.filter(function (e) { return e.areaName == areaName; }).map(function (e) { return e.name; });
        };
        return DataStore;
    }());
    models.DataStore = DataStore;
    ;
})(models || (models = {}));
//# sourceMappingURL=DataStore.js.map