function jsonOutput(targetDiv) {
  //const jsonFilePath = "output.json";
  const jsonFilePath =
    "https://yosuke-tomisawa.github.io/backlink//output.json"; // 絶対URLを指定

  // data属性からbrandとprefを取得
  const brand = targetDiv.dataset.brand;
  const pref = targetDiv.dataset.pref;

  if (!brand || !pref) {
    targetDiv.innerHTML = "<p>適切なbrandまたはprefが指定されていません。</p>";
    return;
  }

  // ローディング中メッセージを表示
  targetDiv.innerHTML = "<p>読み込み中...</p>";

  // JSONファイルを取得
  fetch(jsonFilePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      // 条件に合うデータをフィルタリング
      const filteredData = json.filter(
        (item) => item.brand === brand && item.pref === pref
      );

      if (filteredData.length === 0) {
        targetDiv.innerHTML = "<p>該当するデータがありません。</p>";
        return;
      }

      // HTML生成
      let html = "";
      filteredData.forEach((item) => {
        html += `
          <div class="p-parts">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer">
              <p class="p-parts__title">${item.title}</p>
            </a>
            <img src="${item.img}" alt="${item.title}" width="100" height="62">
        `;

        if (item.area && typeof item.area === "object") {
          html += "<ul>";
          for (const [city, cityUrl] of Object.entries(item.area)) {
            html += `<li><a href="${cityUrl}" target="_blank" rel="noopener noreferrer">${city}</a></li>`;
          }
          html += "</ul>";
        }

        html += "</div>";
      });
      targetDiv.innerHTML = html;
    })
    .catch((error) => {
      console.error("読み込みに失敗しました:", error);
      targetDiv.innerHTML = "<p>データの取得に失敗しました</p>";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const targetDivs = document.querySelectorAll(".kinpoudou-link");
  targetDivs.forEach((div) => jsonOutput(div));
});
