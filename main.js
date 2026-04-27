// Start All Ciphers

// <====== Start Ceaser Cipher =========>

        function ceaserCipher(text,shift,direction){

            let result = "";
            shift = parseInt(shift);

            for(let i=0; i< text.length; i++){
                let char = text[i];
                if(char.match(/[a-zA-Z]/)){
                    let code = char.charCodeAt(0);
                    let offset = char === char.toUpperCase() ? 65 : 97;
                    if(direction === 'encrypt'){
                        result += String.fromCharCode((code - offset + shift) % 26 + offset );
                    }else{
                        result += String.fromCharCode((code - offset - shift + 26 ) % 26 + offset );
                    }
                }else{
                    result += char;
                }
            }
                   return result;            
        }

// <======  End Ceaser Cipher =========>

// <======  Start Monoalphabitic Cipher =========>

    // <======  Encryption =========>
    function MonoalphabeticCipher(text,key,direction){

        let alphabet = "abcdefghijklmnopqrstuvwxyz";
        let result = "";

        for(let i = 0 ; i < text.length; i++){
            let char = text[i].toLowerCase();
            let index = alphabet.indexOf(char);

            if(index !== -1){
                if(direction === 'encrypt'){
                    result += key[index];
                }else{
                    let keyIndex = key.indexOf(char);
                    result += alphabet[keyIndex];
                }
            }else {
                result += char
            }
        }
        return result;
    }

    // <======  Encryption =========>
    
// <======  End Monoalphabitic Cipher =========>

// <======  Start Playfair Cipher =========>
function prepareKey(key) {
key = key.toUpperCase().replace(/J/g, "I");
let result = "";

for (let c of key) {
if (!result.includes(c) && /[A-Z]/.test(c)) {
result += c;
}
}

for (let c of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
if (c === "J") continue;
if (!result.includes(c)) {
result += c;
}
}

let matrix = [];
for (let i = 0; i < 5; i++) {
matrix.push(result.slice(i * 5, i * 5 + 5).split(""));
}

return matrix;
}

function prepareText(text) {
text = text.toUpperCase().replace(/J/g, "I");
text = text.replace(/[^A-Z]/g, "");

let result = "";
let i = 0;

while (i < text.length) {
let a = text[i];
let b = text[i + 1];

if (a === b) {
result += a + "X";
i += 1;
} else {
if (b) {
result += a + b;
i += 2;
} else {
result += a + "X";
i += 1;
}
}
}

return result;
}

function findPosition(matrix, char) {
for (let i = 0; i < 5; i++) {
for (let j = 0; j < 5; j++) {
if (matrix[i][j] === char) {
return [i, j];
}
}
}
}

function encryptPair(matrix, a, b) {
let [r1, c1] = findPosition(matrix, a);
let [r2, c2] = findPosition(matrix, b);

if (r1 === r2) {
return matrix[r1][(c1 + 1) % 5] + matrix[r2][(c2 + 1) % 5];
} else if (c1 === c2) {
return matrix[(r1 + 1) % 5][c1] + matrix[(r2 + 1) % 5][c2];
} else {
return matrix[r1][c2] + matrix[r2][c1];
}
}

function decryptPair(matrix, a, b) {
let [r1, c1] = findPosition(matrix, a);
let [r2, c2] = findPosition(matrix, b);

if (r1 === r2) {
return matrix[r1][(c1 + 4) % 5] + matrix[r2][(c2 + 4) % 5];
} else if (c1 === c2) {
return matrix[(r1 + 4) % 5][c1] + matrix[(r2 + 4) % 5][c2];
} else {
return matrix[r1][c2] + matrix[r2][c1];
}
}

function encrypt(text, key) {
let matrix = prepareKey(key);
text = prepareText(text);

let result = "";
for (let i = 0; i < text.length; i += 2) {
result += encryptPair(matrix, text[i], text[i + 1]);
}

return result;
}

function decrypt(cipher, key) {
let matrix = prepareKey(key);

let result = "";
for (let i = 0; i < cipher.length; i += 2) {
result += decryptPair(matrix, cipher[i], cipher[i + 1]);
}

return result;
}

function encryptText() {
let key = document.querySelector(".Playfair-key-input-en").value;
let text = document.querySelector(".Playfair-input-en").value;

document.querySelector(".playfair-result-area").innerHTML = encrypt(text, key);
}

