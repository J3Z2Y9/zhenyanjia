"use strict";

const cssLoaded = getComputedStyle(document.documentElement)
  .getPropertyValue("--stylesheet-loaded").trim() === "yes";
document.getElementById("css-status").textContent = cssLoaded
  ? "样式已加载" : "样式未加载，请刷新检查";
document.getElementById("js-status").textContent = "脚本已加载";

const button = document.getElementById("test-button");
const result = document.getElementById("test-result");
let clicks = 0;
button.disabled = false;
result.textContent = "点击按钮，验证 JavaScript 交互是否正常。";
button.addEventListener("click", () => {
  clicks += 1;
  result.textContent = `交互正常！你已点击 ${clicks} 次。`;
});
