//get element
const $_ = (value, parent = document) => parent.querySelectorAll(value);

//redirect page
const redirect = way => window.location.replace(`${way}`);

//logout
const exit = () => { send({}, '/exit', (res) => { location.reload() }) };

//validation email
const validEmail = text => (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? true : false;
const validPhone = text => (text.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)) ? true : false;

const modal = $_('.modal_wrap')[0];
const inputFrom = $_('#main_from')[0];
const inputTo = $_('#main_to')[0];
const mainTimeInput = $_('#main_time')[0];
const RegExpArr = {
    RegExpInput : new RegExp(/[^a-zA-Zа-яА-Я0-9-()_+=.'\":/\,іІїЇєЄ /\n]/g),
    RegExpPhone : new RegExp(/[^0-9-()+ /\n]/g),
    RegExpName : new RegExp(/[^a-zA-Zа-яА-Я-іІїЇєЄ /\n]/g),
    RegExpEmail : new RegExp(/[^a-zA-Z0-9.&@-_]/g)
} 

let idTownPlace, tokenTown, formValid;
let hours, minutes, hArr = [], mArr = [], hStart = 0, mStart = 0;;
let townsFrom = {}, townsTo = {}, transfersArr = [];
let calkTrue = true;

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

//for close mobile menu
const mobileMenu = $_('.menu_container_wrap_mobile')[0];
const mobileMenuContact = $_('.mobile_menu_contacts')[0];
window.onclick = function(event) {        
    if (!event.target.matches(['.container_menu', '.bar1', '.bar2', '.bar3', '.logo_mobile', '.menu_container_wrap_mobile'])) {
        if (mobileMenu.classList.contains('menu_container_wrap_mobile_active')) {
            mobileMenu.classList.remove("menu_container_wrap_mobile_active");
            $_('.container_menu')[0].classList.remove("change");
        };
    };
    if (!event.target.matches('.fa-ellipsis-v')) {
        if ($_('.mobile_menu_contacts')[0].classList.contains('mobile_menu_contacts_active')) {
            mobileMenuContact.classList.remove("mobile_menu_contacts_active");
        };
    };
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

//for creating calendar
const date = new Date();
const renderCalendar = (year) => {
    date.setDate(1);
    date.setYear(year);
    const monthDays = document.querySelector(".days");
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    const firstDayIndex = date.getDay();
    const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;
    let months = [], days = "";
    if (getLang('lang') === 'uk') {
        months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
    }
    if (getLang('lang')  === 'en') {
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }
    document.querySelector(".date h1").innerHTML = months[date.getMonth()];    
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    };
    const today = `${new Date().getFullYear()}-${(readyMonth(new Date()))}-${readyDay(new Date())}`;
    for (let i = 1; i <= lastDay; i++) {
        const dateDay = `'1988-01-${i}`;
        if ( i === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            days += `<div class="today" onclick="selectDate('${i}/${readyMonth(date.getMonth())}/${year}')">${i}</div>`;
        } else if (`${date.getFullYear()}-${readyMonth(date)}-${readyDay(dateDay)}` < today) {
            days += `<div class="prev-date">${i}</div>`;
        } else {
            days += `<div onclick="selectDate('${i}/${readyMonth(date.getMonth())}/${year}')">${i}</div>`;
        };
    };
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`;
        monthDays.innerHTML = days;
    };
};
const selectDate = (date) => {
    // console.log('date', date);
    const inputPlace = $_(`#main_date`)[0];
    inputPlace.value = date;    
    inputPlace.classList.remove('err_input');
    modal.innerHTML = '';
    checkForm();
};

//for send AJAX  
const send = (obj, url, fun, req = 'POST') => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            fun(this.responseText);
        }};
    xmlhttp.open(req, url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(obj));     
};    

//to top
const toTopFn = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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

//transliteration
var a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
const transliterate = (word) => {
    return word.split('').map(function (char) { 
        return a[char] || char; 
    }).join("");
};

//for changing menu in skroling process
const body = $_('body')[0];
const menu = $_('.menu_container')[0];
const social = $_('.social_wrap')[0];
const toTop = $_('#toTop')[0];
window.onscroll = function() {
    const socialValue = social !== undefined ? social.clientHeight : 0;
    toTop.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";
    if (body.offsetWidth > 1280) {
        (document.body.scrollTop > socialValue || document.documentElement.scrollTop > socialValue) 
            ? menu.classList.add('menu_scroll') 
            : menu.classList.remove('menu_scroll');
    }; 
    if (body.offsetWidth <= 1280) {
        if (mobileMenu.classList.contains('menu_container_wrap_mobile_active')) {
            mobileMenu.classList.remove("menu_container_wrap_mobile_active");
            $_('.container_menu')[0].classList.remove("change");
        };
        if ($_('.mobile_menu_contacts')[0].classList.contains('mobile_menu_contacts_active')) {
            mobileMenuContact.classList.remove("mobile_menu_contacts_active");
        };
    };
};

