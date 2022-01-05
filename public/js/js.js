//get element
const $_ = (value, parent = document) => parent.querySelectorAll(value);

//redirect page
const redirect = way => window.location.replace(`${way}`);

//validation email
const validEmail = text => (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? true : false;

//logout
const exit = () => { send({}, '/exit', (res) => { location.reload() }) };

const modal = $_('.modal_wrap')[0];
const RegExpInput = new RegExp(/[^a-zA-Zа-яА-Я0-9-()_+=.'\":/\,іІїЇєЄ /\n]/g); 


let idTownPlace, tokenTown;

let hours, minutes, hArr = [], mArr = [];
let hStart = 0, mStart = 0;

// dropdown menu
// const dropdowns = $_('.user_settings_list');
// const makeCounter = function() {
//     let privateCounter = 0;
//     const changeBy = val => privateCounter += val;
//     return {
//         increment: () => changeBy(1), 
//         decrement: () => changeBy(-1), 
//         value: () => privateCounter
//     };
// };

// const counter = makeCounter();    
// const menuAnimation = (change) => {
//     var windowWidth = window.innerWidth;
//     let animation = setInterval(() => { 
//         let border = change === 'decrement' ? 0 : 10;           
//         if (change === 'decrement') { counter.decrement() };
//         if (change === 'increment') { counter.increment() };          
//         let count = counter.value();
//         if (windowWidth < 767) {dropdowns[0].style.width = `${count*10}%`};
//         dropdowns[0].style.maxWidth = windowWidth < 767 ? `${count*10}%` : `${20 + count*20}px`;        
//         dropdowns[0].style.opacity = `${0 + count/10}`;
//         dropdowns[0].style.fontSize = `${count + 3}px`;
//         if (count === border) { clearInterval(animation) };
//     }, 20); 
// };
// const showSettingsList = () => {
//     dropdowns[0].classList.toggle('user_settings_list_show');
//     dropdowns[0].classList.contains('user_settings_list_show') ? menuAnimation('increment') : menuAnimation('decrement');
// };    

//for close context menu
// window.onclick = function(event) {        
//     if (!event.target.matches('.user_settings_list_wrap > i')) {
//         for (let i = 0; i < dropdowns.length; i++) {
//             if (dropdowns[i].classList.contains('user_settings_list_show')) {
//                 setTimeout(() => { dropdowns[i].classList.remove('user_settings_list_show') }, 200);
//                 menuAnimation('decrement');
//             };
//         };
//     };

//     ['gender', 'birthday', 'emailverified'].forEach(element => {
//         if (!event.target.matches(`#${element}>b>.fa-edit`) &&
//             !event.target.matches(`.forRemote${element}`)) {
//             for (let i = 0; i < forRemote.length; i++) {
//                 if (forRemote[i].classList.contains(`forRemote${element}`)) {
//                     plase.innerHTML = oldVersion;                            
//                 };
//             };
//         };
//     }); 
// };

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

//to change the language
const setLang = (lang) => {
    document.cookie = `lang=${lang}`;
    document.location.reload();
};

//to top
const toTopFn = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

//token
const generate_token = (length) => {
    console.log('dsfgdfg');
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
// console.log('body', body);
// console.log('menu', menu);
// console.log('social', social);
// console.log('toTop', toTop);
window.onscroll = function() {
    const socialValue = social !== undefined ? social.clientHeight : 0;

    // console.log('body', body.offsetWidth);
    // console.log('menu', menu.offsetTop);
    // console.log('social', socialValue);

    toTop.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";

    if (body.offsetWidth > 991) {
        (document.body.scrollTop > socialValue || document.documentElement.scrollTop > socialValue)
            ? menu.classList.add('menu_scroll') 
            : menu.classList.remove('menu_scroll');
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
    }
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
}

//to change the tab
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

//modal window
const closeSubModal = () => { $_('.wrap_sub_modal')[0].innerHTML = '' };
const closeModal = (el) => { 
    let valClose = true;
    el.path.forEach(element => {
        if (element.classList && element.classList.contains('modal_place')) { valClose = false };
    });
    if (valClose) { modal.innerHTML = '' }; 
};  
const showModal = function(type, obj, el){
    console.log('type', type);
    console.log('obj', obj);
    // console.log('el', el);

    (type === 'transferTimes' || type === 'transferTowns') 
        ? $_('.wrap_sub_modal')[0].innerHTML = template[type]
        : modal.innerHTML = template[type];

    //sub modal
    if (type === 'transferTimes') {
        $_('.wrap_sub_modal')[0].innerHTML = template[type];
        
        console.log('el', el);

        hours = $_('.hours')[0];
        minutes = $_('.minutes')[0];
        hArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        mArr = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
        hStart = 0, mStart = 0;    

        $_('.admTime')[0].addEventListener('click', function(){
            console.log('hours', hours.innerHTML);
            console.log('minutes', minutes.innerHTML);

            el.value = `${hours.innerHTML}:${minutes.innerHTML}`;
            closeSubModal();
        });   
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
                    tawns_list.innerHTML += `<p id="${element.town_id}" onclick="selectTown(this, '${setParam}')">${element.name_ua}</p>`
                });
            };
        });
    };

    //main modal
    if (type === 'townAdd') {
        idTownPlace = $_('#id_town')[0];
        tokenTown = generate_token(6);
    };
    if (type === 'transferAdd') {

    };
    if (type === 'townEdit') {
        $_(`#${type} > #id_town`)[0].innerHTML = obj.id;
        $_(`#${type} > #ua`)[0].value = obj.ua;
        $_(`#${type} > #en`)[0].value = obj.en;
        $_(`#${type} > #ru`)[0].value = obj.ru; 
    };
    if (type === 'transferEdit') {

    };
    if (type === 'townDel') { $_(`#${type} > #id_town`)[0].innerHTML = obj.id };   
    if (type === 'transferDel') {

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

//creating town id
const creatingIdTown = (el) => {
    idTownPlace.innerHTML = `${transliterate(el.value).replace( /[^a-zA-ZiIіІ]/g, "" )}_${tokenTown}`;
};

//validation text input
const validationInput = (el) => {
    const val = `${el.value.replace(RegExpInput , "")}`;
    el.value = val;
    $_(`.town_empty_${el.id}`)[0].style.display = 'none';
    $_(`.town_dup_${el.id}`)[0].style.display = 'none';
};
const validationPrice = (el) => {
    $_(`.transfer_price_empt`)[0].style.display = 'none'; 
    const priceVal = el.value, errMess = $_(`.transfer_price_${el.id}`)[0];
    errMess.style.display = (priceVal < 1 || priceVal > 50000) ? 'block' : 'none';
    if (priceVal === '') { errMess.style.display = 'none' };
};

//for add time field
const plusTime = (element, type) => {
    const translateBody = $_('.add_time')[0];
    const translateBodyChild = translateBody.children;
    const plusTransBody = document.createElement("div");
    plusTransBody.setAttribute('class', 'add');
    plusTransBody.innerHTML = `<p class="time_label">Відправлення</p> 
                               <input type="text" name="translate" class="time" placeholder="Час перевезення..." onfocus="showModal('transferTimes', {}, this)">
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

//for selecting time
const selectTime = (type, arrow) => {
    console.log('hours', hours);
    console.log('minutes', minutes);
    console.log('type', type);
    console.log('arrow', arrow);



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

//load towns list
const loadTownsList = () => {
    send({} , `/townlist`, (result) => {
        const resultat = JSON.parse(result);
        // console.log(resultat);    
        if (resultat.res) {
            // console.log('res', resultat.res);
            const tawns_list = $_('.tawns_list')[0];
            // console.log('tawns_list', tawns_list);
            tawns_list.innerHTML = '';
            resultat.res.forEach(element => {        
                // console.log('element', element);        
                tawns_list.innerHTML += `
                <div class="town"><p>${element.name_ua}
                    <span>
                        <i class='fas fa-edit' onclick="showModal('townEdit', {'id' : '${element.town_id}', 'ua' : '${element.name_ua}', 'en' : '${element.name_en}', 'ru' : '${element.name_ru}'})"></i>
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
        // console.log(resultat);    
        if (resultat.res) {
            // console.log('res', resultat.res);
            const transfers_list = $_('.transfers_list')[0];
            // console.log('tawns_list', tawns_list);
            transfers_list.innerHTML = '';
            resultat.res.forEach(element => {        
                // console.log('element', element);        
                transfers_list.innerHTML += `
                <div class="transfer"><p>${element.from} - ${element.to}
                    <span>
                        <i class='fas fa-edit' onclick="showModal('transferEdit', 
                            {'id' : '${element.transfer_id}', 
                            'from' : '${element.from}', 
                            'to' : '${element.to}', 
                            'pricepr' : '${element.price_pr}', 
                            'pricegr' : '${element.price_gr}'})">
                        </i>
                        <i class='fas fa-trash-alt' onclick="showModal('transferDel', {'id' : '${element.transfer_id}'})"></i>
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
            // console.log(resultat);    
            if (resultat.res) {
                // console.log('res', resultat.res);
                showModal(`${formID}Res`);
                $_('#id_town')[0].innerHTML = obj.id;
                setTimeout(() => { modal.innerHTML = '' }, 3000);
                loadTownsList();
            }
            if (resultat.DUP) {
                // console.log('DUP');
                // console.log(resultat.DUP);      
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

//add to DB Towns
const formSendTransfer = (formID) => {
    let obj = {}, trueSend;
    if ((formID === 'transferAdd') || (formID === 'transferEdit')) {

        // const transfer_from_noda = $_(`#${formID} > #from`)[0].inputparam;
        // const transfer_to_noda = $_(`#${formID} > #to`)[0].inputparam;
        // console.log('transfer_from_noda', transfer_from_noda);
        // console.log('transfer_to_noda', transfer_to_noda);
        const transfer_from = $_(`#${formID} > #from`)[0].inputparam;
        const transfer_to = $_(`#${formID} > #to`)[0].inputparam;
        const transfer_gr = $_(`#${formID} #gr`)[0].value;
        const transfer_pr = $_(`#${formID} #pr`)[0].value;
        const transfer_select = $_(`#${formID} > #selection`)[0].checked;
        const transfer_times = [];

        console.log('dfgdfg', $_('.time'));

        $_('.time').forEach(element => {
            console.log('element', element);
            console.log('element', element.value);
            if (element.value !== '') {
                transfer_times.push(element.value)
            }
        });

        // console.log('transfer_from', transfer_from);
        // console.log('transfer_to', transfer_to);
        // console.log('transfer_gr', transfer_gr);
        // console.log('transfer_pr', transfer_pr);
        // console.log('transfer_select', transfer_select);
        console.log('transfer_times', transfer_times);
        obj = {"from" : transfer_from, "to" : transfer_to, "gr" : transfer_gr, "pr" : transfer_pr, "select" : transfer_select, "times" : transfer_times, "param" : formID};
        console.log('obg false', obj);
        
        if (transfer_from !== '' && transfer_from !== undefined && transfer_to !== '' && transfer_to !== undefined) {
            if (transfer_from === transfer_to) {
                $_(`.transfer_dup_to`)[0].style.display = 'block'; 
                trueSend = false;
            } else {
                if ((transfer_gr !== '' && (transfer_gr >= 1 && transfer_gr <= 50000)) || (transfer_pr !== '' &&  (transfer_pr >= 1 && transfer_pr <= 50000))) {
                    trueSend = true;
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
    if (formID === 'townDel') {
        const id_town = $_(`#${formID} > #id_town`)[0].innerHTML;
        obj = {"id" : id_town, "param" : formID};
    };

    if (trueSend) {
        console.log('objjjjjjjjjjjjjjjjjjjjjj', obj);
    }
    // if (trueSend) {
    //     send(obj , `/${formID.toLowerCase()}`, (result) => {
    //         const resultat = JSON.parse(result);
    //         // console.log(resultat);    
    //         if (resultat.res) {
    //             // console.log('res', resultat.res);
    //             showModal(`${formID}Res`);
    //             $_('#id_town')[0].innerHTML = obj.id;
    //             setTimeout(() => { modal.innerHTML = '' }, 3000);
    //             loadTownsList();
    //         };   
    //     });
    // };
};


