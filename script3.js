'use strict';
const { createClient } = supabase
const client = createClient('https://ltwcysyrojosazncwkqf.supabase.co', 'sb_publishable_j5UkkULVm0FJQboPMoifaA_6Z9feuzz')

const storage = localStorage;

const menu = document.querySelector('.header_line');
menu.addEventListener("click", menuchange);
function menuchange() {
  document.querySelector('body').classList.toggle('active');
  document.querySelector('.open_menu').classList.toggle('active');
}


async function digesthash(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};



async function check(me) {
  const hash = await digesthash(me);
  const aori = ['ちっがいまぁ～すwww', 'ざ～んね～んで～した～～', 'そんなパスワードなわけwww', `"${me}"なわけ笑`, 'さすがにヒントいる？\n　\n教えな～い', '残念！', 'ちがう！', 'ブブー✖', '誤'];
  if (hash == pass) {
    document.getElementById('pass').classList.add('hidden');
    allData();
  } else {
    const arg = Math.floor(Math.random() * aori.length);
    alert(aori[arg]);
    document.getElementById('pw').value = '';
  }
};

const pass = '24a8ce0f34b85c9789eb683cddf33ea237054ee03ee14edd1329a79d515e6d16';

document.getElementById('word').addEventListener('click', () => {
  const text = document.getElementById('pw').value;
  check(text);
})


//パスワード突破後
async function allData() {
  
  const { data, error } = await client
    .from('table_1')
    .select('*')
    .order('id', { ascending: true });
  if (error) {
    console.error(error);
    return;
  }
  const body = document.getElementById('allList');
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>${item.id}</th>
      <td>${item.user_name}</td><td>${item.stars}</td><td>${item.review}</td><td>${item.likes}</td>`
    body.appendChild(tr);
  });
};

document.getElementById('reflesh').addEventListener('click', () => {
  document.getElementById('allList').innerHTML = '';
  allData();
})

let gn = storage.getItem("good_num");//いいね読み取り
document.getElementById('tmpgood').textContent = '現在のいいね：' + gn;
document.getElementById('tmpgoodin').value = gn;
let mp = storage.getItem("myPost");//自分のポスト読み取り
document.getElementById('tmppost').textContent = '自分のポスト：' + mp;
document.getElementById('tmppostin').value = mp;
let na = JSON.parse(storage.getItem("user_name"));//なまえ読み取り
document.getElementById('tmpname').textContent = '自分の名前：' + na;
document.getElementById('tmpnamein').value = na;

document.getElementById('tmpgoodbtn').addEventListener('click', () => {
  storage.good_num = document.getElementById('tmpgoodin').value;
  let gn = storage.getItem("good_num");//いいね読み取り
  document.getElementById('tmpgood').textContent = '現在のいいね：' + gn;
});

document.getElementById('tmppostbtn').addEventListener('click', () => {
  storage.myPost = document.getElementById('tmppostin').value;
  let mp = storage.getItem("myPost");//自分のポスト読み取り
  document.getElementById('tmppost').textContent = '自分のポスト：' + mp;
});

document.getElementById('tmpnamebtn').addEventListener('click', () => {
  storage.user_name = JSON.stringify(document.getElementById('tmpnamein').value);
  let na = JSON.parse(storage.getItem("user_name"));//なまえ読み取り
  document.getElementById('tmpname').textContent = '自分の名前：' + na;
})