//to resize the traffic settings block
if ($_('.options_container')[0]) { 
    const options = () => {
        let item = 3
        if (body.offsetWidth > 768 && body.offsetWidth < 1100) { item = 2 }; 
        if (body.offsetWidth <= 768) { item = 1 }; 
        const wrapSize = $_('.options_container')[0].offsetWidth;
        $_('.options_wrap > .blok').forEach(element => { element.style.width = `${wrapSize / item}px` });
    };
    options();
    window.addEventListener('resize', options, true);
    const options_left = () => {
        const wrap = $_('.options_wrap')[0];
        const boxW = wrap.children[0].offsetWidth;
        const firstChild = wrap.children[0];        
        wrap.insertBefore(firstChild, wrap.firstChild);
        wrap.style.cssText  = `transition:.2s;transform:translateX(${-boxW}px)`;
        setTimeout(() => {
            wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
            wrap.appendChild(firstChild);
        }, 100);
    };
    const options_right = () => {
        const wrap = $_('.options_wrap')[0];
        const boxW = wrap.children[0].offsetWidth;
        const lastChild = wrap.children[wrap.children.length - 1];  
        wrap.appendChild(lastChild);
        wrap.style.cssText  = `transition:.2s;transform:translateX(${+boxW}px)`;
        setTimeout(() => {
            wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
            wrap.insertBefore(lastChild, wrap.firstChild);            
        }, 100);
    };
    $_('.arrow_left')[0].addEventListener('click', options_left, true);
    $_('.arrow_right')[0].addEventListener('click', options_right, true);
};

//to resize the feedback block
if ($_('.feedback_container')[0]) { 
    const feedback = () => {
        $_('.feedback_wrap > .feedback_block').forEach(element => { element.style.minWidth = `${$_('.feedback_container')[0].offsetWidth}px` });
    };
    feedback();
    window.addEventListener('resize', feedback, true);
    function feedbackPosition(el, i){
        $_('.feedback_wrap')[0].style.transform = `translateX(-${i}00%)`;        
        $_('.feedback_points > p').forEach(element => { element.style.backgroundColor = 'rgb(141, 141, 141)' });
        el.style.backgroundColor = '#ee9e07';
    };
    const feedbackCount = () => {
        $_('.feedback_points')[0].innerHTML = '';
        for (let i = 0; i < $_('.feedback_wrap > .feedback_block').length; i++) { $_('.feedback_points')[0].innerHTML += `<p onclick="feedbackPosition(this, ${i})"></p>` };
        $_('.feedback_points > p')[0].style.backgroundColor = '#ee9e07';
    };
    feedbackCount();
};

//for change status of mobile menu
const shoeMobilMenu = (el) => {
    el.classList.toggle("change");
    $_('.menu_container_wrap_mobile')[0].classList.toggle("menu_container_wrap_mobile_active");
}
const shoeMobilInfo = () => {
    $_('.mobile_menu_contacts')[0].classList.toggle("mobile_menu_contacts_active");
}

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

//close modal window
const closeSubModal = () => { $_('.wrap_sub_modal')[0].innerHTML = '' };
const closeModal = (el) => { 
    let valClose = true;
    el.path.forEach(element => {
        if (element.classList && element.classList.contains('modal_place')) { valClose = false };
    });
    if (valClose) { modal.innerHTML = '' }; 
};  

