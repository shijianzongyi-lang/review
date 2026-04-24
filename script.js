'use strict';
const { createClient } = supabase
const client = createClient('https://ltwcysyrojosazncwkqf.supabase.co', ${{ secrets.PUBLISH_KEY }})
const storage = localStorage;
if (storage.getItem("good_num") == null) {
  //storage.good_num = JSON.stringify([]);//good_numの初期リスト設定
  storage.setItem("good_num", JSON.stringify([]));
};
if (storage.getItem("myPost") == null) {
  storage.setItem("myPost", JSON.stringify([]));//myPostの初期リスト設定
};
if (storage.getItem("reply_id") == null) {
  storage.setItem("reply_id", JSON.stringify(""));//reply_idの初期値設定
};
if (storage.getItem("Rgood_num") == null) {
  storage.setItem("Rgood_num", JSON.stringify([]));//Rgood_numの初期値設定
};
if (storage.getItem("MyReply") == null) {
  storage.setItem("MyReply", JSON.stringify([]));//Rgood_numの初期値設定
};

//自分のポスト
async function myData() {
  const myp = JSON.parse(storage.getItem("myPost"));
  const { data, error } = await client
    .from('table_1')
    .select('*')
    .in('id', myp)
    .order('id', { ascending: false });
  //日付を整形
  const fmdata = data.map(row => ({
    id: row.id,
    user_name: row.user_name,
    stars: row.stars,
    review: row.review,
    likes: row.likes,
    datetime: new Date(row.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }));
  if (error) {
    return error;
  } else {
    return fmdata;
  }
};
async function mp() {
  loadReviews(await myData());
};

//いいねしたポスト
async function likeData() {
  const myp = JSON.parse(storage.getItem("good_num"));
  const { data, error } = await client
    .from('table_1')
    .select('*')
    .in('id', myp)
    .order('id', { ascending: false });
  //日付を整形
  const fmdata = data.map(row => ({
    id: row.id,
    user_name: row.user_name,
    stars: row.stars,
    review: row.review,
    likes: row.likes,
    datetime: new Date(row.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }));
  if (error) {
    return error;
  } else {
    return fmdata;
  }
};
async function lp() {
  loadReviews(await likeData());
};

//星の数多い順
let sData = [];
async function starsData() {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await client
    .from('table_1')
    .select('*')
    .order('stars', { ascending: false })
    .range(from, to);
  //日付を整形
  const fmdata = data.map(row => ({
    id: row.id,
    user_name: row.user_name,
    stars: row.stars,
    review: row.review,
    likes: row.likes,
    datetime: new Date(row.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }));
  if (error) {
    return error;
  } else if (await lineNums(sData, fmdata) == true) {
    document.getElementById('starload').classList.add('hidden');
    sData = [...sData, ...fmdata];
    return sData;
  } else {
    page++;
    sData = [...sData, ...fmdata];
    return sData;
  }
};
async function lineNums(list, data) {//行数を出す
  const { count, error } = await client
  .from('table_1')
  .select('*', { count: 'exact', head: true });
  if (count === list.length + data.length) {
    return true;
  };
};
async function sto() {
  loadReviews(await starsData());
};

//数件ずつ読み込み
let page = 0;
const PAGE_SIZE = 10;//１回で読み込む件数
let storageData = [];
async function fetchData() {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await client
    .from('table_1')
    .select('*')
    .order('id', { ascending: false })
    .range(from, to);
  //日付を整形
  const fmdata = data.map(row => ({
    id: row.id,
    user_name: row.user_name,
    stars: row.stars,
    review: row.review,
    likes: row.likes,
    datetime: new Date(row.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }));

  if (error) {
    return error;
  } else if (fmdata[fmdata.length-1]['id'] == 1) {
    document.getElementById('loadmore').classList.add('hidden');
    storageData = [...storageData, ...fmdata];
    return storageData;
  } else {
    page++;
    storageData = [...storageData, ...fmdata];
    return storageData;
  }
};
async function fd() {
  loadReviews(await fetchData());
};

//いいね多い順に数件ずつ
let favoData = [];
async function likesData() {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await client
    .from('table_1')
    .select('*')
    .order('likes', { ascending: false })
    .range(from, to);
  
  //日付を整形
  const fmdata = data.map(row => ({
    id: row.id,
    user_name: row.user_name,
    stars: row.stars,
    review: row.review,
    likes: row.likes,
    datetime: new Date(row.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }));

  if (error) {
    return error;
  } else if (await lineNums(favoData, fmdata) == true) {
    document.getElementById('likeload').classList.add('hidden');
    favoData = [...favoData, ...fmdata];
    return favoData;
  } else {
    page++;
    favoData = [...favoData, ...fmdata];
    return favoData;
  }
};
async function lsp() {
  loadReviews(await likesData());
};
//返信数を取得
async function getreplynumber() {
  const { data, error } = await client
  .from('reply')
  .select('id')
  .order('id', { ascending: true });
  return data;
};
async function replynumber() {
  const count = await getreplynumber();
  const list = [];
  let lastindex = 0;
  const { data, error } = await client
    .from('table_1')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
  count.forEach(row => {
    const repid = Math.floor(row.id / 100);
    if (list[repid-1] == undefined) {
      list[repid-1] = 1;//[1, 0, 0, undefined, 1]となる
    } else {
      list[repid-1] += 1;//[1, 0, 0, undefined, 1→2]となる
    };
    list.fill(0, lastindex, repid-1); //(0で埋める, これ以上, これ未満)
    lastindex = repid;
  });
  if (list.length < data[0].id) {
    list[data[0].id-1] = 0;
    list.fill(0, lastindex, data[0].id-1); //(0で埋める, これ以上, これ未満)
  };
  
  console.log(list);
  return list;
};



async function loadReviews(list) {

  const data = list; // data が入る
  console.log(data);
  const replylist = await replynumber();

  //HTMLに反映
  const reviews = document.getElementById("review");
  reviews.innerHTML = "";
  data.forEach(review => {
    const person = document.createElement('div');
    const nadaDiv = document.createElement('div');
    const nameDiv = document.createElement('div');
    const datetimeDiv = document.createElement('div');
    const starsDiv = document.createElement('div');
    const commentDiv = document.createElement('div');
    const replyDiv = document.createElement('div');
    const replyNumDiv = document.createElement('div');
    const likesDiv = document.createElement('div');
    const likesNumDiv = document.createElement('div');
    const deletePost = document.createElement('div');
    const buttons = document.createElement('div');
    person.id = `person_${review.id}`;
    nadaDiv.id = 'nada';
    nameDiv.id = 'user_name';
    datetimeDiv.id = 'datetime';
    starsDiv.id = 'stars';
    commentDiv.id = 'comment';
    starsDiv.className = 'stars rated';
    replyDiv.id = 'reply';
    replyDiv.classList = 'replyimg';
    replyNumDiv.id = `replyNum_${review.id}`;
    replyNumDiv.className = 'replyNum';
    likesDiv.id = 'check';
    likesNumDiv.id = `likesNum_${review.id}`;
    likesNumDiv.className = 'goodNum';
    deletePost.id = 'deletePost';
    buttons.id = 'buttons';
    reviews.appendChild(person);//大枠を追加
    nameDiv.innerHTML = review.user_name || 'no name';//nameDiv内の文字を指定
    datetimeDiv.innerHTML = review.datetime;
    nadaDiv.appendChild(nameDiv);//nameDivを追加
    nadaDiv.appendChild(datetimeDiv);
    person.appendChild(nadaDiv);
    person.appendChild(starsDiv);//starsDivを追加
    //星を生成
    for (let i = 0; i < review.stars; i++) {
      const rated = document.createElement("img");
      rated.src = "rated.png";
      starsDiv.appendChild(rated);
    }
    for (let j = 0; j < (5 - review.stars); j++) {
      const unrated = document.createElement("img");
      unrated.src = "unrated.png";
      starsDiv.appendChild(unrated);
    }
    //コメント本文を生成
    commentDiv.innerHTML = review.review || 'no comment';
    person.appendChild(commentDiv);
    //返信ボタンを生成
    replyDiv.innerHTML = `<input type="button" id="replybtn_${review.id}"/>`;
    buttons.appendChild(replyDiv);
    replyNumDiv.innerHTML = replylist[review.id-1];
    buttons.appendChild(replyNumDiv);
    //いいねボタンを生成
    likesDiv.innerHTML = `<input type="checkbox" id="checkInput_${review.id}"/>
        <div class="bg"></div>`;
    buttons.appendChild(likesDiv);
    //いいね数を生成
    likesNumDiv.innerHTML = review.likes;
    buttons.appendChild(likesNumDiv);
    //削除ボタンを生成
    person.appendChild(buttons);
    const mp = JSON.parse(storage.getItem("myPost"));
    for (const mpChild of mp) {
      if (review.id == mpChild) {
        deletePost.innerHTML = `<button id="delete_${review.id}"></button>`;
        buttons.appendChild(deletePost);
        document.getElementById(`delete_${review.id}`).addEventListener("click", deleteReview);
      };
    };
    
    //過去に付けたいいねを反映
    let gn = JSON.parse(storage.getItem("good_num"));//ローカルストレージ読み取り
    for (const gnChild of gn) {
      if (review.id == gnChild) {
        //もしデータベースのidがgnリスト上にあったら=いいねしてあるとき
        document.getElementById(`checkInput_${gnChild}`).checked = true;
        const likesNumber = document.getElementById(`likesNum_${gnChild}`);//いいね数のDiv呼び出し
        likesNumber.classList.toggle("goodNum");//CSSスタイル切り替え
        likesNumber.classList.toggle("goodNum2");//CSSスタイル切り替え
      };
    };
  });
  //いいねボタンを発火させるため
  //console.log(document.querySelectorAll('input[type="checkbox"]'));
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", loadLikes);
  });
  //返信ボタンを発火させる
  document.querySelectorAll('input[type="button"]').forEach((button) => {
    button.addEventListener("click", loadReply);
  })
  //投稿ページの星初期化
  const checked = document.querySelector('input[name="rating"]:checked');
  if (checked) {
    checked.checked = false;
  };
};
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.endsWith("index.html")) {
    document.getElementById('lmbtn').addEventListener('click', fd);
    document.getElementById('llbtn').addEventListener('click', lsp);
    document.getElementById('slbtn').addEventListener('click', sto);
    document.getElementById('likeload').classList.add('hidden');
    document.getElementById('starload').classList.add('hidden');
    const select = document.getElementById('selectmode');
    fd();
    select.addEventListener('change', () => {
      selectmode(select.value);
    });
  }
});
//モード切替関数
function selectmode(value) {
  if (value == '最近のポスト') {
    page = 0;
    storageData = [];
    document.getElementById('loadmore').classList.remove('hidden');
    document.getElementById('likeload').classList.add('hidden');
    document.getElementById('starload').classList.add('hidden');
    fd();
  } else if (value == '自分のポスト') {
    document.getElementById('loadmore').classList.add('hidden');
    document.getElementById('likeload').classList.add('hidden');
    document.getElementById('starload').classList.add('hidden');
    mp();
  } else if (value == 'いいねしたポスト') {
    document.getElementById('loadmore').classList.add('hidden');
    document.getElementById('likeload').classList.add('hidden');
    document.getElementById('starload').classList.add('hidden');
    lp();
  } else if (value == 'いいねが多い順') {
    page = 0;
    favoData = [];
    document.getElementById('loadmore').classList.add('hidden');
    document.getElementById('likeload').classList.remove('hidden');
    document.getElementById('starload').classList.add('hidden');
    lsp();
  } else if (value == '星が多い順') {
    page = 0;
    sData = [];
    document.getElementById('loadmore').classList.add('hidden');
    document.getElementById('likeload').classList.add('hidden');
    document.getElementById('starload').classList.remove('hidden');
    sto();
  };
}


