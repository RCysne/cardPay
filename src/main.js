import "./css/index.css"
import IMask from "imask";

const formCard = document.querySelector('form').addEventListener('submit', () => {
  event.preventDefault();
})

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path');

const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');

function setCardType(type) {

  const colors = {
  visa: ['#436D99', '#2D57F2'],
  mastercard: ['#DF6F29', '#C69347'],
  default: ['black', 'gray']
  }

  // type é usado como variável acionando o objeto - Ex. colors.visa[position]
  ccBgColor01.setAttribute('fill', colors[type][0]);
  ccBgColor02.setAttribute('fill', colors[type][1]);
  ccLogo.setAttribute('src', `cc-${type}.svg`)
}
globalThis.setCardType = setCardType // Tornando a função global, assumindo o escopo global


// --------------------------  Security Code Mask - CVC
const securityCode = document.getElementById('security-code');
const securityCodePattern = {
  mask: '000'
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

// ---------------------------  Expiration Date
const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask: 'MM{/}YY',
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

// ----------------------- Card Number Mask
const cardNumber = document.querySelector('#card-number');

// Estrutura de dados do objeto para o dynamicMasked. Usando essa estrutura ele pode navegar deixando dinâmico 
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: '0000 0000 0000 0000',
      cardType: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) { // Propriedade dispatch que vai executar a função todas as vezes que um número é digitado. A função vai ler o valor, concatenar com o appended e substituir com o replace. Se for um não dígito(valores numéricos), retorna vazio
    const number = (dynamicMasked.value + appended).replace(/\D/g, ""); 
    
    /* O item é o objeto do array, na arrow function, para pegar só um valor do item, faz-se uma desestruturação com o ({valor}) => {}; 
    const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex)); */
    
    const foundMask = dynamicMasked.compiledMasks.find(function (item) { // Se retornar true, ele insere o valor no foundmask, se for false, ele não insere.
    // const ccNumber = document.querySelector('#cc-number');
    // ccNumber.innerText = cardNumber.value;
      return number.match(item.regex) // Pegou o number, roda o match, se encontrar, é true, senão é false
      
    });
    
    console.log(foundMask);
    return foundMask; // A função dispatch precisa retornar o foundMask (toda a regra colocada na função) para obter o valor encontrado, senão sempre irá retornar o default
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector("#add-card");

addButton.addEventListener('click', () => {
  alert('Cartão Adicionado com sucesso!');
})

const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', (event) => {
  const ccHolder = document.querySelector('.cc-holder .value');
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
})

// Trabalhando com o IMASK
securityCodeMasked.on('accept', () => {
  updateSecurityCode(securityCodeMasked.value)
}); // O ON, Funciona como o addEventListener e o accept é se ele passou nas regras

function updateSecurityCode (code) {
  const ccSecurity = document.querySelector('.cc-security .value');
  ccSecurity.innerText = code.length === 0 ? "123" : code ;
}

expirationDateMasked.on('accept', () => {
  updateExpirationDate(expirationDateMasked.value);
})

function updateExpirationDate(expirationDate) {
  const ccExpirationDate = document.querySelector('.cc-expiration-date.value');
  ccExpirationDate.innerText = expirationDate === 0 ? '02/32' : expirationDate
}

cardNumberMasked.on('accept', () => {
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber (currentCardNumber) {
  const ccNumber = document.querySelector('#cc-number');
  ccNumber.innerText = currentCardNumber.length === 0 ? '1234 5678 9012 3456': currentCardNumber
}