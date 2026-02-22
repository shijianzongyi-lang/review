'use strict';

const client = supabase.createClient('https://ltwcysyrojosazncwkqf.supabase.co', 'sb_publishable_j5UkkULVm0FJQboPMoifaA_6Z9feuzz')

//const SUPABASE_URL = "https://ltwcysyrojosazncwkqf.supabase.co";
//const SUPABASE_ANON_KEY = "sb_publishable_j5UkkULVm0FJQboPMoifaA_6Z9feuzz";
//const supabaseClient = supabase.createClient(
//  SUPABASE_URL,
//  SUPABASE_ANON_KEY
//);

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
    person.id = 'person';
    nameDiv.id = 'user_name';
    starsDiv.id = 'stars';
    commentDiv.id = 'comment';
    starsDiv.className = 'stars rated';
    reviews.appendChild(person);//大枠を追加
    nameDiv.innerHTML = review.user_name;//nameDiv内の文字を指定
    person.appendChild(nameDiv);//nameDivを追加
    person.appendChild(starsDiv);//starsDivを追加
    //星を生成
    for (let i = 0; i < review.stars; i++) {
      const rated = document.createElement("img");
      rated.src = "rated.jpg";
      starsDiv.appendChild(rated);
    }
    for (let j = 0; j < (5 - review.stars); j++) {
      const unrated = document.createElement("img");
      unrated.src = "unrated.jpg";
      starsDiv.appendChild(unrated);
    }
    //コメント本文を生成
    commentDiv.innerHTML = review.review;
    person.appendChild(commentDiv);
  })
}
loadReviews();

async function addReview() {
  const { data } = await client
    .from('table_1')
    .select('*')
  const idDecide = data[data.length - 1]['id'] + 1;
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
        user_name: name
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