async function addReview() {
  document.getElementById("postButton").disabled = true;
  const { data } = await client
    .from('table_1')
    .select('*')
  let idMax = 1;
  for (const review of data) {//データベースからのidの最大値を求める
    if (review.id > idMax) {
      idMax = review.id;
    };
  };
  const idDecide = idMax + 1;//新しいidを決定

  const stars = document.querySelector('input[name="rating"]:checked')?.value;
  const name = document.getElementById("name").value;
  const comment = document.getElementById("comm").value;
  const { error } = await client
    .from('table_1')
    .insert([
      {
        id: idDecide,
        stars: stars,
        review: comment,
        user_name: name,
      }
    ])

  storage.user_name = JSON.stringify(name);
  const mp = JSON.parse(storage.getItem("myPost"));
  mp.push(idDecide);
  storage.myPost = JSON.stringify(mp);
  //フォームの空欄化
  document.getElementById("comm").value = '';

  if (error) {
    console.error(error);
    let myp = JSON.parse(storage.getItem("myPost"));//ローカルストレージ読み取り
    const newgn = myp.filter(num => num !== idDecide);//リストから削除
    console.log(newgn);
    storage.myPost = JSON.stringify(newgn);//ローカルストレージ書き出し
    alert("投稿失敗");
  };

  //updateStars(0);
  document.getElementById("postButton").disabled = false;
  window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.endsWith("index3.html")) {
    //ユーザー名があればセット
    if (storage.getItem("user_name") != null) {
      const username = JSON.parse(storage.getItem("user_name"));
      document.getElementById("name").value = username;
    };
    document.getElementById('postButton').addEventListener("click", addReview);
  }
});



