//import * as d3 from 'd3';
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
;
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
        this._timing = timing;
        this._fleetIndex = fleetIndex;
    }
    Object.defineProperty(ExpeditionTask.prototype, "expedition", {
        get: function () { return this._expedition; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpeditionTask.prototype, "timing", {
        get: function () { return this._timing; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpeditionTask.prototype, "fleetIndex", {
        get: function () { return this._fleetIndex; },
        enumerable: true,
        configurable: true
    });
    return ExpeditionTask;
}());
;
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
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "長距離練習航海", 30, 1, 4));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "海上護衛任務", 90, 0, 1));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "防空射撃演習", 40, 3, 3));
    };
    /**
     * 遠征名・タイミング・艦隊番号から遠征タスクを作成
     * @param name 遠征名
     * @param timing タイミング
     * @param fleetIndex 艦隊番号
     */
    DataStore.makeExpeditionTask = function (name, timing, fleetIndex) {
        var expedition = DataStore.expeditionList.filter(function (e) { return e.name == name; })[0];
        return new ExpeditionTask(expedition, timing, fleetIndex);
    };
    return DataStore;
}());
;
/**
 * スタートアップ
 */
window.onload = function () {
    var element = document.getElementById("taskList");
    // データベースを初期化
    DataStore.initialize();
    // 遠征タスクを作成
    var expTaskList = new Array();
    expTaskList.push(DataStore.makeExpeditionTask("長距離練習航海", 0, 2));
    expTaskList.push(DataStore.makeExpeditionTask("海上護衛任務", 90, 3));
    expTaskList.push(DataStore.makeExpeditionTask("海上護衛任務", 200, 4));
    // 遠征タスクを表示する
    for (var i = 0; i < expTaskList.length; ++i) {
        var expTask = expTaskList[i];
        element.innerText += "・" + expTask.expedition.areaName + "―";
        element.innerText += expTask.expedition.name + "　";
        element.innerText += "タイミング：" + expTask.timing + "　";
        element.innerText += "第" + expTask.fleetIndex + "艦隊\n";
    }
};
//# sourceMappingURL=app.js.map