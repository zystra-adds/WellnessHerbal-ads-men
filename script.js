// ==========================================================
// WELLNESS HERBAL - MEN'S VITALITY CONTROLLER SCRIPT
// ==========================================================

// Google Apps Script Web App URL for Google Sheets
let GOOGLE_SHEET_APP_URL = "https://script.google.com/macros/s/AKfycbxx6LYcRqZrNB5MLJCqYrXf4oTc6s4fiW40Rkn8yQCp9hmAQCXLuGZnYkTZSaewC4KuWA/exec";

// Product Data Configuration
const PRODUCTS_DATA = {
  powder: {
    id: "powder",
    nameEn: "Testosterone Plus Powder (200g)",
    nameHi: "टेस्टोस्टेरोन प्लस पाउडर (200g)",
    tag: "🦁 LION FORMULA",
    image: "images/testosterone_plus_powder.png",
    priceVal: "1,499",
    priceNum: 1499,
    mrp: "₹2,499",
    saveEn: "SAVE ₹1,000 (40% OFF)",
    saveHi: "₹1,000 छूट (40% OFF)"
  },
  spray: {
    id: "spray",
    nameEn: "Steel Man Gold Oil Spray (50ml)",
    nameHi: "स्टील मैन गोल्ड ऑयल स्प्रे (50ml)",
    tag: "⚡ VITALITY SPRAY",
    image: "images/steelman_gold_spray.png",
    priceVal: "999",
    priceNum: 999,
    mrp: "₹1,699",
    saveEn: "SAVE ₹700 (41% OFF)",
    saveHi: "₹700 छूट (41% OFF)"
  },
  combo: {
    id: "combo",
    nameEn: "Full Power Combo (Powder 200g + Oil Spray 50ml)",
    nameHi: "फुल पावर कॉम्बो (पाउडर 200g + स्प्रे 50ml)",
    tag: "👑 MEGA COMBO",
    image: "images/testosterone_plus_powder.png",
    priceVal: "2,199",
    priceNum: 2199,
    mrp: "₹4,198",
    saveEn: "SAVE ₹1,999 (48% OFF)",
    saveHi: "₹1,999 भारी छूट (48% OFF)"
  }
};

let currentSelectedProduct = "powder";

document.addEventListener('DOMContentLoaded', () => {
  initTwoMinuteTimer();
  initFormValidation();
  selectProduct('powder'); // default active
});

// ==========================================================
// 1. PRODUCT SELECTION CONTROLLER
// ==========================================================
window.selectProduct = function(productId) {
  const prod = PRODUCTS_DATA[productId];
  if (!prod) return;

  currentSelectedProduct = productId;

  // 1. Update selector cards active state
  document.querySelectorAll('.product-opt-card').forEach(card => {
    if (card.getAttribute('data-product-id') === productId) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  // 2. Update active showcase image & tag
  const imgEl = document.getElementById('activeProductImg');
  const tagEl = document.getElementById('activeProductTag');
  if (imgEl) {
    imgEl.src = prod.image;
    imgEl.alt = prod.nameEn;
  }
  if (tagEl) {
    tagEl.textContent = prod.tag;
  }

  // 3. Update Name & Pricing
  const nameEl = document.getElementById('activeProductName');
  const mrpEl = document.getElementById('activeMrp');
  const priceValEl = document.getElementById('activePriceVal');
  const saveTagEl = document.getElementById('activeSaveTag');
  const btnPayAmount = document.getElementById('btnPayAmount');
  const bottomBtnText = document.getElementById('bottomBtnText');

  if (nameEl) {
    nameEl.setAttribute('data-en', prod.nameEn);
    nameEl.setAttribute('data-hi', prod.nameHi);
    const isHi = document.body.classList.contains('lang-hi');
    nameEl.textContent = isHi ? prod.nameHi : prod.nameEn;
  }

  if (mrpEl) mrpEl.textContent = prod.mrp;
  if (priceValEl) priceValEl.textContent = prod.priceVal;

  if (saveTagEl) {
    saveTagEl.setAttribute('data-en', prod.saveEn);
    saveTagEl.setAttribute('data-hi', prod.saveHi);
    const isHi = document.body.classList.contains('lang-hi');
    saveTagEl.textContent = isHi ? prod.saveHi : prod.saveEn;
  }

  if (btnPayAmount) {
    btnPayAmount.textContent = `₹${prod.priceVal}`;
  }

  if (bottomBtnText) {
    bottomBtnText.setAttribute('data-en', `↑ ORDER NOW (CASH ON DELIVERY - ₹${prod.priceVal})`);
    bottomBtnText.setAttribute('data-hi', `↑ अभी आर्डर करें (कैश ऑन डिलीवरी - ₹${prod.priceVal})`);
    const isHi = document.body.classList.contains('lang-hi');
    bottomBtnText.textContent = isHi ? `↑ अभी आर्डर करें (कैश ऑन डिलीवरी - ₹${prod.priceVal})` : `↑ ORDER NOW (CASH ON DELIVERY - ₹${prod.priceVal})`;
  }
};

window.scrollToTopForm = function() {
  const formEl = document.getElementById('compactOrderForm');
  if (formEl) {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const nameInput = document.getElementById('fullName');
    if (nameInput) setTimeout(() => nameInput.focus(), 400);
  }
};

// ==========================================================
// 2. 2-MINUTE COUNTDOWN TIMER (02:00 -> 00:00)
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
// 3. LANGUAGE SWITCHER (Dual, Hindi, English)
// ==========================================================
window.setLanguage = function(lang) {
  const body = document.body;
  const btns = document.querySelectorAll('.lang-btn');

  btns.forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  body.classList.remove('lang-dual', 'lang-hi', 'lang-en');
  body.classList.add(`lang-${lang}`);

  // Re-sync dynamic texts
  selectProduct(currentSelectedProduct);
};

// ==========================================================
// 4. COMPACT FORM VALIDATION & SUBMISSION
// ==========================================================
function initFormValidation() {
  const form = document.getElementById('compactOrderForm');
  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const pincodeInput = document.getElementById('pincode');
  const addressInput = document.getElementById('fullAddress');

  if (!form) return;

  // Name Validation
  nameInput.addEventListener('input', () => {
    const parent = nameInput.closest('.input-cell');
    if (nameInput.value.trim().length >= 3) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
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
  });

  // Address Validation
  addressInput.addEventListener('input', () => {
    const parent = addressInput.closest('.input-cell');
    if (addressInput.value.trim().length >= 5) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
  });

  // Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim().length < 2) {
      nameInput.closest('.input-cell').classList.add('has-error');
      isValid = false;
    }
    if (!/^[6-9]\d{9}$/.test(phoneInput.value)) {
      phoneInput.closest('.input-cell').classList.add('has-error');
      isValid = false;
    }
    if (pincodeInput.value.length !== 6) {
      pincodeInput.closest('.input-cell').classList.add('has-error');
      isValid = false;
    }
    if (addressInput.value.trim().length < 4) {
      addressInput.closest('.input-cell').classList.add('has-error');
      isValid = false;
    }

    if (isValid) {
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-main-title').textContent = '⏳ REGISTERING ORDER...';
      }

      const selectedProdObj = PRODUCTS_DATA[currentSelectedProduct];

      const orderData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        pincode: pincodeInput.value.trim(),
        address: addressInput.value.trim(),
        product: selectedProdObj.nameEn,
        amount: `₹${selectedProdObj.priceVal} (COD)`
      };

      openSuccessModal(orderData);
      form.reset();
      document.querySelectorAll('.input-cell').forEach(f => f.classList.remove('valid'));

      if (submitBtn) {
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.querySelector('.btn-main-title').textContent = 'BOOK CASH ON DELIVERY ORDER →';
        }, 1200);
      }
    } else {
      const firstErr = form.querySelector('.input-cell.has-error');
      if (firstErr) {
        const input = firstErr.querySelector('input');
        if (input) input.focus();
      }
    }
  });
}

