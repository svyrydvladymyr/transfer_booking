class ShowDate {
    constructor(){}

    show() {

    }
};
const showDate = new ShowDate().show();

class Services {
    constructor(){}
};

class Templates {
    constructor(){}
};

class ModalWindow extends Templates {
    constructor(){}
};

class News extends ModalWindow {
    constructor(){}
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
    };
    if (getLang('lang')  === 'en') {
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    };
    document.querySelector(".date h1").innerHTML = months[date.getMonth()];
    for (let i = firstDayIndex; i > 0; i--) { days += `<div class="prev-date">${prevLastDay - i + 1}</div>` };
    const today = `${new Date().getFullYear()}-${(readyMonth(new Date()))}-${readyDay(new Date())}`;
    for (let i = 1; i <= lastDay; i++) {
        if ( i === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            days += `<div class="today" onclick="selectDate('${i}/${readyMonth(date.getMonth())}/${year}')">${i}</div>`;
        } else if (`${date.getFullYear()}-${readyMonth(date)}-${readyDay(`2022-01-${i}`)}` < today) {
            days += `<div class="prev-date">${i}</div>`;
        } else {
            days += `<div onclick="selectDate('${i}/${readyMonth(`${year}-${date.getMonth() + 1}-${i}`)}/${year}')">${i}</div>`;
        };
    };
    for (let i = 1; i <= nextDays; i++) { days += `<div class="next-date">${i}</div>` };
    monthDays.innerHTML = days;
};
const selectDate = (date) => {
    const inputPlace = $_(`#main_date`)[0];
    inputPlace.value = date;
    inputPlace.classList.remove('err_input');
    modal.innerHTML = '';
    checkForm();
};

