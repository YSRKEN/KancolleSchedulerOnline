var Expedition = (function () {
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
var ExpeditionTask = (function () {
    function ExpeditionTask(expedition, timing, fleet_index) {
        this._expedition = expedition;
        this._timing = timing;
        this._fleetIndex = fleet_index;
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
window.onload = function () {
    var exp1 = new Expedition("鎮守府海域", "長距離練習航海", 30, 1, 4);
    var exp2 = new Expedition("鎮守府海域", "海上護衛任務", 90, 0, 1);
    var exp3 = new Expedition("鎮守府海域", "防空射撃演習", 40, 3, 3);
    var expList = [exp1, exp2, exp3];
    var expTask1 = new ExpeditionTask(expList[1], 90, 3);
    var expTask2 = new ExpeditionTask(expList[1], 200, 4);
    var expTaskList = [expTask1, expTask2];
    var element = document.getElementById('taskList');
    for (var i = 0; i < expTaskList.length; ++i) {
        var expTask = expTaskList[i];
        element.innerText += "・" + expTask.expedition.areaName + "-";
        element.innerText += expTask.expedition.name + "　";
        element.innerText += "タイミング：" + expTask.timing + "　";
        element.innerText += "第" + expTask.fleetIndex + "艦隊\n";
    }
};
