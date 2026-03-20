'use strict';
const { createClient } = supabase
const client = createClient('https://ltwcysyrojosazncwkqf.supabase.co', 'sb_publishable_j5UkkULVm0FJQboPMoifaA_6Z9feuzz')
//const client = supabase.createClient('https://ltwcysyrojosazncwkqf.supabase.co', 'sb_publishable_j5UkkULVm0FJQboPMoifaA_6Z9feuzz')
const storage = localStorage;
if (storage.getItem("good_num") == null) {
  //storage.good_num = JSON.stringify([]);//good_numの初期リスト設定
  storage.setItem("good_num", JSON.stringify([]));
} else {
  
}


async function loadReviews() {
  const { data, error } = await client
  .from('table_1')   // ← テーブル名
  .select('*')

  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
  console.log(data[0]['stars']);
  for(let i = 0; i < 4; i += 1) {
    console.log(typeof data[i]['stars']);
  }
  //HTMLに反映
  //const reviews = document.getElementById("review");
  //reviews.innerHTML = "";
  //data.forEach(review => {
    //const el = document.createElement("div");
    //el.innerHTML = `
      //<b>${review.user_name}</b><br>
      //${review.stars}　${review.review}
      //<hr>
    //`;
    //reviews.appendChild(el);
    //})
  const reviews = document.getElementById("review");
  reviews.innerHTML = "";
  data.forEach(review => {
    const person = document.createElement('div');
    const nameDiv = document.createElement('div');
    const starsDiv = document.createElement('div');
    const commentDiv = document.createElement('div');
    const likesDiv = document.createElement('div');
    const likesNumDiv = document.createElement('div');
    person.id = 'person';
    nameDiv.id = 'user_name';
    starsDiv.id = 'stars';
    commentDiv.id = 'comment';
    starsDiv.className = 'stars rated';
    likesDiv.id = 'check';
    likesNumDiv.id = `likesNum_${review.id}`;
    likesNumDiv.className = 'goodNum';
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
    person.appendChild(likesDiv);
    //いいね数を生成
    likesNumDiv.innerHTML = review.likes;
    person.appendChild(likesNumDiv);
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

  console.log(document.querySelectorAll('input[type="checkbox"]'));
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", loadLikes);
  });
};
loadReviews();

async function addReview() {
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
  //const idDecide = data[data.length - 1]['id'] + 1;
  const name = document.getElementById("name").value;
  const stars = document.getElementById("st").value;
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
    ]);
  //if (stars == '') {
    //alert('５段階評価をしてから投稿してください');
  //} else if (error) {
    //console.error(error);
    //alert("投稿失敗");
    //return;
  //}
  if (error) {
    console.error(error);
    alert("投稿失敗");
  }
  //フォームの空欄化
  document.getElementById("name").value = '';
  document.getElementById("st").value = '';
  document.getElementById("comm").value = '';

  loadReviews();//レビューの再読み込み
}
document.getElementById('postButton').addEventListener("click", addReview);


//いいねボタン
async function loadLikes(event) {
  //document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    const cb = event.target;//changeしたpersonのDivタグ
    const tmpId = cb.id.match(/\d+$/)[0];//今問題のid番号
    const likesNumber = document.getElementById(`likesNum_${tmpId}`);//いいね数のDiv呼び出し

    likesNumber.classList.toggle("goodNum");//CSSスタイル切り替え
    likesNumber.classList.toggle("goodNum2");//CSSスタイル切り替え

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
      storage.good_num = JSON.stringify(gn);
      console.log('チェックされました');
      likesNumber.textContent = NewLN;//表示いいね数更新
      incrementLikes(tmpId);//DBのいいね数更新
    } else {
      //いいね外されたとき
      const NewLN = dataLN - 1;//新しいいいね数
      const idnum = Number(tmpId);//idから数字読み取り
      let gn = JSON.parse(storage.getItem("good_num"));//ローカルストレージ読み取り
      //gn.push(idnum);//idnumをリストに追加
      const target = idnum;
      const newgn = gn.filter(num => num !== target);
      console.log(newgn);
      storage.good_num = JSON.stringify(newgn);
      console.log('チェックが外されました');
      likesNumber.textContent = NewLN;//表示いいね数更新
      decrementLikes(tmpId);//DBのいいね数更新
    }
  //});
};

//データベース上でいいね数更新
async function incrementLikes(id) {
  const { data, error } = await client.rpc('increment_likes', { row_id: id });
  if (error) {
    console.error('エラー:', error)
    return
  };
}
//いいね数減少
async function decrementLikes(id) {
  const { data, error } = await client.rpc('decrement_likes', { row_id: id });
  if (error) {
    console.error('エラー:', error)
    return
  };
}


//window.confirm('削除しますか？');
