import * as d3 from 'd3';
import * as UAParser from 'ua-parser-js';
import constant = require("./models/Constant"); import Constant = constant.Constant;
import utility = require("./models/Utility"); import Utility = utility.Utility;
import dataStore = require("./models/DataStore"); import DataStore = dataStore.DataStore;
import expeditionTask = require("./models/ExpeditionTask"); import ExpeditionTask = expeditionTask.ExpeditionTask;

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
        d3.select("#areaName")
            .selectAll("option").remove();
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
        var nameList = DataStore.getNameList(areaName);
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
    private redrawCanvas(){
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
        // 選択している遠征タスクについての着色
        d3.selectAll("g > rect").filter((d, i) => (i === this.selectedTaskIndex))
            .attr("fill","orange");
        // 遠征スケジュールについての情報表示を更新する
        var allSupply = this.calcAllSupply();
        var infoText = this.supplyToText(allSupply);
        d3.select("#supplyResult").html(infoText);
    }
    /**
     * ドラッグスタート時に呼び出される関数
     */
    private dragstartedTask() {
        // 開始時のマウス座標を記録する
        this.dragMouseX = d3.event.x;
        this.dragMouseY = d3.event.y;
        d3.event.preventDefault;
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
        if(distance <= 100){
            // クリック時の処理
            data.rewindTaskPosition();
            this.refreshTaskPosition(index);
            this.clickedTask(data, index);
        }else{
            // 艦隊番号とタイミングを逆算
            var fleetIndex = Utility.xToFleetIndex(data.rx);
            var timing = Utility.yToTiming(data.ry);
            // 当該艦隊番号における他の遠征一覧を出す
            var candidate = this.expTaskList.filter(task => task.fleetIndex == fleetIndex && task.hash != data.hash);
            // 各種判定処理を行う
            var dragFlg = true;
            while(true){
                // candidateの大きさが0ならば、他の遠征と何ら干渉しないのでセーフ
                if(candidate.length == 0){
                    break;
                }
                // 入れたい遠征がcandidateと明らかに干渉している場合はアウト
                var mediumTiming = timing + data.expedition.time / 2;   //入れたい遠征の中央の位置
                if(candidate.filter(task => task.timing <= mediumTiming && mediumTiming <= task.endTiming).length > 0){
                    dragFlg = false;
                    break;
                }
                // mediumTimingがcandidateのどの候補の中にも重ならなかった場合、prevTimingとnextTimingの計算を行う
                // prevTiming……遠征を入れたい位置の手前にある遠征の終了タイミング
                // nextTiming……遠征を入れたい位置の後にある遠征の開始タイミング
                var prevTiming = (candidate.some(task => task.endTiming <= mediumTiming) ? candidate.filter(task => task.endTiming <= mediumTiming).sort((a, b) => b.endTiming - a.endTiming)[0].endTiming : 0);
                var nextTiming = (candidate.some(task => mediumTiming <= task.timing) ? candidate.filter(task => mediumTiming <= task.timing).sort((a, b) => a.endTiming - b.endTiming)[0].timing : Constant.ALL_TIMES);
                // nextTiming - prevTimingが入れたい遠征の幅より狭い場合、入りっこないのでアウト
                if(nextTiming - prevTiming < data.expedition.time){
                    dragFlg = false;
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
            if(dragFlg){
                data.setTaskPosition(fleetIndex, timing);
            }else{
                data.rewindTaskPosition();
            }
            // 修正した座標を反映
            this.refreshTaskPosition(index);
        }
    }
    /**
     * 遠征タスクをクリックした際に呼び出される関数
     * @param data クリックした遠征タスク
     * @param index 遠征タスクのインデックス
     */
    private clickedTask(data: ExpeditionTask, index: number) {
        // 遠征タスクを選択したことによる着色処理
        if(this.selectedTaskIndex == index){
            // 既に選択していた遠征タスクをクリックした場合
            this.selectedTaskIndex = -1;
            d3.selectAll("g > rect").filter((d, i) => (i === index))
                .attr("fill","skyblue");
        }else{
            // まだ選択していない遠征タスクをクリックした場合
            if(this.selectedTaskIndex != -1){
                // 既に選択していた遠征タスクの選択を取り消す
                d3.selectAll("g > rect").filter((d, i) => (i === this.selectedTaskIndex))
                    .attr("fill","skyblue");
            }
            // 改めて選択する処理
            this.selectedTaskIndex = index;
            d3.selectAll("g > rect").filter((d, i) => (i === index))
                .attr("fill","orange");
        }
        // 選択した遠征タスクの情報を画面に反映するための下準備
        var task = this.expTaskList[index];
        var areaName = task.expedition.areaName;
        var areaNameList = DataStore.makeAreaNameList;
        var expName = task.expedition.name;
        var nameList = DataStore.getNameList(areaName);
        // 選択した遠征タスクの情報を画面に反映する処理
        this.initializeAreaNameList();
        d3.select("#areaName").property("value", "" + areaName);
        this.initializeExpNameList();
        d3.select("#expName").property("value", "" + expName);
        d3.select("#addPer").property("value", "" + task.addPer);
        d3.select("#ciFlg").property("checked", task.ciFlg);
        d3.select("#marriageFlg").property("checked", task.marriageFlg);
    }
    /**
     * 削除ボタンを押した際に呼び出される関数
     */
    private removeTask(){
        // 未選択なら何もしない
        if(this.selectedTaskIndex == -1)
            return;
        // 選択した遠征の部分を削除する
        this.expTaskList.splice(this.selectedTaskIndex, 1);
        // 遠征の選択を外す
        this.selectedTaskIndex = -1;
        // 再描画
        this.redrawCanvas();
    }
    /**
     * 追加ボタンを押した際に呼び出される関数
     */
    private addTask(){
        // 遠征タスクの情報を新規に作成
        var selectedExpName = d3.select("#expName").property("value");
        if(selectedExpName == "---")
            return;
        var addTaskData = DataStore.makeExpeditionTask(selectedExpName, 0, 0);
        // その遠征タスクを差し込める最初の場所を検索する
        var setTiming = Constant.ALL_TIMES;
        var setFleetIndex = -1;
        d3.range(0, Constant.FLEET_COUNT).forEach(fleetIndex => {
            // 累積和のアルゴリズムにより、遠征タスクを置けない区間を求める
            var temp = d3.range(0, Constant.ALL_TIMES).map(() => 0);
            this.expTaskList.filter(task => task.fleetIndex == fleetIndex).forEach(task => {
                temp[task.timing] += 1;
                if(task.endTiming < Constant.ALL_TIMES)
                    temp[task.endTiming] -= 1;
            });
            // 走査しつつ、置ける最初の位置を探す
            var sum = 0;
            var searchEndIndex = Math.min(temp.length - addTaskData.expedition.time, setTiming + 1);
            for(var i = 0; i < searchEndIndex; ++i){
                sum += temp[i];
                if(sum != 0)
                    continue;
                // 「連続X個の要素について、値が全て0か」を調べる
                var jumpPosition = d3.range(i + 1, i + addTaskData.expedition.time).find(j => temp[j] != 0);
                if(!jumpPosition || jumpPosition - i >= addTaskData.expedition.time){
                    console.log("OK " + i  + "," + fleetIndex);
                    // 置けるので座標を読み取る
                    if(setTiming > i){
                        setTiming = i;
                        setFleetIndex = fleetIndex;
                    }
                    break;
                }else{
                    // 置けないのでワープして再開
                    console.log("NG " + i  + "," + fleetIndex);
                    i = jumpPosition - 1;
                    console.log("->->" + i);
                }
            }
        });
        // 検索した位置に遠征タスクを配置する
        if(setFleetIndex != -1){
            addTaskData.setTaskPosition(setFleetIndex, setTiming);
            addTaskData.addPer = parseInt(d3.select("#addPer").property("value"));
            addTaskData.ciFlg = d3.select("#ciFlg").property("checked");
            addTaskData.marriageFlg = d3.select("#marriageFlg").property("checked");
            this.expTaskList.push(addTaskData);
            this.redrawCanvas();
        }
    }
    /**
     * 変更ボタンを押した際に呼び出される関数
     */
    private changeTask(){
        // セレクトボックスで選択している遠征名を取得
        var selectedExpName = d3.select("#expName").property("value");
        if(selectedExpName == "---")
            return;
        // 当該遠征についての情報を得る
        var expedition = DataStore.getExpedition(selectedExpName);
        // マウスで選択した遠征についての情報を得る
        if(this.selectedTaskIndex == -1)
            return;
        var selectedTask = this.expTaskList[this.selectedTaskIndex];
        // 遠征名の変更処理
        if(selectedTask.expedition.name != selectedExpName){
            // 選択した遠征の次に来る遠征の開始時間を得る
            var temp = this.expTaskList.filter(
                task => task.fleetIndex == selectedTask.fleetIndex
                && task.hash != selectedTask.hash
                && task.timing >= selectedTask.endTiming);
            if(temp.length > 0){
                var nextTiming = temp.sort((a, b) => a.timing - b.timing)[0].timing;
                // 遠征を変更できるかを判定する
                if(nextTiming - selectedTask.timing >= expedition.time){
                    selectedTask = DataStore.makeExpeditionTask(selectedExpName, selectedTask.timing, selectedTask.fleetIndex);
                }
            }
        }
        // その他の情報を変更
        selectedTask.addPer = parseInt(d3.select("#addPer").property("value"));
        selectedTask.ciFlg = d3.select("#ciFlg").property("checked");
        selectedTask.marriageFlg = d3.select("#marriageFlg").property("checked");
        this.redrawCanvas();
    }
    /**
     * 保存ボタンを押した際に呼び出される関数
     */
    private saveTask(){
        var storage = window.localStorage;
        storage.clear();
        storage.setItem("selectedTaskIndex", "" + this.selectedTaskIndex);
        var count = 1;
        this.expTaskList.forEach(task => {
            var text = task.expedition.name + "," + task.timing + "," + task.fleetIndex
                + "," + task.addPer + "," + (task.ciFlg ? 1 : 0) + "," + (task.marriageFlg ? 1 : 0);
            storage.setItem("Task" + count, text);
            ++count;
        });
    }
    /**
     * 読込ボタンを押した際に呼び出される関数
     */
    private loadTask(){
        // 初期化
        var storage = window.localStorage;
        this.selectedTaskIndex = -1;
        var temp = new Array<ExpeditionTask>();
        // 読み込み
        for(var i = 0; i < storage.length; ++i){
            var value = storage.getItem(storage.key(i));
            // キーの内容によって分岐
            if(storage.key(i) == "selectedTaskIndex"){
                // 選択している遠征タスクのインデックス
                this.selectedTaskIndex = parseInt(value);
                if(isNaN(this.selectedTaskIndex))
                    this.selectedTaskIndex = -1;
            }
            if(storage.key(i).substr(0, 4) == "Task"){
                // 遠征タスク。「海上護衛任務,120,2」のように記録されている
                //パースできるかを確認
                var temp2 = value.split(",");
                if(temp2.length < 3)
                    continue;
                //遠征名・タイミング・艦隊番号を取得
                var expName = temp2[0];
                var timing = parseInt(temp2[1]);
                var fleetIndex = parseInt(temp2[2]);
                if(DataStore.getExpedition(expName) == null
                    || isNaN(timing) || isNaN(fleetIndex))
                    continue;
                timing = Utility.Limit(timing, 0, Constant.ALL_TIMES - 1);
                fleetIndex = Utility.Limit(fleetIndex, 0, Constant.FLEET_COUNT - 1);
                // 可能なら、収入補正・大成功フラグ・ケッコン艦フラグを読み取る
                var addPer = 0;
                var ciFlg = false;
                var marriageFlg = false; 
                if(temp2.length >= 6){
                    addPer = Math.floor(parseInt(temp2[3]) / 5) * 5;
                    addPer = Utility.Limit(addPer, 0, 20);
                    ciFlg = (parseInt(temp2[4]) > 0);
                    marriageFlg = (parseInt(temp2[5]) > 0);
                }
                // 書き込み
                var temp3 = DataStore.makeExpeditionTask(expName, timing, fleetIndex);
                temp3.addPer = addPer;
                temp3.ciFlg = ciFlg;
                temp3.marriageFlg = marriageFlg;
                temp.push(temp3);
            }
        }
        // 遠征タスク数≦選択インデックス数だった場合に備える
        if(this.selectedTaskIndex >= 0){
            this.selectedTaskIndex = Utility.Limit(this.selectedTaskIndex, 0, temp.length);
        }
        // 書き込み・反映
        this.expTaskList = temp;
        this.redrawCanvas();
    }
    /**
     * 指定したインデックスの遠征タスクの表示座標を更新する
     * @param index 遠征タスクのインデックス
     */
    private refreshTaskPosition(index: number){
        var data = this.expTaskList[index];
        d3.selectAll("g > text").filter((d, i) => (i === index))
            .attr("x", data.tx)
            .attr("y", data.ty);
        d3.selectAll("g > rect").filter((d, i) => (i === index))
            .attr("x", data.rx)
            .attr("y", data.ry);
    }
    /**
     * 遠征の総収入を計算する
     */
    private calcAllSupply(){
        var allSupply = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        this.expTaskList.forEach(task => {
            var supply = task.calcSupplyInfo();
            d3.range(0, allSupply.length).forEach(i => {
                allSupply[i] += supply[i];
            });
        });
        return allSupply;
    }
    /**
     * 遠征の総収入をテキストに変換する
     */
    private supplyToText(allSupply: number[]){
        var label = ["燃料", "弾薬", "鋼材", "ボーキ", "バケツ", "バーナー", "開発資材", "家具コイン"];
        var text = d3.range(0, allSupply.length).map(i => {
            if(allSupply[i] != 0.0)
                return label[i] + "：" + allSupply[i];
            else
                return "";
        }).filter(str => str != "").join("<br>");
        return text;
    }
    /**
     * コンストラクタ
     */
    constructor(){
        // canvasを初期化
        this.initializeCanvas();
        // セレクトボックスを初期化
        this.initializeAreaNameList();
        this.initializeExpNameList();
        // ボタンを初期化
        d3.select("#removeTask").on("click", this.removeTask.bind(this));
        d3.select("#addTask").on("click", this.addTask.bind(this));
        d3.select("#changeTask").on("click", this.changeTask.bind(this));
        d3.select("#saveTask").on("click", this.saveTask.bind(this));
        // ローカルストレージから自動読み込み
        this.loadTask();
        // 画面を描画
        this.redrawCanvas();
    }
};

/**
 * スタートアップ
 */
window.onload = async function(){
    // データベースを初期化
    await DataStore.initialize();
    // Controllerを初期化
    var mc = new MainController();
    // UA判定
    var userAgent = window.navigator.userAgent;
    var parser = new UAParser(userAgent);
    var result = parser.getResult();
    if(result.device.type == null){
        // PC判定
        console.log("PC");
    }else{
        // モバイル判定
        console.log("Mobile");
    }
};
