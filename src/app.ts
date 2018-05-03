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
    timing: number;
    /**
     * 第n艦隊なのか(艦隊番号)を指定
     */
    fleetIndex: number;
    /**
     * 枠のx座標
     */
    rx: number;
    /**
     * 枠のy座標
     */
    ry: number;
    /**
     * 遠征名のx座標
     */
    tx: number;
    /**
     * 遠征名のy座標
     */
    ty: number;

    /**
     * コンストラクタ
     * @param expedition 遠征情報
     * @param timing 遠征が始まるタイミング
     * @param fleetIndex 艦隊番号
     */
    constructor(expedition: Expedition, timing: number, fleetIndex: number) {
        this._expedition = expedition;
        this.timing = timing;
        this.fleetIndex = fleetIndex;
        this.rx = Utility.fleetIndexToX(fleetIndex);
        this.ry = Utility.timingToY(timing);
        this.tx = this.rx;
        this.ty = this.ry + 18 + 2;
    }
    /**
     * 遠征の終了タイミング
     */
    get endTiming(){ return this.timing + this.expedition.time; }
    get hash(){ return this.timing + this.fleetIndex * Constant.ALL_TIMES; }
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
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "練習航海", 15, 1, 1));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "長距離練習航海", 30, 1, 4));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "警備任務", 20, 2, 2));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "対潜警戒任務", 50, 1, 4));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "海上護衛任務", 90, 0, 1));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "防空射撃演習", 40, 3, 3));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "観艦式予行", 60, 2, 3));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "観艦式", 180, 1, 1));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "兵站強化任務", 25, 0, 1));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "海峡警備行動", 55, 0, 1));
        DataStore.expeditionList.push(new Expedition("鎮守府海域", "長時間対潜警戒", 135, 0, 4));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "タンカー護衛任務", 240, 0, 0));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "強行偵察任務", 90, 1, 4));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "ボーキサイト輸送任務", 300, 3, 3));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "資源輸送任務", 480, 1, 2));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "鼠輸送作戦", 240, 0, 1));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "包囲陸戦隊撤収作戦", 360, 1, 2));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "囮機動部隊支援作戦", 720, 2, 3));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "艦隊決戦援護作戦", 900, 0, 1));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "南西方面航空偵察作戦", 35, 2, 3));
        DataStore.expeditionList.push(new Expedition("南西諸島海域", "敵泊地強襲反撃作戦", 520, 0, 1));
        DataStore.expeditionList.push(new Expedition("北方海域", "敵地偵察作戦", 45, 0, 1));
        DataStore.expeditionList.push(new Expedition("北方海域", "航空機輸送作戦", 300, 2, 4));
        DataStore.expeditionList.push(new Expedition("北方海域", "北号作戦", 360, 0, 0));
        DataStore.expeditionList.push(new Expedition("北方海域", "潜水艦哨戒任務", 120, 2, 2));
        DataStore.expeditionList.push(new Expedition("北方海域", "北方鼠輸送作戦", 140, 0, 1));
        DataStore.expeditionList.push(new Expedition("北方海域", "北方航路海上護衛", 500, 0, 0));
        DataStore.expeditionList.push(new Expedition("西方海域", "潜水艦通商破壊作戦", 1200, 2, 2));
        DataStore.expeditionList.push(new Expedition("西方海域", "潜水艦派遣演習", 1440, 3, 3));
        DataStore.expeditionList.push(new Expedition("西方海域", "海外艦との接触", 120, 1, 1));
        DataStore.expeditionList.push(new Expedition("南方海域", "MO作戦", 420, 2, 3));
        DataStore.expeditionList.push(new Expedition("南方海域", "水上機基地建設", 540, 0, 0));
        DataStore.expeditionList.push(new Expedition("南方海域", "東京急行", 165, 1, 2));
        DataStore.expeditionList.push(new Expedition("南方海域", "東京急行（弐）", 175, 0, 2));
        DataStore.expeditionList.push(new Expedition("南方海域", "水上機前線輸送", 410, 0, 1));
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
    /**
     * 海域名の一覧を返す
     * 参考：
     * https://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
     */
    static get makeAreaNameList(){
        return this.expeditionList.map(e => e.areaName).filter((x, i, self) => self.indexOf(x) === i);
    }
    static gerNameList(areaName: string){
        return this.expeditionList.filter(e => e.areaName == areaName).map(e => e.name);
    }
};

