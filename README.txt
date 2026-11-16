HERTZ 소개 홈페이지
====================

■ 열어보기
  index.html 을 더블클릭하면 브라우저에서 열립니다.
  (폰트는 인터넷 연결이 있어야 적용됩니다)

■ 고칠 일이 있으면 config.js 하나만 열면 됩니다
  - 응답하기 버튼 링크(블룸 주소)
  - 창밖 풍경 목록 / 바뀌는 간격 / 무작위 순서 여부

■ 풍경 추가
  1. 이미지를 assets/scenes 폴더에 넣기
  2. config.js 의 HERTZ_SCENES 목록에 한 줄 추가
     { file: 'assets/scenes/새이미지.png', label: '보여줄 라벨', type: 'nebula' },
  type 종류: blackhole / wormhole / nebula / planet / galaxy / redshift
  (type 에 따라 함선 계기판 반응이 달라집니다)

■ 풍경 빼기
  config.js 에서 해당 줄 삭제, 또는 줄 맨 앞에 // 를 붙이기

■ 폴더 구성
  index.html     페이지 구조
  config.js      설정 (링크, 풍경)
  css/style.css  디자인
  js/main.js     연출·크루 기록·일지·카메라 문구
  assets/        이미지·BGM (웹용으로 변환한 사본, 원본은 그대로 둠)

※ 크루 명단, 함장 일지, 카메라 설명, 아이다 대사는 js/main.js 위쪽 '데이터' 부분에서 바로 고칠 수 있습니다.