//いいねボタン
async function loadLikes(event) {
  const cb = event.target;//changeしたpersonのDivタグ
  const tmpId = cb.id.match(/\d+$/)[0];//今問題のid番号
  document.getElementById(`checkInput_${tmpId}`).disabled = true;//ボタン無効化
  const likesNumber = document.getElementById(`likesNum_${tmpId}`);//いいね数のDiv呼び出し

  likesNumber.classList.toggle("goodNum");//CSSスタイル切り替え
  likesNumber.classList.toggle("goodNum2");//同上

  const { data, error } = await client
    .from('table_1')   // ← テーブル名
    .select('id, likes')
  let dataLN = 0;//データベース上のいいね数
  for (const review of data) {
    if (review.id == tmpId) {
      dataLN = review.likes;
    };
  };
  
  if (cb.checked) {
    //いいねされたとき
    console.log("good_numの中身:", storage.getItem("good_num"));
    console.log("押されたID:", cb.id);
    const NewLN = dataLN + 1;//新しいいいね数
    const idnum = Number(tmpId);//idから数字読み取り
    let gn = JSON.parse(storage.getItem("good_num"));//ローカルストレージ読み取り
    gn.push(idnum);//idnumをリストに追加
    console.log(gn);
    storage.good_num = JSON.stringify(gn);//ローカルストレージ書き出し
    console.log('チェックされました');
    likesNumber.textContent = NewLN;//表示いいね数更新
    incrementLikes(tmpId);//DBのいいね数更新
  } else {
    //いいね外されたとき
    const NewLN = dataLN - 1;//新しいいいね数
    const idnum = Number(tmpId);//idから数字読み取り
    let gn = JSON.parse(storage.getItem("good_num"));//ローカルストレージ読み取り
    const target = idnum;
    const newgn = gn.filter(num => num !== target);//リストから削除
    console.log(newgn);
    storage.good_num = JSON.stringify(newgn);//ローカルストレージ書き出し
    console.log('チェックが外されました');
    likesNumber.textContent = NewLN;//表示いいね数更新
    decrementLikes(tmpId);//DBのいいね数更新
  };
  document.getElementById(`checkInput_${tmpId}`).disabled = false;//ボタン無効化解除
};
//リプライ用のいいね関数
async function RloadLikes(event) {
  const cb = event.target;//changeしたpersonのDivタグ
  const tmpId = cb.id.match(/\d+$/)[0];//今問題のid番号
  document.getElementById(`checkInput_${tmpId}`).disabled = true;//ボタン無効化
  const likesNumber = document.getElementById(`likesNum_${tmpId}`);//いいね数のDiv呼び出し
  likesNumber.classList.toggle("goodNum");//CSSスタイル切り替え
  likesNumber.classList.toggle("goodNum2");//同上

  const { data, error } = await client
    .from('reply')
    .select('likes')
    .eq('id', tmpId)
    .single();
  const dataLN = data.likes;
  
  if (cb.checked) {
    //いいねされたとき
    console.log("good_numの中身:", storage.getItem("Rgood_num"));
    console.log("押されたID:", cb.id);
    const NewLN = dataLN + 1;//新しいいいね数
    const idnum = Number(tmpId);//idから数字読み取り
    let gn = JSON.parse(storage.getItem("Rgood_num"));//ローカルストレージ読み取り
    gn.push(idnum);
    storage.Rgood_num = JSON.stringify(gn);//ローカルストレージ書き出し
    console.log('チェックされました');
    likesNumber.textContent = NewLN;//表示いいね数更新
    RincrementLikes(tmpId);//DBのいいね数更新
  } else {
    //いいね外されたとき
    const NewLN = dataLN - 1;//新しいいいね数
    const idnum = Number(tmpId);//idから数字読み取り
    let gn = JSON.parse(storage.getItem("Rgood_num"));//ローカルストレージ読み取り
    const target = idnum;
    const newgn = gn.filter(num => num !== target);//リストから削除
    console.log(newgn);
    storage.Rgood_num = JSON.stringify(newgn);//ローカルストレージ書き出し
    console.log('チェックが外されました');
    likesNumber.textContent = NewLN;//表示いいね数更新
    RdecrementLikes(tmpId);//DBのいいね数更新
  };
  document.getElementById(`checkInput_${tmpId}`).disabled = false;//ボタン無効化解除
};

