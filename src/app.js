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
        this.timing = timing;
        this.fleetIndex = fleetIndex;
        this.rx = Utility.fleetIndexToX(fleetIndex);
        this.ry = Utility.timingToY(timing);
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
        get: function () { return this.timing + this.fleetIndex * Constant.ALL_TIMES; },
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
    Constant.CANVAS_HOUR_MARGIN = 50;
    /**
     * 上下方向の余白
     */
    Constant.CANVAS_HEIGHT_MARGIN = 20;
    /**
     * スケジュール表示の横幅
     */
    Constant.CANVAS_WIDTH = Constant.TASK_WIDTH * Constant.FLEET_COUNT + Constant.CANVAS_HOUR_MARGIN;
    /**
     * スケジュール表示の縦幅
     */
    Constant.CANVAS_HEIGHT = Constant.TASK_HEIGHT_PER_TIME * Constant.ALL_TIMES + Constant.CANVAS_HEIGHT_MARGIN * 2;
    return Constant;
}());
;
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
        return Constant.TASK_HEIGHT_PER_TIME * timing + Constant.CANVAS_HEIGHT_MARGIN;
    };
    /**
     * 艦隊番号→横座標
     */
    Utility.fleetIndexToX = function (fleetIndex) {
        return Constant.TASK_WIDTH * fleetIndex + Constant.CANVAS_HOUR_MARGIN;
    };
    /**
     * 縦座標→タイミング
     */
    Utility.yToTiming = function (y) {
        return Math.floor(Utility.Limit((y - Constant.CANVAS_HEIGHT_MARGIN) / Constant.TASK_HEIGHT_PER_TIME, 0, Constant.ALL_TIMES - 1));
    };
    /**
     * 横座標→艦隊番号
     */
    Utility.xToFleetIndex = function (x) {
        return Math.floor(Utility.Limit((x + Constant.TASK_WIDTH / 2 - Constant.CANVAS_HOUR_MARGIN) / Constant.TASK_WIDTH, 0, Constant.FLEET_COUNT - 1));
    };
    return Utility;
}());
;
var MainController = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function MainController() {
        /**
         * 遠征タスクの一覧
         */
        this.expTaskList = new Array();
        /**
         * 遠征スケジュールを描画するための盤面
         * 型推論させるため、意図的にここで代入している
         */
        this.canvas = d3.select("#canvas").append("svg")
            .attr("width", Constant.CANVAS_WIDTH)
            .attr("height", Constant.CANVAS_HEIGHT);
        // expTaskListを初期化
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 95, 0));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 95, 1));
        this.expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦", 95, 2));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 230, 0));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 185, 1));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 425, 0));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 815, 0));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 950, 0));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 425, 1));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 815, 1));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 905, 1));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務", 995, 1));
        this.expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦", 425, 2));
        this.expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦", 815, 2));
        // canvasを初期化
        this.initializeCanvas();
    }
    /**
     * 遠征タスクを初期化
     */
    MainController.prototype.initializeCanvas = function () {
        // 縦方向の罫線
        // (太さ1の黒い実線)
        for (var w = 0; w <= Constant.FLEET_COUNT; ++w) {
            this.canvas.append("line")
                .attr("x1", Utility.fleetIndexToX(w))
                .attr("x2", Utility.fleetIndexToX(w))
                .attr("y1", Utility.timingToY(0))
                .attr("y2", Utility.timingToY(Constant.ALL_TIMES))
                .attr("stroke-width", 1)
                .attr("stroke", "black");
        }
        // 横方向の罫線と時刻表示
        // (太さ1の黒い実線、文字は18pxで遠征スケジュールの左側に表示)
        for (var h = 0; h <= 24; ++h) {
            this.canvas.append("line")
                .attr("y1", Utility.timingToY(60 * h))
                .attr("y2", Utility.timingToY(60 * h))
                .attr("x1", Utility.fleetIndexToX(0))
                .attr("x2", Utility.fleetIndexToX(Constant.FLEET_COUNT + 1))
                .attr("stroke-width", 1)
                .attr("stroke", "black");
            var hour = (h + 5) % 24;
            var hourString = hour.toString() + ":00";
            this.canvas.append("text")
                .attr("x", Constant.CANVAS_HOUR_MARGIN - hourString.length * 18 / 2)
                .attr("y", Constant.TASK_HEIGHT_PER_TIME * 60 * h + 9 + Constant.CANVAS_HEIGHT_MARGIN)
                .attr("font-size", "18px")
                .text(hourString);
        }
    };
    /**
     * 遠征スケジュールを再描画する
     */
    MainController.prototype.redrawCanvas = function () {
        var _this = this;
        // 遠征タスクをまとめて消去
        this.canvas.selectAll("g").remove();
        // 遠征タスクをまとめて描画するための下地
        var tasks = this.canvas.selectAll("g")
            .data(this.expTaskList)
            .enter()
            .append("g")
            .call(d3.drag()
            .on("start", this.dragstartedTask)
            .on("drag", this.draggedTask)
            .on("end", function (d, i) { return _this.dragendedTask(d, i, _this.expTaskList); }));
        // 遠征タスクをまとめて描画
        // (枠の色は透明度0％の黒、内部塗りつぶしは透明度20％のskyblue)
        tasks.append("rect")
            .classed("movable", true)
            .attr("x", function (task) { return task.rx; })
            .attr("y", function (task) { return task.ry; })
            .attr("width", Constant.TASK_WIDTH)
            .attr("height", function (task) {
            return Constant.TASK_HEIGHT_PER_TIME * task.expedition.time;
        })
            .attr("stroke", "black")
            .style("opacity", 0.8)
            .attr("fill", "skyblue");
        // (文字は18pxで、遠征タスク枠の左上に横向きで描画)
        tasks.append("text")
            .classed("movable", true)
            .attr("x", function (task) { return task.tx; })
            .attr("y", function (task) { return task.ty; })
            .attr("font-size", "18px")
            .text(function (task) {
            return task.expedition.name;
        });
    };
    MainController.prototype.test = function () {
        this.expTaskList.length = 0;
        this.expTaskList.push(DataStore.makeExpeditionTask("海上護衛任務", 0, 2));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒", 100, 1));
        this.expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦", 200, 0));
    };
    /**
     * ドラッグスタート時に呼び出される関数
     */
    MainController.prototype.dragstartedTask = function () {
    };
    /**
     * ドラッグ中に呼び出される関数
     */
    MainController.prototype.draggedTask = function (data, index) {
        data.rx += d3.event.dx;
        data.ry += d3.event.dy;
        data.tx += d3.event.dx;
        data.ty += d3.event.dy;
        d3.selectAll("g > rect").filter(function (d, i) { return (i === index); })
            .attr("x", data.rx)
            .attr("y", data.ry);
        d3.selectAll("g > text").filter(function (d, i) { return (i === index); })
            .attr("x", data.tx)
            .attr("y", data.ty);
    };
    /**
     * ドラッグ終了時に呼び出される関数
     */
    MainController.prototype.dragendedTask = function (data, index, expTaskList) {
        // 艦隊番号とタイミングを逆算
        var fleetIndex = Utility.xToFleetIndex(data.tx);
        var timing = Utility.yToTiming(data.ty);
        // 当該艦隊番号における他の遠征一覧を出す
        var candidate = expTaskList.filter(function (task) { return task.fleetIndex == fleetIndex && task.hash != data.hash; });
        // 各種判定処理を行う
        while (true) {
            // candidateの大きさが0ならば、他の遠征と何ら干渉しないのでセーフ
            if (candidate.length == 0) {
                console.log('OK1');
                break;
            }
            // 入れたい遠征がcandidateと明らかに干渉している場合はアウト
            var mediumTiming = timing + data.expedition.time / 2; //入れたい遠征の中央の位置
            console.log('mediumTiming : ' + mediumTiming);
            if (candidate.filter(function (task) { return task.timing <= mediumTiming && mediumTiming <= task.endTiming; }).length > 0) {
                fleetIndex = data.fleetIndex;
                timing = data.timing;
                console.log('NG1');
                break;
            }
            // mediumTimingがcandidateのどの候補の中にも重ならなかった場合、prevTimingとnextTimingの計算を行う
            // prevTiming……遠征を入れたい位置の手前にある遠征の終了タイミング
            // nextTiming……遠征を入れたい位置の後にある遠征の開始タイミング
            var prevTiming = (candidate.some(function (task) { return task.endTiming <= mediumTiming; }) ? candidate.filter(function (task) { return task.endTiming <= mediumTiming; }).sort(function (a, b) { return b.endTiming - a.endTiming; })[0].endTiming : 0);
            var nextTiming = (candidate.some(function (task) { return mediumTiming <= task.timing; }) ? candidate.filter(function (task) { return mediumTiming <= task.timing; }).sort(function (a, b) { return a.endTiming - b.endTiming; })[0].timing : Constant.ALL_TIMES);
            // nextTiming - prevTimingが入れたい遠征の幅より狭い場合、入りっこないのでアウト
            if (nextTiming - prevTiming < data.expedition.time) {
                fleetIndex = data.fleetIndex;
                timing = data.timing;
                console.log('NG2');
                break;
            }
            // そのまま入る場合は文句なくセーフ
            var endTiming = timing + data.expedition.time;
            if (prevTiming <= timing && endTiming <= nextTiming) {
                console.log('OK2');
                break;
            }
            // 位置補正を掛ける
            var moveDistance1 = (prevTiming <= timing ? Constant.ALL_TIMES : prevTiming - timing); //上端が重ならないようにするための最小の下方向への移動量
            var moveDistance2 = (endTiming <= nextTiming ? Constant.ALL_TIMES : endTiming - nextTiming); //下端が～上方向～
            if (moveDistance1 < moveDistance2) {
                // 下方向に動かす
                timing = prevTiming;
                console.log('FIX1');
                break;
            }
            else {
                // 上方向に動かす
                timing = nextTiming - data.expedition.time;
                console.log('FIX2');
                break;
            }
        }
        // 逆算した結果を元に座標修正を掛ける
        data.rx = Utility.fleetIndexToX(fleetIndex);
        data.ry = Utility.timingToY(timing);
        data.tx = data.rx;
        data.ty = data.ry + 18 + 2;
        console.log('' + fleetIndex + ' ' + timing + ' ' + index + '|' + data.fleetIndex + ' ' + data.timing);
        data.fleetIndex = fleetIndex;
        data.timing = timing;
        // 修正した座標を反映
        d3.selectAll("g > text").filter(function (d, i) { return (i === index); })
            .attr("x", data.tx)
            .attr("y", data.ty);
        d3.selectAll("g > rect").filter(function (d, i) { return (i === index); })
            .attr("x", data.rx)
            .attr("y", data.ry);
    };
    return MainController;
}());
;
/**
 * スタートアップ
 */
window.onload = function () {
    var element = document.getElementById("taskList");
    // データベースを初期化
    DataStore.initialize();
    // Controllerを初期化
    var mc = new MainController();
    // 画面を再描画
    mc.redrawCanvas();
    mc.test();
    mc.redrawCanvas();
};
//# sourceMappingURL=app.js.map