function decryptText() {
let key = document.querySelector(".Playfair-key-input-de").value;
let text = document.querySelector(".playfair-input-de").value;

document.querySelector(".playfair-result-area").innerHTML = decrypt(text, key);
}


// <======  End Playfair Cipher =========>

// <======  Start DES Cipher =========>

    // تحويل النص إلى بايتات (يدعم العربية)
function stringToBytes(str) {
  return Array.from(new TextEncoder().encode(str));
}

// تحويل البايتات إلى نص
function bytesToString(bytes) {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// تحويل إلى Base64
function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

// فك Base64
function base64ToBytes(base64) {
  let binary = atob(base64);
  return Array.from(binary, c => c.charCodeAt(0));
}

// XOR
function xor(a, b) {
  let res = [];
  for (let i = 0; i < a.length; i++) {
    res.push(a[i] ^ b[i % b.length]); // دعم مفاتيح بأي طول
  }
  return res;
}

// تقسيم إلى بلوكات
function chunkArray(arr, size) {
  let result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// padding (PKCS7 أفضل من صفر)
function pad(bytes) {
  let padLength = 8 - (bytes.length % 8);
  for (let i = 0; i < padLength; i++) {
    bytes.push(padLength);
  }
  return bytes;
}

// إزالة padding
function unpad(bytes) {
  let padLength = bytes[bytes.length - 1];
  return bytes.slice(0, bytes.length - padLength);
}

// تجهيز المفتاح
function normalizeKey(key) {
  let k = stringToBytes(key);
  while (k.length < 8) k.push(0);
  return k.slice(0, 8);
}

// "DES مبسط"
function simpleDES(block, key) {
  let result = block.slice();

  for (let round = 0; round < 16; round++) {
    result = xor(result, key);
    result.reverse();
    let first = result.shift();
    result.push(first);
  }

  return result;
}

// التشفير
function DesencryptText() {
  let text = document.querySelector(".DES-input-en").value;
  let key = normalizeKey(document.querySelector(".DES-key-input-en").value);

  let bytes = pad(stringToBytes(text));
  let blocks = chunkArray(bytes, 8);

  let encrypted = [];

  blocks.forEach(block => {
    encrypted.push(...simpleDES(block, key));
  });

  let result = bytesToBase64(encrypted);

  document.querySelector(".DES-result-area").innerHTML = result;
  console.log(result);
}

// فك التشفير
function DesdecryptText() {
  let key = normalizeKey(document.querySelector(".DES-key-input-de").value);

  let bytes = base64ToBytes(document.querySelector(".DES-input-de").value);
  let blocks = chunkArray(bytes, 8);

  let decrypted = [];

  blocks.forEach(block => {
    let result = block.slice();

    for (let round = 0; round < 16; round++) {
      let last = result.pop();
      result.unshift(last);
      result.reverse();
      result = xor(result, key);
    }

    decrypted.push(...result);
  });

  let finalText = bytesToString(unpad(decrypted));

  document.querySelector(".DES-result-area").innerHTML = finalText;
}

// <======  End DES Cipher =========>

// <======  Start TripleDES Cipher =========>

   
// تحويل النص إلى بايتات (يدعم العربية)
function stringToBytes(str) {
  return Array.from(new TextEncoder().encode(str));
}

// تحويل البايتات إلى نص
function bytesToString(bytes) {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// Base64
function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToBytes(base64) {
  let binary = atob(base64);
  return Array.from(binary, c => c.charCodeAt(0));
}

// XOR على مستوى البايت
function xorBytes(data, key) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    result.push(data[i] ^ key[i % key.length]);
  }
  return result;
}

// تقسيم المفتاح إلى 3 مفاتيح (مع ضمان الطول)
function splitKeys(key) {
  let bytes = stringToBytes(key);

  while (bytes.length < 3) {
    bytes.push(0);
  }

  let part = Math.ceil(bytes.length / 3);

  let k1 = bytes.slice(0, part);
  let k2 = bytes.slice(part, part * 2);
  let k3 = bytes.slice(part * 2);

  return [k1, k2, k3];
}

// "DES مبسط" على مستوى البايت
function simpleDESBytes(data, key) {
  return xorBytes(data, key);
}

// تشفير 3DES (EDE)
function tripleEncrypt(text, key) {
  let data = stringToBytes(text);
  let [k1, k2, k3] = splitKeys(key);

  let step1 = simpleDESBytes(data, k1); // E
  let step2 = simpleDESBytes(step1, k2); // D (نفس العملية للتبسيط)
  let step3 = simpleDESBytes(step2, k3); // E

  return bytesToBase64(step3);
}

// فك التشفير
function tripleDecrypt(cipher, key) {
  let data = base64ToBytes(cipher);
  let [k1, k2, k3] = splitKeys(key);

  let step1 = simpleDESBytes(data, k3);
  let step2 = simpleDESBytes(step1, k2);
  let step3 = simpleDESBytes(step2, k1);

  return bytesToString(step3);
}

// ربط مع الواجهة
function tripleDesencrypt() {
  let text = document.querySelector(".trpile-DES-input-en").value;
  let key = document.querySelector(".triple-DES-key-input-en").value;

  let result = tripleEncrypt(text, key);
  document.querySelector(".triple-DES-result-area").innerHTML = result;
}

function tripleDesdecrypt() {
  let text = document.querySelector(".triple-DES-input-de").value;
  let key = document.querySelector(".triple-DES-key-input-de").value;

  let result = tripleDecrypt(text, key);
  document.querySelector(".triple-DES-result-area").innerHTML = result;
}

// <======  End TripleDES Cipher =========>

//  End All Ciphers 


//start variables
let CeaserBtn = document.querySelector(".Ceaser");

let MonoBtn = document.querySelector(".special-class");

let PlayfairBtn = document.querySelector(".playfair-btn");

let DESBtn = document.querySelector(".DES-opt");

let TripleDESBtn = document.querySelector(".Triple-DES");

let MainMenu = document.querySelector(".main-container");
//end variables

// Ceaser Variables

let ceaserInterface = document.querySelector(".Ceaser-interface");

let switchToDecInCeaserBtn = document.querySelector(".switch-to-de-in-ceaseer");

let switchToEncInCeaserBtn = document.querySelector(".switch-to-en-in-ceaseer");

let EnModeInCeaser = document.querySelector(".input-enbtn");

let DeModeInCeaser = document.querySelector(".input-debtn");

let EncryptionInputCeasr = document.querySelector(".input-enbtn .input-ceaser-en");

let DecryptionInputCeasr = document.querySelector(".input-debtn .input-ceaser-de");

let shiftInputCeasrEn = document.querySelector(".input-enbtn .ceaser-shift-input-en");

let shiftInputCeasrDe = document.querySelector(".input-debtn .ceaser-shift-input-de");

let EncryptionBtn = document.querySelector(".input-enbtn .en-ceaser");

let DecryptionBtn = document.querySelector(".input-debtn .de-ceaser");

let ceaserResult = document.querySelector(".Ceaser-interface .ceaser-result-wrapper .ceaser-result");

// Ceaser Variables

// Monoalphabetic variables

let MonoUi = document.querySelector(".mono-ui");

let monoResult = document.querySelector(".mono-result .result-of-mono");

EncryptionInMono = document.querySelector(".encryption-mode"); 

DecryptionInMono = document.querySelector(".decryption-mode"); 

swtEnnMonoBtn = document.querySelector(".swt-en-btn");

swtDeInMonoBtn = document.querySelector(".swt-de-btn");

EncryptionMonoBtn = document.querySelector(".encryption-mono");

DecryptionMonoBtn = document.querySelector(".decryption-mono");

EnInputMono = document.querySelector(".en-input-mono");

DecInputMono = document.querySelector(".de-input-mono");

EnInputKeyMono = document.querySelector(".mono-key-input-en");

DecInputKeyMono = document.querySelector(".mono-key-input-de");


// Monoalphabetic variables

// playfair variables

let PlayfairUI = document.querySelector(".Playfair");

let PlayfairRes = document.querySelector(".playfair-result .playfair-result-area");

let PlayfairEncryptMode = document.querySelector(".Playfair-Enmode"); 

let PlayfairDecryptMode = document.querySelector(".Playfair-Demode"); 

let PlayfairSwitEnBtn= document.querySelector(".switc-to-en-in-playfair");

let PlayfairSwitDeBtn= document.querySelector(".switc-to-de-in-playfair");

let PlayfairEnInput = document.querySelector(".Playfair-input-en");

let PlayfairDeInput = document.querySelector(".playfair-input-de");

let PlayfairEnBtn = document.querySelector(".Playfair-EnBtn");

let PlayfairDeBtn = document.querySelector(".playfair-DeBtn");

// playfair variables


// DES variables

let DES = document.querySelector(".DES");

let DESRes = document.querySelector(".DES-result .DES-result-area");

let DESEncryptionMode = document.querySelector(".DES-Encrypt-mode"); 

let DESDecryptionMode = document.querySelector(".DES-Decrypt-mode"); 

let DESSwitchEnBtn= document.querySelector(".DES-switch-en-btn");

let DESSwitchDeBtn= document.querySelector(".DES-switch-de-btn");

let DESInputEn = document.querySelector(".DES-input-en");

let DESEnBtn = document.querySelector(".DES-EnBtn");

let DESDeBtn = document.querySelector(".DES-DeBtn");

let DESInputDe = document.querySelector(".DES-input-de");

// DES variables

// tripleDES variables

let tripleDES = document.querySelector(".triple-DES");

let tripleDESRes = document.querySelector(".triple-DES-result .triple-DES-result-area");

let tripleDESEncryptionMode = document.querySelector(".triple-DES-Encrypt-mode"); 

let tripleDESDecryptionMode = document.querySelector(".triple-DES-Decrypt-mode"); 

let tripleDESSwitchEnBtn= document.querySelector(".triple-DES-switch-en-btn");

let tripleDESSwitchDeBtn= document.querySelector(".triple-DES-switch-de-btn");

let tripleDESInputEn = document.querySelector(".trpile-DES-input-en");

let tripleDESInputDe = document.querySelector(".triple-DES-input-de");

let tripleDESKey1InputEn = document.querySelector(".triple-DES-key1-input-en");

let tripleDESKey2InputEn = document.querySelector(".triple-DES-key2-input-en");

let tripleDESKey3InputEn = document.querySelector(".triple-DES-key3-input-en");

let tripleDESKeyInputDe = document.querySelector(".triple-DES-key-input-de");

let tripleDESEnBtn = document.querySelector(".triple-DES-EnBtn");

let tripleDESDeBtn = document.querySelector(".triple-DES-DeBtn");

// tripleDES variables

// About DES

DESBtn.addEventListener("click",()=>{

DES.style.display = "block";
MainMenu.style.display = "none";
DESSwitchEnBtn.style.display = "none";

});

DESSwitchDeBtn.addEventListener("click",()=>{

DESEncryptionMode.style.display = "none";
DESDecryptionMode.style.display = "block";
DESSwitchDeBtn.style.display = "none";
DESSwitchEnBtn.style.display = "block";
DESInputEn.value = "";
DESRes.value = "";

});


DESSwitchEnBtn.addEventListener("click",()=>{

DESEncryptionMode.style.display = "block";
DESDecryptionMode.style.display = "none";
DESSwitchDeBtn.style.display = "block";
DESSwitchEnBtn.style.display = "none";
DESInputDe.value ="";
DESRes.value = "";


});


DESEnBtn.addEventListener("click",()=>{

DesencryptText();

});


DESDeBtn.addEventListener("click",()=>{

DesdecryptText();

});


// About DES 

// About ceaser

CeaserBtn.addEventListener("click",()=>{

ceaserInterface.style.display = "block";
MainMenu.style.display = "none";
switchToEncInCeaserBtn.style.display = "none";

});

switchToDecInCeaserBtn.addEventListener("click",()=>{

EnModeInCeaser.style.display = "none";
DeModeInCeaser.style.display = "block";
switchToDecInCeaserBtn.style.display = "none";
switchToEncInCeaserBtn.style.display = "block";
EncryptionInputCeasr.value = "";
shiftInputCeasrEn.value = "";
ceaserResult.value = "";

});


switchToEncInCeaserBtn.addEventListener("click",()=>{

EnModeInCeaser.style.display = "block";
DeModeInCeaser.style.display = "none";
switchToDecInCeaserBtn.style.display = "block";
switchToEncInCeaserBtn.style.display = "none";
DecryptionInputCeasr.value ="";
shiftInputCeasrDe.value = "";
ceaserResult.value = "";


});

EncryptionBtn.addEventListener("click",()=>{

    let text = document.querySelector(".Ceaser-interface .input-enbtn .input-ceaser-en").value;
    let shift = document.querySelector(".Ceaser-interface .input-enbtn .ceaser-shift-input-en").value;
    let result = ceaserCipher(text,shift,'encrypt');

    ceaserResult.innerHTML = result;

});

DecryptionBtn.addEventListener("click",()=>{

    let text = document.querySelector(".Ceaser-interface .input-debtn .input-ceaser-de").value;
    let shift = document.querySelector(".Ceaser-interface .input-debtn .ceaser-shift-input-de").value;
    let result = ceaserCipher(text,shift,'decrypt');

    ceaserResult.innerHTML = result;

});

// About ceaser 


// About Monoalphabetic

MonoBtn.addEventListener("click",()=>{

MonoUi.style.display = "block";
MainMenu.style.display = "none";
swtEnnMonoBtn.style.display = "none";

});

swtDeInMonoBtn.addEventListener("click",()=>{

EncryptionInMono.style.display = "none";
DecryptionInMono.style.display = "block";
swtDeInMonoBtn.style.display = "none";
swtEnnMonoBtn.style.display = "block";
EnInputMono.value = "";
monoResult.value = "";

});

swtEnnMonoBtn.addEventListener("click",()=>{

EncryptionInMono.style.display = "block";
DecryptionInMono.style.display = "none";
swtDeInMonoBtn.style.display = "block";
swtEnnMonoBtn.style.display = "none";
DecInputMono.value ="";
monoResult.value = "";

});

EncryptionMonoBtn.addEventListener("click",()=>{

    let text = document.querySelector(".en-input-mono").value;
    let key = document.querySelector(".mono-key-input-en").value.toLowerCase();

    let result = MonoalphabeticCipher(text,key,'encrypt');

    monoResult.innerHTML = result;

});

DecryptionMonoBtn.addEventListener("click",()=>{

    let text = document.querySelector(".de-input-mono").value;
    let key = document.querySelector(".mono-key-input-de").value.toLowerCase();

    let result = MonoalphabeticCipher(text,key,'decrypt');

    console.log(result);

    monoResult.innerHTML = result;

});

// About Monoalphbetic 

// About playfair

PlayfairBtn.addEventListener("click",()=>{

PlayfairUI.style.display = "block";
MainMenu.style.display = "none";
PlayfairSwitEnBtn.style.display = "none";

});

PlayfairSwitDeBtn.addEventListener("click",()=>{

PlayfairEncryptMode.style.display = "none";
PlayfairDecryptMode.style.display = "block";
PlayfairSwitDeBtn.style.display = "none";
PlayfairSwitEnBtn.style.display = "block";
PlayfairEnInput.value = "";
PlayfairRes.value = "";

});


PlayfairSwitEnBtn.addEventListener("click",()=>{

PlayfairEncryptMode.style.display = "block";
PlayfairDecryptMode.style.display = "none";
PlayfairSwitDeBtn.style.display = "block";
PlayfairSwitEnBtn.style.display = "none";
PlayfairDeInput.value ="";
PlayfairRes.value = "";


});


PlayfairEnBtn.addEventListener("click",()=>{

 encryptText();

});
 

PlayfairDeBtn.addEventListener("click",()=>{

 decryptText();

});

// About playfair

// About tripleDES

TripleDESBtn.addEventListener("click",()=>{

tripleDES.style.display = "block";
MainMenu.style.display = "none";
tripleDESSwitchEnBtn.style.display = "none";

});

tripleDESSwitchDeBtn.addEventListener("click",()=>{

tripleDESEncryptionMode.style.display = "none";
tripleDESDecryptionMode.style.display = "block";
tripleDESSwitchDeBtn.style.display = "none";
tripleDESSwitchEnBtn.style.display = "block";
tripleDESInputEn.value = "";
tripleDESRes.value = "";

});


tripleDESSwitchEnBtn.addEventListener("click",()=>{

tripleDESEncryptionMode.style.display = "block";
tripleDESDecryptionMode.style.display = "none";
tripleDESSwitchDeBtn.style.display = "block";
tripleDESSwitchEnBtn.style.display = "none";
tripleDESInputDe.value ="";
tripleDESRes.value = "";


});


tripleDESEnBtn.addEventListener("click",()=>{

tripleDesencrypt();

});

tripleDESDeBtn.addEventListener("click",()=>{

tripleDesdecrypt();

});

// About tripleDES