/* ==========================================================
   HERTZ 홈페이지 설정 파일
   - 풍경 추가/삭제, 링크 변경은 이 파일만 고치면 됩니다.
   ========================================================== */

/* ----------------------------------------------------------
   1) 링크
   ---------------------------------------------------------- */
const HERTZ_LINKS = {
  // '응답하기' 버튼이 연결될 블룸 캐릭터 주소
  bloom: 'https://bloom-ai.me/content/9d3e9d5d-4e44-496b-a486-1e3831046f86',
};

/* ----------------------------------------------------------
   2) 창밖 풍경 목록
   ----------------------------------------------------------
   [풍경 추가하기]
     1. 이미지를 assets/scenes 폴더에 넣는다 (png, jpg, webp 모두 가능)
     2. 아래 목록에 한 줄 추가한다

   [풍경 빼기]
     해당 줄을 지우거나, 맨 앞에 // 를 붙여 꺼둔다

   [항목 설명]
     file  : 이미지 경로
     label : 상단 바에 잠깐 뜨는 관측 라벨
     type  : 풍경 종류. 함선 계기판이 이 값에 반응한다
             'blackhole' → 중력 시간 지연 계수 상승, 화면 가장자리 왜곡
             'wormhole'  → 통신 노이즈 + 영상 신호가 한 프레임 스침
             'nebula'    → 센서 간섭, 일부 수치가 '---'로 흔들림
             'planet'    → 테라포밍 모듈이 행성을 스캔했다가 '부적합' 판정
             'galaxy'    → 평온한 순항
             'redshift'  → 붉은 경고등, 신호 감쇠
     focus : (선택) 이미지에서 화면 중앙에 둘 지점. 기본 'center'
             예) 'center 30%' 는 위쪽을 더 보여줌
   ---------------------------------------------------------- */
const HERTZ_SCENES = [
  { file: 'assets/scenes/wormhole-01.webp',  label: '시공간 왜곡 — 통로 진입 중',        type: 'wormhole' },
  { file: 'assets/scenes/blackhole-02.webp', label: '중력 특이점 근접 — 강착원반 관측', type: 'blackhole' },
  { file: 'assets/scenes/nebula-01.webp',    label: '미확인 성운 — 저밀도 가스층 통과',  type: 'nebula' },
  { file: 'assets/scenes/planet-01.webp',    label: '행성계 외곽 — 지표 스캔 대상 다수',  type: 'planet', focus: 'center 70%' },
  { file: 'assets/scenes/galaxy-02.webp',    label: '나선 은하 원경 — 순항',             type: 'galaxy' },
  { file: 'assets/scenes/blackhole-03.webp', label: '중력 렌즈 현상 — 광원 굴절',         type: 'blackhole' },
  { file: 'assets/scenes/nebula-03.webp',    label: '성간 먼지 구름 — 센서 감도 저하',    type: 'nebula' },
  { file: 'assets/scenes/planet-02.webp',    label: '고리 행성 — 궤도 접근',             type: 'planet' },
  { file: 'assets/scenes/redshift-01.webp',  label: '적색편이 영역 — 광원 후퇴 중',       type: 'redshift' },
  { file: 'assets/scenes/galaxy-01.webp',    label: '은하 원반 — 항로 기준점 탐색',       type: 'galaxy', focus: 'center 60%' },
  { file: 'assets/scenes/wormhole-02.webp',  label: '고에너지 개구부 — 통로 출구',        type: 'wormhole' },
  { file: 'assets/scenes/nebula-02.webp',    label: '성운 내부 — 가시거리 저하',          type: 'nebula' },
  { file: 'assets/scenes/blackhole-01.webp', label: '사건의 지평선 외곽 — 안전거리 유지',  type: 'blackhole' },
  { file: 'assets/scenes/galaxy-03.webp',    label: '항성 밀집 구역 — 순항',             type: 'galaxy' },
];

/* 풍경이 바뀌는 간격(초) */
const HERTZ_SCENE_SECONDS = 45;

/* 순서대로 보여줄지(false), 무작위로 섞을지(true) */
const HERTZ_SCENE_SHUFFLE = false;