//for add time field
const plusTime = (element, type) => {
    const translateBody = $_('.add_time')[0];
    const translateBodyChild = translateBody.children;
    const plusTransBody = document.createElement("div");
    plusTransBody.setAttribute('class', 'add');
    plusTransBody.innerHTML = `<p class="time_label">Відправлення</p>
                               <input type="text" name="translate" class="time" autocomplete="off" placeholder="Час перевезення..." onfocus="showModal('transferTimes', {}, this)" readonly>
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

//close modal window
const closeSubModal = () => { $_('.wrap_sub_modal')[0].innerHTML = '' };
const closeModalX = () => {modal.innerHTML = ''};
const closeModal = (el) => {
    let valClose = true;
    for (let element of el.target.children) {
        if (element.classList && element.classList.contains('modal_place')) {
            valClose = false;
        };
    };
    if (!valClose) { modal.innerHTML = '' };
};

//wrap for modal window
const modalWindowWrap = (type) => {
    const sub_close = ['townAdd', 'townEdit', 'transferEdit', 'transferAdd', 'transferTowns', 'transferTimes', 'newsAdd', 'newsEdit'].includes(type) ? '' : 'onclick="closeModal(event)"';
    const sub_noclose = ['transferTowns', 'transferTimes'].includes(type) ? '' : '<i class="fa fa-times" onclick="closeModalX()"></i>';
    const style = {
        newsAdd: "max-width: 90%",
        newsEdit: "max-width: 90%",
    };
    return `<div class="modal_body" ${sub_close}>
        <div class="modal_close">${sub_noclose}</div>
        <div class="modal_place" id="${type}" style="${style[type]}">
            ${template[type]}
        </div>
        <div class="wrap_sub_modal"></div>
    </div>`;
};

//show modal window
const showModal = function(type, obj, el) {
    console.log('type', type);
    console.log('obj', obj);
    console.log('el', el);

    ['townAdd', 'townAddRes', 'townEdit', 'townEditRes', 'townDel', 'townDelRes',
    'transferAdd', 'transferAddRes', 'transferEdit', 'transferEditRes', 'transferDel', 'transferDelRes',
    'mainformFrom', 'mainformTo', 'mainformCalendar',
    'editMenuTown', 'editMenuTransfer', 'editMenuNews',
    'orderInfo', 'confirmPhone', 'feedbackInfo',
    'newsAdd', 'newsEdit', 'newsEditRes', 'newsDel', 'newsDelRes', 'newsDelResBad'].includes(type)
        ? modal.innerHTML = modalWindowWrap(type) : null;


    if (type === 'newsEdit' || type === 'newsAdd') {
        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'align': [] }],
            ['image'],
            ['link'],
            ['clean']
        ];
        var editor = new Quill('#editor', {
            modules: {
              toolbar: toolbarOptions
            },
            theme: 'snow'
        });
        // const editor_body = $_('.ql-editor > p');
        // console.log('editor_body', editor_body);
        news_status = obj;
        news_token = obj === 'edit' ? el : generate_token(6);
        $_('#news_foto')[0].addEventListener("change", async function (event){
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onloadend = function(){
                temp_foto = news_foto === "" ? temp_foto : news_foto;
                $_('#foto_load')[0].style.backgroundImage = `url(${reader.result})`;
                news_foto = reader.result;
            };
            if(file){
                reader.readAsDataURL(file);
            };
        });

        if (type === 'newsEdit' ) {
            news_status = 'edit';
            send({ id: el }, `/blog/open/${news_token}`, (result) => {
                const resultat = JSON.parse(result);
                const editior = $_('.ql-editor')[0];
                if (resultat.res) {
                    news_foto = resultat.res.cover;
                    const article = resultat.res.article.split("\n");

                    console.log('article', article);

                    const port = (window.location.hostname.includes('127.0.0.1')) ? ":8054" : "";
                    $_('#news_alias')[0].innerHTML = `
                    <a href="/blog/${resultat.res.alias}"
                        title="Створюється автоматично із назви статті!"
                        target="_blank">
                        ${window.location.hostname}${port}/blog/${resultat.res.alias}
                    </a>`;
                    $_('#news_title')[0].value = resultat.res.title;
                    $_('#news_description')[0].value = resultat.res.description;
                    $_('#news_create')[0].innerHTML = `Створено: <span>${resultat.res.date_create}</span>`;
                    if (news_foto !== '') {
                        temp_foto = news_foto;
                        $_('#foto_load')[0].style.backgroundImage = `url(/img/news/${news_token}/${news_foto}_cover_resized_footer.jpg)`;
                    };
                    if (resultat.res.date_update !== '') {
                        $_('#news_update')[0].innerHTML = `Оновлено: <span>${resultat.res.date_update}</span>`;
                    };
                    editior.innerHTML = '';
                    [...article].forEach(element => {
                        editior.innerHTML += element;
                    });
                    resizeTextarea($_('#news_title')[0], '60')
                    resizeTextarea($_('#news_description')[0], '100');
                };
            }, 'GET');
        };
    };
    if (type === 'editMenuNews') {
        $_(`#${type}`)[0].innerHTML = `
            <p class="edit_menu" onclick="showModal('newsEdit', 'edit', '${el}')">Редагувати <i class='far fa-edit'></i></p>
            <p class="edit_menu" onclick="showModal('newsDel', 'delete', '${el}')">Видалити <i class='far fa-trash-alt'></i></p>`;
    };
    if (type === 'newsDel') {
        $_(`#${type} > #id_news`)[0].innerHTML = el
    };


    if (type === 'feedbackInfo') {
        const bookLang = getLang('lang');
        let answer = '';
        if (obj.settings === 'true') {
            answer = `<p class="edit_menu" style="min-width: 200px; margin-top: 25px;" onclick="saveAnswer('${obj.idfeedback}')">Відправити відповідь</p>`;
        }
        $_(`#${type}`)[0].innerHTML = `
            <p class="feedback_info">${obj.user_name}</p>
            <p class="feedback_info">${obj.feedbackEmail}</p>
            <p class="feedback_info">${obj.feedbackPhone}</p>
            <p class="feedback_info">${obj.date}</p>
            <p class="feedback_mess">${obj.feedbackComment}</p>
            <textarea name="feedback_answer" id="feedback_answer" autocomplete="nope" maxlength="300" placeholder="Введіть текст відповіді..." oninput="validation(this, 'Input', 'answer')">${obj.answer}</textarea>
            ${answer}`;
    }
    if (type === 'orderInfo') {
        const bookLang = getLang('lang');
        let proof = '', del = '';
        if (obj.settings === 'true') {
            proof = `<p class="edit_menu" style="min-width: 200px; margin-top: 25px;" onclick="proofOrder('${obj.orders}', 'proof')">Підтвердити замовлення <i class='fas fa-check-double'></i></p>`;
            del = `<p class="edit_menu" style="min-width: 200px; margin-bottom: 20px;" onclick="proofOrder('${obj.orders}', 'del')">Скасувати замовлення <i class='fas fa-times'></i></p>`;
        }
        $_(`#${type}`)[0].innerHTML = `
            <p class="order_info title_order">${obj.from} - ${obj.to} </p>
            <p class="order_info name" style="border-radius: 5px 5px 0px 0px;"><span>${obj.user_name}</span> - <span>${obj.user_surname}</span></p>
            <p class="order_info name" style="border-radius: 0px; border-top: 1px solid #e1e1e1; border-bottom: 1px solid #e1e1e1;"><span>${obj.user_email}</span></p>
            <p class="order_info name" style="border-radius: 0px 0px 5px 5px; margin-bottom: 7px;"><span>${obj.user_tel}</span></p>
            <p class="order_info block">${lang[`date${bookLang}`]} - <span>${obj.date}</span> &nbsp ${lang[`time${bookLang}`]} - <span>${obj.time}</span></p>
            <p class="order_info block">${lang[`adult${bookLang}`]} - <span>${obj.adult}</span> &nbsp ${lang[`children${bookLang}`]} - <span>${obj.children}</span></p>
            <p class="order_info block">${lang[`equip${bookLang}`]} - <span>${lang[`${obj.equip}${bookLang}`]}</span> &nbsp ${lang[`equip_child${bookLang}`]} - <span>${obj.equip_child}</span></p>
            <p class="order_info block">${lang[`sum${bookLang}`]} - <span>${obj.sum}</span> ${lang[`sum_type${bookLang}`]} &nbsp <span>${lang[`transfer_${obj.type}${bookLang}`]}</span></p>
            <p class="order_info block">${lang[`bookdate${bookLang}`]} - <span>${obj.book_date}</span></p>
            <p class="order_info block">${lang[`paid${bookLang}`]} - <span class="${obj.paid}">${lang[`${obj.paid}${bookLang}`]}</span></p>
            <p class="order_info block">${lang[`status${bookLang}`]} - <span class="${obj.status}">${lang[`${obj.status}${bookLang}`]}</span></p>
            ${proof}
            ${del}
        `;
    };
    if (type === 'editMenuTown') {
        $_(`#${type}`)[0].innerHTML = `
            <p class="edit_menu" onclick="showModal('townEdit', {'id' : '${obj.id}', 'uk' : '${obj.uk}', 'en' : '${obj.en}', 'ru' : '${obj.ru}'})">Редагувати <i class='far fa-edit'></i></p>
            <p class="edit_menu" onclick="showModal('townDel', {'id' : '${obj.id}'})">Видалити <i class='far fa-trash-alt'></i></p>`;
    };
    if (type === 'editMenuTransfer') {
        $_(`#${type}`)[0].innerHTML = `
        <p class="edit_menu" onclick="showModal('transferEdit',
            {'id' : '${obj.id}',
            'from' : '${obj.from}',
            'from_id' : '${obj.from_id}',
            'to' : '${obj.to}',
            'to_id' : '${obj.to_id}',
            'pricepr' : '${obj.pricepr}',
            'pricegr' : '${obj.pricegr}',
            'time1' : '${obj.time1}',
            'time2' : '${obj.time2}',
            'time3' : '${obj.time3}',
            'time4' : '${obj.time4}',
            'time5' : '${obj.time5}',
            'time6' : '${obj.time6}',
            'time7' : '${obj.time7}',
            'time8' : '${obj.time8}',
            'time9' : '${obj.time9}',
            'time10' : '${obj.time10}',
            'select' : '${obj.select}',
            'privat' : '${obj.privat}',
            'microbus' : '${obj.microbus}'})">Редагувати <i class='far fa-edit'></i></p>
        <p class="edit_menu" onclick="showModal('transferDel',
            {'id' : '${obj.id}',
            'from' : '${obj.from}',
            'to' : '${obj.to}'})">Видалити <i class='far fa-trash-alt'></i></p>`;
    };
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
        $_('.wrap_sub_modal')[0].innerHTML = modalWindowWrap(type);
        hours = $_('.hours')[0];
        minutes = $_('.minutes')[0];
        hArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        mArr = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
        hStart = 0, mStart = 0;
        $_('.admTime')[0].addEventListener('click', function(){
            el.value = `${hours.innerHTML}:${minutes.innerHTML}`;
            closeSubModal();
            // mainTimeInput.classList.remove('err_input');
            // checkForm();
        });
    };
    if (type === 'mainformTimes') {
        if (el.getAttribute("setparam") === 'limit') {
            modal.innerHTML = modalWindowWrap(`${type}limit`);
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
            modal.innerHTML = modalWindowWrap(type);
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
        $_('.wrap_sub_modal')[0].innerHTML = modalWindowWrap(type);
        const setParam =  obj.param;
        send('' , `/towns/list`, (result) => {
            const resultat = JSON.parse(result);
            if (resultat.res) {
                const tawns_list = $_('.towns_select_list')[0];
                tawns_list.innerHTML = '';
                resultat.res.forEach(element => {
                    tawns_list.innerHTML += `<p id="${element.town_id}" onclick="selectTown(this, '${setParam}')">${element.name_uk}</p>`
                });
            };
        }, 'GET');
    };
    //____TOWNS
    if (type === 'townAdd') {
        idTownPlace = $_('#id_town')[0];
        tokenTown = generate_token(6);
    };
    if (type === 'townEdit') {
        $_(`#${type} > #id_town`)[0].innerHTML = obj.id;
        $_(`#${type} > #uk`)[0].value = obj.uk;
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
        $_(`#${type} > #selection`)[0].checked = obj.select === 'true' ? true : false;
        $_(`#${type} > #privat`)[0].checked = obj.privat === 'true' ? true : false;
        $_(`#${type} > #microbus`)[0].checked = obj.microbus === 'true' ? true : false;
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

//for send to main page and set route to main form
const sendToMainForm = (transfid, type, obj) => {
    localStorage.setItem("transfid", transfid);
    localStorage.setItem("transftype", type);
    localStorage.setItem("transffromid", obj.fromid);
    localStorage.setItem("transffrom", obj.from);
    localStorage.setItem("transftoid", obj.toid);
    localStorage.setItem("transfto", obj.to);
    window.location.href = "/";
};

//for set route to main form
const setToMainForm = (transfid, type, obj) => {
    window.scrollTo({
        top: $_('.main_form_container')[0].offsetTop - 140,
        behavior: "smooth"
    });
    formValid = 'book';
    inputFrom.value = obj.from;
    inputTo.value = obj.to;
    $_('#type_transfer')[0].value = `transfer_${type}`;
    inputFrom.setAttribute("inputmainparam", obj.fromid);
    inputTo.setAttribute("inputmainparam", obj.toid);
    validationType($_('#type_transfer')[0]);
    checkForm();
};

//for select town and add to input
const selectTown = (el, param) => {
    $_(`.transfer_dup_to`)[0].style.display = 'none';
    $_(`.transfer_empty_to`)[0].style.display = 'none';
    $_(`.transfer_duplicated`)[0].style.display = 'none';
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
                peopleMax = 50;
                peopleType = 'gr';
            } else if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr === '' && element.price_pr !== '') {
                $_(`#type_pr`)[0].selected = true;
                $_(`#type_pr`)[0].classList.remove('hide_err');
                $_(`#type_gr`)[0].classList.add('hide_err');
                mainTimeInput.setAttribute("setparam", '');
                $_('#type_transfer')[0].classList.remove('err_input');
                peopleMax = 7;
                peopleType = 'pr';
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

//validation text input
const validation = (el, type, form = '') => {
    const val = `${el.value.replace(RegExpArr[`RegExp${type}`] , "")}`;
    el.value = val.replace(/\s\s+/g, ' ');
    if (form === 'feedback') {
        el.classList.remove('err_input');
        const arrInp = ['feedback_name', 'feedback_surname', 'feedback_email', 'feedback_phone', 'feedback_comment'];
        const arrTrue = [];
        arrInp.forEach(element => { if ($_(`#${element}`)[0].value === '') { arrTrue.push(false)} });
        if (!arrTrue.includes(false)) { $_(`.feedback_form_err`)[0].classList.add('hide_err') };
    } else if (['news', 'answer'].includes(form)) {
    } else {
        if (type ==='Input') {
            $_(`.town_empty_${el.id}`)[0].style.display = 'none';
            $_(`.town_dup_${el.id}`)[0].style.display = 'none';
        } else {
            el.classList.remove('err_input');
            checkForm();
        };
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
const validationPerson = (el, max) => {
    const priceVal = el.value;
    (priceVal < 0) ? el.value = '' : null;
    (priceVal > max) ? el.value = max : null;
    (priceVal === '') ? el.value = '' : null;
};
const validationEquip = (el) => {
    const priceVal = el.value;
    const maxPerson = 3;
    (priceVal < 0) ? el.value = '' : null;
    (priceVal > maxPerson) ? el.value = maxPerson : null;
    (priceVal === '') ? el.value = '' : null;
};
const validationType = (el) => {
    $_('#type_transfer')[0].classList.remove('err_input');
    $_(`.main_form_err_limit_pr`)[0].classList.add('hide_err');
    $_(`.main_form_err_limit_gr`)[0].classList.add('hide_err');
    mainTimeInput.value = '';
    if (el.value === 'transfer_pr') {
        peopleMax = 7;
        peopleType = 'pr';
        mainTimeInput.setAttribute("setparam", '');
    };
    if (el.value === 'transfer_gr') {
        peopleMax = 50;
        peopleType = 'gr';
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
    (adultInp.value > 0) ? adultInp.classList.remove('err_input') : adultInp.classList.add('err_input');
    peopleCount = +adultInp.value + +childrenValue.value;
    const peopleTypeErr = $_(`.main_form_err_limit_${peopleType}`)[0];
    // console.log('peopleType', peopleType);
    // console.log('peopleTypeErr', peopleTypeErr);
    if (peopleCount > peopleMax) {
        peopleTypeErr.classList.remove('hide_err');
        if (childrenValue.value !== '' && childrenValue.value !== '0') {
            adultInp.classList.add('err_input');
            childrenValue.classList.add('err_input');
        } else {
            adultInp.classList.add('err_input');
        };
    } else {
        peopleTypeErr.classList.add('hide_err');
        $_(`.main_form_err_book`)[0].classList.add('hide_err');
        adultInp.classList.remove('err_input');
        childrenValue.classList.remove('err_input');
    };
};
const validationChildren = (el) => {
    const equipchild =  $_('.equip_child')[0];
    const equipchildInp =  $_('.equip_child #equip_child')[0];
    equipchildInp.setAttribute('max', `${childrenValue.value}`);
    (equipchildInp.value > childrenValue.value) ? equipchildInp.value = childrenValue.value : null;
    (el.value < 1) ? equipchild.style.display = 'none' : null;
    (el.value > 0) ? equipchild.style.display = 'flex' : null;
    peopleCount = +adultInp.value + +childrenValue.value;
    const peopleTypeErr = $_(`.main_form_err_limit_${peopleType}`)[0];
    if (peopleCount > peopleMax) {
        peopleTypeErr.classList.remove('hide_err');
        if (adultInp.value !== '' && adultInp.value !== '0') {
            adultInp.classList.add('err_input');
            childrenValue.classList.add('err_input');
        } else {
            childrenValue.classList.add('err_input');
        };
    } else {
        peopleTypeErr.classList.add('hide_err');
        $_(`.main_form_err_book`)[0].classList.add('hide_err');
        adultInp.classList.remove('err_input');
        childrenValue.classList.remove('err_input');
    };
};
const resizeTextarea = (el, h) => {
    el.style.height = "";
    el.style.height = el.scrollHeight + "px";
    if (el.scrollHeight > +h) {
        el.style.overflow = 'auto';
    } else {
        el.style.overflow = 'hidden';
    };
};

//for back to previous tab
const mainFormBack = () => {
    $_('#check')[0].style.display = 'flex';
    $_('#booking')[0].style.display = 'none';
};

//for check form
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
        const peopleTypeErr = $_(`.main_form_err_limit_${peopleType}`)[0];
        if (elemCheck.value === '') {
            arrTrue.push(false);
            elemCheck.classList.add('err_input');
        };
        if (peopleCount > peopleMax) {
            arrTrue.push(false);
            peopleTypeErr.classList.remove('hide_err');
            if (childrenValue.value !== '' && childrenValue.value !== '0') {
                adultInp.classList.add('err_input');
                childrenValue.classList.add('err_input');
            } else {
                adultInp.classList.add('err_input');
            };
        } else {
            adultInp.classList.remove('err_input');
            childrenValue.classList.remove('err_input');
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

//for culculate and send orders
const bookArr = {};
const culculate = () => {
    checkForm();
    if (calkTrue) {
        const inpFrom = inputFrom.getAttribute('inputmainparam');
        const inpTo = inputTo.getAttribute('inputmainparam');
        transfersArr.forEach(element => {
            if (element.transfer_from === inpFrom && element.transfer_to === inpTo) {
                bookArr.transferId = element.transfer_id;
                bookArr.transferFromName = $_('#main_from')[0].value;
                bookArr.transferToName = $_('#main_to')[0].value;
                bookArr.adult = +$_('#adults')[0].value;
                bookArr.children = +$_('#children')[0].value;
                bookArr.type = $_('#type_transfer')[0].value;
                bookArr.sum = ($_('#type_transfer')[0].value === 'transfer_gr') ? element.price_gr * (bookArr.adult + bookArr.children) : element.price_pr;
                bookArr.date = $_('#main_date')[0].value;
                bookArr.time = $_('#main_time')[0].value;
                bookArr.equip = document.querySelector('input[name="equip"]:checked').value;
                bookArr.equip_child = +$_('#equip_child')[0].value;
                bookArr.user_name = $_('#main_name')[0].value;
                bookArr.user_surname = $_('#main_surname')[0].value;
                bookArr.user_email = $_('#main_email')[0].value;
                bookArr.user_phone = $_('#main_phone')[0].value;
                // bookArr.paid = $_('#main_paid')[0].checked;
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
                    const resInfoBlock = `
                        <p class="main_form_color">${bookArr.transferFromName} - ${bookArr.transferToName}</p>
                        <p>${lang[`date${bookLang}`]} - <span class="main_form_color">${bookArr.date}</span> &nbsp ${lang[`time${bookLang}`]} - <span class="main_form_color">${bookArr.time}</span></p>
                        <p>${lang[`adult${bookLang}`]} - <span class="main_form_color">${bookArr.adult}</span> &nbsp
                            ${lang[`children${bookLang}`]} - <span class="main_form_color">${bookArr.children}</span> &nbsp
                            ${lang[`children_chear${bookLang}`]} - <span class="main_form_color">${bookArr.equip_child}</span></p>
                        <p>${lang[`equip${bookLang}`]} - <span class="main_form_color">${lang[`${bookArr.equip}${bookLang}`]}</span> &nbsp
                            <b class="main_form_color">${lang[`${bookArr.type}${bookLang}`]}</b></p>
                        <p>${lang[`sum${bookLang}`]} - <span class="main_form_color">${bookArr.sum}</span> </p>
                    `;
                    resInfo.innerHTML = resInfoBlock;
                    $_('#check')[0].style.display = 'none';
                    $_('#booking')[0].style.display = 'flex';
                };
                if (formValid === 'bookfinal') {
                    send(bookArr , `/order/order`, (result) => {
                        const resultat = JSON.parse(result);
                        if (resultat.res) {
                            if (resultat.res === 'Order created!') {
                                $_('#check')[0].style.display = 'none';
                                $_('#booking')[0].style.display = 'none';
                                $_('#received')[0].style.display = 'flex';
                            };
                        };
                    }, 'POST');
                };
            };
        });
    };
};

//for set order sort numbers
const setOrderNumb = (el) => { numb = el.value; ordersList(1) };
const setOrderStatus = (el) => { orderstat = el.value; ordersList(1) };
const setOrderDate = (el) => { orderdate = el.value; ordersList(1) };

//for proofing or canceling order
const proofOrder = (orderid, param) => {
    send({"id": `${orderid}`, 'param': `${param}`} , `/order/orderstatus`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) { ordersList(1); modal.innerHTML = '' };
    }, 'POST');
};

//load towns list
const ordersList = (page = 1) => {
    let param = [];
    ['reserv', 'proof', 'del'].includes(orderstat) ? param.push({"status": orderstat}) : param.push({"status": ''});
    ['3', '6', '12', ''].includes(orderdate) ? param.push({"date": orderdate}) : param.push({"date": ''});
    send({page, param, 'numb' : numb} , `/order/list`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            const bookLang = getLang('lang');
            const orders_list = $_('.orders_list')[0];
            const orders_pagination = $_('.orders_pagination')[0];
            const present_pagination = orders_pagination.children;
            const pagin_page = Math.ceil(resultat.res.count / numb);
            orders_list.innerHTML = '';
            orders_pagination.innerHTML = '';
            if (pagin_page > 1) {
                for (let i = 1; i <= pagin_page; i++) { orders_pagination.innerHTML += `<p onclick="ordersList(${i})">${i}</p>` };
                present_pagination[page-1].style.color = '#fff';
                present_pagination[page-1].style.backgroundColor = 'rgb(139 195 74)';
                present_pagination[page-1].removeAttribute("onclick");
            };
            resultat.res.list.forEach(element => {
                orders_list.innerHTML += `
                <div class="order" onclick="showModal('orderInfo',
                {'orders' : '${element.orders}',
                'from' : '${element.order_from}',
                'to' : '${element.order_to}',
                'date' : '${element.date}',
                'time' : '${element.time}',
                'type' : '${element.type}',
                'adult' : '${element.adult}',
                'children' : '${element.children}',
                'equip' : '${element.equip}',
                'equip_child' : '${element.equip_child}',
                'sum' : '${element.sum}',
                'paid' : '${element.paid}',
                'status' : '${element.status}',
                'book_date' : '${element.book_date}',
                'user_email' : '${element.user_email}',
                'user_name' : '${element.user_name}',
                'user_surname' : '${element.user_surname}',
                'user_tel' : '${element.user_tel}',
                'settings' : '${element.settings}'}, this)">
                    <p>${element.order_from} - ${element.order_to}  </p>
                    <p>${lang[`date${bookLang}`]} - <span>${element.date}</span> </p>
                    <p>${lang[`time${bookLang}`]} - <span>${element.time}</span></p>
                    <p>${lang[`sum${bookLang}`]} - <span>${element.sum}</span> ${lang[`sum_type${bookLang}`]}</p>
                    <p><span>${lang[`transfer_${element.type}${bookLang}`]}</span></p>
                    <i class='fas fa-info-circle ${element.proof}'></i>
                </div>`
            });
        };
    }, "POST");
};

//for check feedback form
const checkFeedback = () => {
    let arrInp = ['feedback_name', 'feedback_surname', 'feedback_email', 'feedback_phone', 'feedback_comment'];
    const arrTrue = [];
    arrInp.forEach(element => {
        const elemCheck = $_(`#${element}`)[0];
        const emailCheck = $_('#feedback_email')[0];
        const phoneCheck = $_('#feedback_phone')[0];
        if (elemCheck.value === '') {
            arrTrue.push(false);
            elemCheck.classList.add('err_input');
        };
        if (emailCheck.value !== '' && !validEmail(emailCheck.value)) {
            arrTrue.push(false);
            emailCheck.classList.add('err_input');
        };
        if (phoneCheck.value !== '' && !validPhone(phoneCheck.value)) {
            arrTrue.push(false);
            phoneCheck.classList.add('err_input');
        };
    });
    if (arrTrue.includes(false)) {
        feedbackCalkTrue = false;
        $_(`.feedback_form_err`)[0].classList.remove('hide_err');
    } else {
        feedbackCalkTrue = true;
        $_(`.feedback_form_err`)[0].classList.add('hide_err');
    };
};

//for send feedback
const feedbackArr = {};
const sendFeedback = () => {
    checkFeedback();
    if (feedbackCalkTrue) {
        feedbackArr.feedbackName = $_('#feedback_name')[0].value;
        feedbackArr.feedbackSurname = $_('#feedback_surname')[0].value;
        feedbackArr.feedbackEmail = $_('#feedback_email')[0].value;
        feedbackArr.feedbackPhone = $_('#feedback_phone')[0].value;
        feedbackArr.feedbackComment = $_('#feedback_comment')[0].value;
        send(feedbackArr , `/feedback/feedback`, (result) => {
            const resultat = JSON.parse(result);
            if (resultat.res) {
                if (resultat.res === 'Feedback sended!') {
                    if ($_('.feedback_name')[0]) {$_('.feedback_name')[0].value = ''};
                    if ($_('.feedback_surname')[0]) {$_('.feedback_surname')[0].value = ''};
                    if ($_('.feedback_email')[0]) {$_('.feedback_email')[0].value = ''};
                    if ($_('#feedback_phone')[0]) {$_('#feedback_phone')[0].value = ''};
                    $_('#feedback_comment')[0].value = '';
                    $_(`.feedback_sended`)[0].classList.remove('hide_err');
                    setTimeout(() => {
                        $_(`.feedback_sended`)[0].classList.add('hide_err');
                    }, 5000);
                };
            };
        }, "POST");
    };
};

//for set feedback sort numbers
const setFeedbackNumb = (el) => { feedback_numb = el.value; feedbackList(1) };
const setFeedbackStatus = (el) => { feedback_stat = el.value; feedbackList(1) };
const setFeedbackDate = (el) => { feedback_date = el.value; feedbackList(1) };

//for sending feedback answer
const saveAnswer = (feedbackid) => {
    const answer_mess = $_('#feedback_answer')[0].value;
    send({"id": `${feedbackid}`, 'answer': `${answer_mess}`}, `/feedback/answer`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) { feedbackList(1); modal.innerHTML = '' };
    }, "POST");
};

