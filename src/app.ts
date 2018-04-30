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
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "長時間対潜警戒", 135, 0, 4));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "強行偵察任務", 90, 1, 4));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "鼠輸送作戦", 240, 0, 1));
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

class Constant{
    /**
     * 遠征タスクの横幅
     */
    static TASK_WIDTH: number = 150;
    /**
     * 遠征タスクの縦幅(/分)
     */
    static TASK_HEIGHT_PER_TIME: number = 1;
    /**
     * 遠征の総艦隊数
     */
    static FLEET_COUNT: number = 3;
    /**
     * 1日の分数
     */
    static ALL_TIMES: number = 60 * 24;
    /**
     * 時間を表示するための余白
     */
    static CANVAS_HOUR_MARGIN: number = 50;
    /**
     * スケジュール表示の横幅
     */
    static CANVAS_WIDTH: number = Constant.TASK_WIDTH * Constant.FLEET_COUNT + Constant.CANVAS_HOUR_MARGIN;
    /**
     * スケジュール表示の縦幅
     */
    static CANVAS_HEIGHT: number = Constant.TASK_HEIGHT_PER_TIME * Constant.ALL_TIMES;
};

class MainController {
    /**
     * 遠征タスクの一覧
     */
    private expTaskList: Array<ExpeditionTask> = new Array<ExpeditionTask>();
    /**
     * 遠征スケジュールを描画するための盤面
     */
    private canvas;
    /**
     * 遠征タスクを初期化
     */
    private initializeCanvas(){
        // SVG要素でcanvasを作成
        this.canvas = d3.select("#canvas").append("svg")
            .attr("width", Constant.CANVAS_WIDTH)
            .attr("height", Constant.CANVAS_HEIGHT);
        // 縦方向の罫線
        // (太さ1の黒い実線)
        for(var w = 0; w <= Constant.FLEET_COUNT; ++w){
            this.canvas.append("line")
                .attr("x1", Constant.TASK_WIDTH * w + Constant.CANVAS_HOUR_MARGIN)
                .attr("x2", Constant.TASK_WIDTH * w + Constant.CANVAS_HOUR_MARGIN)
                .attr("y1", 0)
                .attr("y2", Constant.CANVAS_HEIGHT)
                .attr("stroke-width", 1)
                .attr("stroke", "black");
        }
        // 横方向の罫線と時刻表示
        // (太さ1の黒い実線、文字は18pxで遠征スケジュールの左側に表示)
        for(var h = 0; h <= 24; ++h){
            this.canvas.append("line")
                .attr("y1", Constant.TASK_HEIGHT_PER_TIME * 60 * h)
                .attr("y2", Constant.TASK_HEIGHT_PER_TIME * 60 * h)
                .attr("x1", 0 + Constant.CANVAS_HOUR_MARGIN)
                .attr("x2", Constant.CANVAS_WIDTH + Constant.CANVAS_HOUR_MARGIN)
                .attr("stroke-width", 1)
                .attr("stroke", "black");
            var hour = (h + 5) % 24;
            var hourString = hour.toString() + ":00";
            this.canvas.append("text")
                .attr("x", Constant.CANVAS_HOUR_MARGIN - hourString.length * 18 / 2)
                .attr("y", Constant.TASK_HEIGHT_PER_TIME * 60 * h + (h == 0 ? 18 : h == 24 ? 0 : 9))
                .attr("font-size", "18px")
                .text(hourString);
        }
    }
    /**
     * 遠征スケジュールを再描画する
     */
    redrawCanvas(){
        // 遠征タスクをまとめて消去
        this.canvas.selectAll("g").remove();
        // 遠征タスクをまとめて描画するための下地
        var tasks = this.canvas.selectAll("boxes")
            .data(this.expTaskList)
            .enter()
            .append("g");
        // 遠征タスクをまとめて描画
        // (枠の色は透明度0％の黒、内部塗りつぶしは透明度20％のskyblue)
        tasks.append("rect")
            .attr("x",function(task){
                return Constant.TASK_WIDTH * task.fleetIndex + Constant.CANVAS_HOUR_MARGIN;
            })
            .attr("y",function(task){
                return Constant.TASK_HEIGHT_PER_TIME * task.timing;
            })
            .attr("width",Constant.TASK_WIDTH)
            .attr("height",function(task){
                return Constant.TASK_HEIGHT_PER_TIME * task.expedition.time;
            })
            .attr("stroke", "black")
            .style("opacity", 0.8)
            .attr("fill","skyblue");
        // (文字は18pxで、遠征タスク枠の左上に横向きで描画)
        tasks.append("text")
            .attr("x",function(task){
                return Constant.TASK_WIDTH * task.fleetIndex + Constant.CANVAS_HOUR_MARGIN + 2;
            })
            .attr("y",function(task){
                return Constant.TASK_HEIGHT_PER_TIME * task.timing + 18 + 2;
            })
            .attr("font-size", "18px")
            .text(function(task){
                return task.expedition.name;
            });
    }
    test(){
        this.expTaskList.length = 0;
        this.expTaskList.push(DataStore.makeExpeditionTask("海上護衛任務",0,2));
        this.expTaskList.push(DataStore.makeExpeditionTask("海上護衛任務",100,1));
        this.expTaskList.push(DataStore.makeExpeditionTask("海上護衛任務",200,0));
    }
    /**
     * コンストラクタ
     */
    constructor(){
        // expTaskListを初期化
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒",95,0));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務",95,1));
        this.expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦",95,2));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒",230,0));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務",185,1));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒",425,0));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒",815,0));
        this.expTaskList.push(DataStore.makeExpeditionTask("長時間対潜警戒",950,0));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務",425,1));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務",815,1));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務",905,1));
        this.expTaskList.push(DataStore.makeExpeditionTask("強行偵察任務",995,1));
        this.expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦",425,2));
        this.expTaskList.push(DataStore.makeExpeditionTask("鼠輸送作戦",815,2));
        // canvasを初期化
        this.initializeCanvas();
    }
};

/**
 * スタートアップ
 */
window.onload = () => {
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
