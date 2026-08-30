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

// 新增：吉他最好按的指型
const PREFERRED_SHAPES = {
  major: ['C', 'D', 'E', 'G', 'A'],
  minor: ['A', 'D', 'E'] // 代表 Am, Dm, Em
};

let currentRoot = 'C';
let currentMode = 'major';

function getNoteByOffset(root, offset) {
  const rootIndex = NOTES.indexOf(root);
  const targetIndex = (rootIndex + offset) % 12;
  return NOTES[targetIndex];
}

// 新增：計算移調夾建議的函數
function updateCapoSuggestions() {
  const targetIndex = NOTES.indexOf(currentRoot);
  const shapes = PREFERRED_SHAPES[currentMode];
  const suggestions = [];

  shapes.forEach(shapeNote => {
    const shapeIndex = NOTES.indexOf(shapeNote);
    let capo = targetIndex - shapeIndex;
    
    // 如果相減是負數，代表要跨過八度，所以加 12 個半音
    if (capo < 0) {
      capo += 12;
    }
    
    const modeSuffix = currentMode === 'minor' ? 'm' : '';
    
    // 通常 Capo 只夾 1~7 格，超過 7 格吉他會很難彈
    if (capo > 0 && capo <= 7) {
      suggestions.push(`Capo ${capo} 彈 <strong>${shapeNote}${modeSuffix}</strong> 調指型`);
    } else if (capo === 0) {
      suggestions.push(`無需 Capo (Capo 0) ，直接彈 <strong>${shapeNote}${modeSuffix}</strong>`);
    }
  });

  // 將結果依照 Capo 數字小到大排序
  suggestions.sort((a, b) => {
    const numA = a.includes('無需') ? 0 : parseInt(a.match(/Capo (\d+)/)[1]);
    const numB = b.includes('無需') ? 0 : parseInt(b.match(/Capo (\d+)/)[1]);
    return numA - numB;
  });

  const capoBox = document.getElementById('capo-suggestions');
  if (suggestions.length > 0) {
    capoBox.innerHTML = `<strong>🎸 移調夾 (Capo) 建議：</strong><br>` + 
                        suggestions.map(s => `<div class="capo-item">💡 ${s}</div>`).join('');
    capoBox.style.display = 'block';
  } else {
    capoBox.style.display = 'none';
  }
}

function updateChords() {
  const modeData = SCALES[currentMode];
  document.getElementById('current-key-title').innerText = `${currentRoot} ${modeData.name}`;

  const chordsContainer = document.getElementById('chords-display');
  chordsContainer.innerHTML = '';

  // 1. 繪製 1~7 級和弦
  for (let i = 0; i < 7; i++) {
    const note = getNoteByOffset(currentRoot, modeData.offsets[i]);
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

  // 2. 更新並顯示 Capo 建議
  updateCapoSuggestions();
}

// 綁定按鈕點擊事件
document.querySelectorAll('.root-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.root-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentRoot = e.target.dataset.root;
    updateChords();
  });
});

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentMode = e.target.dataset.mode;
    updateChords();
  });
});

// 網頁載入時先執行一次
updateChords();