//for show feedback list
const feedbackList = (page = 1) => {
    let param = [];
    ['answer', 'noanswer'].includes(feedback_stat) ? param.push({"status": feedback_stat}) : param.push({"status": ''});
    ['3', '6', '12', ''].includes(feedback_date) ? param.push({"date": feedback_date}) : param.push({"date": ''});
    send({page, param, 'numb' : feedback_numb} , `/feedback/list`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            const bookLang = getLang('lang');
            const feedback_list = $_('.feedback_list')[0];
            const feedback_pagination = $_('.feedback_pagination')[0];
            const present_pagination = feedback_pagination.children;
            const pagin_page = Math.ceil(resultat.res.count / feedback_numb);
            feedback_list.innerHTML = '';
            feedback_pagination.innerHTML = '';
            if (pagin_page > 1) {
                for (let i = 1; i <= pagin_page; i++) { feedback_pagination.innerHTML += `<p onclick="feedbackList(${i})">${i}</p>` };
                present_pagination[page-1].style.color = '#fff';
                present_pagination[page-1].style.backgroundColor = 'rgb(139 195 74)';
                present_pagination[page-1].removeAttribute("onclick");
            };
            resultat.res.list.forEach(element => {
                let settings = '', answer = '', answerdate = '';
                if (element.settings === 'true') {
                    settings = `<i class='fas fa-edit' onclick="showModal('feedbackInfo',
                    {'idfeedback' : '${element.idfeedback}',
                    'feedbackComment' : '${element.feedbackComment}',
                    'user_name' : '${element.feedbackName} ${element.feedbackSurname}',
                    'feedbackEmail' : '${element.feedbackEmail}',
                    'feedbackPhone' : '${element.feedbackPhone}',
                    'date' : '${element.date_create}',
                    'answer' : '${element.answer}',
                    'settings' : '${element.settings}'}, this)"></i>`;
                };
                if (element.status === 'answer') {
                    answer = `<p class="f_answer"><span>${lang[`answer${bookLang}`]}: </span> ${element.answer}</p>`;
                    answerdate = `<p class="f_answer_date">${lang[`date${bookLang}`]}: ${element.date_answer}</p>`;
                };
                feedback_list.innerHTML += `
                <div class="feedback user${element.settings}">
                    <p>${element.feedbackComment}</p>
                    <p class="f_date">${lang[`date${bookLang}`]}: ${element.date_create}</p>
                    ${answer}
                    ${answerdate}
                    ${settings}
                </div>`
            });
        };
    }, "POST");
};