/**
 * 各種定数定義
 */
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
    static CANVAS_HOUR_MARGIN: number = 40;
    /**
     * 上下方向の余白
     */
    static CANVAS_HEIGHT_MARGIN: number = 20;
    /**
     * 左右方向の余白
     */
    static CANVAS_WIDTH_MARGIN: number = 20;
    /**
     * スケジュール表示の横幅
     */
    static CANVAS_WIDTH: number = Constant.TASK_WIDTH * Constant.FLEET_COUNT + Constant.CANVAS_HOUR_MARGIN + Constant.CANVAS_WIDTH_MARGIN * 2;
    /**
     * スケジュール表示の縦幅
     */
    static CANVAS_HEIGHT: number = Constant.TASK_HEIGHT_PER_TIME * Constant.ALL_TIMES + Constant.CANVAS_HEIGHT_MARGIN * 2;
};

/**
 * ユーティリティ関数
 */
class Utility{
    /**
     * 入力値を[min, max]に丸める
     * @param x 入力値
     * @param min 最小値
     * @param max 最大値
     */
    static Limit(x: number, min: number, max: number){
        return (x < min ? min : x > max ? max : x);
    }
    /**
     * タイミング→縦座標
     */
    static timingToY(timing: number){
        return Constant.TASK_HEIGHT_PER_TIME * timing + Constant.CANVAS_HEIGHT_MARGIN;
    }
    /**
     * 艦隊番号→横座標
     */
    static fleetIndexToX(fleetIndex: number){
        return Constant.TASK_WIDTH * fleetIndex + Constant.CANVAS_HOUR_MARGIN + Constant.CANVAS_WIDTH_MARGIN;
    }
    /**
     * 縦座標→タイミング
     */
    static yToTiming(y: number){
        return Math.floor(Utility.Limit((y - Constant.CANVAS_HEIGHT_MARGIN) / Constant.TASK_HEIGHT_PER_TIME, 0, Constant.ALL_TIMES - 1));
    }
    /**
     * 横座標→艦隊番号
     */
    static xToFleetIndex(x: number){
        return Math.floor(Utility.Limit((x + Constant.TASK_WIDTH / 2 - Constant.CANVAS_HOUR_MARGIN - Constant.CANVAS_WIDTH_MARGIN) / Constant.TASK_WIDTH, 0, Constant.FLEET_COUNT - 1));
    }
};