//show modal window
const showModal = function(type, obj, el) {
    // console.log('type', type);
    // console.log('obj', obj);
    // console.log('el', el);
    ['townAddRes', 'townEditRes', 'townDelRes', 'transferAddRes', 'transferEditRes', 'transferDelRes',
    'townAdd', 'townEdit', 'townDel', 'transferAdd', 'transferEdit', 'transferDel',
    'mainformFrom', 'mainformTo', 'mainformCalendar'].includes(type) 
        ? modal.innerHTML = template[type] : null;

    if (type === 'mainformCalendar') {
        $_(`#${type}`)[0].children[0].innerHTML = lang[`${type}${getLang('lang')}`];
        let yearVal = 1, dateField = $_(`.date_year > h1`)[0];
        dateField.innerHTML = (new Date().getFullYear() -1) + yearVal;
        document.querySelector(".prev_year").addEventListener("click", () => {
            (yearVal <= 1) ? yearVal = 1 : yearVal--;
            dateField.innerHTML = (new Date().getFullYear() -1) + yearVal;
            renderCalendar((new Date().getFullYear() -1) + yearVal);
        });          
        document.querySelector(".next_year").addEventListener("click", () => {
            (yearVal > 15) ? yearVal = 15 : yearVal++;
            dateField.innerHTML = (new Date().getFullYear() -1) + yearVal;
            renderCalendar((new Date().getFullYear() -1) + yearVal);
        });    
        document.querySelector(".prev").addEventListener("click", () => {
            date.setMonth(date.getMonth() - 1);
            renderCalendar((new Date().getFullYear() -1) + yearVal);
        });          
        document.querySelector(".next").addEventListener("click", () => {
            date.setMonth(date.getMonth() + 1);
            renderCalendar((new Date().getFullYear() -1) + yearVal);
        });
        renderCalendar((new Date().getFullYear() -1) + yearVal);
    };
    if (type === 'mainformFrom' || type === 'mainformTo') { 
        $_(`#${type}`)[0].children[0].innerHTML = lang[`${type}${getLang('lang')}`];
        const tawns_list = $_('.towns_select_list')[0];
        let objTowns = {}, inpValue, param1, param2;
        if (type === 'mainformFrom') { objTowns = townsFrom; inpValue = inputTo; param1 = 'to'; param2 = 'from'; };
        if (type === 'mainformTo') { objTowns = townsTo; inpValue = inputFrom; param1 = 'from'; param2 = 'to'; };
        tawns_list.innerHTML = '';  
        if ((inputFrom.value !== '') && (inputTo.value !== '')) {             
            for (const [key, value] of Object.entries(objTowns)) {
                tawns_list.innerHTML += `<p id="${key}" onclick="selectTownMain(this, 'main_${param2}', 'clear')">${value}</p>`;
            };
        } else {
            if (inpValue.value === '') {                  
                for (const [key, value] of Object.entries(objTowns)) {
                    tawns_list.innerHTML += `<p id="${key}" onclick="selectTownMain(this, 'main_${param2}')">${value}</p>`;
                };
            } else {
                const anotherValue = $_(`#main_${param1}`)[0].getAttribute('inputmainparam'), resListTowns = [];
                transfersArr.forEach(element => {
                    if (element[`transfer_${param1}`] === anotherValue) {
                        resListTowns.push({[`${element[`transfer_${param2}`]}`] : `${objTowns[element[`transfer_${param2}`]]}`});
                    };
                });
                resListTowns.forEach(element => {
                    for (const [key, value] of Object.entries(element)) {
                        tawns_list.innerHTML += `<p id="${key}" onclick="selectTownMain(this, 'main_${param2}')">${value}</p>`;
                    };
                });
            };
        }; 
    };    
    if (type === 'transferTimes') {
        $_('.wrap_sub_modal')[0].innerHTML = template[type];
        hours = $_('.hours')[0];
        minutes = $_('.minutes')[0];
        hArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        mArr = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
        hStart = 0, mStart = 0;
        $_('.admTime')[0].addEventListener('click', function(){
            el.value = `${hours.innerHTML}:${minutes.innerHTML}`;
            closeSubModal();
            mainTimeInput.classList.remove('err_input');
            checkForm();
        });   
    };
    if (type === 'mainformTimes') {        
        if (el.getAttribute("setparam") === 'limit') {
            modal.innerHTML = template[`${type}limit`];
            $_(`#${type}limit`)[0].children[0].innerHTML = lang[`${type}${getLang('lang')}`];
            if (inputFrom.value !== '' && inputTo.value !== '') {
                const timeArrForm = [];
                const fromParam = inputFrom.getAttribute("inputmainparam")
                const toParam = inputTo.getAttribute("inputmainparam")
                transfersArr.forEach(element => {
                    if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr !== '') {
                        for (let i = 0; i < 10; i++) {
                            if (element[`time${i+1}`] !== '') { timeArrForm.push(element[`time${i+1}`])};                            
                        };
                    };
                });
                timeArrForm.forEach(element => {
                    $_('#mainformTimeslimit > .towns_select_list')[0].innerHTML += `<p onclick="setTime('${element}')">${element}</p>`;                    
                });
            };            
        } else {
            modal.innerHTML = template[type];
            $_(`#${type}`)[0].children[0].innerHTML = lang[`${type}${getLang('lang')}`];
            hours = $_('.hours')[0];
            minutes = $_('.minutes')[0];
            hArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
            mArr = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
            hStart = 0, mStart = 0;
            $_('.admTime')[0].addEventListener('click', function(){
                el.value = `${hours.innerHTML}:${minutes.innerHTML}`;
                modal.innerHTML = '';
                mainTimeInput.classList.remove('err_input');
                checkForm();
            }); 
        }; 
    };
    if (type === 'transferTowns') {
        $_('.wrap_sub_modal')[0].innerHTML = template[type];
        const setParam =  obj.param;
        send({} , `/townlist`, (result) => {
            const resultat = JSON.parse(result);
            if (resultat.res) {
                const tawns_list = $_('.towns_select_list')[0];
                tawns_list.innerHTML = '';
                resultat.res.forEach(element => {        
                    tawns_list.innerHTML += `<p id="${element.town_id}" onclick="selectTown(this, '${setParam}')">${element.name_uk}</p>`
                });
            };
        });
    };
    //____TOWNS
    if (type === 'townAdd') {        
        idTownPlace = $_('#id_town')[0];
        tokenTown = generate_token(6);
    };
    if (type === 'townEdit') {
        $_(`#${type} > #id_town`)[0].innerHTML = obj.id;
        $_(`#${type} > #ua`)[0].value = obj.uk;
        $_(`#${type} > #en`)[0].value = obj.en;
        $_(`#${type} > #ru`)[0].value = obj.ru; 
    };
    if (type === 'townDel') { 
        $_(`#${type} > #id_town`)[0].innerHTML = obj.id 
    };
    //____TRANSFERS
    if (type === 'transferEdit') {
        const timeList = [];
        for (let i = 0; i < 10; i++) { if (obj[`time${i + 1}`] !== '') { timeList.push(obj[`time${i + 1}`])}};
        $_(`#${type}`)[0].paramid = obj.id;
        $_(`#${type} > #from`)[0].inputparam = obj.from_id;
        $_(`#${type} > #from`)[0].value = obj.from;
        $_(`#${type} > #to`)[0].inputparam = obj.to_id;
        $_(`#${type} > #to`)[0].value = obj.to;
        $_(`#${type} #gr`)[0].value = obj.pricegr;
        $_(`#${type} #pr`)[0].value = obj.pricepr;
        $_(`#${type} > #selection`)[0].checked = obj.select;        
        if (timeList.length > 0) {
            const translateBody = $_('.add_time')[0];
            translateBody.style.display = 'block';
            translateBody.innerHTML = '';            
            for (let i = 0; i < timeList.length; i++) {
                let timeAction = 'minus';
                if (i === timeList.length - 1) { timeAction = 'plus' };
                const plusTransBody = document.createElement("div");
                plusTransBody.setAttribute('class', 'add');
                plusTransBody.innerHTML = `<p class="time_label">Відправлення</p> 
                                           <input type="text" name="translate" class="time" value="${timeList[i]}" autocomplete="off" placeholder="Час перевезення..." onfocus="showModal('transferTimes', {}, this)">
                                           <i class='fas fa-${timeAction}' onclick="plusTime(this, '${timeAction}')"></i>`;
                translateBody.appendChild(plusTransBody); 
            };
        };        
        $_('.add_time')[0].style.display = $_(`#${type} #gr`)[0].value !== '' ? 'table' : 'none'
    };
    if (type === 'transferDel') {
        $_(`#${type} > #id_transfer`)[0].paramid = `${obj.id}`;
        $_(`#${type} > #id_transfer`)[0].innerHTML = `${obj.from} - ${obj.to}`;
    }; 
};

