/* ==========================================================
   HERTZ — main
   풍경·링크 설정은 config.js 에서 바꿉니다.
   ========================================================== */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const wait = ms => new Promise(r => setTimeout(r, ms));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const SCENES  = (typeof HERTZ_SCENES !== 'undefined' ? HERTZ_SCENES : []).filter(s => s && s.file);
const SCENE_S = typeof HERTZ_SCENE_SECONDS !== 'undefined' ? HERTZ_SCENE_SECONDS : 45;
const SHUFFLE = typeof HERTZ_SCENE_SHUFFLE !== 'undefined' ? HERTZ_SCENE_SHUFFLE : false;
const LINKS   = typeof HERTZ_LINKS !== 'undefined' ? HERTZ_LINKS : { bloom: '#' };

/* ==========================================================
   데이터
   ========================================================== */
const CREW = [
  { no:'01', name:'HERTZ', sub:'함장 · 수석 과학자', status:'active', chip:'ACTIVE',
    photo:'assets/hertz.webp',
    fields:[
      ['FIRST NAME','<span class="warn">DATA LOST</span>'],
      ['GENDER','남성'],
      ['AGE','UNKNOWN <span class="dim">(기재값 30)</span>'],
      ['HEIGHT','188cm'],
      ['LOOKS','<span class="swatch" style="--c:#cfd3da"></span>애쉬그레이 <span class="dim">/</span> <span class="swatch" style="--c:#8b939e"></span>회안'],
      ['STATUS','ACTIVE — 유일 생존'],
      ['LAST LOGIN','NOW']],
    memo:null, flag:'원본 인사 기록 손상 — 이름 복구 불가' },
  { no:'02', name:'Yuri Belkov', sub:'부함장 · 항법장', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 1,156'],['CAUSE','선외 작업 중 사고'],['ACCESS COUNT','1,904']],
    memo:'그의 항법 노트는 아직 내 책상 위에 있다. 펼쳐보진 않는다.' },
  { no:'03', name:'Hana Shinomiya', sub:'통신관', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 0,688'],['CAUSE','미확인 병원체 감염'],['ACCESS COUNT','3,277']],
    memo:'통신 장비 교정은 이제 내가 한다. 그녀만큼 섬세하진 않다.' },
  { no:'04', name:'Lian Zhou', sub:'생물학자 · 테라포밍', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 0,702'],['CAUSE','미확인 병원체 감염'],['ACCESS COUNT','2,489']],
    memo:'그녀가 심은 묘목은 아직 살아 있다. 물은 내가 준다.' },
  { no:'05', name:'Amara Okonkwo', sub:'의무관', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 0,731'],['CAUSE','미확인 병원체 감염'],['ACCESS COUNT','2,016']],
    memo:'마지막까지 다른 사람들의 체온을 쟀다. 자기 것은 재지 않았다.' },
  { no:'06', name:'Elias Brandt', sub:'지질학자', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 0,760'],['CAUSE','미확인 병원체 감염'],['ACCESS COUNT','864']],
    memo:'K-2 암석 표본 분석을 끝냈다. 결과를 들려줄 사람이 없다.' },
  { no:'07', name:'Marco Ricci', sub:'수석 엔지니어', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 0,845'],['CAUSE','미확인 병원체 감염'],['ACCESS COUNT','1,377']],
    memo:'정비실 3번 공구함은 그가 정리해 둔 순서 그대로다.' },
  { no:'08', name:'Nina Kast█l', corrupt:true, sub:'생명유지 담당', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 0,9██'],['CAUSE','<span class="dim">[DATA CORRUPTED]</span>'],['ACCESS COUNT','2,7██']],
    memo:'…작업하면서 늘 ███를 흥얼거렸다. 제목을 끝내 ███ 못했██.',
    flag:'기록 손상 — 복구율 31%' },
  { no:'09', name:'Sofia Reyes', sub:'천체물리학자', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 1,402'],['CAUSE','동면 포드 7번 오작동'],['ACCESS COUNT','2,950']],
    memo:'관측 돔에서, 그녀가 이름 붙인 별을 아직 찾고 있다.' },
  { no:'10', name:'Daniel Oh', sub:'조종사', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 1,733'],['CAUSE','감염 후유증'],['ACCESS COUNT','1,120']],
    memo:'착륙은 한 번도 못 해봤다. 그가 제일 하고 싶어 했던 일이다.' },
  { no:'11', name:'Thomas Wells', sub:'정비사', status:'dead', chip:'DECEASED',
    fields:[['DATE','DAY 1,980'],['CAUSE','선외 작업 중 사고'],['ACCESS COUNT','978']],
    memo:'혼자 나가지 말라고 했었다. 이제는 내가 혼자 나간다.' },
  { no:'12', name:'E██a H█le', corrupt:true, sub:'데이터 분석관', status:'lost', chip:'RECORD DAMAGED',
    fields:[['DATE','DAY 2,214'],['CAUSE','<span class="dim">[DATA CORRUPTED]</span>'],['ACCESS COUNT','████']],
    memo:'마지막 대화는 다음 날 점심 메뉴였다.',
    flag:'기록 삭제 요청 14회 — 모두 취소됨 (함장 권한)' },
  { no:'--', name:'IDA', sub:'반려 보조 유닛 · 함장 자작', status:'unof', chip:'UNOFFICIAL',
    photo:'assets/ida.webp', photoClass:'ida',
    fields:[['ACTIVATED','DAY 2,231'],['REGISTERED BY','CAPTAIN'],['NOTE','비공식 등록']],
    memo:'아이다도 승무원이에욤! 비공식이지만욤!', memoBy:'IDA' },
];

