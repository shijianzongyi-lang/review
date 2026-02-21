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
  const reviews = document.getElementById("review");
  reviews.innerHTML = "";

  data.forEach(review => {
    const el = document.createElement("div");
    el.innerHTML = `
      <b>${review.user_name}</b><br>
      ${review.stars}　${review.review}
      <hr>
    `;
    reviews.appendChild(el);
    console.log(review.stars);
  })

}

loadReviews();
