// date var
const today = new Date();
const todayDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()];

let todayMoonIdx = 0;
const dataApiUrl = "https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo";
const dataApiKey =
  "?ServiceKey=68%2BtOC0gNDUQjLJUHWznKNCwXD8Wy04hWoQH%2Bl%2FI9Rhne17jw9Rljp1xNppnXbFUrXTsNKJpZWeIA9lv2RJVxQ%3D%3D";
const year = "&solYear=" + today.getFullYear();
const month = todayDate[1] < 10 ? "&solMonth=0" + todayDate[1] : "&solMonth=" + todayDate[1];
const date = todayDate[2] < 10 ? "&solDay=0" + todayDate[2] : "&solDay=" + todayDate[2];
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

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
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
      let todayMoonStr = xmlDoc.querySelector("body items item lunDay").textContent;
      let todayMoon = Number(todayMoonStr);

      // 음력일 및 달 명칭 추가
      this.querySelector(".intro .lun_info").textContent = todayMoon;
      const moonName = this.querySelector(".intro .lun_name");
      const moonInfo = moonFinder(todayMoon);
      todayMoonIdx = moonInfo.shapeIdx;
      moonName.textContent = moonInfo.shapeName;
      this.querySelector(".moon_box").classList.add(`type0${todayMoonIdx}`);
      this.querySelectorAll(".moon_list li")[0].classList.remove(`active`);
      this.querySelectorAll(".moon_list li")[todayMoonIdx].classList.add(`active`);
    } else console.log("failed");
  };

  const moonLists = this.querySelectorAll(".moon_list li");

  moonLists.forEach((item) => {
    item.addEventListener("click", function () {
      moonLists.forEach((lists) => lists.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // 달 슬롯머신
  let canvas = document.getElementById("grass"),
    ctx = canvas.getContext("2d"),
    stack = [],
    w = window.innerWidth - getScrollbarWidth(),
    h = window.innerHeight;
  const drawer = function () {
    ctx.fillRect(0, 0, w, h);
    stack.forEach((el) => el());
    requestAnimationFrame(drawer);
  };
  const anim = function () {
    let x = (y = 0);
    let maxTall = Math.random() * 100 + 200;
    let maxSize = Math.random() * 10;
    let speed = Math.random();
    let position = Math.random() * w - w / 2;
    let c = (l, u) => Math.round(Math.random() * (u || 255) + l || 0);
    let color = "rgb(" + c(250, 5) + "," + c(215, 10) + "," + c(110, 10) + ")";
    return function () {
      const deviation = Math.cos(x / 30) * Math.min(x / 40, 50),
        tall = Math.min(x / 2, maxTall),
        size = Math.min(x / 50, maxSize);
      x += speed;
      ctx.save();
      ctx.strokeWidth = 10;
      ctx.translate(w / 2 + position, h);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.lineTo(-size, 0);
      ctx.quadraticCurveTo(-size, -tall / 2, deviation, -tall);
      ctx.quadraticCurveTo(size, -tall / 2, size, 0);
      ctx.fill();
      ctx.restore();
    };
  };
  for (let x = 0; x < 400; x++) {
    stack.push(anim());
  }
  canvas.width = w;
  canvas.height = h;
  window.addEventListener("resize", () => {
    (w = window.innerWidth - getScrollbarWidth()), (h = window.innerHeight);
    canvas.width = w;
    canvas.height = h;
    stack = [];
    for (let x = 0; x < 400; x++) {
      stack.push(anim());
    }
  });
  drawer();

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
    if (scrTop >= sectionArr[0] && scrTop < sectionArr[1]) navIdx = 0;
    else if (scrTop >= sectionArr[1] && scrTop < sectionArr[2]) navIdx = 1;
    else if (scrTop >= sectionArr[2] && scrTop < sectionArr[3]) navIdx = 2;
    else if (scrTop >= sectionArr[3]) navIdx = 3;
    navList[navIdx].classList.add("active");

    if (scrTop > sectionArr[1]) topBtn.classList.add("active");
    else topBtn.classList.remove("active");

    if (scrTop < sectionTopArr[2]) {
      let perVal = ((scrTop - aboutHeight) / aboutHeight) * 100;
      lineWidth = perVal > 90 ? 90 : perVal;
      introLine.forEach((lines) => (lines.style.width = lineWidth + "%"));
    }
  });
});
