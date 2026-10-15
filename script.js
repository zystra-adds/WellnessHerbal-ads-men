// ==========================================================
// WELLNESS HERBAL - COMPLETE POWER COMBO CONTROLLER SCRIPT
// ==========================================================

// Google Apps Script Web App URL for Google Sheets
let GOOGLE_SHEET_APP_URL = "https://script.google.com/macros/s/AKfycbw3P_MxBgQ2CSHqo_X-931AOOfUuU6wx_tQUCGUYUtM3MfKWb8DsjRErtH_qgFytuqd/exec";

const COMBO_DETAILS = {
  name: "Complete Power Combo (Testosterone Powder 200g + Steel Man Gold 30 Capsules + Oil Spray 50ml)",
  amount: "₹3,499 (COD)"
};

const PREVIEW_IMAGES = {
  kit: "images/power_combo_kit.png",
  powder: "images/testosterone_plus_powder.png",
  capsule: "images/steelman_gold_capsule.png",
  spray: "images/steelman_gold_spray.png"
};

window.switchComboPreview = function(key) {
  const imgEl = document.getElementById('activeProductImg');
  if (imgEl && PREVIEW_IMAGES[key]) {
    imgEl.style.opacity = '0.3';
    imgEl.style.transform = 'scale(0.95)';
    setTimeout(() => {
      imgEl.src = PREVIEW_IMAGES[key];
      imgEl.style.opacity = '1';
      imgEl.style.transform = 'scale(1)';
    }, 120);
  }

  // Update active chip state
  document.querySelectorAll('.preview-item-chip').forEach(btn => btn.classList.remove('active'));
  const activeChip = document.getElementById(`chip-${key}`);
  if (activeChip) activeChip.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
  initTwoMinuteTimer();
  initFormValidation();
});

window.scrollToTopForm = function() {
  const formEl = document.getElementById('compactOrderForm');
  if (formEl) {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const nameInput = document.getElementById('fullName');
    if (nameInput) setTimeout(() => nameInput.focus(), 400);
  }
};

// ==========================================================
// 1. 2-MINUTE COUNTDOWN TIMER (02:00 -> 00:00)
// ==========================================================
function initTwoMinuteTimer() {
  let totalSeconds = 120; // 2 minutes
  const timerDisplay = document.getElementById('timerDisplay');

  if (!timerDisplay) return;

  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      totalSeconds = 120;
    }
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    const formattedMin = min < 10 ? '0' + min : min;
    const formattedSec = sec < 10 ? '0' + sec : sec;
    timerDisplay.textContent = `${formattedMin}:${formattedSec}`;
  }, 1000);
}

// ==========================================================
// 2. LANGUAGE SWITCHER (Dual, Hindi, English)
// ==========================================================
window.setLanguage = function(lang) {
  const body = document.body;
  const btns = document.querySelectorAll('.lang-btn');

  btns.forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  body.classList.remove('lang-dual', 'lang-hi', 'lang-en');
  body.classList.add(`lang-${lang}`);
};

