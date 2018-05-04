/**
 * 遠征情報および遠征タスク情報を格納するデータベース
 */
import * as d3 from 'd3';
import expedition = require("./Expedition"); import Expedition = expedition.Expedition;
import expeditionTask = require("./ExpeditionTask"); import ExpeditionTask = expeditionTask.ExpeditionTask;
import csv = require('../files/ExpList.csv');

export class DataStore {
    /**
     * 遠征一覧
     */
    private static expeditionList: Array<Expedition>;

    /**
     * データベースを初期化
     */
    static async initialize() {
        DataStore.expeditionList = await d3.csv(csv).then((data) => {
            return data.map(row => {
                var areaName = row["海域名"];
                var name = row["遠征名"];
                var time = parseInt(row["遠征時間"]);
                var color1 = parseInt(row["色1"]);
                var color2 = parseInt(row["色2"]);
                var exp = new Expedition(areaName,name,time,color1,color2);
                return exp;
            });
        });
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
    /**
     * 指定した海域における遠征名の一覧を返す
     * @param areaName 海域名
     */
    static getNameList(areaName: string){
        return this.expeditionList.filter(e => e.areaName == areaName).map(e => e.name);
    }
    static getExpedition(expName: string){
        return this.expeditionList.filter(e => e.name == expName)[0];
    }
};