//load variables list
const loadVariablesList = () => {
    send('', `/towns/variables`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            townsFrom = resultat.res.towns_from;
            townsTo = resultat.res.towns_to;
            transfersArr = resultat.res.transfers_arr;
            const langName = getLang('lang');
            const privatWrap = $_('.wrap_prevat')[0];
            const microbusWrap = $_('.wrap_microbus')[0];
            const specialWrap = $_('.wrap_special')[0];
            if (privatWrap !== undefined) {
                privatWrap.innerHTML = '';
                resultat.res.privat.forEach(priv => {
                    transfersArr.forEach(transf => {
                        if (transf.transfer_id === priv.transfer_id) {
                            privatWrap.innerHTML += `
                            <p onclick="setToMainForm('${transf.transfer_id}', 'pr',
                                {'from': '${townsFrom[transf.transfer_from]}',
                                'to': '${townsTo[transf.transfer_to]}',
                                'fromid': '${transf.transfer_from}',
                                'toid': '${transf.transfer_to}'})">
                                <i class='fas fa-arrow-alt-circle-right'></i>${townsFrom[transf.transfer_from]} - ${townsTo[transf.transfer_to]}</p>
                            <p class="price"><span>${lang[`from${langName}`]}</span>${transf.price_pr}<span>${lang[`sum_type${langName}`]}</span></p>`
                        };
                    });
                });
            };
            if (microbusWrap !== undefined) {
                microbusWrap.innerHTML = '';
                resultat.res.microbus.forEach(micro => {
                    transfersArr.forEach(transf => {
                        if (transf.transfer_id === micro.transfer_id) {
                            microbusWrap.innerHTML += `
                            <p onclick="setToMainForm('${transf.transfer_id}', 'gr',
                                {'from': '${townsFrom[transf.transfer_from]}',
                                'to': '${townsTo[transf.transfer_to]}',
                                'fromid': '${transf.transfer_from}',
                                'toid': '${transf.transfer_to}'})">
                                <i class='fas fa-arrow-alt-circle-right'></i>${townsFrom[transf.transfer_from]} - ${townsTo[transf.transfer_to]}</p>
                            <p class="price"><span>${lang[`from${langName}`]}</span>${transf.price_gr}<span>${lang[`sum_type${langName}`]}</span></p>`
                        };
                    });
                });
            };
            if (specialWrap !== undefined) {
                specialWrap.innerHTML = '';
                resultat.res.spec.forEach(spec => {
                    transfersArr.forEach(transf => {
                        if (transf.transfer_id === spec.transfer_id) {
                            specialWrap.innerHTML += `
                            <div>
                                <p><i class='fas fa-arrow-alt-circle-right'></i>
                                    <span>${townsFrom[transf.transfer_from]}</span>
                                    <span>&nbsp-&nbsp</span>
                                    <span>${townsTo[transf.transfer_to]}</span>
                                </p>
                                <p class="price"><span>${lang[`from${langName}`]}</span>${transf.price_pr}<span>${lang[`sum_type${langName}`]}</span></p>
                                <p class="special_btn" onclick="sendToMainForm('${transf.transfer_id}', 'pr',
                                    {'from': '${townsFrom[transf.transfer_from]}',
                                    'to': '${townsTo[transf.transfer_to]}',
                                    'fromid': '${transf.transfer_from}',
                                    'toid': '${transf.transfer_to}'}
                                )">${lang[`book${langName}`]}</p>
                            </div>`
                        };
                    });
                });
            };
        };
    }, 'GET');
};

