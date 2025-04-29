// screen var
export const winWidth = window.innerWidth;
export const winHeight = window.innerHeight;

// intro var
export const moonCycle = [
  { range: [0, 2], shapeName: "월삭(합삭)", shapeIdx: 0 },
  { range: [2, 8], shapeName: "초승달", shapeIdx: 1 },
  { range: [8, 9], shapeName: "상현달", shapeIdx: 2 },
  { range: [9, 15], shapeName: "상현달", shapeIdx: 3 },
  { range: [15, 16], shapeName: "보름달", shapeIdx: 4 },
  { range: [16, 22], shapeName: "하현달", shapeIdx: 5 },
  { range: [22, 24], shapeName: "하현달", shapeIdx: 6 },
  { range: [24, Infinity], shapeName: "그믐달", shapeIdx: 7 },
];

export const moonFinder = (moon) => {
  return moonCycle.find(({ range }) => moon >= range[0] && moon < range[1]);
};

export const scrollEvent = (val) => {
  window.scrollTo({ top: val, behavior: "smooth" });
};

export const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};
