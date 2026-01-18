// --- MATRIX RAIN ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const targetText = "HAMEEDJUTT";
const fontSize = 18;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);
const colors = ['#4285f4', '#9b72cb', '#d96570'];

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = targetText[Math.floor(Math.random() * targetText.length)];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 60);

// --- APP LOGIC ---
let currentFilter = 'All';

function loadWords() {
    const saved = JSON.parse(localStorage.getItem('hameedAiWords')) || [];
    const list = document.getElementById('wordList');
    list.innerHTML = '';
    saved.forEach((item, index) => {
        if (currentFilter === 'All' || item.cat === currentFilter) {
            const li = document.createElement('li');
            li.innerHTML = `<div><span class="category-tag">${item.cat}</span><strong>${item.word}</strong><p>${item.def}</p></div>
            <button onclick="deleteWord(${index})">🗑️</button>`;
            list.appendChild(li);
        }
    });
}

function addNewWord() {
    const w = document.getElementById('newWord');
    const d = document.getElementById('newDef');
    const c = document.getElementById('newCategory');
    if (!w.value || !d.value) return;
    const saved = JSON.parse(localStorage.getItem('hameedAiWords')) || [];
    saved.push({word: w.value, def: d.value, cat: c.value});
    localStorage.setItem('hameedAiWords', JSON.stringify(saved));
    w.value = ''; d.value = '';
    loadWords();
}

function deleteWord(i) {
    let saved = JSON.parse(localStorage.getItem('hameedAiWords'));
    saved.splice(i, 1);
    localStorage.setItem('hameedAiWords', JSON.stringify(saved));
    loadWords();
}

function filterByCategory(cat) {
    currentFilter = cat;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');
    loadWords();
}

function startSpeech(id) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.onresult = (e) => { document.getElementById(id).value = e.results[0][0].transcript; };
    rec.start();
}

function exportLogs() {
    const saved = localStorage.getItem('hameedAiWords');
    const blob = new Blob([saved], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "Hameed_AI_Data.txt";
    a.click();
}
