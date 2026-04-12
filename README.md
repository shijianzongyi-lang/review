## README

### ファイルの関係

* `script.js`
  * ホーム　`index.html`
  * 投稿する　`index3.html`
* `script2.js`
  * 何のサイト？？　`index2.html`
  * 設定　`index4.html`
* `script3.js`
  * 管理画面　`index5.html`


### モード別関数（＠`script.js`）
定義：`selectmode(value)`@(258)  
発火：@(253)  
(87) `PAZE_SIZE = 10` で共通

<span style="color: #ff8000">1. **⏱"最近のポスト"**</span>
* `fd()`
  * `fetchData()`
* (85)以降
* 更新辞める条件：idに１が含まれるか
* リスト名：`storageData`
* (265)で発火

<span style="color: #ff8000">2. **📄"自分のポスト"**</span>
* `mp()`
  * `myData()`
* (14)以降
* 分割読み込み機能なし
* (270)で発火

<span style="color: #ff8000">3. **❤"いいねしたポスト"**</span>
* `lp()`
  * `likeData()`
* (32)以降
* 分割読み込み機能なし
* (275)で発火

<span style="color: #ff8000">4. **💕"いいねが多い順"**</span>
* `lsp()`
  * likesData()
* (115)以降
* 更新辞める条件：`lineNums(0,0) == true`
* リスト名：`favoData`
* (282)で発火

<span style="color: #ff8000">5. **⭐"星が多い順"**</span>
* `sto()`
  * starsData()
* (50)以降
* 更新辞める条件：`lineNums(0,0) == true`
* リスト名：`sData`
* (289)で発火

***
`lineNums()`の仕組み
* (73)以降
* 行数だけ取得 from Supabase
* ２つの入力リストの長さと等しければ`true`を返す
***
### 主要な関数
* <span style="color: #00a71c">(146) `loadReviews()`</span>
* <span style="color: #00a71c">(294) `addReview()`</span>
* <span style="color: #00a71c">(457) `deleteReview()`</span>
  
* (368) `loadLikes()`
  * (416) `incrementLikes()` Supabase上の関数
  * (424) `decrementLikes()` 　　　〃
* 投稿ページ
  * (439)以降
  * `updateStars()`見た目変更
* ヘッダー
  * (447)以降
