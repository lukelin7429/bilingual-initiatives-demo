/* =====================================================================
   Quiz grading + save-to-Google-Sheet.
   STEP 4 — paste your Google Apps Script Web App URL between the quotes.
   It looks like: https://script.google.com/macros/s/AKfy....../exec
   Leave it empty to test the quiz without saving.
   ===================================================================== */
const ENDPOINT = "https://script.google.com/macros/s/AKfycbyFF2CVD_7Y1uwdsSfuJOB389sqRiNwYvfJi2mVlXU26H-sWac7XWGBF215RrfIZYEo/exec";

(function () {
  const form = document.getElementById('quizForm');
  if (!form) return;
  const result = document.getElementById('result');
  const QS = [...form.querySelectorAll('.q')];

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('stuName').value.trim();
    const klass = document.getElementById('stuClass').value.trim();
    const msg = document.getElementById('msg');
    msg.textContent = ''; msg.className = 'msg';

    const answers = {};
    for (let i = 0; i < QS.length; i++) {
      if (!name || !klass) { msg.textContent = 'Please fill in your name and class. 請先填姓名與班級。'; msg.className = 'msg err'; return; }
      const sel = form.querySelector('input[name="q' + (i + 1) + '"]:checked');
      if (!sel) { msg.textContent = 'Please answer every question. 請回答每一題。'; msg.className = 'msg err'; QS[i].scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      answers['q' + (i + 1)] = sel.value;
    }

    let score = 0;
    QS.forEach((q, i) => {
      const correct = q.dataset.answer;
      const chosen = answers['q' + (i + 1)];
      if (chosen === correct) score++;
      q.querySelectorAll('.opts label').forEach(lab => {
        const val = lab.querySelector('input').value;
        if (val === correct) lab.classList.add('correct');
        else if (val === chosen) lab.classList.add('wrong');
      });
      q.querySelector('.explain').classList.add('show');
    });

    document.getElementById('scoreText').textContent = 'Your score: ' + score + ' / 5  ' + (score === 5 ? '🎉' : score >= 3 ? '👍' : '💪');
    document.getElementById('resultMsg').textContent = score === 5 ? 'Perfect! You watched carefully.' : score >= 3 ? 'Nice work — check the answers above.' : 'Good try — review the video and the answers above.';
    result.classList.add('show');
    document.getElementById('submitBtn').disabled = true;
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const saveMsg = document.getElementById('saveMsg');
    if (!ENDPOINT) { saveMsg.textContent = '(Demo mode — answers are not being saved yet.)'; return; }
    const payload = { name, class: klass, score, total: 5, q1: answers.q1, q2: answers.q2, q3: answers.q3, q4: answers.q4, q5: answers.q5 };
    try {
      await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      saveMsg.textContent = '✅ Your answers were sent to the teacher.';
    } catch (err) {
      saveMsg.textContent = '⚠️ Could not send your answers. Please tell the teacher.';
      saveMsg.className = 'msg err';
    }
  });
})();
