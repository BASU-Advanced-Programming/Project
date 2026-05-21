function calculateCombat() {
    const atkInput = document.getElementById('atkVal');
    const defInput = document.getElementById('defVal');
    
    const atk = parseInt(atkInput.value) || 0;
    const def = parseInt(defInput.value) || 0;
    
    const resultBox = document.getElementById('resultBox');
    const damageResult = document.getElementById('damageResult');
    const winnerResult = document.getElementById('winnerResult');

    let damage = atk - def;
    if (damage < 0) damage = 0;

    resultBox.classList.remove('hidden');

    // روش جایگزین برای نمایش عدد (برای اطمینان از کارکرد صحیح)
    damageResult.innerHTML = 'میزان آسیب وارده: <span class="text-red-500 text-4xl mx-2">' + damage + '</span> واحد';

    if (damage > 0) {
        winnerResult.innerText = "🏆 برنده نبرد: مهاجم (Attacker)";
        winnerResult.className = "text-center font-black text-xl tracking-wide text-red-400";
    } else {
        winnerResult.innerText = "🛡️ برنده نبرد: مدافع (Defender)";
        winnerResult.className = "text-center font-black text-xl tracking-wide text-green-400";
    }
}