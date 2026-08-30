const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALES = {
  major: {
    name: '大調',
    degrees: ['Ⅰ', 'ⅱ', 'ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ°'],
    offsets: [0, 2, 4, 5, 7, 9, 11],
    suffixes: ['', 'm', 'm', '', '', 'm', 'dim']
  },
  minor: {
    name: '小調',
    degrees: ['ⅰ', 'ⅱ°', 'Ⅲ', 'ⅳ', 'ⅴ', 'Ⅵ', 'Ⅶ'],
    offsets: [0, 2, 3, 5, 7, 8, 10],
    suffixes: ['m', 'dim', '', 'm', 'm', '', '']
  }
};

let currentRoot = 'C';
let currentMode = 'major';
let currentCapo = 0; // 新增 Capo 變數，預設為 0

function getNoteByOffset(root, offset) {
  const rootIndex = NOTES.indexOf(root);
  const targetIndex = (rootIndex + offset) % 12;
  return NOTES[targetIndex];
}

function updateChords() {
  const modeData = SCALES[currentMode];
  
  // 計算「吉他手實際要按」的根音 (目標音高 - Capo格數)
  // 加上 12 是為了避免相減變成負數
  const targetRootIndex = NOTES.indexOf(currentRoot);
  const fingeringRootIndex = (targetRootIndex - currentCapo + 12) % 12;
  const fingeringRoot = NOTES[fingeringRootIndex];

  // 更新顯示標題
  const titleEl = document.getElementById('current-key-title');
  if (currentCapo === 0) {
    titleEl.innerText = `🎵 聽覺音高：${currentRoot} ${modeData.name}\n🎸 彈奏和弦：${fingeringRoot} ${modeData.name} (不夾 Capo)`;
  } else {
    titleEl.innerText = `🎵 聽覺音高：${currentRoot} ${modeData.name}\n🎸 彈奏和弦：${fingeringRoot} ${modeData.name} (夾 Capo ${currentCapo})`;
  }

  const chordsContainer = document.getElementById('chords-display');
  chordsContainer.innerHTML = '';

  // 使用「吉他手實際要按」的根音 (fingeringRoot) 來推算 1~7 級和弦
  for (let i = 0; i < 7; i++) {
    const note = getNoteByOffset(fingeringRoot, modeData.offsets[i]);
    const chordName = note + modeData.suffixes[i];
    const degreeName = modeData.degrees[i];

    const card = document.createElement('div');
    card.className = 'chord-card';
    card.innerHTML = `
      <div class="chord-degree">${degreeName} 級</div>
      <div class="chord-name">${chordName}</div>
    `;
    chordsContainer.appendChild(card);
  }
}

// 監聽主音按鈕
document.querySelectorAll('.root-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.root-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentRoot = e.target.dataset.root;
    updateChords();
  });
});

// 監聽大小調按鈕
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentMode = e.target.dataset.mode;
    updateChords();
  });
});

// 監聽 Capo 按鈕 (新增)
document.querySelectorAll('.capo-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.capo-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCapo = parseInt(e.target.dataset.capo);
    updateChords();
  });
});

// 初始渲染
updateChords();