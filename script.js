'use strict';
const { createClient } = supabase
const client = createClient('https://ltwcysyrojosazncwkqf.supabase.co', 'sb_publishable_j5UkkULVm0FJQboPMoifaA_6Z9feuzz')
//const client = supabase.createClient('https://ltwcysyrojosazncwkqf.supabase.co', 'sb_publishable_j5UkkULVm0FJQboPMoifaA_6Z9feuzz')
const storage = localStorage;
if (storage.getItem("good_num") == null) {
  //storage.good_num = JSON.stringify([]);//good_numの初期リスト設定
  storage.setItem("good_num", JSON.stringify([]));
};
if (storage.getItem("myPost") == null) {
  storage.setItem("myPost", JSON.stringify([]));//myPostの初期リスト設定
};

//最近のポスト//使ってない
async function currentData() {
  const { data, error } = await client
    .from('table_1')
    .select('*')
    .order('id', { ascending: false })
    .limit(20);
  if (error) {
    return error;
  } else {
    return data;
  }
};
async function main() {
  loadReviews(await currentData());
};

//自分のポスト
async function myData() {
  const myp = JSON.parse(storage.getItem("myPost"));
  const { data, error } = await client
    .from('table_1')
    .select('*')
    .in('id', myp)
    .order('id', { ascending: false });
  if (error) {
    return error;
  } else {
    return data;
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
  if (error) {
    return error;
  } else {
    return data;
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
  if (error) {
    return error;
  } else if (await lineNums(sData, data) == true) {
    document.getElementById('starload').classList.add('hidden');
    sData = [...sData, ...data];
    return sData;
  } else {
    page++;
    sData = [...sData, ...data];
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

  if (error) {
    return error;
  } else if (data[data.length-1]['id'] == 1) {
    document.getElementById('loadmore').classList.add('hidden');
    storageData = [...storageData, ...data];
    return storageData;
  } else {
    page++;
    storageData = [...storageData, ...data];
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

  if (error) {
    return error;
  } else if (await lineNums(favoData, data) == true) {
    document.getElementById('likeload').classList.add('hidden');
    favoData = [...favoData, ...data];
    return favoData;
  } else {
    page++;
    favoData = [...favoData, ...data];
    return favoData;
  }
};
async function lsp() {
  loadReviews(await likesData());
};




async function loadReviews(list) {
  //const { data, error } = await client
  //.from('table_1')   // ← テーブル名
  //.select('*')
  const data = list; // data が入る
  console.log(data);
  //if (error) {
    //console.error(error);
  //} else {
    //console.log(data);
  //}
  //console.log(data[0]['stars']);
  //for(let i = 0; i < 4; i += 1) {
    //console.log(typeof data[i]['stars']);
  //}

  //HTMLに反映
  const reviews = document.getElementById("review");
  reviews.innerHTML = "";
  data.forEach(review => {
    const person = document.createElement('div');
    const nameDiv = document.createElement('div');
    const starsDiv = document.createElement('div');
    const commentDiv = document.createElement('div');
    const likesDiv = document.createElement('div');
    const likesNumDiv = document.createElement('div');
    const deletePost = document.createElement('div');
    const buttons = document.createElement('div');
    person.id = `person_${review.id}`;
    nameDiv.id = 'user_name';
    starsDiv.id = 'stars';
    commentDiv.id = 'comment';
    starsDiv.className = 'stars rated';
    likesDiv.id = 'check';
    likesNumDiv.id = `likesNum_${review.id}`;
    likesNumDiv.className = 'goodNum';
    deletePost.id = 'deletePost';
    buttons.id = 'buttons';
    reviews.appendChild(person);//大枠を追加
    nameDiv.innerHTML = review.user_name || 'no name';//nameDiv内の文字を指定
    person.appendChild(nameDiv);//nameDivを追加
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
  //星の数を確認する
  //let stars = 0;
  //const radio = document.getElementsByName("rating");
  //for (const btn of radio) {
    //if (btn.checked == true) {
      //const stars = Number(btn.value);
    //};
  //};
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
    //.select('id')
    //.single();
  //if (!error) {
    //const newId = data.id;
    //console.log(newId);
  //};

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

let current = 0;
function updateStars(selected) {
  for (let i = 1; i <= 5; i++) {
    document.getElementById('img' + i).src = i <= selected ? 'rated.png' : 'emunrated.png';
  };
};
// ラジオボタン選択時
document.querySelectorAll('input[name="rating"]').forEach(radio => {
  radio.addEventListener('change', () => {
    current = parseInt(radio.value);
    updateStars(current);
  });
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
}
