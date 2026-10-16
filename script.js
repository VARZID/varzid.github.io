function topUpWallet() {
    let input = prompt(currentLang === 'tj' ? "Маблағи иловашавандаро ворид кунед (TJS):" : (currentLang === 'uz' ? "To'ldiriladigan summani kiriting (TJS):" : "Введите сумму пополнения (TJS):"), "100");
    if (input !== null) {
        let amount = parseFloat(input);
        if (!isNaN(amount) && amount > 0) {
            walletBalance += amount;
            document.getElementById('wallet-balance').innerText = walletBalance.toFixed(2) + ' TJS';
        } else {
            alert(currentLang === 'tj' ? "Лутфан маблағи дуруст ворид кунед!" : (currentLang === 'uz' ? "Iltimos, to'g'ri summa kiriting!" : "Пожалуйста, введите корректную сумму!"));
        }
    }
}