//load towns list
const loadTownsList = () => {
    send({} , `/towns/list`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            const tawns_list = $_('.tawns_list')[0];
            tawns_list.innerHTML = '';
            resultat.res.forEach(element => {
                tawns_list.innerHTML += `
                <div class="town"><p>${element.name_uk}</p>
                <i class='fas fa-ellipsis-h' onclick="showModal('editMenuTown', {'id' : '${element.town_id}', 'uk' : '${element.name_uk}', 'en' : '${element.name_en}', 'ru' : '${element.name_ru}'})"></i>
                </div>`
            });
        };
    }, 'GET');
};

//for save transfer list position
const savePosition = () => {
    const sortWrap = $_('#sortable')[0].children, sortArr = {};
    for (var i = 0; i < sortWrap.length; ++i) {
        sortArr[`${sortWrap[i].id}`] = `${i+1}${token(4)}`;
    };
    send(sortArr , `/transfers/saveposition`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            $_('#save_position')[0].style.display = 'none';
            loadTransfersList();
        };
    }, 'POST');
};

//load transferі list
const loadTransfersList = () => {
    send({} , `/transfers/list`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            // console.log('res', resultat.res);
            const transfers_list = $_('.transfers_list')[0];
            transfers_list.innerHTML = '';
            resultat.res.forEach(element => {
                transfers_list.innerHTML += `
                <div class="transfer" id="${element.id}">
                    <p>${element.transfer_from} - ${element.transfer_to}</p>
                    <span>
                        <p class="sel${element.selection}">обрані</p>
                        <p class="pr${element.privat}">приватні</p>
                        <p class="micro${element.microbus}">мікроавтобус</p>
                    </span>
                    <i class='fas fa-ellipsis-h' onclick="showModal('editMenuTransfer',
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
                    'select' : '${element.selection}',
                    'privat' : '${element.privat}',
                    'microbus' : '${element.microbus}'})"></i>
                </div>`
            });
        };
    }, 'GET');
};

