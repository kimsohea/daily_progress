(() => {
	const todayLunar = async () => {
		// let data = await fetch('http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?ServiceKey=68%2BtOC0gNDUQjLJUHWznKNCwXD8Wy04hWoQH%2Bl%2FI9Rhne17jw9Rljp1xNppnXbFUrXTsNKJpZWeIA9lv2RJVxQ%3D%3D&solYear=2025&solMonth=02&solDay=13');
		// console.log(data);
		// console.log(typeof data);

		//     fetch('http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?ServiceKey=68%2BtOC0gNDUQjLJUHWznKNCwXD8Wy04hWoQH%2Bl%2FI9Rhne17jw9Rljp1xNppnXbFUrXTsNKJpZWeIA9lv2RJVxQ%3D%3D&solYear=2025&solMonth=02&solDay=13')
		// .then((response) => response.text())
		// .then((str) => new DOMParser().parseFromString(str, 'application/xml'))
		// .then((xml) => {
		//   console.log(xml);
		//   // console.log(xml.querySelector('orange').innerHTML);
		// });

		// 파일 가져오기
		const response = await fetch(
			"http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?ServiceKey=68%2BtOC0gNDUQjLJUHWznKNCwXD8Wy04hWoQH%2Bl%2FI9Rhne17jw9Rljp1xNppnXbFUrXTsNKJpZWeIA9lv2RJVxQ%3D%3D&solYear=2025&solMonth=02&solDay=13"
		);
		debugger;
		// 텍스트 형식으로 해석
		const text = await response.text();
		// XML 형식으로 해석
		const xml = new DOMParser().parseFromString(text, "application/xml");

		console.log(xml);
	};

	todayLunar();
	console.log("test");
})();
