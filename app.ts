/**
 * 遠征情報を表すクラス
 */
class Expedition {
    /**
     * 遠征海域名
     */
    private _areaName: string;
    get areaName(): string { return this._areaName; }
    /**
     * 遠征名
     */
    private _name: string;
    get name(): string { return this._name; }
    /**
     * 遠征時間
     */
    private _time: number;
    get time(): number { return this._time; }
    /**
     * 色ID(配列)
     */
    private _color: number[];
    get color(): number[] { return this._color; }

    /**
     * コンストラクタ
     * @param area_name 遠征海域名
     * @param name 遠征名
     * @param time 遠征時間
     * @param color1 色1
     * @param color2 色2
     */
    constructor(areaName: string, name: string, time: number, color1: number, color2: number) {
        this._areaName = areaName;
        this._name = name;
        this._time = time;
        this._color = [color1, color2];
    }
};

/**
 * 遠征タスクを表すクラス
 */
class ExpeditionTask {
    /**
     * 遠征情報
     */
    private _expedition: Expedition;
    get expedition(): Expedition { return this._expedition; }
    /**
     * 遠征が始まるタイミングを分単位で指定
     */
    private _timing: number;
    get timing(): number { return this._timing; }
    /**
     * 第n艦隊なのかを指定
     */
    private _fleetIndex: number;
    get fleetIndex(): number { return this._fleetIndex; }

    /**
     * コンストラクタ
     * @param expedition 遠征情報
     * @param timing 遠征が始まるタイミング
     * @param fleet_index 第n艦隊
     */
    constructor(expedition: Expedition, timing: number, fleet_index: number) {
        this._expedition = expedition;
        this._timing = timing;
        this._fleetIndex = fleet_index;
    }
};

/**
 * スタートアップ
 */
window.onload = () => {
    // 遠征リストを初期化
    var exp1 = new Expedition("鎮守府海域", "長距離練習航海", 30, 1, 4);
    var exp2 = new Expedition("鎮守府海域", "海上護衛任務",   90, 0, 1);
    var exp3 = new Expedition("鎮守府海域", "防空射撃演習",   40, 3, 3);
    var expList = [exp1, exp2, exp3];
    // 遠征リストと位置情報から、遠征タスクを作成
    var expTask1 = new ExpeditionTask(expList[1], 90, 3);
    var expTask2 = new ExpeditionTask(expList[1], 200, 4);
    var expTaskList = [expTask1, expTask2];
    // 遠征タスクを表示する
    var element = document.getElementById('taskList');
    for (var i = 0; i < expTaskList.length; ++i) {
        var expTask = expTaskList[i];
        element.innerText += "・" + expTask.expedition.areaName + "-";
        element.innerText += expTask.expedition.name + "　";
        element.innerText += "タイミング：" + expTask.timing + "　";
        element.innerText += "第" + expTask.fleetIndex + "艦隊\n";
    }
};