//for select town and add to input
const selectTown = (el, param) => {
    $_(`.transfer_dup_to`)[0].style.display = 'none';
    $_(`.transfer_empty_to`)[0].style.display = 'none';
    $_('.wrap_sub_modal')[0].innerHTML = '';
    const inputPlace = $_(`#${param}`)[0];
    const inputPlaceTO = $_(`#to`)[0];
    const inputPlaceFROM = $_(`#from`)[0];
    inputPlace.value = el.innerHTML;
    inputPlace.inputparam = el.id;
    if (inputPlaceFROM.inputparam === inputPlaceTO.inputparam) {
        $_(`.transfer_dup_to`)[0].style.display = 'block';
    };
};
const selectTownMain = (el, param, clear) => {
    modal.innerHTML = '';
    const inputPlace = $_(`#${param}`)[0];
    mainTimeInput.value = '';
    inputPlace.value = el.innerHTML;
    inputPlace.setAttribute("inputmainparam", el.id);
    checkForm();
    if (param === 'main_from') { $_('#main_from')[0].classList.remove('err_input') };
    if (param === 'main_to') { $_('#main_to')[0].classList.remove('err_input') };
    if (clear === 'clear') {
        if (param === 'main_from') {
            inputTo.value = '';
            inputTo.setAttribute("inputmainparam", '');
            $_('#main_from')[0].classList.remove('err_input');
        };
        if (param === 'main_to') {
            inputFrom.value = '';
            inputFrom.setAttribute("inputmainparam", '');
            $_('#main_to')[0].classList.remove('err_input');
        };
    };
    if (inputFrom.value !== '' && inputTo.value !== '') {
        const fromParam = inputFrom.getAttribute("inputmainparam");
        const toParam = inputTo.getAttribute("inputmainparam");
        $_('#type_transfer')[0].value = '';
        transfersArr.forEach(element => {
            if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr !== '' && element.price_pr === '') {
                $_(`#type_gr`)[0].selected = true;
                $_(`#type_gr`)[0].classList.remove('hide_err');
                $_(`#type_pr`)[0].classList.add('hide_err');
                mainTimeInput.setAttribute("setparam", 'limit');
                $_('#type_transfer')[0].classList.remove('err_input');   
            } else if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr === '' && element.price_pr !== '') {    
                $_(`#type_pr`)[0].selected = true;
                $_(`#type_pr`)[0].classList.remove('hide_err');
                $_(`#type_gr`)[0].classList.add('hide_err');
                mainTimeInput.setAttribute("setparam", '');
                $_('#type_transfer')[0].classList.remove('err_input');
            } else if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr === ''){
                $_(`#type_gr`)[0].classList.add('hide_err');
                mainTimeInput.setAttribute("setparam", '');
            };
        });
    } else {
        mainTimeInput.setAttribute("setparam", '');
        mainTimeInput.value = '';
        $_(`#type_gr`)[0].classList.remove('hide_err');
        $_(`#type_pr`)[0].classList.remove('hide_err');
        $_(`#type_gr`)[0].selected = false;
    };
};

