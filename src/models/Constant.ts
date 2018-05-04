/**
 * 各種定数定義
 */
export class Constant{
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