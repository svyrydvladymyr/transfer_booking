//get element
const $_ = (value, parent = document) => parent.querySelectorAll(value);

const modal = $_('.modal_wrap')[0];
const inputFrom = $_('#main_from')[0];
const inputTo = $_('#main_to')[0];
const mainTimeInput = $_('#main_time')[0];
const adultInp =  $_('#adults')[0];
const childrenValue =  $_('#children')[0];
const RegExpArr = {
    RegExpInput : new RegExp(/[^a-zA-Zа-яА-Я0-9-()_+=!?.:;/\,іІїЇєЄ /\n]/g),
    RegExpNews : new RegExp(/[^a-zA-Zа-яА-Я0-9-()_+=!?.:;'"/\,іІїЇєЄ<> /\n]/g),
    RegExpPhone : new RegExp(/[^0-9-()+ /\n]/g),
    RegExpName : new RegExp(/[^a-zA-Zа-яА-Я-іІїЇєЄ /\n]/g),
    RegExpEmail : new RegExp(/[^a-zA-Z0-9.&@-_]/g)
}

let idTownPlace, tokenTown, formValid;
let hours, minutes, hArr = [], mArr = [], hStart = 0, mStart = 0, peopleCount = 0, peopleMax = 50, peopleType = 'gr';
let townsFrom = {}, townsTo = {}, transfersArr = [];
let calkTrue = true, feedbackCalkTrue = true;
// let news_status = '', news_token = '', news_foto = "", temp_foto = "";

//redirect page
const redirect = way => window.location.replace(`${way}`);

//logout
const exit = () => { send({}, '/exit', (res) => { location.reload() }, 'POST') };

//token
const token = length => {
    let result = '';
    const characters = '123456789';
    for ( var i = 0; i < length; i++ ) {result += characters.charAt(Math.floor(Math.random() * characters.length))}
    return result;
};

//token
const generate_token = (length) => {
    const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    const b = [];
    for (let i = 0; i < length; i++) {
        let j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    };
    return b.join("");
};

//to top
const toTopFn = () => { window.scrollTo({ top: 1, behavior: "smooth" })};

//validation email
const validEmail = text => (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? true : false;
const validPhone = text => (text.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)) ? true : false;


//to change the language
const setLang = (lang) => {
    document.cookie = `lang=${lang}`;
    document.location.reload();
};

//to get the language name
const getLang = (name) => {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]).slice(0, 2) : 'uk';
};

//date format day
const readyDay = function(fullDate){
    const createDate = new Date(fullDate);
    return ((createDate.getDate() >= 1) && (createDate.getDate() <= 9)) ? "0" + createDate.getDate() : createDate.getDate();
};

//date format month
const readyMonth = function(fullDate){
    const createDate = new Date(fullDate);
    return ((createDate.getMonth() >= 0) && (createDate.getMonth() <= 8)) ? "0" + (createDate.getMonth() + 1) : createDate.getMonth() + 1;
};

//for send AJAX
const send = (obj, url, fun, req = 'POST', type = 'application/json') => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            fun(this.responseText, this.status);
        }};
    xmlhttp.open(req, url, true);
    xmlhttp.setRequestHeader("Content-type", type);
    xmlhttp.send(JSON.stringify(obj));
};

//transliteration
var a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
const transliterate = (word) => {
    return word.split('').map(function (char) {
        return a[char] || char;
    }).join("");
};

//tabs
const tabs = (tab) => {
    const tabs = $_('.tabs > p');
    const bodys = $_('.tab_bodys > .body');
    tabs.forEach(element => { element.classList.remove('tab_active') });
    bodys.forEach(element => { element.classList.remove('body_active') });
    tabs[tab].classList.add('tab_active');
    bodys[tab].classList.add('body_active');
}

//sliders
const slider = (el) => {
    const active = el.classList.contains('active_sl');
    $_('.slider > p').forEach(element => { element.classList.remove('active_sl') });
    active ? null : el.classList.toggle('active_sl');
};

//for change status of mobile menu
const shoeMobilMenu = (el) => {
    el.classList.toggle("change");
    $_('.menu_container_wrap_mobile')[0].classList.toggle("menu_container_wrap_mobile_active");
}
const shoeMobilInfo = () => {
    $_('.mobile_menu_contacts')[0].classList.toggle("mobile_menu_contacts_active");
}

//creating town id
// const creatingIdTown = (el) => {
//     idTownPlace.innerHTML = `${transliterate(el.value).replace( /[^a-zA-ZiIіІ]/g, "" )}_${tokenTown}`;
// };