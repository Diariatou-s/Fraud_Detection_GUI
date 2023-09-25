const amountInput = document.getElementById('amount');
const alert1 = document.getElementById('amount-invalid')
const type = document.getElementById('type')
const retrait = document.querySelector('.retrait')
const retraitSelect1 = document.querySelector('#orig_retrait')
const retraitSelect2 = document.querySelector('#dest_retrait')
const transfert = document.querySelector('.transfert')
const transfertSelect1 = document.querySelector('#orig_transfert')
const transfertSelect2 = document.querySelector('#dest_transfert')

function display_type() {
    if (type.value == 'CASH_OUT') {
        retrait.classList.remove('d-none')
        transfert.classList.add('d-none')
        transfertSelect1.removeAttribute("required");
        transfertSelect2.removeAttribute("required");
        retraitSelect1.setAttribute("name", "orig");
        retraitSelect2.setAttribute("name", "dest");
        retraitSelect1.setAttribute("required", "true");
        retraitSelect2.setAttribute("required", "true");
    } else if (type.value == 'TRANSFER') {
        transfert.classList.remove('d-none')
        retrait.classList.add('d-none')
        retraitSelect1.removeAttribute("required");
        retraitSelect2.removeAttribute("required");
        transfertSelect1.setAttribute("name", "orig");
        transfertSelect2.setAttribute("name", "dest");
        transfertSelect1.setAttribute("required", "true");
        transfertSelect2.setAttribute("required", "true");
    }
}

function validateDay() {
    const dayInput = document.getElementById('day');
    const invalidAlert = document.getElementById('day-invalid')
    const inputValue = dayInput.value.trim();
    const regex = /^(0[1-9]|1\d|2[0-9]|3[01])$/;

    if (!regex.test(inputValue)) {
        event.preventDefault();
        invalidAlert.classList.remove("d-none")
    }else {
        invalidAlert.classList.add("d-none")
    }
}
function validateHour() {
    const hourInput = document.getElementById('hour');
    const invalidAlert = document.getElementById('hour-invalid')
    const inputValue = hourInput.value.trim();
    const regex = /^(0\d|1\d|2[0-3])$/;

    if (!regex.test(inputValue)) {
        event.preventDefault();
        invalidAlert.classList.remove("d-none")
    }else {
        invalidAlert.classList.add("d-none")
    }
}
function validateAmount(input, alert) {
    const inputValue = input.value.trim();
    const regex = /^[0-9]+(\.[0-9]{2})?$/;

    if (!regex.test(inputValue)) {
        event.preventDefault();
        alert.classList.remove("d-none")
    }else {
        alert.classList.add("d-none")
    }
}
amountInput.addEventListener('blur', function() {
    const valeur = amountInput.value;
    if (/^\d+$/.test(valeur)) {
        amountInput.value = valeur + ".00";
    }
    if (/^\d+\.\d$/.test(valeur)) {
        amountInput.value = valeur + "0";
    }
});
document.querySelector('form').addEventListener('submit', function(event) {
    validateDay()
    validateHour()
    validateAmount(amountInput, alert1)
});