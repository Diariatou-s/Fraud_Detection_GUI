const amountInput = document.getElementById('amount');
const oldbalanceDestInput = document.getElementById('oldbalanceDest');
const newbalanceDestInput = document.getElementById('newbalanceDest');
const oldbalanceOrgInput = document.getElementById('oldbalanceOrg');
const newbalanceOrgInput = document.getElementById('newbalanceOrg');
const alert1 = document.getElementById('amount-invalid')
const alert2 = document.getElementById('oldbalanceDest-invalid')
const alert3 = document.getElementById('newbalanceDest-invalid')
const alert4 = document.getElementById('oldbalanceOrg-invalid')
const alert5 = document.getElementById('newbalanceOrg-invalid')

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
oldbalanceDestInput.addEventListener('blur', function() {
    const valeur = oldbalanceDestInput.value;
    if (/^\d+$/.test(valeur)) {
        oldbalanceDestInput.value = valeur + ".00";
    }
    if (/^\d+\.\d$/.test(valeur)) {
        oldbalanceDestInput.value = valeur + "0";
    }
});
newbalanceDestInput.addEventListener('blur', function() {
    const valeur = newbalanceDestInput.value;
    if (/^\d+$/.test(valeur)) {
        newbalanceDestInput.value = valeur + ".00";
    }
    if (/^\d+\.\d$/.test(valeur)) {
        newbalanceDestInput.value = valeur + "0";
    }
});
oldbalanceOrgInput.addEventListener('blur', function() {
    const valeur = oldbalanceOrgInput.value;
    if (/^\d+$/.test(valeur)) {
        oldbalanceOrgInput.value = valeur + ".00";
    }
    if (/^\d+\.\d$/.test(valeur)) {
        oldbalanceOrgInput.value = valeur + "0";
    }
});
newbalanceOrgInput.addEventListener('blur', function() {
    const valeur = newbalanceOrgInput.value;
    if (/^\d+$/.test(valeur)) {
        newbalanceOrgInput.value = valeur + ".00";
    }
    if (/^\d+\.\d$/.test(valeur)) {
        newbalanceOrgInput.value = valeur + "0";
    }
});
document.querySelector('form').addEventListener('submit', function(event) {
    validateDay()
    validateHour()
    validateAmount(amountInput, alert1)
    validateAmount(oldbalanceDestInput, alert2)
    validateAmount(newbalanceDestInput, alert3)
    validateAmount(oldbalanceOrgInput, alert4)
    validateAmount(newbalanceOrgInput, alert5)
});