/**
 * 遠征情報を表すクラス
 */
export class Expedition {
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
     * 基本報酬についての情報
     */
    private _basicSupply: number[];
    /**
     * 特殊報酬についての情報(左側)
     */
    private _extraSupply1: number[];
    /**
     * 特殊報酬についての情報(右側)
     */
    private _extraSupply2: number[];
    /**
     * 遠征による消費コスト
     */
    private _basicCost: number[];

    /**
     * コンストラクタ
     * @param area_name 遠征海域名
     * @param name 遠征名
     * @param time 遠征時間
     * @param color1 色1
     * @param color2 色2
     */
    constructor(areaName: string, name: string, time: number, color1: number, color2: number, supply: number[]) {
        this._areaName = areaName;
        this._name = name;
        this._time = time;
        this._color = [color1, color2];
        this._basicSupply = supply.slice(0, 4);
        this._extraSupply1 = supply.slice(4, 8);
        this._extraSupply2 = supply.slice(8, 12);
        this._basicCost = supply.slice(12, 14);
    }
};