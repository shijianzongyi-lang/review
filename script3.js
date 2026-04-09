'use strict';

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
  const aori = ['ちっがいまぁ～すwww', 'ざ～んね～んで～した～～', 'そんなパスワードなわけwww', 'それまじでいってる？', `"${me}"なわけないじゃん笑`, 'さすがにヒントいる？\n　\n教えな～い', 'それ時間の無駄だよ'];
  if (hash == pass) {
    document.getElementById('pass').classList.add('hidden');
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