//データベース上でいいね数増加
async function incrementLikes(id) {
  const { data, error } = await client.rpc('increment_likes', { row_id: id });
  if (error) {
    console.error('エラー:', error)
    return
  };
};
//いいね数減少
async function decrementLikes(id) {
  const { data, error } = await client.rpc('decrement_likes', { row_id: id });
  if (error) {
    console.error('エラー:', error)
    return
  };
};
//上記のやつ。リプライ用
async function RincrementLikes(id) {
  const { data, error } = await client.rpc('rincrement_likes', { row_id: id });
  if (error) {
    console.error('エラー:', error)
    return
  };
};
async function RdecrementLikes(id) {
  const { data, error } = await client.rpc('rdecrement_likes', { row_id: id });
  if (error) {
    console.error('エラー:', error)
    return
  };
};


let current = 0;
function updateStars(selected) {
  for (let i = 1; i <= 5; i++) {
    document.getElementById('img' + i).src = i <= selected ? 'rated.png' : 'emunrated.png';
  };
};
// ラジオボタン選択時in投稿フォーム
document.querySelectorAll('input[name="rating"]').forEach(radio => {
  radio.addEventListener('change', () => {
    current = parseInt(radio.value);
    updateStars(current);
  });
});
//返信ボタン
async function loadReply(event) {
  const cb = event.target;//押したpersonのDivタグ
  const tmpId = cb.id.match(/\d+$/)[0];//今問題のid番号
  storage.reply_id = JSON.stringify(tmpId);//ローカルストレージ書き出し
  window.location.href = 'reply.html';
};
async function loadPaReply(number) {
  const replylist = await replynumber();
  console.log(replylist);
  const { data, error } = await client
    .from('table_1')
    .select('*')
    .eq('id', number)
    .single();
  //日付を整形
  const jst = new Date(data.created_at).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
  data.created_at = jst;
  console.log(data);
  const origin = document.getElementById('origin');
  origin.innerHTML = `<div id="person_${number}">
  <div id="nada">
    <div id="user_name">${data.user_name}</div>
    <div id="datetime">${data.created_at}</div>
  </div>
  <div id="stars" class="stars rated">

  </div>
  <div id="comment">${data.review}</div>
  <div id="buttons">
    <div id="reply" class="addreplyimg"><input type="button" id="replybtn_${number}"></div>
    <div id="replyNum_${number}" class="replyNum">${replylist[number-1]}</div>
    <div id="check">
      <input type="checkbox" id="checkInput_${number}">
      <div class="bg"></div>
    </div>
    <div id="likesNum_${number}" class="goodNum">${data.likes}</div>
  </div>
  </div>`;
  //星を生成
  const starsDiv = document.getElementById('stars');
  for (let i = 0; i < data.stars; i++) {
    const rated = document.createElement("img");
    rated.src = "rated.png";
    starsDiv.appendChild(rated);
  }
  for (let j = 0; j < (5 - data.stars); j++) {
    const unrated = document.createElement("img");
    unrated.src = "unrated.png";
    starsDiv.appendChild(unrated);
  };
  document.getElementById(`checkInput_${number}`).addEventListener("change", loadLikes);
  //過去のいいねを反映
  let gn = JSON.parse(storage.getItem("good_num"));//ローカルストレージ読み取り
  for (const gnChild of gn) {
    if (number == gnChild) {
      //もしデータベースのidがgnリスト上にある場合=いいねしてあるとき
      document.getElementById(`checkInput_${number}`).checked = true;
      const likesNumber = document.getElementById(`likesNum_${number}`);//いいね数のDiv呼び出し
      likesNumber.classList.toggle("goodNum");//CSSスタイル切り替え
      likesNumber.classList.toggle("goodNum2");//CSSスタイル切り替え
    };
  };
  document.getElementById(`replybtn_${number}`).addEventListener("click", () => {
    window.location.href = 'reply_post.html';
  });
  if (location.pathname.endsWith("reply_post.html")) {
    document.getElementById('buttons').style.display = 'none';
  }
};
async function loadChReply(number) {
  const { data, error } = await client
    .from('reply')
    .select('*')
    .gte('id', number * 100)
    .lt('id', (Number(number) + 1) * 100);
  //日付を整形
  const fmdata = data.map(row => ({
    id: row.id,
    user_name: row.user_name,
    stars: row.stars,
    review: row.review,
    likes: row.likes,
    datetime: new Date(row.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }));
  console.log(fmdata);
  const reply = document.getElementById('replies');
  if (data.length != 0) {
    reply.innerHTML = "";
  } 
  fmdata.forEach(review => {
    const personDiv = document.createElement('div');
    personDiv.id = `person_${review.id}`;
    personDiv.innerHTML = `<div id="nada">
    <div id="user_name">${review.user_name}</div>
    <div id="datetime">${review.datetime}</div>
  </div>
  <div id="comment">${review.review}</div>
  <div id="buttons">
    <div id="check">
      <input type="checkbox" id="checkInput_${review.id}">
      <div class="bg"></div>
    </div>
    <div id="likesNum_${review.id}" class="goodNum">${review.likes}</div>
  </div>`;
    reply.appendChild(personDiv);
    let gn = JSON.parse(storage.getItem("Rgood_num"));//ローカルストレージ読み取り
    for (const gnChild of gn) {
      if (review.id == gnChild) {
        //もしデータベースのidがgnリスト上にあったら=いいねしてあるとき
        document.getElementById(`checkInput_${gnChild}`).checked = true;
        const likesNumber = document.getElementById(`likesNum_${gnChild}`);//いいね数のDiv呼び出し
        likesNumber.classList.toggle("goodNum");//CSSスタイル切り替え
        likesNumber.classList.toggle("goodNum2");//CSSスタイル切り替え
      };
    };
    //削除ボタンを生成
    const likesNumDiv = document.getElementById(`likesNum_${review.id}`);
    const deleteDiv = document.createElement('div');
    deleteDiv.id = 'deletePost';
    const mp = JSON.parse(storage.getItem("MyReply"));
    for (const mpChild of mp) {
      if (review.id == mpChild) {
        deleteDiv.innerHTML = `<button id="delete_${review.id}"></button>`;
        likesNumDiv.after(deleteDiv);
        document.getElementById(`delete_${review.id}`).addEventListener("click", deleteReply);
      };
    };
    //いいねボタンを発火させる
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", RloadLikes);
    });
  });
};
//返信用の投稿フォームを作る→いいねの隣の返信ボタンにEventListenerつける→押したら投稿フォームへ
//返信したらreply.htmlに戻ってくるように