//add to DB Towns
const formSend = (formID) => {
    let obj = {}, trueSend = true, metod = 'POST', url = 'create';
    if ((formID === 'townAdd') || (formID === 'townEdit')) {
        const id_town = $_(`#${formID} > #id_town`)[0].innerHTML;
        const uk_town = $_(`#${formID} > #uk`)[0].value.replace(RegExpArr.RegExpInput , "");
        const en_town = $_(`#${formID} > #en`)[0].value.replace(RegExpArr.RegExpInput , "");
        const ru_town = $_(`#${formID} > #ru`)[0].value.replace(RegExpArr.RegExpInput , "");
        obj = {"id" : id_town, "uk" : uk_town, "en" : en_town, "ru" : ru_town, "param" : formID};
        ["uk", "en", "ru"].forEach(element => {
            if ($_(`#${formID} > #${element}`)[0].value === '') {
                $_(`.town_empty_${element}`)[0].style.display = 'block';
                trueSend = false;
            };
        });
    };
    if (formID === 'townEdit') {
        metod = "PUT";
        url = 'update';
    }
    if (formID === 'townDel') {
        const id_town = $_(`#${formID} > #id_town`)[0].innerHTML;
        obj = {"id" : id_town, "param" : formID};
        metod = "DELETE";
        url = 'delete';
    }
    if (trueSend) {

        console.log('obj', obj);

        send(obj, `/towns/${url}`, (result) => {
            const resultat = JSON.parse(result);
            if (resultat.res) {
                console.log(resultat.res);
                showModal(`${formID}Res`);
                $_('#id_town')[0].innerHTML = obj.id;
                setTimeout(() => { modal.innerHTML = '' }, 2000);
                loadTownsList();
                (formID === 'townDel') ? loadTransfersList() : null;
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
        }, metod);
    };
};

//add to DB Transfers
const formSendTransfer = (formID) => {
    let obj = {}, trueSend, metod = 'POST', url = 'create';
    if ((formID === 'transferAdd') || (formID === 'transferEdit')) {
        const transfer_id = $_(`#${formID}`)[0].paramid;
        const transfer_from = $_(`#${formID} > #from`)[0].inputparam;
        const transfer_to = $_(`#${formID} > #to`)[0].inputparam;
        const transfer_gr = $_(`#${formID} #gr`)[0].value;
        const transfer_pr = $_(`#${formID} #pr`)[0].value;
        const transfer_select = $_(`#${formID} > #selection`)[0].checked;
        const privat = $_(`#${formID} > #privat`)[0].checked;
        const microbus = $_(`#${formID} > #microbus`)[0].checked;
        const transfer_times = [];
        $_('.time').forEach(element => { if (element.value !== '') { transfer_times.push(element.value)}});
        obj = {"id" : transfer_id, "from" : transfer_from, "to" : transfer_to, "gr" : transfer_gr, "pr" : transfer_pr,
               "select" : transfer_select, "privat" : privat, "microbus" : microbus, "times" : transfer_times, "param" : formID};
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
    if (formID === 'transferEdit') {
        metod = "PUT";
        url = 'update'
    };
    if (formID === 'transferDel') {
        const id_transfer = $_(`#${formID} > #id_transfer`)[0].paramid;
        obj = {"id" : id_transfer, "param" : formID};
        trueSend = true;
        metod = "DELETE";
        url = 'delete'
    };
    if (trueSend) {
        send(obj, `/transfers/${url}`, (result) => {
            const resultat = JSON.parse(result);
            if (resultat.res) {
                showModal(`${formID}Res`);
                setTimeout(() => { modal.innerHTML = '' }, 2000);
                loadTransfersList();
            };
            if (resultat.DUP) {
                console.log('Transfer duplicated!');
                $_(`.transfer_duplicated`)[0].style.display = 'block';
            };
        }, metod);
    };
};


//for showing news messge
const messageNews = (text = '', classs = 'mmm') => {
    const news_vilid = $_('#vilid_news')[0];
    if (news_vilid) {
        news_vilid.innerHTML = text;
        news_vilid.classList.remove('vilid_news_bad');
        news_vilid.classList.remove('vilid_news_good');
        news_vilid.classList.add(classs);
    };
};

//for validation file input
const validIMG = (event) => {
    const files = event.target.files;
    if (!['image/jpg', 'image/jpeg', 'image/png', 'image/bmp'].includes(files[0].type)) {
        messageNews(`Недоступний формат. Доступними є: jpg, jpeg, png`, 'vilid_news_bad');
        $_('#news_foto')[0].value = '';
    } else {
        if (files[0].size > 5000000) {
            messageNews(`Надто великий розмір. Максимально 5Mb`, 'vilid_news_bad');
            $_('#news_foto')[0].value = '';
        } else {
            messageNews('');
        };
    };
};

const createGallery = async (img_base64, formData) => {
    return new Promise((resolve) => {
        const image_names = Object.keys(img_base64);
        if (image_names.length > 0) {
            let x = 0;
            Object.entries(img_base64).forEach(async ([key, value]) => {
                const base64Cover = await fetch(`${value}`);
                const foto = await base64Cover.blob();
                formData.append("gallery", foto, `${key}.jpg`);
                (++x === image_names.length) && resolve(formData);
            });
        } else {
            resolve(formData);
        };
    });
};

const clearCoverImg = () => {
    $_('#news_foto')[0].type = "text";
    $_('#news_foto')[0].type = "file";
    news_foto = temp_foto;
    $_('#foto_load')[0].style.backgroundImage = temp_foto.length < 5 ? `url(/img/nofoto.png)` : `url(/img/news/${news_token}/${news_foto}_cover_resized_footer.jpg)`;
};

const removeCoverImg = () => {
    $_('#foto_load')[0].style.backgroundImage = `url(/img/nofoto.png)`;
    $_('#news_foto')[0].type = "text";
    $_('#news_foto')[0].type = "file";
    news_foto = "";
};

//for saving news article
const saveNews = async (param) => {
    let trueSendNews = false;
    const valid_empty = [], valid_fields = [], field_names = [' назва', ' опис'];
    const save_cover = $_('#load_cover')[0];
    const news_title = $_('#news_title')[0].value;
    const news_description = $_('#news_description')[0].value;
    const news_editor = $_('.ql-editor')[0].children;
    [news_title, news_description].forEach((element, index) => {
        if (element === '' || element === undefined) {
            valid_empty.push(false);
            valid_fields.push(field_names[index]);
        };
    });
    if (!valid_empty.includes(false)) {
        trueSendNews = true;
        messageNews('');
    } else {
        trueSendNews = false;
        messageNews(`<span>Поля є обовяковими: ${valid_fields} </span>`, 'vilid_news_bad');
    };

    console.log('news_save_status', param);
    console.log('news_status', news_status);
    console.log('news_token', news_token);
    console.log('news_title', news_title);
    console.log('news_description', news_description);
    console.log('news_foto', news_foto);
    console.log('news_editor', news_editor);

    if (trueSendNews) {
        save_cover.style.display = 'flex';
        const img_arr = $_('.ql-editor')[0].getElementsByTagName('img');
        const img_base64 = {};
        const img_https_names = [];
        [...img_arr].forEach(function(element) {
            if (element.src.includes('base64')) {
                const img_token = generate_token(9)
                img_base64[img_token] = element.src;
                element.src = img_token;
            };
            if (element.src.includes('http')) {
                img_https_names.push(element.src);
            };
        });
        const article = [...news_editor].map((element) => element.outerHTML).join("\n");
        const cover_name = (!news_foto.includes('base64')) ? news_foto : generate_token(6);
        let formData = new FormData();
        const obj = {
            token: news_token,
            title: news_title,
            description: news_description,
            cover: cover_name,
            article: article,
            gallery: Object.keys(img_base64),
            httpnames: img_https_names
        };
        formData.append("obj", JSON.stringify(obj));
        formData.append("token", news_token);
        if (news_foto && news_foto.includes('base64')) {
            const base64Cover = await fetch(`${news_foto}`);
            formData.append("cover", await base64Cover.blob(), `${cover_name}_cover.jpg`);
        };
        await createGallery(img_base64, formData);
        fetch(`/blog/${news_status}`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.status === 200) {
                return response.json()
            } else {
                if (response.status === 201) { news_status = 'edit' };
                throw new Error('Article is not saved!')
            };
        })
        .then(result => {

            console.log('result', result);

            closeModalX();
            (param === 'save')
                ? showModal('newsEdit', 'edit', news_token)
                : (showModal('newsEditRes'), setTimeout(() => {
                    closeModalX();
                    loadNewsList();
                }, 3000));
        })
        .finally(() => {
            save_cover.style.display = 'none';
        })
        .catch(error => {
            messageNews(`<span>Виникла помилка під час збереження статті. Спробуйте зберегти ще раз.</span>`, 'vilid_news_bad');
            [...img_arr].forEach(function(element) {
                const img_keys = Object.keys(img_base64);
                const original_img = element.src.split('/')[element.src.split('/').length -1].replace("/", "");
                if (img_keys.includes(original_img)) {
                    element.src = img_base64[original_img];
                };
            });
            loadNewsList();
            news_status = news_status === 'create' ? news_status : 'edit';
            console.log(error);
        });
    };
};