class MainController {
    /**
     * ドラッグ開始時のマウスのX座標
     */
    private dragMouseX: number;
    /**
     * ドラッグ開始時のマウスのY座標
     */
    private dragMouseY: number;
    /**
     * 遠征タスクの一覧
     */
    private expTaskList: Array<ExpeditionTask> = new Array<ExpeditionTask>();
    /**
     * 遠征スケジュールを描画するための盤面
     * 型推論させるため、意図的にここで代入している
     */
    private canvas = d3.select("#canvas").append("svg")
        .attr("width", Constant.CANVAS_WIDTH)
        .attr("height", Constant.CANVAS_HEIGHT);
    private selectedTaskIndex: number = -1;
    /**
     * 遠征タスクを初期化
     */
    private initializeCanvas(){
        // 縦方向の罫線
        // (太さ1の黒い実線)
        this.canvas.selectAll("line.cl").classed("cl", true)
            .data(d3.range(Constant.FLEET_COUNT + 1))
            .enter()
            .append("line")
            .attr("x1", w => Utility.fleetIndexToX(w))
            .attr("x2", w => Utility.fleetIndexToX(w))
            .attr("y1", Utility.timingToY(0))
            .attr("y2", Utility.timingToY(Constant.ALL_TIMES))
            .attr("stroke-width", 1)
            .attr("stroke", "black");
        // 横方向の罫線と時刻表示
        // (太さ1の黒い実線、文字は18pxで遠征スケジュールの左側に表示)
        this.canvas.selectAll("line.rl").classed("rl", true)
            .data(d3.range(24 + 1))
            .enter()
            .append("line")
            .attr("y1", h => Utility.timingToY(60 * h))
            .attr("y2", h => Utility.timingToY(60 * h))
            .attr("x1", Utility.fleetIndexToX(0))
            .attr("x2", Utility.fleetIndexToX(Constant.FLEET_COUNT))
            .attr("stroke-width", 1)
            .attr("stroke", "black");
        var hourStringList = d3.range(24 + 1).map(h => {
            var hour = (h + 5) % 24;
            return hour.toString() + ":00";
        });
        this.canvas.selectAll("text")
            .data(d3.range(24 + 1))
            .enter()
            .append("text")
                .attr("x", h => Utility.fleetIndexToX(0) - hourStringList[h].length * 18 / 2)
                .attr("y", h => Utility.timingToY(60 * h) + 9)
                .attr("font-size", "18px")
                .text((h) => hourStringList[h]);
    }
    /**
     * 遠征海域一覧を初期化
     */
    private initializeAreaNameList(){
        var areaNameList = DataStore.makeAreaNameList;
        areaNameList.unshift("---");
        d3.select("#areaName").on("change", this.initializeExpNameList)
            .selectAll("option").data(areaNameList).enter()
            .append("option").attr("value", d => d).text(d => d);
    }
    /**
     * 遠征海域における遠征一覧を初期化
     * @param areaName 遠征海域
     */
    private initializeExpNameList(){
        var areaName = d3.select("#areaName").property('value');
        var nameList = DataStore.gerNameList(areaName);
        nameList.unshift("---");
        d3.select("#expName")
            .selectAll("option").remove();
        d3.select("#expName").selectAll("option")
            .data(nameList).enter()
            .append("option").attr("value", d2 => d2).text(d2 => d2);
    }
    /**
     * 遠征スケジュールを再描画する
     */
    redrawCanvas(){
        // 遠征タスクをまとめて消去
        this.canvas.selectAll("g").remove();
        // 遠征タスクをまとめて描画するための下地
        var tasks = this.canvas.selectAll("g")
            .data<ExpeditionTask>(this.expTaskList)
            .enter()
            .append("g")
            .call(
                d3.drag<SVGElement, ExpeditionTask>()
                    .on("start", this.dragstartedTask.bind(this))
                    .on("drag", this.draggedTask)
                    .on("end", this.dragendedTask.bind(this))
            );
        // 遠征タスクをまとめて描画
        // (枠の色は透明度0％の黒、内部塗りつぶしは透明度20％のskyblue)
        tasks.append("rect")
            .attr("x", function(task) { return task.rx; })
            .attr("y", function(task) { return task.ry; })
            .attr("width",Constant.TASK_WIDTH)
            .attr("height",function(task){
                return Constant.TASK_HEIGHT_PER_TIME * task.expedition.time;
            })
            .attr("stroke", "black")
            .style("opacity", 0.8)
            .attr("fill","skyblue");
        // (文字は18pxで、遠征タスク枠の左上に横向きで描画)
        tasks.append("text")
            .attr("x", function(task) { return task.tx; })
            .attr("y", function(task) { return task.ty; })
            .attr("font-size", "18px")
            .text(function(task){
                return task.expedition.name;
            });
    }
    /**
     * ドラッグスタート時に呼び出される関数
     */
    private dragstartedTask() {
        // 開始時のマウス座標を記録する
        this.dragMouseX = d3.event.x;
        this.dragMouseY = d3.event.y;
    }
    /**
     * ドラッグ中に呼び出される関数
     */
    private draggedTask(data: ExpeditionTask, index: number) {
        data.rx += d3.event.dx;
        data.ry += d3.event.dy;
        data.tx += d3.event.dx;
        data.ty += d3.event.dy;
        d3.selectAll("g > rect").filter((d, i) => (i === index))
            .attr("x", data.rx)
            .attr("y", data.ry);
        d3.selectAll("g > text").filter((d, i) => (i === index))
            .attr("x", data.tx)
            .attr("y", data.ty);
    }
    /**
     * ドラッグ終了時に呼び出される関数
     */
    private dragendedTask(data: ExpeditionTask, index: number) {
        // マウスの移動量によって、クリックかドラッグかを判定する
        var distanceX = this.dragMouseX - d3.event.x;
        var distanceY = this.dragMouseY - d3.event.y;
        var distance = distanceX * distanceX + distanceY * distanceY;
        if(distance == 0){
            // クリックの場合の処理
            if(this.selectedTaskIndex == index){
                this.selectedTaskIndex = -1;
                d3.selectAll("g > rect").filter((d, i) => (i === index))
                    .attr("fill","skyblue");
            }else{
                if(this.selectedTaskIndex != -1){
                    d3.selectAll("g > rect").filter((d, i) => (i === this.selectedTaskIndex))
                        .attr("fill","skyblue");
                }
                this.selectedTaskIndex = index;
                d3.selectAll("g > rect").filter((d, i) => (i === index))
                    .attr("fill","orange");
            }
        }else{
            // 艦隊番号とタイミングを逆算
            var fleetIndex = Utility.xToFleetIndex(data.rx);
            var timing = Utility.yToTiming(data.ry);
            // 当該艦隊番号における他の遠征一覧を出す
            var candidate = this.expTaskList.filter(task => task.fleetIndex == fleetIndex && task.hash != data.hash);
            // 各種判定処理を行う
            while(true){
                // candidateの大きさが0ならば、他の遠征と何ら干渉しないのでセーフ
                if(candidate.length == 0){
                    break;
                }
                // 入れたい遠征がcandidateと明らかに干渉している場合はアウト
                var mediumTiming = timing + data.expedition.time / 2;   //入れたい遠征の中央の位置
                if(candidate.filter(task => task.timing <= mediumTiming && mediumTiming <= task.endTiming).length > 0){
                    fleetIndex = data.fleetIndex;
                    timing = data.timing;
                    break;
                }
                // mediumTimingがcandidateのどの候補の中にも重ならなかった場合、prevTimingとnextTimingの計算を行う
                // prevTiming……遠征を入れたい位置の手前にある遠征の終了タイミング
                // nextTiming……遠征を入れたい位置の後にある遠征の開始タイミング
                var prevTiming = (candidate.some(task => task.endTiming <= mediumTiming) ? candidate.filter(task => task.endTiming <= mediumTiming).sort((a, b) => b.endTiming - a.endTiming)[0].endTiming : 0);
                var nextTiming = (candidate.some(task => mediumTiming <= task.timing) ? candidate.filter(task => mediumTiming <= task.timing).sort((a, b) => a.endTiming - b.endTiming)[0].timing : Constant.ALL_TIMES);
                // nextTiming - prevTimingが入れたい遠征の幅より狭い場合、入りっこないのでアウト
                if(nextTiming - prevTiming < data.expedition.time){
                    fleetIndex = data.fleetIndex;
                    timing = data.timing;
                    break;
                }
                // そのまま入る場合は文句なくセーフ
                var endTiming = timing + data.expedition.time;
                if(prevTiming <= timing && endTiming <= nextTiming){
                    break;
                }
                // 位置補正を掛ける
                var moveDistance1 = (prevTiming <= timing ? Constant.ALL_TIMES :  prevTiming - timing);    //上端が重ならないようにするための最小の下方向への移動量
                var moveDistance2 = (endTiming <= nextTiming ? Constant.ALL_TIMES : endTiming - nextTiming); //下端が～上方向～
                if(moveDistance1 < moveDistance2){
                    // 下方向に動かす
                    timing = prevTiming;
                    break;
                }else{
                    // 上方向に動かす
                    timing = nextTiming - data.expedition.time;
                    break;
                }
            }
            // 逆算した結果を元に座標修正を掛ける
            data.rx = Utility.fleetIndexToX(fleetIndex);
            data.ry = Utility.timingToY(timing);
            data.tx = data.rx;
            data.ty = data.ry + 18 + 2;
            data.fleetIndex = fleetIndex;
            data.timing = timing;
            // 修正した座標を反映
            d3.selectAll("g > text").filter((d, i) => (i === index))
                .attr("x", data.tx)
                .attr("y", data.ty);
            d3.selectAll("g > rect").filter((d, i) => (i === index))
                .attr("x", data.rx)
                .attr("y", data.ry);
        }
    }
    /**
     * コンストラクタ
     */
    constructor(){
        // セレクトボックスを初期化
        this.initializeAreaNameList();
        this.initializeExpNameList();
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
    // データベースを初期化
    DataStore.initialize();
    // Controllerを初期化
    var mc = new MainController();
    // 画面を再描画
    mc.redrawCanvas();
};