// ==========================================================
// 3. COMPACT FORM VALIDATION & SUBMISSION
// ==========================================================
function initFormValidation() {
  const form = document.getElementById('compactOrderForm');
  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const pincodeInput = document.getElementById('pincode');
  const addressInput = document.getElementById('fullAddress');
  const dpdpCheckbox = document.getElementById('dpdpConsent');
  const dpdpBox = document.getElementById('dpdpOptinBox');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  function checkAllFormValid() {
    const isNameValid = nameInput.value.trim().length >= 3;
    const isPhoneValid = /^[6-9]\d{9}$/.test(phoneInput.value.trim());
    const isPincodeValid = pincodeInput.value.trim().length === 6;
    const isAddressValid = addressInput.value.trim().length >= 4;
    const isConsentChecked = dpdpCheckbox ? dpdpCheckbox.checked : false;

    const allValid = isNameValid && isPhoneValid && isPincodeValid && isAddressValid && isConsentChecked;

    if (submitBtn) {
      if (allValid) {
        submitBtn.classList.remove('btn-disabled');
      } else {
        submitBtn.classList.add('btn-disabled');
      }
    }
    return allValid;
  }

  function showMissingErrors() {
    let firstErrorEl = null;

    if (nameInput.value.trim().length < 3) {
      const parent = nameInput.closest('.input-cell');
      parent.classList.add('has-error');
      parent.classList.remove('valid');
      if (!firstErrorEl) firstErrorEl = nameInput;
    }

    if (!/^[6-9]\d{9}$/.test(phoneInput.value.trim())) {
      const parent = phoneInput.closest('.input-cell');
      parent.classList.add('has-error');
      parent.classList.remove('valid');
      if (!firstErrorEl) firstErrorEl = phoneInput;
    }

    if (pincodeInput.value.trim().length !== 6) {
      const parent = pincodeInput.closest('.input-cell');
      parent.classList.add('has-error');
      parent.classList.remove('valid');
      if (!firstErrorEl) firstErrorEl = pincodeInput;
    }

    if (addressInput.value.trim().length < 4) {
      const parent = addressInput.closest('.input-cell');
      parent.classList.add('has-error');
      parent.classList.remove('valid');
      if (!firstErrorEl) firstErrorEl = addressInput;
    }

    if (dpdpCheckbox && !dpdpCheckbox.checked) {
      if (dpdpBox) dpdpBox.classList.add('has-error');
      if (!firstErrorEl) firstErrorEl = dpdpCheckbox;
    }

    if (submitBtn) {
      submitBtn.classList.add('shake');
      setTimeout(() => submitBtn.classList.remove('shake'), 450);
    }

    if (firstErrorEl) {
      const scrollTarget = firstErrorEl.closest('.input-cell') || dpdpBox || firstErrorEl;
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => firstErrorEl.focus(), 350);
    }
  }

  // Name Validation
  nameInput.addEventListener('input', () => {
    const parent = nameInput.closest('.input-cell');
    if (nameInput.value.trim().length >= 3) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
    checkAllFormValid();
  });

  // Phone Validation (10 digits starting 6-9)
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    const parent = phoneInput.closest('.input-cell');
    const val = phoneInput.value;

    if (val.length === 10 && /^[6-9]\d{9}$/.test(val)) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
    checkAllFormValid();
  });

  // Pincode Validation (6 digits)
  pincodeInput.addEventListener('input', () => {
    pincodeInput.value = pincodeInput.value.replace(/\D/g, '').slice(0, 6);
    const parent = pincodeInput.closest('.input-cell');
    const val = pincodeInput.value;

    if (val.length === 6) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
    checkAllFormValid();
  });

  // Address Validation
  addressInput.addEventListener('input', () => {
    const parent = addressInput.closest('.input-cell');
    if (addressInput.value.trim().length >= 4) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
    checkAllFormValid();
  });

  if (dpdpCheckbox && dpdpBox) {
    dpdpCheckbox.addEventListener('change', () => {
      if (dpdpCheckbox.checked) {
        dpdpBox.classList.add('checked');
        dpdpBox.classList.remove('has-error');
      } else {
        dpdpBox.classList.remove('checked');
      }
      checkAllFormValid();
    });
  }

  // Initial check on page load
  checkAllFormValid();

  // Form Submit / Tap on button
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!checkAllFormValid()) {
      showMissingErrors();
      return;
    }

    const loaderOverlay = document.getElementById('orderLoaderOverlay');
    if (loaderOverlay) {
      loaderOverlay.style.display = 'flex';
    }

    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.querySelector('.btn-main-title').textContent = '⏳ BOOKING ORDER IN SYSTEM...';
    }

    const randomId = 'WH-' + Math.floor(10000 + Math.random() * 90000);
    const orderData = {
      orderId: `#${randomId}`,
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      pincode: pincodeInput.value.trim(),
      address: addressInput.value.trim(),
      product: COMBO_DETAILS.name,
      amount: COMBO_DETAILS.amount,
      dpdpConsent: "Agreed (Safe Data & Tracking Consent)",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };

    // 1. Wait for Google Sheets entry to complete FIRST!
    try {
      await submitToGoogleSheet(orderData);
    } catch (sheetErr) {
      console.log('Sheet entry notice:', sheetErr);
    }

    // 2. Store verified order data in sessionStorage for thankyou.html
    try {
      sessionStorage.setItem('wellnessHerbalOrder', JSON.stringify(orderData));
    } catch (err) {}

    // 4. Redirect to dedicated Thank You confirmation page
    const query = new URLSearchParams({
      id: randomId,
      name: orderData.name,
      phone: orderData.phone,
      address: orderData.address + ', PIN: ' + orderData.pincode
    });

    setTimeout(() => {
      window.location.href = 'thankyou.html?' + query.toString();
    }, 300);
  });
}

// Submit to Google Sheet Webhook and wait for network completion
async function submitToGoogleSheet(data) {
  if (!GOOGLE_SHEET_APP_URL) return true;
  const payloadStr = JSON.stringify(data);

  try {
    const fetchPromise = fetch(GOOGLE_SHEET_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: payloadStr
    });

    // 4-second safety timeout so customer is never stuck if Google server lags
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 4000));

    await Promise.race([fetchPromise, timeoutPromise]);
    return true;
  } catch (e) {
    console.log("Fetch error:", e);
    return false;
  }
}
