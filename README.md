# KancolleScheduler Web(艦これスケジューラー Web版)
Expedition Schedule Maker by TypeScript+D3.js

# 概要
　[艦これ](http://www.dmm.com/netgame/feature/kancolle.html)の遠征スケジュールを組み立てるためのWebアプリケーションです。  
　[艦これスケジューラー](https://github.com/YSRKEN/KancolleScheduler/releases)(Java製)をWebアプリにしてみたいと思ったことから制作を始めました。

# 使い方

　概ね**見た通り**ですが、ポイントだけ挙げておきます。

- 遠征をクリックすると、右のテーブルにある「遠征の海域名」～「ケッコン艦」が変化します
- 「追加」ボタンを押すと、右のテーブルの設定内容の遠征タスクが、「挿入可能な最も早い時間帯」に追加されます
- 個々の遠征タスクの内容変更は、「変更」ボタンを押さないと記憶されません
- 「保存」「読込」はブラウザのローカルストレージに保存しています
- サイトを読み込んだ瞬間はどの遠征タスクも表示されません。「保存」「読込」を忘れずに！

# 謝辞

　このWebアプリケーションは、以下の方々の協力なしには作れませんでした。本当にありがとうございます。

- ソフトウェアの着想は、「名無しのでち公([@goyadeti](https://twitter.com/goyadeti))」さんから得ました
- Webアプリ設計の際、ノエルさん・白山風露さん・ABAB↑↓BAさん・BaHo猫さんなどから情報・指摘を賜りました

# 作者

YSR([@YSRKEN](https://twitter.com/YSRKEN), [ysr.ken@gmail.com](mailto:ysr.ken@gmail.com))