//reply.html開いてからの動作
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.endsWith("reply.html")) {
    const tmpId = JSON.parse(storage.getItem("reply_id"));
    loadPaReply(tmpId);
    loadChReply(tmpId);
    console.log(tmpId);
    
  };
});
async function addReply() {
  document.getElementById("postButton").disabled = true;
  const PaId = JSON.parse(storage.getItem("reply_id"));
  const { data } = await client
    .from('reply')
    .select('id')
    .order('id', {ascending: false})
    .gte('id', PaId * 100)
    .lt('id', (Number(PaId) + 1) * 100);
  let idDecide;
  if (!data || data.length === 0) {
    console.log("指定した範囲に行がありません");
    idDecide = PaId*100 + 1;
    console.log(idDecide);
  } else {
    const MaxId = data[0].id;
    idDecide = MaxId + 1;//新しいidを決定
  };
  console.log(idDecide);

  const name = document.getElementById("name").value;
  const comment = document.getElementById("comm").value;
  const { error } = await client
    .from('reply')
    .insert([
      {
        id: idDecide,
        review: comment,
        user_name: name,
      }
    ])

  storage.user_name = JSON.stringify(name);
  const mr = JSON.parse(storage.getItem("MyReply"));
  mr.push(idDecide);
  storage.MyReply = JSON.stringify(mr);
  //フォームの空欄化
  document.getElementById("comm").value = '';

  if (error) {
    console.error(error);
    let myp = JSON.parse(storage.getItem("MyReply"));//ローカルストレージ読み取り
    const newgn = myp.filter(num => num !== idDecide);//リストから削除
    console.log(newgn);
    storage.MyReply = JSON.stringify(newgn);//ローカルストレージ書き出し
    alert("投稿失敗");
  };

  document.getElementById("postButton").disabled = false;
  window.location.href = "reply.html";
};
//リプライ投稿フォーム開いてからの動作
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.endsWith("reply_post.html")) {
    const tmpId = JSON.parse(storage.getItem("reply_id"));
    loadPaReply(tmpId);
    //ユーザー名があればセット
    if (storage.getItem("user_name") != null) {
      const username = JSON.parse(storage.getItem("user_name"));
      document.getElementById("name").value = username;
    };
    document.getElementById('postButton').addEventListener("click", addReply);
  }
});

