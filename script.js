const today = new Date();
const todayDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()];

let todayMoonIdx = 0;
const dataApiUrl =
  "https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo";
const dataApiKey =
  "?ServiceKey=68%2BtOC0gNDUQjLJUHWznKNCwXD8Wy04hWoQH%2Bl%2FI9Rhne17jw9Rljp1xNppnXbFUrXTsNKJpZWeIA9lv2RJVxQ%3D%3D";
const year = "&solYear=" + today.getFullYear();
const month =
  todayDate[1] < 10
    ? "&solMonth=0" + todayDate[1]
    : "&solMonth=" + todayDate[1];
const date =
  todayDate[2] < 10 ? "&solDay=0" + todayDate[2] : "&solDay=" + todayDate[2];
const requestUrl = dataApiUrl + dataApiKey + year + month + date;

const slotList = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
const moonNameArr = [
  "월삭(합삭)",
  "초승달",
  "상현달",
  "보름달",
  "하현달",
  "그믐달",
];

document.addEventListener("DOMContentLoaded", () => {
  const respon = new XMLHttpRequest();
  respon.open("GET", requestUrl);
  respon.send();
  respon.onload = () => {
    if (respon.status >= 200 && respon.status < 300) {
      let parseXML = new DOMParser();
      let xmlDoc = parseXML.parseFromString(respon.response, "text/xml");
      let todayMoonStr = xmlDoc.querySelector(
        "body items item lunDay"
      ).textContent;
      let todayMoon = Number(todayMoonStr);
      const moonNum = document.querySelector(".intro .lun_info");
      moonNum.textContent = todayMoon;
      const moonName = document.querySelector(".intro .lun_name");
      if (todayMoon < 2) {
        todayMoonIdx = 0;
        moonName.textContent = moonNameArr[0];
      } else if (todayMoon > 2 && todayMoon < 8) {
        todayMoonIdx = 1;
        moonName.textContent = moonNameArr[1];
      } else if (todayMoon >= 8 && todayMoon < 9) {
        todayMoonIdx = 2;
        moonName.textContent = moonNameArr[2];
      } else if (todayMoon > 9 && todayMoon < 15) {
        todayMoonIdx = 3;
        moonName.textContent = moonNameArr[2];
      } else if (todayMoon === 15) {
        todayMoonIdx = 4;
        moonName.textContent = moonNameArr[3];
      } else if (todayMoon > 15 && todayMoon < 22) {
        todayMoonIdx = 5;
        moonName.textContent = moonNameArr[3];
      } else if (todayMoon >= 22 && todayMoon < 24) {
        todayMoonIdx = 6;
        moonName.textContent = moonNameArr[4];
      } else {
        todayMoonIdx = 7;
        moonName.textContent = moonNameArr[5];
      }
    } else console.log("failed");
  };

  let slotNum = 0;
  let slotStop = 0;
  const slotBox = document.querySelector(".slot_box");

  const slotTimer = setInterval(() => {
    slotBox.textContent = slotList[slotNum];
    slotNum++;
    slotStop++;
    if (slotNum > 7) slotNum = 0;

    if (slotStop > 28) {
      clearInterval(slotTimer);
      slotBox.textContent = slotList[todayMoonIdx];
      slotBox.classList.add("shine");
    }
  }, 50);

  //const siteSwiper = new Swiper(".swiper_site_list", {
  //  slidesPerView: 1,
  //  loop: true,
  //});
});