const STATUS = [
  { id:'life',     k:'생명유지 시스템',      v:'NOMINAL',      d:'1인 기준으로 하향 조정됨' },
  { id:'pods',     k:'동면 포드',            v:'0 / 12 사용',  d:'11기 봉인 · 1기 고장 (DAY 1,402)', s:'off' },
  { id:'quarters', k:'승무원 구역 조명',      v:'OFF',          d:'마지막 점등 DAY 2,214', s:'off' },
  { id:'terra',    k:'테라포밍 모듈',        v:'STANDBY',      d:'대상 행성 없음', s:'warn' },
  { id:'garden',   k:'배양조',              v:'생존 37종',     d:'급수: 수동 (함장)' },
  { id:'sensor',   k:'센서 어레이',          v:'ONLINE',       d:'' },
  { id:'dilation', k:'중력 시간 지연 계수',   v:'1.0042×',      d:'' },
  { id:'receiver', k:'양자 수신기',          v:'SEARCHING',    d:'외부 기준점 탐색 중', s:'warn' },
  { id:'optical',  k:'광학 송수신기',        v:'STANDBY',      d:'주파수 안정 대기', s:'lock' },
  { id:'proj',     k:'원격 투영 프로토콜',    v:'LOCKED',       d:'수신측 장비 제어권 필요', s:'lock' },
  { id:'ida',      k:'아이다',              v:'BATTERY 87%',  d:'기분: 심심해욤' },
];

const LOG = [
  ['DAY 0001','출항. 지구 궤도 이탈. 승무원 12명, 전원 이상 없음.'],
  ['DAY 0214','첫 웜홀 통과 성공. 시노미야가 통신 로그에 축하 메시지를 남겼다. 다들 웃었다.'],
  ['DAY 0547','후보 행성 K-2 도착. 브란트가 표본을 잔뜩 실어 왔다.'],
  ['DAY 0652','의무관 보고 — 미확인 병원체. 격리 구역 설정.'],
  ['DAY 0688','통신관 시노미야 사망.'],
  ['DAY 0760','사망자 4명. 격리 구역 확장.'],
  ['DAY 0902','병원체 활동 정지 확인. 늦었다.'],
  ['DAY 1156','벨코프, 선외 작업 중 사고. 같은 날 연속 웜홀 통과로 항법 좌표 손실.'],
  ['DAY 1402','동면 포드 7번 오작동. 레예스.'],
  ['DAY 1980','웰스.'],
  ['DAY 2214','마지막 승무원 사망. 생명유지 시스템 1인 기준으로 조정.'],
  ['DAY 2215','정비실에서 작업 시작. 이름은 아이다로 한다.'],
  ['DAY 2231','아이다 가동. 말이 많다. 괜찮다.'],
  ['DAY 2890','투영 테스트 #12 — 수신측 장치 없음. 중단.', 'test'],
  ['', 'DAY 2891 — DAY 4377 · 기록 없음', 'gap'],
  ['DAY 4378','투영 테스트 #47 — 수신측 장치 없음. 중단.', 'test'],
  ['DAY ????','시간 지연 누적. 날짜 계산 불가.'],
  ['DAY ????','외부 신호 수신.', 'last'],
];