// Submit silently to Google Sheet Webhook
function submitToGoogleSheet(data) {
  if (!GOOGLE_SHEET_APP_URL) return;
  const payloadStr = JSON.stringify(data);

  try {
    fetch(GOOGLE_SHEET_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: payloadStr
    }).catch(err => console.log("Fetch catch:", err));
  } catch (e) {
    console.log("Fetch error:", e);
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payloadStr], { type: 'text/plain;charset=utf-8' });
      navigator.sendBeacon(GOOGLE_SHEET_APP_URL, blob);
    }
  } catch (e) {
    // beacon fallback ignore
  }
}

// ==========================================================
// 5. ORDER CONFIRMATION MODAL & WHATSAPP
// ==========================================================
function openSuccessModal(data) {
  const modal = document.getElementById('orderSuccessModal');
  const idEl = document.getElementById('receiptOrderId');
  const prodEl = document.getElementById('receiptProduct');
  const nameEl = document.getElementById('receiptName');
  const phoneEl = document.getElementById('receiptPhone');
  const addressEl = document.getElementById('receiptAddress');
  const amountEl = document.getElementById('receiptAmount');
  const waBtn = document.getElementById('whatsappConfirmLink');

  const randomId = 'WH-' + Math.floor(10000 + Math.random() * 90000);

  if (idEl) idEl.textContent = `#${randomId}`;
  if (prodEl) prodEl.textContent = data.product;
  if (nameEl) nameEl.textContent = data.name;
  if (phoneEl) phoneEl.textContent = `+91 ${data.phone}`;
  if (addressEl) addressEl.textContent = `${data.address}, PIN: ${data.pincode}`;
  if (amountEl) amountEl.textContent = data.amount;

  // Submit to Google Sheets in background
  submitToGoogleSheet({
    orderId: `#${randomId}`,
    product: data.product,
    name: data.name,
    phone: data.phone,
    pincode: data.pincode,
    address: data.address,
    amount: data.amount,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  });

  const waText = encodeURIComponent(
    `Hello Wellness Herbal, I placed my order!\n\n` +
    `*Order ID:* #${randomId}\n` +
    `*Product:* ${data.product}\n` +
    `*Amount:* ${data.amount}\n` +
    `*Name:* ${data.name}\n` +
    `*Phone:* +91 ${data.phone}\n` +
    `*Address:* ${data.address}, PIN: ${data.pincode}\n\n` +
    `Please confirm dispatch in discreet packaging. Thank you!`
  );

  if (waBtn) {
    waBtn.href = `https://api.whatsapp.com/send?text=${waText}`;
  }

  if (modal) {
    modal.classList.add('active');
  }
}

window.closeSuccessModal = function() {
  const modal = document.getElementById('orderSuccessModal');
  if (modal) {
    modal.classList.remove('active');
  }
};