//creating town id
const creatingIdTown = (el) => {
    idTownPlace.innerHTML = `${transliterate(el.value).replace( /[^a-zA-ZiIіІ]/g, "" )}_${tokenTown}`;
};

//validation text input
const validation = (el, type) => {
    const val = `${el.value.replace(RegExpArr[`RegExp${type}`] , "")}`;
    el.value = val;
    if (type ==='Input') {
        $_(`.town_empty_${el.id}`)[0].style.display = 'none';
        $_(`.town_dup_${el.id}`)[0].style.display = 'none';
    } else {
        el.classList.remove('err_input');
        checkForm();
    };
};
const validationPrice = (el) => {
    $_(`.transfer_price_empt`)[0].style.display = 'none'; 
    const priceVal = el.value, errMess = $_(`.transfer_price_${el.id}`)[0];
    errMess.style.display = (priceVal < 1 || priceVal > 50000) ? 'block' : 'none';
    (priceVal < 0) ? el.value = '' : null;
    (priceVal > 50000) ? el.value = 50000 : null;
    (priceVal === '') ? el.value = '' : null;
    if (priceVal === '') { errMess.style.display = 'none' };
};
const validationPerson = (el) => {
    const priceVal = el.value;
    (priceVal < 0) ? el.value = '' : null;
    (priceVal > 50) ? el.value = 50 : null;
    (priceVal === '') ? el.value = '' : null;
};
const validationType = (el) => {
    $_('#type_transfer')[0].classList.remove('err_input');
    mainTimeInput.value = '';
    if (el.value === 'transfer_pr') {
        mainTimeInput.setAttribute("setparam", '');  
    };
    if (el.value === 'transfer_gr') {
        if (inputFrom.value !== '' && inputTo.value !== '') {
            const fromParam = inputFrom.getAttribute("inputmainparam");
            const toParam = inputTo.getAttribute("inputmainparam");
            transfersArr.forEach(element => {
                if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr !== '') {
                    mainTimeInput.setAttribute("setparam", 'limit');              
                };
            });
        };
    };
    checkForm();
};
const validationAdults = (el) => {
    checkForm();
    const adultInp =  $_('#adults')[0];
    (adultInp.value > 0) ? adultInp.classList.remove('err_input') : adultInp.classList.add('err_input');
};

//culculate main form
const mainFormBack = () => {
    $_('#check')[0].style.display = 'flex'; 
    $_('#booking')[0].style.display = 'none'; 
}

