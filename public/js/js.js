//get element
const $_ = (value, parent = document) => parent.querySelectorAll(value);

//redirect page
const redirect = way => window.location.replace(`${way}`);

//validation email
const validEmail = text => (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? true : false;

//logout
const exit = () => { send({}, '/exit', (res) => { location.reload() }) };

const alertMessage = $_('#alert-message')[0],
      modal = $_('.modal_wrap')[0],
      voiceStorage = localStorage.getItem("SpeakVoice");
let oldVersion, plase, forRemote = [], idTownPlace, tokenTown;

// dropdown menu
const dropdowns = $_('.user_settings_list');
const makeCounter = function() {
    let privateCounter = 0;
    const changeBy = val => privateCounter += val;
    return {
        increment: () => changeBy(1), 
        decrement: () => changeBy(-1), 
        value: () => privateCounter
    };
};
const counter = makeCounter();    
const menuAnimation = (change) => {
    var windowWidth = window.innerWidth;
    let animation = setInterval(() => { 
        let border = change === 'decrement' ? 0 : 10;           
        if (change === 'decrement') { counter.decrement() };
        if (change === 'increment') { counter.increment() };          
        let count = counter.value();
        if (windowWidth < 767) {dropdowns[0].style.width = `${count*10}%`};
        dropdowns[0].style.maxWidth = windowWidth < 767 ? `${count*10}%` : `${20 + count*20}px`;        
        dropdowns[0].style.opacity = `${0 + count/10}`;
        dropdowns[0].style.fontSize = `${count + 3}px`;
        if (count === border) { clearInterval(animation) };
    }, 20); 
};
const showSettingsList = () => {
    dropdowns[0].classList.toggle('user_settings_list_show');
    dropdowns[0].classList.contains('user_settings_list_show') ? menuAnimation('increment') : menuAnimation('decrement');
};    

//for close context menu
window.onclick = function(event) {        
    if (!event.target.matches('.user_settings_list_wrap > i')) {
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('user_settings_list_show')) {
                setTimeout(() => { dropdowns[i].classList.remove('user_settings_list_show') }, 200);
                menuAnimation('decrement');
            };
        };
    };

    // console.log(forRemote);

    ['gender', 'birthday', 'emailverified'].forEach(element => {
        if (!event.target.matches(`#${element}>b>.fa-edit`) &&
            !event.target.matches(`.forRemote${element}`)) {
            for (let i = 0; i < forRemote.length; i++) {
                if (forRemote[i].classList.contains(`forRemote${element}`)) {
                    plase.innerHTML = oldVersion;                            
                };
            };
        };
    });


    // if (!event.target.matches('#gender>b>.fa-edit') &&
    //     !event.target.matches('.forRemotegender')) {
    //     for (let i = 0; i < forRemote.length; i++) {
    //         if (forRemote[i].classList.contains('forRemotegender')) {
    //             plase.innerHTML = oldVersion;                            
    //         };
    //     };
    // };
    // if (!event.target.matches('#birthday>b>.fa-edit') &&
    //     !event.target.matches('.forRemotebirthday')) {
    //     for (let i = 0; i < forRemote.length; i++) {
    //         if (forRemote[i].classList.contains('forRemotebirthday')) {
    //             plase.innerHTML = oldVersion;                            
    //         };
    //     };
    // };
    
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

//get voices index
const getVoicesIndex = (voices, defaultVoice) => {
    let indexFin;
    const voiceForCheck = (defaultVoice !== undefined) ? defaultVoice : voiceStorage;
    voices.forEach((el, index) => { 
        if (el.name == voiceForCheck) { indexFin = index }; 
    });    
    return indexFin;
};

//change settings lists (interface, language, colo, birthday, emailverified)
const changeSettingsLists = (list, type, resFun) => {
    for (const i of list) {
        const types = {
            birthday : 'change',
            emailverified : 'change'
        };
        i.addEventListener(types[type] || 'click', () => { 
            if (i.title !== '') {
                send({"type": type, "value": i.title} , '/setsettings', (result) => {
                    alertMessage.innerHTML = '';
                    resFun(JSON.parse(result), i);
                });
            };
        });
    };
}; 

//shows language list with language names
const showLangList = (langStringList, langStringName, place) => {
    langStringList.split(",").forEach((el, index) => { 
        place.innerHTML += `<button class="selectLanguage" title="${el}" >${langStringName.split(",")[index]}<img src="../img/lang/${el}.png"></button>`; 
    });   
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
}

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

//to change the tab
const tabs = (tab) => {
    const tabs = $_('.tabs > p');
    const bodys = $_('.tab_bodys > .body');
    tabs.forEach(element => { element.classList.remove('tab_active') });
    bodys.forEach(element => { element.classList.remove('body_active') });
    tabs[tab].classList.add('tab_active');
    bodys[tab].classList.add('body_active');
}

//modal window
const closeModal = (el) => { 
    let valClose = true;
    el.path.forEach(element => {
        if (element.classList && element.classList.contains('modal_place')) { valClose = false };
    });
    if (valClose) { modal.innerHTML = '' }; 
}; 
const showModal = function(type){
    modal.innerHTML = template[type];    
    idTownPlace = $_('#id_town')[0];
    tokenTown = generate_token(6);
};

//sliders
const slider = (el) => {
    const active = el.classList.contains('active_sl');
    $_('.slider > p').forEach(element => { element.classList.remove('active_sl') });
    active ? null : el.classList.toggle('active_sl');
};

//creating town id
const creatingIdTown = (el) => {
    idTownPlace.innerHTML = `${transliterate(el.value).replace( /[^a-zA-ZiIіІ]/g, "" )}_${tokenTown}`;
};

//add to DB
const formSend = (formID) => {
    let obj = {};

    if (formID === 'town') {
        const formData = $_('#town')[0];
        console.log('formData', formData); 

        const id_town = $_('#town > #id_town')[0].value;
        const ua_town = $_('#town > #ua')[0].value.replace( /[^a-zA-ZiIіІ]/g, "" );
        const en_town = $_('#town > #en')[0].value.replace( /[^a-zA-ZiIіІ]/g, "" );
        const ru_town = $_('#town > #ru')[0].value.replace( /[^a-zA-ZiIіІ]/g, "" );

        
        console.log('id_town', id_town); 
        console.log('ua_town', ua_town); 
        console.log('en_town', en_town); 
        console.log('ru_town', ru_town); 

    }


    send(obj , '/addtown', (result) => {

        console.log('res', JSON.parse(result));    

    });
}

