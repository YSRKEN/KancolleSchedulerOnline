/**
* 遠征タスクを表すクラス
*/
import expedition = require("./Expedition"); import Expedition = expedition.Expedition;
import utility = require("./Utility"); import Utility = utility.Utility;
import constant = require("./Constant"); import Constant = constant.Constant;

export class ExpeditionTask {
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
    /**
    * 比較用ハッシュ関数
    */
    get hash(){ return this.timing + this.fleetIndex * Constant.ALL_TIMES; }
    /**
    * 遠征タスクの座標を、艦隊番号とタイミングから設定する
    * @param fleetIndex 艦隊番号
    * @param timing タイミング
    */
    setTaskPosition(fleetIndex, timing){
        this.rx = Utility.fleetIndexToX(fleetIndex);
        this.ry = Utility.timingToY(timing);
        this.tx = this.rx;
        this.ty = this.ry + 18 + 2;
        this.fleetIndex = fleetIndex;
        this.timing = timing;
    }
    /**
    * 遠征タスクの座標をドラッグ前に戻す
    */
    rewindTaskPosition(){
        this.setTaskPosition(this.fleetIndex, this.timing);
    }
};