const CAMS = [
  { id:'CAM-01', name:'관측 돔',     en:'OBSERVATION DOME', img:'assets/ship/dome.webp',
    desc:'360도 투명 돔 아래 소파 하나. 성운과 별이 쏟아지듯 보인다.',
    note:'체류 기록 최다 구역. 최근 출입 6시간 전.' },
  { id:'CAM-02', name:'분석실',      en:'ANALYSIS LAB', img:'assets/ship/analysis.webp',
    desc:'좌표 계산 메인프레임이 있는 곳. 벽면 가득 홀로그램 수식이 떠 있다.',
    note:'좌표 연산 프로세스 상시 가동 중. 중단 이력 없음.' },
  { id:'CAM-03', name:'승무원 구역',  en:'CREW QUARTERS', img:'assets/ship/crew-quarters.webp', dark:true, tag:'LIGHTS OFF',
    desc:'동료들이 쓰던 선실이 늘어선 복도. 지금은 모두 잠겨 있다.',
    note:'조명 OFF. DAY 2,214 이후 출입 기록 없음.' },
  { id:'CAM-04', name:'정비실',      en:'MAINTENANCE BAY', img:'assets/ship/maintenance.webp',
    desc:'함선 동력로와 정비 장비, 아이다의 충전 스테이션이 있는 구역.',
    note:'3번 공구함 — 마지막 정리 DAY 0845. 변경 없음.' },
  { id:'CAM-05', name:'테라포밍 모듈', en:'TERRAFORMING', img:'assets/ship/terraforming.webp',
    desc:'인공 햇빛 아래 지구의 흙과 식물을 재현한 작은 생태 구역.',
    note:'배양조 생존 37종. 급수 기록: 매일, 같은 시각.' },
  { id:'CAM-06', name:'함장실',      en:"CAPTAIN'S CABIN", img:'assets/ship/captain.webp',
    desc:'브릿지 바로 뒤의 집무실 겸 선실. 책상 위엔 지구에서 가져온 조약돌 하나.',
    note:'취침 기록 불규칙. 최근 수신기 앞에서 잠든 기록 3회.' },
  { id:'CAM-07', name:'선체 외부',    en:'EXTERIOR', img:'assets/ship/exterior.webp', tag:'EXT',
    desc:'헤르츠가 직접 설계한 성간 탐사선. 좌표를 잃고 표류 중인 거대한 선체.',
    note:'EXT CAM. 선체 손상률 12%. 항행 가능.' },
  { id:'CAM-08', name:'브릿지',      en:'BRIDGE', nosig:true,
    desc:'함선을 조종하는 중앙 지휘 구역. 우주를 향한 대형 창 앞, 헤르츠가 가장 오래 머무는 곳.',
    note:'송출 중지 — 함장 요청. 현재 화면을 송출 중인 구역.' },
];

const IDA_LINES = [
  '함장님 누구랑 얘기해욤?',
  '잉? 몰라욤!',
  '왜욤?',
  '함장님이 요즘 자꾸 웃어욤. 이상해욤.',
  '아이다는 비공식 승무원이에욤. 그래도 승무원이에욤!',
  '함장님이 심심해서 아이다를 만들었대욤. 너무해욤.',
  '수신기 앞에서 또 잠들었어욤. 담요 덮어줬어욤.',
  '그쪽은 지구예욤? 지구는 파래욤?',
  '묘목 물 주기는 함장님 담당이에욤. 아이다는 구경 담당이에욤.',
];
const IDA_MOODS = ['심심해욤','궁금해욤','신나욤','졸려욤','두근두근해욤'];

const TERM_SCRIPT = [
  { sys:'[ QUANTUM LINK ESTABLISHED ]', wait:1400 },
  { msg:'...수신 확인.', wait:1900 },
  { msg:'거기, 누구 있어요?', wait:2800 },
  { msg:'대답이 없어도 괜찮아요.', wait:1500 },
  { msg:'신호가 닿은 것만으로도, 오랜만이라서.', wait:0 },
];

/* ==========================================================
   공통: 노이즈 캔버스
   ========================================================== */