const checkForm = () => {
    let arrInp = [];
    if (formValid !== undefined && formValid !== '') {
        const arrCall = ['main_from', 'main_to', 'adults', 'type_transfer'];
        const arrBook = ['main_from', 'main_to', 'adults', 'type_transfer', 'main_date', 'main_time'];
        const arrBookFinal = ['main_from', 'main_to', 'adults', 'type_transfer', 'main_date', 'main_time', 'main_name', 'main_surname', 'main_email', 'main_phone'];
        if (formValid === 'calk') {
            $_(`.main_form_err_book`)[0].classList.add('hide_err');
            arrInp = arrCall;
            arrBook.forEach(element => { $_(`#${element}`)[0].classList.remove('err_input') });
        };
        if (formValid === 'book') {
            $_(`.main_form_err_calk`)[0].classList.add('hide_err');
            arrInp = arrBook;
            arrCall.forEach(element => { $_(`#${element}`)[0].classList.remove('err_input') });
        };
        if (formValid === 'bookfinal') {
            $_(`.main_form_err_bookfinal`)[0].classList.add('hide_err');
            arrInp = arrBookFinal;
        };
    };
    const arrTrue = [];
    arrInp.forEach(element => {
        const elemCheck = $_(`#${element}`)[0];
        const adultsCheck = $_('#adults')[0];
        const emailCheck = $_('#main_email')[0];
        const phoneCheck = $_('#main_phone')[0];
        if (elemCheck.value === '') {
            arrTrue.push(false);
            elemCheck.classList.add('err_input');
        };
        if (adultsCheck.value <= 0) {
            arrTrue.push(false);
            adultsCheck.classList.add('err_input');
        };
        if (formValid === 'bookfinal') { 
            if (emailCheck.value !== '' && !validEmail(emailCheck.value)) {
                arrTrue.push(false);
                emailCheck.classList.add('err_input');
            };
            if (phoneCheck.value !== '' && !validPhone(phoneCheck.value)) {
                arrTrue.push(false);
                phoneCheck.classList.add('err_input');
            };
        };
    });

    console.log('formValid', formValid);
    // console.log('arrTrue', arrTrue);

    if (arrTrue.includes(false)) {
        calkTrue = false;
        $_('.main_form_price')[0].classList.add('hide_err');
        if (formValid !== undefined && formValid !== '') {
            $_(`.main_form_err_${formValid}`)[0].classList.remove('hide_err');
        };            
    } else {
        calkTrue = true;
        $_('.main_form_price')[0].classList.add('hide_err');
        if (formValid !== undefined && formValid !== '') {
            $_(`.main_form_err_${formValid}`)[0].classList.add('hide_err');
        };            
    };
};
const bookArr = {};
const culculate = () => {
    checkForm();

    console.log('True', calkTrue);

    if (calkTrue) {
        const inpFrom = inputFrom.getAttribute('inputmainparam');
        const inpTo = inputTo.getAttribute('inputmainparam');
        transfersArr.forEach(element => {
            if (element.transfer_from === inpFrom && element.transfer_to === inpTo) {
                console.log('route', element);

                bookArr.transferId = element.transfer_id;
                bookArr.transferFrom = townsFrom[inpFrom];
                bookArr.transferTo = townsTo[inpTo];
                bookArr.adult = +$_('#adults')[0].value;
                bookArr.children = +$_('#children')[0].value;
                bookArr.type = $_('#type_transfer')[0].value;
                bookArr.sum = ($_('#type_transfer')[0].value === 'transfer_gr') ? element.price_gr * (bookArr.adult + bookArr.children) : element.price_pr;
                bookArr.date = $_('#main_date')[0].value;
                bookArr.time = $_('#main_time')[0].value;
                bookArr.equip = document.querySelector('input[name="equip"]:checked').value;
                bookArr.user_name = $_('#main_name')[0].value;
                bookArr.user_surname = $_('#main_surname')[0].value;
                bookArr.user_email = $_('#main_email')[0].value;
                bookArr.user_phone = $_('#main_phone')[0].value;
                bookArr.paid = $_('#main_paid')[0].checked;

                console.log('bookArr', bookArr);

                if (formValid === 'calk') {
                    $_('.main_form_price')[0].classList.remove('hide_err');
                    let culkSum = 0;
                    if (bookArr.type === 'transfer_gr') { culkSum = element.price_gr * (bookArr.adult + bookArr.children) };
                    if (bookArr.type === 'transfer_pr') { culkSum = element.price_pr };
                    $_('.main_form_price > span')[0].innerHTML = culkSum;
                };
                if (formValid === 'book') {
                    const resInfo = $_('.book_info')[0]; 
                    const bookLang = getLang('lang');
                    
                    console.log('resInfo', resInfo);
                    console.log('bookLang', bookLang);
                    const resInfoBlock = `
                        <p class="main_form_color">${bookArr.transferFrom} - ${bookArr.transferTo}</p>
                        <p>${lang[`date${bookLang}`]} - <span class="main_form_color">${bookArr.date}</span> &nbsp ${lang[`time${bookLang}`]} - <span class="main_form_color">${bookArr.time}</span></p>
                        <p>${lang[`adult${bookLang}`]} - <span class="main_form_color">${bookArr.adult}</span> &nbsp
                            ${lang[`children${bookLang}`]} - <span class="main_form_color">${bookArr.children}</span> &nbsp
                            ${lang[`equip${bookLang}`]} - <span class="main_form_color">${lang[`${bookArr.equip}${bookLang}`]}</span> &nbsp
                            <b class="main_form_color">${lang[`${bookArr.type}${bookLang}`]}</b></p>
                        <p>${lang[`sum${bookLang}`]} - <span class="main_form_color">${bookArr.sum}</span> </p>
                    `;
                    resInfo.innerHTML = resInfoBlock;
                    $_('#check')[0].style.display = 'none'; 
                    $_('#booking')[0].style.display = 'flex'; 
                };
                if (formValid === 'bookfinal') {
                    send(bookArr , `/order`, (result) => {
                        const resultat = JSON.parse(result);
                        if (resultat.res) {
                            console.log("ooooo", resultat.res);
                            if (resultat.res === 'Order created!') {
                                console.log("Order!");
                                $_('#check')[0].style.display = 'none'; 
                                $_('#booking')[0].style.display = 'none'; 
                                $_('#received')[0].style.display = 'flex'; 
                            };
                        };   
                    });                    
                };
            };
        });
    };
};

