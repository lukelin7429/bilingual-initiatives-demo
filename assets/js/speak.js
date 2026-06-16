/* Web Speech pronunciation for any .speak button.
   Usage: <button class="speak" data-say="Good morning!">🔊</button> */
(function () {
  function pickVoice() {
    var vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return vs.find(function (v) { return /en[-_]US/i.test(v.lang) && /female|samantha|google/i.test(v.name); })
        || vs.find(function (v) { return /en[-_]US/i.test(v.lang); })
        || vs.find(function (v) { return /^en/i.test(v.lang); })
        || null;
  }
  function say(text, btn) {
    if (!('speechSynthesis' in window)) { return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.92; u.pitch = 1.0;
    var v = pickVoice(); if (v) u.voice = v;
    if (btn) {
      btn.classList.add('playing');
      u.onend = u.onerror = function () { btn.classList.remove('playing'); };
    }
    speechSynthesis.speak(u);
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.speak');
    if (!btn) return;
    var text = btn.getAttribute('data-say') || (btn.closest('.phrase') && btn.closest('.phrase').querySelector('.en') ? btn.closest('.phrase').querySelector('.en').textContent : '');
    if (text) say(text.trim(), btn);
  });
  // warm up voice list
  if ('speechSynthesis' in window) { speechSynthesis.onvoiceschanged = pickVoice; pickVoice(); }
})();
