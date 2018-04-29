import * as d3 from 'd3';

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
     * 第n艦隊なのか(艦隊番号)を指定
     */
    private _fleetIndex: number;
    get fleetIndex(): number { return this._fleetIndex; }

    /**
     * コンストラクタ
     * @param expedition 遠征情報
     * @param timing 遠征が始まるタイミング
     * @param fleetIndex 艦隊番号
     */
    constructor(expedition: Expedition, timing: number, fleetIndex: number) {
        this._expedition = expedition;
        this._timing = timing;
        this._fleetIndex = fleetIndex;
    }
};

/**
 * 遠征情報および遠征タスク情報を格納するデータベース
 */
class DataStore {
    /**
     * 遠征一覧
     */
    private static expeditionList: Array<Expedition>;

    /**
     * データベースを初期化
     */
    static initialize() {
        DataStore.expeditionList = new Array<Expedition>();
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "長距離練習航海", 30, 1, 4));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "海上護衛任務", 90, 0, 1));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "防空射撃演習", 40, 3, 3));
    }
    /**
     * 遠征名・タイミング・艦隊番号から遠征タスクを作成
     * @param name 遠征名
     * @param timing タイミング
     * @param fleetIndex 艦隊番号
     */
    static makeExpeditionTask(name: String, timing: number, fleetIndex: number): ExpeditionTask {
        var expedition = DataStore.expeditionList.filter(e => e.name == name)[0];
        return new ExpeditionTask(expedition, timing, fleetIndex);
    }
};

/**
 * スタートアップ
 */
window.onload = () => {
    var element = document.getElementById("taskList");
    // データベースを初期化
    DataStore.initialize();
    // 遠征タスクを作成
    var expTaskList = new Array<ExpeditionTask>();
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