//ヘッダー押したとき
const menu = document.querySelector('.header_line');
menu.addEventListener("click", menuchange);
function menuchange() {
  document.querySelector('body').classList.toggle('active');
  document.querySelector('.open_menu').classList.toggle('active');
}


//削除ボタン
async function deleteReview(event) {
  const al = window.confirm('削除しますか？  この操作は取り消せません');
  if (al == true) {
    console.log(`${event.target.id}でかつ${al}`);
    const tmpId = event.target.id.match(/\d+$/)[0];//今問題のid番号
    //Supabaseから削除
    const { error } = await client
      .from("table_1")
      .delete()
      .eq("id", Number(tmpId));
    if (error) {
      alert('削除に失敗しました');
    } else {
      alert('削除しました')
    }
    //ローカルストレージ編集
    let myp = JSON.parse(storage.getItem("myPost"));//ローカルストレージ読み取り
    const newmyp = myp.filter(num => num !== Number(tmpId));//リストから削除
    storage.myPost = JSON.stringify(newmyp);//ローカルストレージ書き出し
    //表示しなおし
    location.reload();
  }
};
//返信を削除
async function deleteReply(event) {
  const al = window.confirm('削除しますか？  この操作は取り消せません');
  if (al == true) {
    console.log(`${event.target.id}でかつ${al}`);
    const tmpId = event.target.id.match(/\d+$/)[0];//今問題のid番号
    //Supabaseから削除
    const { error } = await client
      .from("reply")
      .delete()
      .eq("id", Number(tmpId));
    if (error) {
      alert('削除に失敗しました');
    } else {
      alert('削除しました')
    }
    //ローカルストレージ編集
    let myp = JSON.parse(storage.getItem("MyReply"));//ローカルストレージ読み取り
    const newmyp = myp.filter(num => num !== Number(tmpId));//リストから削除
    storage.MyReply = JSON.stringify(newmyp);//ローカルストレージ書き出し
    //表示しなおし
    location.reload();
  }
};