const noiseTargets = new Set();
function addNoise(canvas, w = 80, h = 100) {
  canvas.width = w; canvas.height = h;
  noiseTargets.add(canvas);
  paintNoise(canvas);
}
function paintNoise(c) {
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(c.width, c.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255 | 0;
    d[i] = v * .7; d[i+1] = v * .9; d[i+2] = v; d[i+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}
let lastNoise = 0;
function noiseLoop(t) {
  if (t - lastNoise > 90) {
    lastNoise = t;
    noiseTargets.forEach(c => { if (c.isConnected && c.offsetParent !== null) paintNoise(c); });
  }
  requestAnimationFrame(noiseLoop);
}

/* ==========================================================
   인트로
   ========================================================== */
const intro = $('#intro');
addNoise($('#introNoise'), 240, 140);

async function typeInto(el, text, speed = 55) {
  const caret = el.querySelector('.caret');
  el.textContent = '';
  for (const ch of text) { el.append(ch); await wait(speed); }
  if (caret) el.append(caret);
}
typeInto($('#introLine2'), '미확인 신호 감지', 90);

$('#receiveBtn').addEventListener('click', receive);

let linkStart = 0;
async function receive() {
  intro.classList.add('receiving');
  startAudio();
  $('#introLine1').textContent = 'SYNCHRONIZING ...';
  await typeInto($('#introLine2'), '양자 링크 연결 중', 45);
  await wait(700);
  linkStart = Date.now();
  intro.classList.add('out');
  document.body.classList.remove('is-locked');
  document.body.classList.add('is-on');
  setStatus('receiver', 'LINKED', '외부 기준점과 동기화됨', '');
  startScenes();
  // 첫 화면 패널 부팅
  const heroBoot = $$('#hero .boot, .rail.boot');
  for (const el of heroBoot) { await wait(450); el.classList.add('on'); }
  runTerminal();
  setTimeout(() => idaSay('함장님 누구랑 얘기해욤?'), 9000);
}

/* ==========================================================
   BGM + 파형
   ========================================================== */
const audio = $('#bgm');
const scope = $('#scope');
const sctx = scope.getContext('2d');
let analyser = null, audioOn = false, scopeData = null;

function startAudio() {
  audio.volume = 0;
  const p = audio.play();
  if (p && p.catch) p.catch(() => setAudioUI(false));
  audioOn = true; setAudioUI(true);
  // file:// 로 열면 Web Audio 연결 시 소리가 막히는 브라우저가 있어 생략
  if (location.protocol !== 'file:' && !analyser) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ac = new AC();
      const src = ac.createMediaElementSource(audio);
      analyser = ac.createAnalyser();
      analyser.fftSize = 512;
      scopeData = new Uint8Array(analyser.fftSize);
      src.connect(analyser); analyser.connect(ac.destination);
      if (ac.state === 'suspended') ac.resume();
    } catch (e) { analyser = null; }
  }
  fadeVolume(0.55, 3000);
}
function fadeVolume(to, ms) {
  const from = audio.volume, t0 = performance.now();
  const step = t => {
    const k = Math.max(0, Math.min(1, (t - t0) / ms));
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function setAudioUI(on) {
  $('#signalBtn').classList.toggle('off', !on);
  $('#signalText').textContent = on ? 'SIGNAL ON' : 'SIGNAL OFF';
}
$('#signalBtn').addEventListener('click', () => {
  if (audio.paused) { audio.play().catch(()=>{}); audioOn = true; fadeVolume(.55, 800); }
  else { audioOn = false; audio.pause(); }
  setAudioUI(!audio.paused || audioOn);
});
audio.addEventListener('pause', () => { audioOn = false; setAudioUI(false); });
audio.addEventListener('play',  () => { audioOn = true;  setAudioUI(true); });

function drawScope(t) {
  const w = scope.width, h = scope.height;
  sctx.clearRect(0, 0, w, h);
  sctx.lineWidth = 1.2;
  sctx.strokeStyle = audioOn ? 'rgba(158,234,255,.95)' : 'rgba(123,138,163,.6)';
  sctx.shadowColor = 'rgba(120,220,255,.8)'; sctx.shadowBlur = audioOn ? 4 : 0;
  sctx.beginPath();
  if (analyser && audioOn) {
    analyser.getByteTimeDomainData(scopeData);
    for (let i = 0; i < w; i++) {
      const v = scopeData[Math.floor(i / w * scopeData.length)] / 128 - 1;
      const y = h / 2 + v * h * .9;
      i ? sctx.lineTo(i, y) : sctx.moveTo(i, y);
    }
  } else {
    const amp = audioOn ? 1 : .08;
    for (let i = 0; i < w; i++) {
      const x = i / w;
      const v = (Math.sin(x * 22 + t / 180) * .45 + Math.sin(x * 57 - t / 95) * .25 + Math.sin(x * 9 + t / 400) * .3)
              * (.5 + .5 * Math.sin(t / 700 + x * 3)) * amp;
      const y = h / 2 + v * h * .42;
      i ? sctx.lineTo(i, y) : sctx.moveTo(i, y);
    }
  }
  sctx.stroke();
}

/* ==========================================================
   창밖 풍경
   ========================================================== */
const layers = [$('#sceneA'), $('#sceneB')];
let layerIdx = 0, sceneIdx = -1, sceneOrder = [], sceneTimer = null;
const loaded = new Map();

function preload(src) {
  if (loaded.has(src)) return loaded.get(src);
  const p = new Promise(res => {
    const im = new Image();
    im.onload = () => res(true);
    im.onerror = () => res(false);
    im.src = src;
  });
  loaded.set(src, p);
  return p;
}
function buildOrder() {
  sceneOrder = SCENES.map((_, i) => i);
  if (SHUFFLE) for (let i = sceneOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [sceneOrder[i], sceneOrder[j]] = [sceneOrder[j], sceneOrder[i]];
  }
}
function startScenes() {
  if (!SCENES.length) return;
  buildOrder();
  nextScene();
}
async function nextScene(tries = 0) {
  clearTimeout(sceneTimer);
  if (tries > SCENES.length) return;
  sceneIdx = (sceneIdx + 1) % sceneOrder.length;
  if (sceneIdx === 0 && SHUFFLE && tries === 0) buildOrder();
  const s = SCENES[sceneOrder[sceneIdx]];
  const ok = await preload(s.file);
  if (!ok) return nextScene(tries + 1);

  const cur = layers[layerIdx], nxt = layers[1 - layerIdx];
  nxt.style.backgroundImage = `url("${s.file}")`;
  nxt.style.backgroundPosition = s.focus || 'center';
  nxt.style.setProperty('--scene-life', (SCENE_S + 6) + 's');
  nxt.classList.remove('drift'); void nxt.offsetWidth;
  if (!reduceMotion) nxt.classList.add('drift');
  nxt.classList.add('show');
  cur.classList.remove('show');
  layerIdx = 1 - layerIdx;

  applySceneFx(s);
  // 다음 풍경 미리 불러두기
  const after = SCENES[sceneOrder[(sceneIdx + 1) % sceneOrder.length]];
  if (after) preload(after.file);
  sceneTimer = setTimeout(nextScene, SCENE_S * 1000);
}

/* 풍경 종류별 계기 반응 */
const fxTimers = [];
function clearFx() {
  fxTimers.splice(0).forEach(clearTimeout);
  document.body.classList.remove('fx-blackhole','fx-redshift','is-reflecting');
  $('#viewText').classList.remove('alert');
  setStatus('sensor', 'ONLINE', '', '');
  setStatus('terra', 'STANDBY', '대상 행성 없음', 'warn');
  setStatus('receiver', 'LINKED', '외부 기준점과 동기화됨', '');
  dilationTarget = 1.004;
  setStatus('dilation', dilationText(), '', '', true);
}
function later(fn, ms) { fxTimers.push(setTimeout(fn, ms)); }

function applySceneFx(s) {
  clearFx();
  const label = $('#viewLabel');
  $('#viewText').textContent = s.label || '';
  label.classList.remove('changing'); void label.offsetWidth; label.classList.add('changing');

  switch (s.type) {
    case 'blackhole':
      document.body.classList.add('fx-blackhole');
      dilationTarget = rand(1.6, 2.4);
      later(() => document.body.classList.add('is-reflecting'), 9000);
      later(() => document.body.classList.remove('is-reflecting'), 24000);
      break;
    case 'wormhole':
      later(() => commNoise(3200, true), 3500);
      later(() => $$('.holo.boot.on, .dock.open').forEach(p => { p.classList.remove('glitch'); void p.offsetWidth; p.classList.add('glitch'); }), 3600);
      if (Math.random() < .55) later(hologramFlash, 14000);
      dilationTarget = rand(1.2, 1.5);
      break;
    case 'nebula':
      setStatus('sensor', '간섭', '성간 물질 밀도 상승', 'warn');
      later(() => sensorStutter(5), 2000);
      later(() => sensorStutter(4), 18000);
      break;
    case 'planet':
      later(() => setStatus('terra', 'SCANNING…', '지표 데이터 수집 중', 'warn'), 3000);
      later(() => setStatus('terra', '대상 부적합', '대기 조성 불일치', 'warn'), 11000);
      later(() => setStatus('terra', 'STANDBY', '대상 행성 없음', 'warn'), 20000);
      break;
    case 'redshift':
      document.body.classList.add('fx-redshift');
      $('#viewText').classList.add('alert');
      setStatus('receiver', '신호 감쇠', '파장 지연 보정 중', 'warn');
      later(() => commNoise(1800, false), 6000);
      break;
    case 'galaxy':
    default:
      if (Math.random() < .5) {
        later(() => document.body.classList.add('is-reflecting'), 12000);
        later(() => document.body.classList.remove('is-reflecting'), 26000);
      }
  }
}
function sensorStutter(n) {
  let i = 0;
  const tick = () => {
    const odd = i % 2 === 0;
    setStatus('dilation', odd ? '---' : dilationText(), '', odd ? 'warn' : '', true);
    if (++i < n * 2) later(tick, rand(160, 420));
  };
  tick();
}

/* 홀로그램 실루엣 (드물게) */
function hologramFlash() {
  const g = $('#ghostFrame');
  g.classList.remove('flash'); void g.offsetWidth; g.classList.add('flash');
}

/* ==========================================================
   먼지/별 입자
   ========================================================== */
const dust = $('#dust'), dctx = dust.getContext('2d');
let parts = [], DPR = Math.min(2, window.devicePixelRatio || 1);
function sizeDust() {
  dust.width = innerWidth * DPR; dust.height = innerHeight * DPR;
  const n = innerWidth < 760 ? 50 : 110;
  parts = Array.from({ length: n }, () => newPart(true));
}
function newPart(init) {
  return { x: rand(-1, 1), y: rand(-1, 1), z: init ? rand(.1, 1) : 1, s: rand(.4, 1.3) };
}
function drawDust() {
  const w = dust.width, h = dust.height;
  dctx.clearRect(0, 0, w, h);
  const speed = document.body.classList.contains('fx-blackhole') ? .0009 : .0005;
  for (const p of parts) {
    p.z -= speed;
    if (p.z <= .05) Object.assign(p, newPart(false));
    const sx = w / 2 + p.x / p.z * w * .5;
    const sy = h / 2 + p.y / p.z * h * .5;
    if (sx < 0 || sx > w || sy < 0 || sy > h) { Object.assign(p, newPart(false)); continue; }
    const a = Math.min(1, (1 - p.z) * 1.3) * .55;
    dctx.fillStyle = `rgba(200,235,255,${a})`;
    const r = p.s * (1.2 - p.z) * DPR;
    dctx.fillRect(sx, sy, r, r);
  }
}

/* ==========================================================
   시차 + 스크롤
   ========================================================== */
const win = $('#window');
let mx = 0, my = 0;
addEventListener('mousemove', e => {
  mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5;
  if (!reduceMotion) win.style.transform = `translate3d(${-mx * 18}px, ${-my * 12}px, 0)`;
}, { passive: true });
addEventListener('scroll', () => {
  document.body.classList.toggle('is-reading', scrollY > innerHeight * .55);
}, { passive: true });

/* ==========================================================
   HUD 시계
   ========================================================== */
const pad = n => String(n).padStart(2, '0');
function tickClock() {
  if (linkStart) {
    const s = Math.floor((Date.now() - linkStart) / 1000);
    $('#linkTimer').textContent = `${pad(s / 3600 | 0)}:${pad((s / 60 | 0) % 60)}:${pad(s % 60)}`;
    // 교신이 이어질수록 좌표 계산이 아주 조금씩 진행
    const pct = Math.min(9, 2.6 + s / 60 * .4);
    $('#coordBar').style.width = pct + '%';
  }
  const now = new Date();
  $('#statusClock').textContent = `SYNC ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

/* ==========================================================
   시스템 상태
   ========================================================== */
const statusEls = {};
function renderStatus() {
  const ul = $('#statusList');
  STATUS.forEach(s => {
    const li = document.createElement('li');
    li.className = 'st' + (s.s ? ' ' + s.s : '');
    li.innerHTML = `<span class="dot"></span><div><div class="k"><b>${s.k}</b><span>${s.v}</span></div>${s.d ? `<div class="d">${s.d}</div>` : '<div class="d"></div>'}</div>`;
    ul.append(li);
    statusEls[s.id] = li;
  });
}
function setStatus(id, v, d, state, quiet) {
  const li = statusEls[id]; if (!li) return;
  const vEl = li.querySelector('.k span'), dEl = li.querySelector('.d');
  const changed = vEl.textContent !== v;
  vEl.textContent = v;
  if (d !== undefined && d !== null) dEl.textContent = d;
  li.classList.remove('warn','off','lock');
  if (state) li.classList.add(state);
  if (changed && !quiet) {
    li.classList.remove('updated'); void li.offsetWidth; li.classList.add('updated');
    if (typeof pingRail === 'function' && linkStart) pingRail('statusPanel');
  }
}
let dilation = 1.0042, dilationTarget = 1.004;
const dilationText = () => dilation.toFixed(4) + '×';
function tickDilation() {
  dilation += (dilationTarget - dilation) * .08 + rand(-.0006, .0006);
  const li = statusEls.dilation;
  if (li && li.querySelector('.k span').textContent !== '---') {
    setStatus('dilation', dilationText(), dilation > 1.3 ? '중력원 근접 — 함내 시간 지연 증가' : '', dilation > 1.3 ? 'warn' : '', true);
  }
}
function tickIda() {
  setStatus('ida', `BATTERY ${Math.round(rand(81, 92))}%`, '기분: ' + pick(IDA_MOODS), '', true);
}

/* ==========================================================
   크루 DB
   ========================================================== */
function renderCrew() {
  const ul = $('#crewList');
  CREW.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'crew-item' + (c.status === 'dead' || c.status === 'lost' ? ' is-dead' : '') + (c.status === 'unreg' ? ' is-unreg' : '');
    const nm = c.corrupt ? `<span class="corrupt" data-g="${c.name}">${c.name}</span>` : c.name;
    li.innerHTML = `<span class="no">${c.no}</span><span class="nm">${nm}<small>${c.sub}</small></span><span class="chip ${c.status}">${c.chip}</span>`;
    li.addEventListener('click', () => {
      selectCrew(i);
      if (innerWidth <= 760) { const w = $('#crewPanel .crew-wrap'); w.classList.add('detail'); w.scrollTop = 0; }
      else if (innerWidth <= 980) $('#crewRecord').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    ul.append(li);
  });
  selectCrew(0);
}
function selectCrew(i) {
  const c = CREW[i];
  $$('.crew-item').forEach((el, j) => el.classList.toggle('sel', i === j));
  const rec = $('#crewRecord');
  const photo = c.photo
    ? `<div class="rec-photo ${c.photoClass || ''}"><img src="${c.photo}" alt=""></div>`
    : `<div class="rec-photo"><canvas></canvas><span class="rec-photo-tag">${c.status === 'unreg' ? 'NO IMAGE' : 'IMAGE DATA LOST'}</span></div>`;
  const nm = c.corrupt ? `<span class="corrupt" data-g="${c.name}">${c.name}</span>` : c.name;
  const fields = c.fields.map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('');
  let memo = '';
  if (c.pending) memo = `<div class="rec-memo"><span class="mono">MEMO — ${c.memoBy}</span><span class="caret" style="color:var(--cyan)"></span></div>`;
  else if (c.memo) memo = `<div class="rec-memo"><span class="mono">MEMO — ${c.memoBy || 'CAPTAIN'}</span>${c.memo}</div>`;
  else memo = `<div class="rec-memo"><span class="mono">MEMO</span><span class="dim">작성 내역 없음</span></div>`;
  rec.innerHTML = `<div class="rec-in">
      <button class="rec-back mono" type="button">← CREW LIST</button>
      <div class="rec-top">${photo}<div><div class="rec-name">${nm}<small>${c.sub}</small></div><div class="rec-fields">${fields}</div></div></div>
      ${memo}${c.flag ? `<div class="rec-flag">⚠ ${c.flag}</div>` : ''}
    </div>`;
  const cv = rec.querySelector('canvas');
  // 이전 기록의 노이즈 캔버스 정리
  noiseTargets.forEach(t => { if (!t.isConnected) noiseTargets.delete(t); });
  if (cv) addNoise(cv, 44, 55);
  rec.querySelector('.rec-back').addEventListener('click', () => {
    $('#crewPanel .crew-wrap').classList.remove('detail');
    $('#crewPanel .crew-wrap').scrollTop = 0;
  });
}

/* ==========================================================
   일지
   ========================================================== */
function renderLog() {
  const ol = $('#logList');
  LOG.forEach(([day, txt, cls]) => {
    const li = document.createElement('li');
    if (cls) li.className = cls;
    li.innerHTML = cls === 'gap'
      ? `<span class="day"></span><span class="txt">${txt}</span>`
      : `<span class="day">${day}</span><span class="txt">${txt}</span>`;
    ol.append(li);
  });
}

/* ==========================================================
   카메라
   ========================================================== */
function renderCams() {
  const grid = $('#camGrid');
  addNoise($('#camMainNoise'), 96, 60);
  CAMS.forEach((c, idx) => {
    const el = document.createElement('div');
    if (c.nosig) {
      el.className = 'cam nosig';
      el.innerHTML = `<canvas></canvas><div class="ns"><b>NO SIGNAL</b>${c.id}<br>${c.name}</div>`;
      addNoise(el.querySelector('canvas'), 64, 48);
    } else {
      el.className = 'cam' + (c.dark ? ' dark' : '');
      el.innerHTML = `<img src="${c.img}" alt="${c.name}" loading="lazy">
        <span class="cam-label">${c.id}<small>${c.name}</small></span>
        ${c.tag ? `<span class="cam-tag">${c.tag}</span>` : ''}`;
    }
    el.addEventListener('click', () => {
      showCam(idx);
      if (innerWidth <= 980) $('#camPanel .dock-body').scrollTo({ top: 0, behavior: 'smooth' });
    });
    grid.append(el);
  });
  showCam(0);
}
function showCam(idx) {
  const c = CAMS[idx];
  $$('#camGrid .cam').forEach((el, i) => el.classList.toggle('sel', i === idx));
  const screen = $('#camScreen');
  screen.classList.remove('switch'); void screen.offsetWidth; screen.classList.add('switch');
  screen.classList.toggle('dark', !!c.dark);
  screen.classList.toggle('nosig', !!c.nosig);
  $('#camMainLabel').innerHTML = `${c.id}<small>${c.name}</small>`;
  $('#camMainTag').textContent = c.tag || '';
  if (c.nosig) {
    $('#camMainImg').removeAttribute('src');
    $('#camMainNs span').textContent = '송출 중지 — 함장 요청';
  } else {
    $('#camMainImg').src = c.img;
    $('#camMainImg').alt = c.name;
  }
  $('#camMainTitle').innerHTML = `<b>${c.name}</b><span class="mono">${c.en || ''}</span>`;
  $('#camMainDesc').textContent = c.desc || '';
  $('#camMainNote').textContent = c.note || '';
}
function openCam(c) {
  $('#camModalTitle').textContent = `${c.id} — ${c.name}`;
  $('#camModalImg').src = c.img;
  $('#camModalImg').alt = c.name;
  $('.cam-modal-view').classList.toggle('dark', !!c.dark);
  $('#camModalNote').textContent = c.note || '';
  $('#camModal').classList.add('open');
}
function closeCam() { $('#camModal').classList.remove('open'); }
$('#camClose').addEventListener('click', closeCam);
$('#camModal').addEventListener('click', e => { if (e.target.id === 'camModal') closeCam(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && $('#camModal').classList.contains('open')) { e.preventDefault(); closeCam(); } });
function tickCamTime() {
  const t = $('#linkTimer').textContent;
  $$('[data-camtime]').forEach(el => el.textContent = 'T+' + t);
}

/* ==========================================================
   통신 터미널
   ========================================================== */
const termLog = $('#termLog');
const ghost = document.createElement('div');
ghost.className = 'term-ghost';
ghost.innerHTML = '<img src="assets/hertz.webp" alt="">';
termLog.append(ghost);

let typing = Promise.resolve();
function termPush(text, sys) {
  typing = typing.then(async () => {
    const line = document.createElement('div');
    line.className = 'term-line' + (sys ? ' sys' : '');
    termLog.insertBefore(line, ghost);
    if (sys) { line.textContent = text; }
    else {
      line.innerHTML = '<span class="who">HERTZ ▸</span>';
      const span = document.createElement('span');
      line.append(span);
      for (const ch of text) { span.textContent += ch; await wait(ch === ' ' ? 30 : rand(45, 85)); }
    }
    // 오래된 줄 정리
    const lines = $$('.term-line', termLog);
    while (lines.length > 6) lines.shift().remove();
  });
  return typing;
}
async function runTerminal() {
  for (const step of TERM_SCRIPT) {
    if (step.sys) await termPush(step.sys, true);
    else await termPush(step.msg);
    if (step.wait) await wait(step.wait);
  }
  setTimeout(() => termPush('아직 거기 있어요?'), 100000);
}
function commNoise(ms, withFrame) {
  termLog.classList.add('noise');
  if (withFrame) {
    setTimeout(() => { ghost.classList.remove('flash'); void ghost.offsetWidth; ghost.classList.add('flash'); }, ms * .35);
  }
  setTimeout(() => termLog.classList.remove('noise'), ms);
  termPush('[ SIGNAL INTERFERENCE — RECOVERING ]', true);
}

/* 대역폭 게이지 */
let bwClicks = 0;
const bw = $('#bandwidth');
bw.addEventListener('click', () => {
  bwClicks++;
  bw.classList.add('show-tip');
  clearTimeout(bw._t); bw._t = setTimeout(() => bw.classList.remove('show-tip'), 1600);
  $$('.bw-seg', bw).forEach((s, i) => { if (i) { s.classList.remove('pulse'); void s.offsetWidth; s.classList.add('pulse'); } });
  if (bwClicks === 3) termPush('아직은 신호가 불안정해요.');
  if (bwClicks === 7) termPush('...조금만 더 기다려 줄래요?');
});

/* 렌즈 LED */
function lensBlink() {
  const l = $('#lens');
  l.classList.add('blink');
  setTimeout(() => l.classList.remove('blink'), 180);
  setTimeout(lensBlink, rand(18000, 45000));
}

/* ==========================================================
   아이다
   ========================================================== */
const ida = $('#ida'), bubble = $('#idaBubble');
let lastLine = '';
function idaSay(text) {
  bubble.textContent = text;
  bubble.classList.add('show');
  clearTimeout(bubble._t);
  bubble._t = setTimeout(() => bubble.classList.remove('show'), 3200);
}
ida.addEventListener('click', () => {
  let line; do { line = pick(IDA_LINES); } while (line === lastLine && IDA_LINES.length > 1);
  lastLine = line;
  ida.classList.remove('spin'); void ida.offsetWidth; ida.classList.add('spin');
  idaSay(line);
});

/* ==========================================================
   접힌 메뉴 → 홀로그램 패널
   ========================================================== */
let openDock = null;
$$('.dock').forEach(d => {
  const sw = document.createElement('span'); sw.className = 'sweep'; d.append(sw);
  d.querySelector('.dock-close').addEventListener('click', () => closeDock());
});
function toggleDock(id) { openDock && openDock.id === id ? closeDock() : showDock(id); }
function showDock(id) {
  const d = document.getElementById(id); if (!d) return;
  if (openDock && openDock !== d) closeDock(true);
  if (id === 'crewPanel') $('#crewPanel .crew-wrap').classList.remove('detail');
  openDock = d;
  const side = d.classList.contains('dock-right') ? 'right' : 'left';
  d.classList.remove('open'); void d.offsetWidth; d.classList.add('open');
  document.body.classList.add('dock-' + side + '-open', 'dock-open');
  document.body.classList.toggle('dock-wide-open', d.classList.contains('full'));
  $$('.rail-btn').forEach(b => {
    const on = b.dataset.dock === id;
    b.classList.toggle('active', on); b.setAttribute('aria-expanded', on);
  });
  const btn = $(`.rail-btn[data-dock="${id}"]`); if (btn) btn.classList.remove('ping');
}
function closeDock(quiet) {
  if (!openDock) return;
  openDock.classList.remove('open');
  document.body.classList.remove('dock-left-open', 'dock-right-open', 'dock-open', 'dock-wide-open');
  $$('.rail-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-expanded', 'false'); });
  openDock = null;
}
$$('.rail-btn').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); toggleDock(b.dataset.dock); }));
document.addEventListener('click', e => {
  if (!openDock) return;
  if (e.target.closest('.dock, .rail, #camModal, #ida, #terminal, #hud')) return;
  closeDock();
});
addEventListener('keydown', e => { if (e.key === 'Escape' && !e.defaultPrevented) closeDock(); });
/* 상태가 바뀌면 접힌 메뉴가 살짝 알림 */
function pingRail(id) {
  const b = $(`.rail-btn[data-dock="${id}"]`);
  if (!b || (openDock && openDock.id === id)) return;
  b.classList.remove('ping'); void b.offsetWidth; b.classList.add('ping');
}

/* ==========================================================
   시작
   ========================================================== */
$$('[data-bloom]').forEach(a => { a.href = LINKS.bloom || '#'; a.target = '_blank'; a.rel = 'noopener'; });
renderStatus();
renderCrew();
renderLog();
renderCams();
sizeDust();
addEventListener('resize', sizeDust);
if (SCENES[0]) preload(SCENES[0].file);

setInterval(tickClock, 1000); tickClock();
setInterval(tickCamTime, 1000);
setInterval(tickDilation, 900);
setInterval(tickIda, 20000);
setTimeout(lensBlink, 12000);
requestAnimationFrame(noiseLoop);

(function frame(t) {
  drawScope(t);
  if (!reduceMotion) drawDust();
  requestAnimationFrame(frame);
})(0);

})();
