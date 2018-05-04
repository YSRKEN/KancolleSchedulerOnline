/**
 * ユーティリティ関数
 */
import constant = require("./Constant"); import Constant = constant.Constant;
export class Utility{
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