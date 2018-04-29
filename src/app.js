"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
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
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "長時間対潜警戒", 135, 0, 4));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "強行偵察任務", 90, 1, 4));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "鼠輸送作戦", 240, 0, 1));
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
    Constant.CANVAS_HOUR_MARGIN = 50;
    /**
     * スケジュール表示の横幅
     */
    Constant.CANVAS_WIDTH = Constant.TASK_WIDTH * Constant.FLEET_COUNT + Constant.CANVAS_HOUR_MARGIN;
    /**
     * スケジュール表示の縦幅
     */
    Constant.CANVAS_HEIGHT = Constant.TASK_HEIGHT_PER_TIME * Constant.ALL_TIMES;
    return Constant;
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
    expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 95, 0));
    expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 95, 1));
    expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦", 95, 2));
    expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 230, 0));
    expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 185, 1));
    expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 425, 0));
    expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 815, 0));
    expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 950, 0));
    expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 425, 1));
    expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 815, 1));
    expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 905, 1));
    expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 995, 1));
    expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦", 425, 2));
    expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦", 815, 2));
    // 遠征タスクを表示する
    /*for (var i = 0; i < expTaskList.length; ++i) {
        var expTask = expTaskList[i];
        element.innerText += "・" + expTask.expedition.areaName + "―";
        element.innerText += expTask.expedition.name + "　";
        element.innerText += "タイミング：" + expTask.timing + "　";
        element.innerText += "第" + expTask.fleetIndex + "艦隊\n";
    }*/
    // 遠征タスクを描画する
    var canvas = d3.select("#canvas").append("svg")
        .attr("width", Constant.CANVAS_WIDTH)
        .attr("height", Constant.CANVAS_HEIGHT);
    for (var w = 0; w <= Constant.FLEET_COUNT; ++w) {
        canvas.append("line")
            .attr("x1", Constant.TASK_WIDTH * w + Constant.CANVAS_HOUR_MARGIN)
            .attr("x2", Constant.TASK_WIDTH * w + Constant.CANVAS_HOUR_MARGIN)
            .attr("y1", 0)
            .attr("y2", Constant.CANVAS_HEIGHT)
            .attr("stroke-width", 1)
            .attr("stroke", "black");
    }
    for (var h = 0; h <= 24; ++h) {
        canvas.append("line")
            .attr("y1", Constant.TASK_HEIGHT_PER_TIME * 60 * h)
            .attr("y2", Constant.TASK_HEIGHT_PER_TIME * 60 * h)
            .attr("x1", 0 + Constant.CANVAS_HOUR_MARGIN)
            .attr("x2", Constant.CANVAS_WIDTH + Constant.CANVAS_HOUR_MARGIN)
            .attr("stroke-width", 1)
            .attr("stroke", "black");
        var hour = (h + 5) % 24;
        var hourString = hour.toString() + ":00";
        canvas.append("text")
            .attr("x", Constant.CANVAS_HOUR_MARGIN - hourString.length * 18 / 2)
            .attr("y", Constant.TASK_HEIGHT_PER_TIME * 60 * h + (h == 0 ? 18 : 9))
            .attr("font-size", "18px")
            .text(hourString);
    }
    var tasks = canvas.selectAll("boxes")
        .data(expTaskList)
        .enter()
        .append("g");
    tasks.append("rect")
        .attr("x", function (task) {
        return Constant.TASK_WIDTH * task.fleetIndex + Constant.CANVAS_HOUR_MARGIN;
    })
        .attr("y", function (task) {
        return Constant.TASK_HEIGHT_PER_TIME * task.timing;
    })
        .attr("width", Constant.TASK_WIDTH)
        .attr("height", function (task) {
        return Constant.TASK_HEIGHT_PER_TIME * task.expedition.time;
    })
        .attr("stroke", "black")
        .style("opacity", 0.8)
        .attr("fill", "skyblue");
    tasks.append("text")
        .attr("x", function (task) {
        return Constant.TASK_WIDTH * task.fleetIndex + Constant.CANVAS_HOUR_MARGIN + 2;
    })
        .attr("y", function (task) {
        return Constant.TASK_HEIGHT_PER_TIME * task.timing + 18 + 2;
    })
        .attr("font-size", "18px")
        .text(function (task) {
        return task.expedition.name;
    });
};
//# sourceMappingURL=app.js.map