//load news list
const loadNewsList = (count = '1000', target = '_admin') => {
    fetch(`/blog/list/${count}`, { method: 'GET' })
    .then(response => response.status === 200 && response.json())
    .then(resultat => {
        const news_list = $_(`.news_list${target}`)[0];
        if (news_list) {
            news_list.innerHTML = '';
            resultat.res.forEach(element => {
                const adm_btn = target === '_admin' ? `
                    <i class='fas fa-ellipsis-h' onclick="showModal('editMenuNews', 'edit', '${element.id_blog}')"></i>
                    <i class="fa fa-share" onclick="window.open('/blog/${element.alias}')"></i>` : '';
                const cover = element.cover !== '' ? `/img/news/${element.id_blog}/${element.cover}_cover_resized${target}.jpg`: '/img/nofoto.png';
                const description = target !== '_footer' ? `<p style="font-size:12px;">${element.description}</p>` : '';
                const open_btn = target === '_footer' ? `onclick="window.open('/blog/${element.alias}')"` : '';
                news_list.innerHTML += `
                <div class="news${target}">
                    <div class="news_body${target}">
                        <div class="news_foto${target}" ${open_btn}>
                            <img src="${cover}" />
                        </div>
                        <div class="news_info${target}">
                            <h4>${element.title}</h4>
                            ${description}
                            <a class="news_more" href="/blog/${element.alias}"><i class='fas fa-long-arrow-alt-right'></i></a>
                        </div>
                    </div>
                    ${adm_btn}
                </div>`
            });
        };
    });
};

const formDeleteNews = () => {
    const news_id = $_(`#newsDel > #id_news`)[0].innerHTML;
    fetch(`/blog/delete/${news_id}`, { method: 'DELETE' })
    .then(response => {
        console.log('response', response);
        if (response.status === 400) {
            throw new Error('Invalid');
        }
        if (response.status === 200) {
            showModal('newsDelRes');
            setTimeout(() => {
                closeModalX();
                loadNewsList();
            }, 3000)
        };
    })
    .catch(() => {
        showModal('newsDelResBad');
        setTimeout(() => {
            closeModalX();
        }, 3000)
    });
};




