'use strict';

const storage = localStorage;

const menu = document.querySelector('.header_line');
menu.addEventListener("click", menuchange);
function menuchange() {
  document.querySelector('body').classList.toggle('active');
  document.querySelector('.open_menu').classList.toggle('active');
}

document.getElementById('debtn1').addEventListener("click", () => {
  const al = window.confirm('削除しますか？');
  if (al == true) {
    //ローカルストレージ編集
    const newmp = [];//空リストを生成
    storage.myPost = JSON.stringify(newmp);//ローカルストレージ書き込み
    alert('削除しました');
  }
});

document.getElementById('debtn2').addEventListener("click", () => {
  const al = window.confirm('削除しますか？');
  if (al == true) {
    //ローカルストレージ編集
    const newgn = [];//空リストを生成
    storage.good_num = JSON.stringify(newgn);//ローカルストレージ書き込み
    alert('削除しました');
  }
});

document.getElementById('debtn3').addEventListener("click", () => {
  const al = window.confirm('削除しますか？');
  if (al == true) {
    //ローカルストレージ編集
    const newun = "";//空リストを生成
    storage.user_name = JSON.stringify(newun);//ローカルストレージ書き込み
    alert('削除しました');
  }
});

document.getElementById('debtn4').addEventListener("click", () => {
  const al = window.confirm('削除しますか？');
  if (al == true) {
    //ローカルストレージ編集
    const newmp = [];//空リストを生成
    storage.myPost = JSON.stringify(newmp);//ローカルストレージ書き込み
    const newgn = [];//空リストを生成
    storage.good_num = JSON.stringify(newgn);//ローカルストレージ書き込み
    const newun = "";//空リストを生成
    storage.user_name = JSON.stringify(newun);//ローカルストレージ書き込み
    alert('削除しました');
  }
});