//for add time field
const plusTime = (element, type) => {
    const translateBody = $_('.add_time')[0];
    const translateBodyChild = translateBody.children;
    const plusTransBody = document.createElement("div");
    plusTransBody.setAttribute('class', 'add');
    plusTransBody.innerHTML = `<p class="time_label">Відправлення</p> 
                               <input type="text" name="translate" class="time" autocomplete="off" placeholder="Час перевезення..." onfocus="showModal('transferTimes', {}, this)">
                               <i class='fas fa-plus' onclick="plusTime(this, 'plus')"></i>`;
    class classLists { constructor(){}
        style(element, first, second){
            element.classList.replace(`fa-${first}`, `fa-${second}`);
            element.setAttribute('onclick', `plusTime(this, '${second}')`);
        };
    };
    const classStyle = new classLists(); 
    if (type === 'plus') {
        classStyle.style(element, 'plus', 'minus');
        if (translateBodyChild.length < 10) { translateBody.appendChild(plusTransBody) };
        if (translateBodyChild.length === 10) { classStyle.style(translateBodyChild[translateBodyChild.length - 1].children[2], 'plus', 'minus') };
    };
    if (type === 'minus') {
        element.parentNode.remove();
        if (translateBodyChild.length < 10) { classStyle.style(translateBodyChild[translateBodyChild.length - 1].children[2], 'minus', 'plus') };
    };
    const timeLabels = $_('.time_label');
    for (const [index, iterator] of timeLabels.entries()) {
        timeLabels[index].innerHTML = `Відправлення ${index + 1}`;
    };
};

//for show times form 
const showTimeList = (el) => {
    $_('.add_time')[0].style.display = el.value === '' ? 'none' : 'table';
};

//for set times to main form 
const setTime = (value) => {
    mainTimeInput.value = value;
    modal.innerHTML = '';
    mainTimeInput.classList.remove('err_input');
    checkForm();
};

//for selecting time
const selectTime = (type, arrow) => {
    if (type === 'hour') {
        if (arrow === 'up') {            
            hStart++
            if (hStart === 24) {hStart = 0}
            hours.innerHTML = hArr[hStart];
        };
        if (arrow === 'down') {            
            hStart--
            if (hStart === -1) {hStart = 23}
            hours.innerHTML = hArr[hStart];
        };       
    };
    if (type === 'minute') {
        if (arrow === 'up') {
            mStart++
            if (mStart === 13) {mStart = 0}
            minutes.innerHTML = mArr[mStart];
        };
        if (arrow === 'down') {
            mStart--
            if (mStart === -1) {mStart = 12}
            minutes.innerHTML = mArr[mStart];
        };  
    };
};

//load variables list
const loadVariablesList = () => {
    send({} , `/variables`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            townsFrom = resultat.res.townsFrom;
            townsTo = resultat.res.townsTo;
            transfersArr = resultat.res.transfersArr;
        };
    });
};

//load towns list
const loadTownsList = () => {
    send({} , `/townlist`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            const tawns_list = $_('.tawns_list')[0];
            tawns_list.innerHTML = '';
            resultat.res.forEach(element => {        
                tawns_list.innerHTML += `
                <div class="town"><p>${element.name_uk}
                    <span>
                        <i class='fas fa-edit' onclick="showModal('townEdit', {'id' : '${element.town_id}', 'uk' : '${element.name_uk}', 'en' : '${element.name_en}', 'ru' : '${element.name_ru}'})"></i>
                        <i class='fas fa-trash-alt' onclick="showModal('townDel', {'id' : '${element.town_id}'})"></i>
                    </span>
                </p></div>`
            });
        };
    });
};

//load transferі list
const loadTransfersList = () => {
    send({} , `/transferlist`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            console.log('res', resultat.res);
            const transfers_list = $_('.transfers_list')[0];
            transfers_list.innerHTML = '';
            resultat.res.forEach(element => {        
                transfers_list.innerHTML += `
                <div class="transfer"><p>${element.transfer_from} - ${element.transfer_to}
                    <span>
                        <i class='fas fa-edit' onclick="showModal('transferEdit', 
                            {'id' : '${element.transfer_id}', 
                            'from' : '${element.transfer_from}', 
                            'from_id' : '${element.transfer_from_id}', 
                            'to' : '${element.transfer_to}', 
                            'to_id' : '${element.transfer_to_id}', 
                            'pricepr' : '${element.price_pr}', 
                            'pricegr' : '${element.price_gr}',
                            'time1' : '${element.time1}',
                            'time2' : '${element.time2}',
                            'time3' : '${element.time3}',
                            'time4' : '${element.time4}',
                            'time5' : '${element.time5}',
                            'time6' : '${element.time6}',
                            'time7' : '${element.time7}',
                            'time8' : '${element.time8}',
                            'time9' : '${element.time9}',
                            'time10' : '${element.time10}',
                            'select' : '${element.selection}'})">
                        </i>
                        <i class='fas fa-trash-alt' onclick="showModal('transferDel', 
                            {'id' : '${element.transfer_id}', 
                            'from' : '${element.transfer_from}', 
                            'to' : '${element.transfer_to}'})">
                        </i>
                    </span>
                </p></div>`
            });
        };
    });
};

