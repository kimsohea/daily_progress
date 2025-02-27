// date var
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

// intro var
const moonCycle = [
  { range: [0, 2], shapeName: "월삭(합삭)", shapeIdx: 0 },
  { range: [2, 8], shapeName: "초승달", shapeIdx: 1 },
  { range: [8, 9], shapeName: "상현달", shapeIdx: 2 },
  { range: [9, 15], shapeName: "상현달", shapeIdx: 3 },
  { range: [15, 16], shapeName: "보름달", shapeIdx: 4 },
  { range: [16, 22], shapeName: "하현달", shapeIdx: 5 },
  { range: [22, 24], shapeName: "하현달", shapeIdx: 6 },
  { range: [24, Infinity], shapeName: "그믐달", shapeIdx: 7 },
];
const slotList = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
let slotNum = 0;
let slotStop = 0;

const moonFinder = (moon) => {
  return moonCycle.find(({ range }) => moon >= range[0] && moon < range[1]);
};

// screen var
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;

// nav var
let headerFlg = false;
let navIdx = 0;
const sectionArr = [];
const sectionTopArr = [];

const toggle = (element, flg) => {
  headerFlg = flg ? false : true;
  if (headerFlg) element.parentElement.classList.add("active");
  else element.parentElement.classList.remove("active");
};

const scrollEvent = (val) => {
  window.scrollTo({ top: val, behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", function () {
  // 21:9 모바일 화면일시 모양 변경
  const screenWrap = document.querySelector(".wrapper");
  if (winWidth < 1081 && winHeight > 750) screenWrap.classList.add("narrow");

  // Http 리퀘스트
  const respon = new XMLHttpRequest();
  respon.open("GET", requestUrl);
  respon.send();
  respon.onload = () => {
    if (respon.status >= 200 && respon.status < 300) {
      // Xml 받아서 파싱 후 숫자로 변환
      let parseXML = new DOMParser();
      let xmlDoc = parseXML.parseFromString(respon.response, "text/xml");
      let todayMoonStr = xmlDoc.querySelector(
        "body items item lunDay"
      ).textContent;
      let todayMoon = Number(todayMoonStr);

      // 음력일 및 달 명칭 추가
      this.querySelector(".intro .lun_info").textContent = todayMoon;
      const moonName = this.querySelector(".intro .lun_name");
      const moonInfo = moonFinder(todayMoon);
      todayMoonIdx = moonInfo.shapeIdx;
      moonName.textContent = moonInfo.shapeName;
    } else console.log("failed");
  };

  // 달 슬롯머신
  const slotBox = this.querySelector(".slot_box");
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

  // 네비게이션 섹션
  const heightHalf = winHeight / 2;
  const sectionNode = this.querySelectorAll(".main>section");
  const navList = this.querySelectorAll(".navi .nav_ul li");

  sectionNode.forEach((el, idx) => {
    sectionTopArr.push(el.offsetTop);
    if (idx > 0) sectionArr.push(el.offsetTop - heightHalf);
    else sectionArr.push(el.offsetTop);
  });

  // 최상단 버튼 스크롤
  const topBtn = this.querySelector(".navi .top");
  topBtn.addEventListener("click", () => scrollEvent(0));

  // 네비게이션 토글
  const navi = this.querySelector(".navi_btn");
  navi.addEventListener("click", () => toggle(navi, headerFlg));

  // 버튼 클릭시 스크롤
  const navBtn = this.querySelectorAll(".navi .nav_ul li button");
  sectionNode.forEach((el) => sectionTopArr.push(el.offsetTop));
  navBtn.forEach((item, idx) =>
    item.addEventListener("click", () => {
      scrollEvent(sectionTopArr[idx]);
      toggle(navi, true);
    })
  );

  // 스크롤시 활성화
  const introLine = this.querySelectorAll(".intro_myself .deco_line");
  let lineWidth = 0;
  const aboutHeight = sectionTopArr[2] - sectionTopArr[1];

  this.addEventListener("scroll", () => {
    const scrTop = window.scrollY;
    navList.forEach((item) => item.classList.remove("active"));
    if (scrTop >= sectionArr[0] && scrTop < sectionArr[1]) {
      navIdx = 0;
      lineWidth = 0;
      introLine.forEach((lines) => (lines.style.width = lineWidth + "%"));
    } else if (scrTop >= sectionArr[1] && scrTop < sectionArr[2]) {
      navIdx = 1;
    } else if (scrTop >= sectionArr[2]) navIdx = 2;
    navList[navIdx].classList.add("active");

    if (scrTop > sectionArr[1]) topBtn.classList.add("active");
    else topBtn.classList.remove("active");

    if (scrTop < sectionTopArr[2]) {
      let perVal = ((scrTop - aboutHeight) / aboutHeight) * 100;
      lineWidth = perVal > 101 ? 100 : perVal;
      introLine.forEach((lines) => (lines.style.width = lineWidth + "%"));
    }
  });

  const swiperContainer = this.querySelector(".site_wrap");
  if (swiperContainer) {
    // 스와이퍼
    const siteSwiper = new Swiper(".site_wrap", {
      speed: 400,
      slidesPerView: 1,
      loop: true,
      navigation: {
        nextEl: ".swiper_btn .next_btn",
        prevEl: ".swiper_btn .prev_btn",
      },
      pagination: {
        el: ".swiper_btn .page",
        type: "fraction",
      },
    });
  }
});
