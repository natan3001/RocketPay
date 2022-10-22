import IMask from "imask";

import "./css/index.css";

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);

const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "2D57F2"],
    mastercard: ["#df6f29", "#C69347"],
    default: ["black", "gray"],
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

//Security Code
const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

//Expiration Date
const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    );

    return foundMask;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const formAddCard = document.querySelector("#form-add-card");
formAddCard.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Cartão adicionado!");
});

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", (e) => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText = cardHolder.value || "Fulano da Silva";
});

securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = securityCodeMasked.value || "123";
});

expirationDateMasked.on("accept", () => {
  const ccExtra = document.querySelector(".cc-extra .value");
  ccExtra.innerText = expirationDateMasked.value || "02/32";
});

cardNumberMasked.on("accept", () => {
  const type = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(type);

  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = cardNumberMasked.value || "1234 5678 9012 3456";
});