//add to DB Towns
const formSend = (formID) => {
    let obj = {}, trueSend = true;
    if ((formID === 'townAdd') || (formID === 'townEdit')) {
        const id_town = $_(`#${formID} > #id_town`)[0].innerHTML;
        const ua_town = $_(`#${formID} > #ua`)[0].value.replace(RegExpInput , "");
        const en_town = $_(`#${formID} > #en`)[0].value.replace(RegExpInput , "");
        const ru_town = $_(`#${formID} > #ru`)[0].value.replace(RegExpInput , "");
        obj = {"id" : id_town, "ua" : ua_town, "en" : en_town, "ru" : ru_town, "param" : formID};
        ["ua", "en", "ru"].forEach(element => {  
            if ($_(`#${formID} > #${element}`)[0].value === '') {
                $_(`.town_empty_${element}`)[0].style.display = 'block'; 
                trueSend = false;
            };
        });
    };
    if (formID === 'townDel') {
        const id_town = $_(`#${formID} > #id_town`)[0].innerHTML;
        obj = {"id" : id_town, "param" : formID};
    }
    if (trueSend) {
        send(obj , `/${formID.toLowerCase()}`, (result) => {
            const resultat = JSON.parse(result);
            if (resultat.res) {
                showModal(`${formID}Res`);
                $_('#id_town')[0].innerHTML = obj.id;
                setTimeout(() => { modal.innerHTML = '' }, 3000);
                loadTownsList();
            }
            if (resultat.DUP) {
                for (const key in obj) {
                    if (Object.hasOwnProperty.call(obj, key)) {
                        if (obj[key] === resultat.DUP) {
                            $_(`.town_dup_${key}`)[0].style.display = 'block'; 
                        };                       
                    };
                };
            };    
        });
    };
};

//add to DB Transfers
const formSendTransfer = (formID) => {
    let obj = {}, trueSend;
    if ((formID === 'transferAdd') || (formID === 'transferEdit')) {
        const transfer_id = $_(`#${formID}`)[0].paramid;
        const transfer_from = $_(`#${formID} > #from`)[0].inputparam;
        const transfer_to = $_(`#${formID} > #to`)[0].inputparam;
        const transfer_gr = $_(`#${formID} #gr`)[0].value;
        const transfer_pr = $_(`#${formID} #pr`)[0].value;
        const transfer_select = $_(`#${formID} > #selection`)[0].checked;
        const transfer_times = [];
        $_('.time').forEach(element => { if (element.value !== '') { transfer_times.push(element.value)}});
        obj = {"id" : transfer_id, "from" : transfer_from, "to" : transfer_to, "gr" : transfer_gr, "pr" : transfer_pr, "select" : transfer_select, "times" : transfer_times, "param" : formID};
        if (transfer_from !== '' && transfer_from !== undefined && transfer_to !== '' && transfer_to !== undefined) {
            if (transfer_from === transfer_to) {
                $_(`.transfer_dup_to`)[0].style.display = 'block'; 
                trueSend = false;
            } else {
                if ((transfer_gr !== '' || transfer_pr !== '')) {
                    if (transfer_gr !== '' && (transfer_gr >= 1 && transfer_gr <= 50000) && transfer_pr === '') {
                        trueSend = true;
                    } else {
                        if (transfer_pr !== '' &&  (transfer_pr >= 1 && transfer_pr <= 50000) && transfer_gr === '') {
                            trueSend = true;
                        } else {
                            if ((transfer_pr !== '' &&  (transfer_pr >= 1 && transfer_pr <= 50000)) && (transfer_gr !== '' && (transfer_gr >= 1 && transfer_gr <= 50000))) {
                                trueSend = true;
                            } else {
                                $_(`.transfer_price_empt`)[0].style.display = 'block'; 
                                trueSend = false;
                            };
                        };
                    };
                } else {
                    $_(`.transfer_price_empt`)[0].style.display = 'block'; 
                    trueSend = false;
                };
            };
        } else {
            $_(`.transfer_empty_to`)[0].style.display = 'block'; 
            trueSend = false;
        };
    };
    if (formID === 'transferDel') {
        const id_transfer = $_(`#${formID} > #id_transfer`)[0].paramid;
        obj = {"id" : id_transfer, "param" : formID};
        trueSend = true
    };
    if (trueSend) {
        send(obj , `/${formID.toLowerCase()}`, (result) => {
            const resultat = JSON.parse(result);
            if (resultat.res) {
                showModal(`${formID}Res`);
                setTimeout(() => { modal.innerHTML = '' }, 3000);
                loadTransfersList();
            };   
        });
    };
};


