const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 大小調順階和弦音程與級數屬性
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

function getNoteByOffset(root, offset) {
  const rootIndex = NOTES.indexOf(root);
  const targetIndex = (rootIndex + offset) % 12;
  return NOTES[targetIndex];
}

function updateChords() {
  const modeData = SCALES[currentMode];
  document.getElementById('current-key-title').innerText = `${currentRoot} ${modeData.name}`;

  const chordsContainer = document.getElementById('chords-display');
  chordsContainer.innerHTML = '';

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
}

// 監聽按鈕點擊
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

// 初始渲染
updateChords();