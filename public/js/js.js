class ShowDate {
    plusZero = (value) => ((value >= 0) && (value <= 9) && (value.toString().length === 1)) ? "0" + value : value;
    minutes = (date) => this.plusZero(date.getMinutes());
    hours = (date) => this.plusZero(date.getHours());
    seconds = (date) => this.plusZero(date.getSeconds());
    day = (date) => this.plusZero(date.getDate());
    month = (date) => this.plusZero(date.getMonth() + 1);
    year = (date) => `${date.getFullYear()}`;
    show(format = 'hh:mi:ss dd.mm.yyyy', date) {
        date = date ? new Date(date) : new Date();
        const year_length = [...format].filter(el => el === 'y').length;
        const year = year_length === 2 ? this.year(date).slice(2, 4) : this.year(date);
        return format
            .replace(/mi/g, `${this.minutes(date)}`)
            .replace(/hh|h/g, `${this.hours(date)}`)
            .replace(/ss|s/g, `${this.seconds(date)}`)
            .replace(/dd|d/g, `${this.day(date)}`)
            .replace(/mm|m/g, `${this.month(date)}`)
            .replace(/yy/g, 'y')
            .replace(/yy/g, 'y')
            .replace(/y/g, year);
    };
};
class Calendar extends ShowDate {
    constructor(){
        super();
    }
    show() {return service.show('dd.mm.yyyy')};
    // show = () => 'ddddddd';
};
const date = new ShowDate();
const calendar = new Calendar();
// console.log('.........................', calendar.show());















//for creating calendar
const date_calendar = new Date();
const renderCalendar = (year) => {
    date_calendar.setDate(1);
    date_calendar.setYear(year);
    const monthDays = document.querySelector(".days");
    const lastDay = new Date(date_calendar.getFullYear(), date_calendar.getMonth() + 1, 0).getDate();
    const prevLastDay = new Date(date_calendar.getFullYear(), date_calendar.getMonth(), 0).getDate();
    const firstDayIndex = date_calendar.getDay();
    const lastDayIndex = new Date(date_calendar.getFullYear(), date_calendar.getMonth() + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;
    let months = [], days = "";
    if (getLang('lang') === 'uk') {
        months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
    };
    if (getLang('lang')  === 'en') {
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    };
    document.querySelector(".date h1").innerHTML = months[date_calendar.getMonth()];
    for (let i = firstDayIndex; i > 0; i--) { days += `<div class="prev-date">${prevLastDay - i + 1}</div>` };
    const today = `${new Date().getFullYear()}-${(readyMonth(new Date()))}-${readyDay(new Date())}`;
    for (let i = 1; i <= lastDay; i++) {
        if ( i === new Date().getDate() && date_calendar.getMonth() === new Date().getMonth() && date_calendar.getFullYear() === new Date().getFullYear()) {
            days += `<div class="today" onclick="selectDate('${i}/${readyMonth(date_calendar.getMonth())}/${year}')">${i}</div>`;
        } else if (`${date_calendar.getFullYear()}-${readyMonth(date_calendar)}-${readyDay(`2022-01-${i}`)}` < today) {
            days += `<div class="prev-date">${i}</div>`;
        } else {
            days += `<div onclick="selectDate('${i}/${readyMonth(`${year}-${date_calendar.getMonth() + 1}-${i}`)}/${year}')">${i}</div>`;
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


class Templates {
    constructor(){}
    //TOWNS
    townSave(data) {
        const creatingID = !data.town_id ? 'town.creatingTownID(this), ' : '';
        return `<p class="towns_error">Сталася помилка спробуйте ще раз!</p>
        <p id="id_town">${data.town_id ? data.town_id : ''}</p>
        <p class="form_info">Унікальний номер міста</p>
        <input type="text" id="uk" name="uk" value="${data.name_uk ? data.name_uk : ''}" maxlength="90" placeholder="Назва українською" oninput="${creatingID}validation(this, 'Input')">
        <p class="town_dup_uk">Така назва вже є в базі!</p>
        <p class="town_empty_uk">Не може бути пустим!</p>
        <input type="text" id="en" name="en" value="${data.name_en ? data.name_en : ''}" maxlength="90" placeholder="Name in English" oninput="validation(this, 'Input')">
        <p class="town_dup_en">Така назва вже є в базі!</p>
        <p class="town_empty_en">Не може бути пустим!</p>
        <input type="text" id="ru" name="ru" value="${data.name_ru ? data.name_ru : ''}" maxlength="90" placeholder="Название на русском" oninput="validation(this, 'Input')">
        <p class="town_dup_ru">Така назва вже є в базі!</p>
        <p class="town_empty_ru">Не може бути пустим!</p>
        <p class="form_send" onclick="town.save('${this.town_param}', '${this.town_form}')">Добавити в базу</p>`;
    }
    townsList(data) {
        return `<div class="town"><p>${data.name_uk}</p>
        <i class='fas fa-ellipsis-h' onclick="town.show('town', 'menu', {}, '${ data.town_id }')"></i>
        </div>`
    }
    transferTowns() {
        return `<p>Натисніть на місто щоб вибрати</p>
        <div class="towns_select_list"></div>
        <p class="form_send" onclick="town.closeSub()">Закрити</p>`
    }

    //TRANSFER
    transferSave(data) {
        return `<p class="transfer_error">Сталася помилка спробуйте ще раз!</p>
        <input type="text" id="from" name="from" maxlength="120" autocomplete="off" placeholder="Перевезення з ..."
            data-input="${data.transfer_from_id ? data.transfer_from_id : ''}"
            value="${data.transfer_from ? data.transfer_from : ''}"
            oninput="validation(this, 'Input')"
            onfocus="town.townList('transfer', 'Towns', 'from')" readonly>
        <input type="text" id="to" name="to" maxlength="120" autocomplete="off" placeholder="Перевезення до ..."
            data-input="${data.transfer_to_id ? data.transfer_to_id : ''}"
            value="${data.transfer_to ? data.transfer_to : ''}"
            oninput="validation(this, 'Input')"
            onfocus="town.townList('transfer', 'Towns', 'to')" readonly>
        <p class="transfer_dup_to">Поля "Перевезення з" і "Перевезення до" не можуть співпадати!</p>
        <p class="transfer_empty_to">Поля "Перевезення з" і "Перевезення до" не можуть бути пустим!</p>
        <p class="transfer_duplicated">Такий маршрут вже існує! Його можна редагувати. Ціни для групових та приватних перевезень потрібно вказувати в одному маршруті.</p>
        <div class="price_form">
            <p>Груповий</p>
            <input type="number" id="gr" name="gr" value="${data.price_gr ? data.price_gr : ''}" min="0" max="50000" autocomplete="off"
            placeholder="Ціна за груповий..." oninput="validationPrice(this), time.showTimeList(this)">
        </div>
        <p class="transfer_price_gr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
        <div class="price_form">
            <p>Приватний</p>
            <input type="number" id="pr" name="pr" value="${data.price_pr ? data.price_pr : ''}" min="0" max="50000" autocomplete="off"
            placeholder="Ціна за приватний..." oninput="validationPrice(this)">
        </div>
        <p class="transfer_price_pr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
        <p class="transfer_price_empt">Хоча б одна ціна має бути вказана!</p>
        <div class="add_time" style="display: none">
            <div class="add">
                ${this.timeField({})}
            </div>
        </div>
        <p class="title">Поставте галочку щоб добавити в список обраних перевезень</p>
        <input type="checkbox" id="selection" name="selection" ${data.selection === 'true' ? 'checked' : ''}>
        <p class="title" style="margin-top:5px">Поставте галочку щоб добавити в список <span style="color:#c95f5f">приватних перевезень</span> максисально 3 шт.</p>
        <input type="checkbox" id="privat" name="privat" ${data.privat === 'true' ? 'checked' : ''}>
        <p class="title" style="margin-top:5px">Поставте галочку щоб добавити в список <span style="color:#c95f5f">перевезень мікроавтобусом</span> максисально 3 шт.</p>
        <input type="checkbox" id="microbus" name="microbus" ${data.microbus === 'true' ? 'checked' : ''}>
        <p class="form_send" onclick="transfer.save('${this.transfer_param}', '${this.transfer_form}')">Добавити в базу</p>`
    }
    transfersList(data) {
        return `<div class="transfer" id="${data.transfer_id}">
            <p>${data.transfer_from} - ${data.transfer_to}</p>
            <span>
                <p class="sel${data.selection}">обрані</p>
                <p class="pr${data.privat}">приватні</p>
                <p class="micro${data.microbus}">мікроавтобус</p>
            </span>
            <i class='fas fa-ellipsis-h' onclick="transfer.show('transfer', 'menu', {}, '${data.transfer_id}')"></i>
        </div>`
    }

    //TIME
    timeField(data) {
        return `<p class="time_label">Відправлення 1</p>
        <input type="text" name="transfer" class="time" value="${data.value ? data.value : ''}" autocomplete="off" placeholder="Час перевезення..." onfocus="time.showWindow('transfer', 'Times', this)">
        <i class='fas fa-${data.timeAction ? data.timeAction : 'plus'}' onclick="time.plusTime(this, '${data.timeAction ? data.timeAction : 'plus'}')"></i>`
    }
    timeBody() {
        return `<div class="time_modal_wrap">
            <div>
                <i class='fas fa-angle-up' onclick="time.selectTime('hour', 'up')"></i>
                <p class="hours">00</p>
                <i class='fas fa-angle-down' onclick="time.selectTime('hour', 'down')"></i>
            </div>
            <p class="dvokrapka">:</p>
            <div>
                <i class='fas fa-angle-up' onclick="time.selectTime('minute', 'up')"></i>
                <p class="minutes">00</p>
                <i class='fas fa-angle-down' onclick="time.selectTime('minute', 'down')"></i>
            </div>
        </div>`
    }
    transferTimes() {
        return `<p>Вкажіть час</p>
        ${this.timeBody()}
        <p class="form_send admTime">Підтвердити</p>`
    }
    mainformTimes() {
        return `<p class="mainform_title"></p>
        ${this.timeBody()}
        <p class="main_form_send admTime"><i class='fas fa-check'></i></p>`
    }

    //NEWS
    newsSave(data) {
        return `<div id="load_cover"><img src="../img/loading.gif"></div>
        <p class="vilid_news" id="vilid_news"></p>
        <div class="main_info_wrap">
            <div class="main_foto">
                <div id="foto_load" style="background-image: ${data.foto ? data.foto : ''}">
                    <label for="news_foto" id="news_foto_label"></label>
                    <input type="file" name="news_foto" id="news_foto" accept=".jpg, .jpeg, .png, .bmp" onchange="news.validIMG(event)" hidden />
                </div>
                <button class="clear_cover" id="clear_cover" onclick="news.clearImg()">Очистити</button>
                <button class="remove_cover" id="remove_cover" onclick="news.removeImg()">Видалити</button>
            </div>
            <div class="main_info">
                <textarea name="news_title" id="news_title" maxlength="260" placeholder="Назва статті"
                    oninput="news.resizeTextarea(this, '60'), validation(this, 'Input', 'news')"
                    onkeydown="return (event.keyCode!=13);">${data.title ? data.title : ''}</textarea>
                <textarea name="news_description" id="news_description" maxlength="700" placeholder="Опис статті"
                    oninput="news.resizeTextarea(this, '100'), validation(this, 'Input', 'news')"
                    onkeydown="return (event.keyCode!=13);">${data.description ? data.description : ''}</textarea>
            </div>
        </div>
        <div class="news_create"><p>${data.create ? data.create : ''}</p><p>${data.update ? data.update : ''}</p></div>
        <div class="news_create"><p id="news_alias">${data.alias ? data.alias : ''}</p></div>
        <div id="editor">${data.article ? data.article : ''}</div>
        <button class="save_new" id="save_news" onclick="news.save('save')">Зберегти</button>
        <button class="save_new" id="save_close_news" onclick="news.save('saveclose')">Зберегти і закрити</button>`;
    }
    newsList(data) {
        return `<div class="news${data.target}">
            <div class="news_body${data.target}">
                <div class="news_foto${data.target}" ${data.open_btn}>
                    <img src="${data.cover}" />
                </div>
                <div class="news_info${data.target}">
                    <h4>${data.title}</h4>
                    ${data.description}
                    <a class="news_more" href="/blog/${data.alias}"><i class='fas fa-long-arrow-alt-right'></i></a>
                </div>
            </div>
            ${data.adm_btn}
        </div>`;
    };


    //FEEDBACK
    feedbackInfo(data) {
        const answer = (data.settings === 'true') ? `<p class="edit_menu" style="min-width: 200px; margin-top: 25px;" onclick="${data.module}.answer('${data.idfeedback}')">Відправити відповідь</p>` : '';
        return `<p class="feedback_info">${data.feedbackSurname + data.feedbackName}</p>
        <p class="feedback_info">${data.feedbackEmail}</p>
        <p class="feedback_info">${data.feedbackPhone}</p>
        <p class="feedback_info">${data.date_create}</p>
        <p class="feedback_mess">${data.feedbackComment}</p>
        <textarea name="feedback_answer" id="feedback_answer" autocomplete="nope" maxlength="300" placeholder="Введіть текст відповіді..." oninput="validation(this, 'Input', 'answer')">${data.answer}</textarea>
        ${answer}`;
    }

    //OTHER FUNCTIONS
    del(data) {
        const town_attentions = (data.module && data.module === 'town')
            ? '<p class="del_info" style="color:#991818;">Зверніть увагу, що після видалення міста також будуть недоступні маршрути з цим містом</p>' : '';
        return `<p class="del_info" style="color:#991818;">Підтвердіть видалення!</p>
        ${town_attentions}
        <p class="form_send" onclick="${data.module ? data.module : ''}.delete('${data.id ? data.id : ''}')">Видалити остаточно!</p>`
    }
    res(data) { return `<p class="res_mess">${data.message ? data.message : ''}</p>` }
    menu(data) {
        return `<p class="edit_menu" onclick="${data.module}.showWindow('${data.module}', 'Save', 'edit', '${data.id}')">Редагувати <i class='far fa-edit'></i></p>
        <p class="edit_menu" onclick="${data.module}.show('${data.module}', 'Del', {}, '${data.id}')">Видалити <i class='far fa-trash-alt'></i></p>`;
    }

    template(type, data) {
        // console.log('template type ', type);
        // console.log('template data ', data);

        const type_res = type.includes('menu') ? 'menu' : type;

        // console.log('template type after', type_res);

        return this[type_res](data);
    };
};

class ModalWindow extends Templates {
    constructor(){
        super();
        this.modal_place = $_('.modal_wrap')[0];
    }


    // news(type, data) {
    //     console.log('news type', type + data);
    //     return type + data
    // };

    closeWrap(event) {
        let valClose = true;
        for (let element of event.target.children) {
            if (element.classList && element.classList.contains('modal_place')) {
                valClose = false;
            };
        };
        if (!valClose) { this.modal_place.innerHTML = '' };
    };
    closeBtn() { this.modal_place.innerHTML = '' };
    closeSub() { $_('.wrap_sub_modal')[0].innerHTML = '' };



    show(module, type, data = {}, id) {
        const window_type = (type === "Del" || type === 'Res') ? type.toLowerCase() : module + type;

        console.log('window_type', window_type);
        // console.log('data show', data);

        data.module = module;
        id && (data.id = id);

        console.log('data show', data);

        const place = (['Towns', 'Times'].includes(type)) ? $_('.wrap_sub_modal')[0] : this.modal_place;
        const wrap_close_arr = ['townSave', 'transferSave', 'newsSave', 'transferTowns', 'transferTimes'];
        const wrap_close = wrap_close_arr.includes(window_type) ? '' : `onclick="${module}.closeWrap(event)"`;
        const no_close_btn = ['transferTowns', 'transferTimes'].includes(window_type) ? '' : `<i class="fa fa-times" onclick="${module}.closeBtn()"></i>`;
        place.innerHTML =  `<div class="modal_body" ${wrap_close}>
            <div class="modal_close">${no_close_btn}</div>
            <div class="modal_place" id="${window_type}" style="${window_type === "newsSave" ? 'max-width: 90%' : '' }">
                ${this.template(window_type, data)}
            </div>
            <div class="wrap_sub_modal"></div>
        </div>`;
    };
};

class Services {
    metods = {
        create: "POST",
        edit: "PUT",
    }
    language = 'uk';
    lang = {};

    constructor(){
    }

    async languagePack(lang) {
        return new Promise((resolve, reject) => {
            fetch(`./json/${lang}.json`)
            .then(response =>  response.json())
            .then(response => resolve(response))
        });
    }

    setLang = (lang) => {
        document.cookie = `lang=${lang}`;
        document.location.reload();
    }

    async getLang() {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + 'lang'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        this.language = matches ? decodeURIComponent(matches[1]).slice(0, 2) : 'uk';
    }

    async list(module, route, place = '') {
        return new Promise(async (resolve) => {
            return fetch(`/${module}/${route}`, { method: 'GET' })
            .then(response => response.status === 200 && response.json())
            .then(resultat => {
                if (resultat.res) {
                    const list = $_(`.${module === 'blog' ? 'news' : module}_list${place}`)[0];
                    if (list) {
                        list.innerHTML = '';
                        resultat.place = list;
                        return resolve(resultat);
                    };
                };
            });
        });
    }

    async open(id, module, that) {
        return new Promise(async (resolve) => {
            return fetch(`/${module}/open/${id}`, { method: 'GET' })
            .then(response => {
                if (response.status === 400) { throw new Error('Invalid') };
                if (response.status === 200) { return response.json() };
            })
            .then(resultat => { resultat.res && resolve(resultat.res[0]) })
            .catch(() => {
                this.showErrorMessage(module, that);
                setTimeout(() => {
                    that.closeBtn();
                    that.list();
                }, 3000);
            });
        });
    }

    delete(id, module, that) {
        const module_mess = {
            towns: 'Місто',
            transfers: 'Маршрут',
            blog: 'Новину',
        };
        fetch(`/${module}/delete/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.status === 400) { throw new Error('Invalid') };
            if (response.status === 200) { that.show(module === 'blog' ? 'news' : module, 'Res', { message: `${module_mess[module]} видалено!` }) };
        })
        .catch(() => { this.showErrorMessage(module, that) })
        .finally(() => {
            setTimeout(() => {
                that.closeBtn();
                that.list();
                (module === 'towns') && transfer.list();
            }, 3000)
        });
    }

    showErrorMessage(module, that) {
        that.show(module === 'blog' ? 'news' : module, 'Res', { message: '<span style="color:red;"> Виникла помилка. Спробуйте ще раз.</span>'});
    }
};


const service = new Services();
service.getLang();




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
    const sub_close = ['transferTowns'].includes(type) ? '' : 'onclick="closeModal(event)"';
    const sub_noclose = ['transferTowns'].includes(type) ? '' : '<i class="fa fa-times" onclick="closeModalX()"></i>';
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

    ['mainformFrom', 'mainformTo', 'mainformCalendar', 'orderInfo'].includes(type)
        ? modal.innerHTML = modalWindowWrap(type) : null;


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
            $_(`.towns_error`)[0].style.display = 'none';
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










//for send feedback

// const sendFeedback = () => {
//     checkFeedback();
//     const feedbackArr = {};
//     if (feedbackCalkTrue) {
//         feedbackArr.feedbackName = $_('#feedback_name')[0].value;
//         feedbackArr.feedbackSurname = $_('#feedback_surname')[0].value;
//         feedbackArr.feedbackEmail = $_('#feedback_email')[0].value;
//         feedbackArr.feedbackPhone = $_('#feedback_phone')[0].value;
//         feedbackArr.feedbackComment = $_('#feedback_comment')[0].value;
//         send(feedbackArr , `/feedback/feedback`, (result) => {
//             const resultat = JSON.parse(result);
//             if (resultat.res) {
//                 if (resultat.res === 'Feedback sended!') {
//                     if ($_('.feedback_name')[0]) {$_('.feedback_name')[0].value = ''};
//                     if ($_('.feedback_surname')[0]) {$_('.feedback_surname')[0].value = ''};
//                     if ($_('.feedback_email')[0]) {$_('.feedback_email')[0].value = ''};
//                     if ($_('#feedback_phone')[0]) {$_('#feedback_phone')[0].value = ''};
//                     $_('#feedback_comment')[0].value = '';
//                     $_(`.feedback_sended`)[0].classList.remove('hide_err');
//                     setTimeout(() => {
//                         $_(`.feedback_sended`)[0].classList.add('hide_err');
//                     }, 5000);
//                 };
//             };
//         }, "POST");
//     };
// };



class Feedback extends ModalWindow {
    number = 30;
    status = '';
    date = '3';

    constructor(){
        super()
    }

    setParam(el, param) {
        this[param] = el.value;
        this.list(1)
    }

    check() {
        const arrTrue = [];
        const arrInp = ['feedback_name', 'feedback_surname', 'feedback_email', 'feedback_phone', 'feedback_comment'];
        const message = $_(`.feedback_form_err`)[0];
        arrInp.forEach(element => {
            const elemCheck = $_(`#${element}`)[0];
            if (elemCheck.value === '') {
                arrTrue.push(false);
                elemCheck.classList.add('err_input');
            };
        });
        const emailCheck = $_('#feedback_email')[0];
        if (emailCheck.value !== '' && !validEmail(emailCheck.value)) {
            arrTrue.push(false);
            emailCheck.classList.add('err_input');
        };
        const phoneCheck = $_('#feedback_phone')[0];
        if (phoneCheck.value !== '' && !validPhone(phoneCheck.value)) {
            arrTrue.push(false);
            phoneCheck.classList.add('err_input');
        };
        console.log('rrrrrrrrrrrrrrrrrrr', arrTrue);
        if (arrTrue.includes(false)) {
            message.classList.remove('hide_err');
            return false
        } else {
            message.classList.add('hide_err');
            return true
        };
    }

    data() {
        const feedbackArr = {};
        feedbackArr.feedbackName = $_('#feedback_name')[0].value;
        feedbackArr.feedbackSurname = $_('#feedback_surname')[0].value;
        feedbackArr.feedbackEmail = $_('#feedback_email')[0].value;
        feedbackArr.feedbackPhone = $_('#feedback_phone')[0].value;
        feedbackArr.feedbackComment = $_('#feedback_comment')[0].value;
        return feedbackArr;
    }

    send() {
        if (this.check()) {
            const data = this.data();
            fetch(`/feedback/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(data)
            })
            .then(response => response.status === 200 && response.json())
            .then(resultat => {
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
            });
        };
    }

    async showWindow(module, type, param, id){
        const data = await this.open(id);
        this.show(module, type, data);
    }

    async open(id) {
        return await service.open(id, 'feedback', this);
    }

    answer(id) {
        const answer = $_('#feedback_answer')[0].value;
        fetch(`/feedback/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ id, answer })
        })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            if (!resultat) { throw new Error() };
            resultat.res && this.show('feedback', 'Res', { message: 'Зміни внесено!' })
        })
        .catch(() => { this.show('feedback', 'Res', { message: '<span style="color:red;">Сталася помилка, спробуйте ще раз!</span>' }) })
        .finally(() => {
            setTimeout(() => {
                this.closeBtn();
                this.list()
            }, 2000)
        });
    }

    list(page = 1) {
        let param = [];
        param.push({"status": `${['answer', 'noanswer'].includes(this.status) ? this.status : ''}`});
        param.push({"date": `${['3', '6', '12', ''].includes(this.date) ? this.date : ''}`});
        fetch(`/feedback/list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({page, param, 'numb' : this.number} )
        })
        .then(response => response.status === 200 && response.json())
        .then(async resultat => {
            if (resultat.res) {
                const list_wrap = $_('.feedback_list')[0];
                const pagination_wrap = $_('.feedback_pagination')[0];
                const pages = pagination_wrap.children;
                const pages_count = Math.ceil(resultat.res.count / this.number);
                list_wrap.innerHTML = '';
                pagination_wrap.innerHTML = '';
                if (pages_count > 1) {
                    for (let i = 1; i <= pages_count; i++) { pagination_wrap.innerHTML += `<p onclick="feedback.list(${i})">${i}</p>` };
                    pages[page-1].style.color = '#fff';
                    pages[page-1].style.backgroundColor = 'rgb(139 195 74)';
                    pages[page-1].removeAttribute("onclick");
                };
                resultat.res.list.forEach(el => {
                    const settings =  (el.settings === 'true') ? `<i class='fas fa-edit' onclick="feedback.showWindow('feedback', 'Info', '', '${el.idfeedback}')"></i>` : '';
                    const answer = (el.status === 'answer') ? `<p class="f_answer"><span>${service.lang['answer']}: </span> ${el.answer}</p>` : '';
                    const answerdate = (el.status === 'answer') ? `<p class="f_answer_date">${service.lang['date']}: ${el.date_answer}</p>` : '';
                    list_wrap.innerHTML += `
                    <div class="feedback user${el.settings}">
                        <p>${el.feedbackComment}</p>
                        <p class="f_date">${service.lang['date']}: ${el.date_create}</p>
                        ${answer}
                        ${answerdate}
                        ${settings}
                    </div>`
                });
            };
        });
    };
}

class Towns extends ModalWindow {
    town_token = '';
    town_id_place = '';
    town_id = '';
    town_form = '';
    town_param = '';
    constructor(){ super() }

    async showWindow(module, type, param, id){
        let data = {};
        this.town_form = module + type;
        this.town_param = param;
        this.town_token = generate_token(6);
        if (param === 'edit' ) {
            data = await this.open(id);
            this.town_id = data.town_id;
        };
        this.show(module, 'Save', data);
        this.town_id_place = $_('#id_town')[0];
    }

    async open(id) {
        return await service.open(id, 'towns', this);
    }

    townList(module, type, param) {
        fetch(`/towns/list`, { method: 'GET' })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            this.show(module, type);
            const tawns_list = $_('.towns_select_list')[0];
            tawns_list.innerHTML = '';
            resultat.res.forEach(element => {
                tawns_list.innerHTML += `<p id="${element.town_id}" onclick="town.select(this, '${param}')">${element.name_uk}</p>`
            });
        });
    }

    select(el, field) {
        console.log('elelelelelelelel', el);
        console.log('paramparamparam', field);

        transfer.labels.dup.style.display = 'none';
        transfer.labels.empty.style.display = 'none';
        transfer.labels.is.style.display = 'none';

        // $_('.wrap_sub_modal')[0].innerHTML = '';
        transfer.fields.modal.innerHTML = '';
        const place = transfer.fields[`${field}`];

        console.log('place', place);


        place.value = el.innerHTML;
        place.setAttribute('data-input', `${el.id}`);

        const to = transfer.fields.to.getAttribute("data-input");
        const from = transfer.fields.from.getAttribute("data-input");

        console.log('inputPlaceTOfffffff', transfer.fields.to);
        console.log('inputPlacefromfffff', transfer.fields.from);

        console.log('inputPlaceTO', to);
        console.log('inputPlaceFROM', from);

        // console.log('inputPlaceTO', $_(`#transferSave`)[0]);
        // console.log('inputPlaceFROM', $_(`#transferSave > #from`)[0]);

        if (from === to) {
            transfer.labels.dup.style.display = 'block';
        };
    }

    creatingTownID(element) {
        const id = `${transliterate(element.value).replace( /[^a-zA-ZiIіІ]/g, "" )}_${this.town_token}`;
        this.town_id_place.innerHTML = id;
        this.town_id = id;
    };

    notEmpty(form) {
        const valid = [];
        ["uk", "en", "ru"].forEach(element => {
            const field = $_(`#${form} > #${element}`)[0];
            if (field.value === '' || field.value === undefined) {
                $_(`.town_empty_${element}`)[0].style.display = 'block';
                valid.push(false);
            };
        });
        return (!valid.includes(false)) ? true : false;
    }

    data(form) {
        const uk = $_(`#${form} > #uk`)[0].value.replace(RegExpArr.RegExpInput , "");
        const en = $_(`#${form} > #en`)[0].value.replace(RegExpArr.RegExpInput , "");
        const ru = $_(`#${form} > #ru`)[0].value.replace(RegExpArr.RegExpInput , "");
        return {"id" : this.town_id, "uk" : uk, "en" : en, "ru" : ru};
    }

    save(param, form) {
        if (this.notEmpty(form)) {
            fetch(`/towns/${param}`, {
                method: service.metods[param],
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(this.data(form)) })
            .then(response => response.status === 200 && response.json())
            .then(resultat => {
                console.log('resultat', resultat);
                if (!resultat) { throw new Error() };
                if (resultat.res) {
                    this.show('town', 'Res', {
                        id: this.town_id,
                        message: param === 'create' ? 'Місто додано до списку!' : 'Зміни внесено!'}
                    );
                    setTimeout(() => {
                        this.closeBtn();
                        this.list()
                        transfer.list()
                    }, 2000);
                };
                if (resultat.DUP) {
                    for (const key in body) {
                        if (Object.hasOwnProperty.call(body, key)) {
                            if (body[key] === resultat.DUP) {
                                $_(`.town_dup_${key}`)[0].style.display = 'block';
                            };
                        };
                    };
                };
            })
            .catch(() => {
                $_(`.towns_error`)[0].style.display = 'block';
            });
        };
    }

    async list() {
        const result = await service.list('towns', 'list');
        result.res.forEach(data => {
            result.place.innerHTML += `${this.template('townsList', data)}`;
        });
    }

    delete(id) {
        service.delete(id, 'towns', this)
    }
}

class Transfers extends ModalWindow {
    transfer_id = '';
    transfer_form = '';
    transfer_param = '';
    fields = {};
    labels = {};

    constructor(){
        super()
    }

    savePosition() {
        const sortWrap = $_('#sortable')[0].children, sortArr = {};
        for (var i = 0; i < sortWrap.length; ++i) {
            sortArr[`${sortWrap[i].id}`] = `${i+1}${token(4)}`;
        };
        fetch(`/transfers/saveposition`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(sortArr) })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            if (resultat.res) {
                $_('#save_position')[0].style.display = 'none';
                this.list();
            };
        });
    }

    setFields(form) {
        this.fields.from = $_(`#from`, form)[0];
        this.fields.to = $_(`#to`, form)[0];
        this.fields.gr = $_(`#gr`, form)[0];
        this.fields.pr = $_(`#pr`, form)[0];
        this.fields.selection = $_(`#selection`, form)[0];
        this.fields.privat = $_(`#privat`, form)[0];
        this.fields.microbus = $_(`#microbus`, form)[0];
        this.fields.time = $_('.time', form)[0];
        this.fields.modal = $_('.wrap_sub_modal')[0];
        this.labels.dup = $_(`.transfer_dup_to`, form)[0];
        this.labels.empty = $_(`.transfer_empty_to`, form)[0];
        this.labels.is = $_(`.transfer_duplicated`, form)[0];
        this.labels.price_gr = $_(`.transfer_price_gr`, form)[0];
        this.labels.price_pr = $_(`.transfer_price_pr`, form)[0];
        this.labels.price_empt = $_(`.transfer_price_empt`, form)[0];
    }

    async showWindow(module, type, param, id){
        let data = {};
        this.transfer_form = module + type;
        this.transfer_param = param;
        this.transfer_id = generate_token(6);
        if (param === 'edit' ) {
            data = await this.open(id);
            this.transfer_id = data.transfer_id;
        };
        this.show(module, 'Save', data);
        this.setFields($_(`#${module + type}`)[0]);
        if (param === 'edit' ) {
            const timeList = [];
            for (let i = 0; i < 10; i++) { if (data[`time${i + 1}`] !== '') { timeList.push(data[`time${i + 1}`])}};
            if (timeList.length > 0) {
                const transferBody = $_('.add_time')[0];
                transferBody.style.display = 'block';
                transferBody.innerHTML = '';
                for (let i = 0; i < timeList.length; i++) {
                    let timeAction = 'minus';
                    if (i === timeList.length - 1) { timeAction = 'plus' };
                    const plusTransBody = document.createElement("div");
                    plusTransBody.setAttribute('class', 'add');
                    plusTransBody.innerHTML = this.template('timeField', {timeAction, value: timeList[i]});
                    transferBody.appendChild(plusTransBody);
                };
            };
        };
    }

    notEmpty(form) {
        const {from, to, gr, pr} = this.data(form);
        if (from && to && from !== '' && to !== '') {
            if (from === to) {
                this.labels.dup.style.display = 'block';
                return false;
            } else {
                if ((gr !== '' || pr !== '')) {
                    if (gr !== '' && (gr >= 1 && gr <= 50000) && pr === '') { return true;
                    } else {
                        if (pr !== '' &&  (pr >= 1 && pr <= 50000) && gr === '') { return true;
                        } else {
                            if ((pr !== '' &&  (pr >= 1 && pr <= 50000)) && (gr !== '' && (gr >= 1 && gr <= 50000))) { return true;
                            } else {
                                this.labels.price_empt.style.display = 'block';
                                return false;
                            };
                        };
                    };
                } else {
                    this.labels.price_empt.style.display = 'block';
                    return false;
                };
            };
        } else {
            this.labels.empty.style.display = 'block';
            return false;
        };
    }

    data(form) {
        return {
            "id" : this.transfer_id,
            "from" : this.fields.from.getAttribute("data-input"),
            "to" : this.fields.to.getAttribute("data-input"),
            "gr" : this.fields.gr.value,
            "pr" : this.fields.pr.value,
            "select" : this.fields.selection.checked,
            "privat" : this.fields.privat.checked,
            "microbus" : this.fields.microbus.checked,
            "times" : [...$_('.time')].map((el) => el.value !== '' && el.value).filter((el) => el !== false),
            "param" : form
        };
    }

    save(param, form) {
        if (this.notEmpty(form)) {
            fetch(`/transfers/${param}`, {
                method: service.metods[param],
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(this.data(form)) })
            .then(response => response.status === 200 && response.json())
            .then(resultat => {
                if (!resultat) { throw new Error() };
                if (resultat.res) {
                    this.show('transfer', 'Res', {message: param === 'create' ? 'Маршрут додано!' : 'Зміни до маршруту внесено!'});
                    setTimeout(() => {
                        this.closeBtn();
                        this.list()
                    }, 2000);
                };
                if (resultat.DUP) {
                    this.labels.is.style.display = 'block';
                };
            })
            .catch(() => {
                $_(`.transfer_error`)[0].style.display = 'block';
            });
        };
    }

    async list() {
        const result = await service.list('transfers', 'list');
        result.res.forEach(data => {
            result.place.innerHTML += `${this.template('transfersList', data)}`;
        });
    }

    async open(id) {
        return await service.open(id, 'transfers', this)
    }

    delete(id) {
        service.delete(id, 'transfers', this)
    }
}

class News extends ModalWindow {
    news_status = '';
    news_token = '';
    news_foto = '';
    temp_foto = '';

    constructor(){
        super()
    }

    async showWindow(module, type, param, id){
        let data = {};
        this.news_status = param;
        this.news_token = param === 'edit' ? id : generate_token(6);
        if (param === 'edit' ) {
            this.news_status = 'edit';
            data = await this.open(this.news_token);
        };
        this.show(module, type, data);
        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'align': [] }],
            ['image'],
            ['link'],
            ['clean']
        ];
        new Quill('#editor', {
            modules: { toolbar: toolbarOptions },
            theme: 'snow'
        });
        $_('#news_foto')[0].addEventListener("change", async (event) => {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onloadend = () => {
                this.temp_foto = this.news_foto === "" ? this.temp_foto : this.news_foto;
                $_('#foto_load')[0].style.backgroundImage = `url(${reader.result})`;
                this.news_foto = reader.result;
            };
            if(file){
                reader.readAsDataURL(file);
            };
        });
        this.resizeTextarea($_('#news_title')[0], '60')
        this.resizeTextarea($_('#news_description')[0], '100');
        if (param === 'edit' ) {
            const editor = $_('.ql-editor')[0];
            editor.innerHTML = '';
            [...data.article].forEach(element => {
                editor.innerHTML += element;
            });
        };
    }

    resizeTextarea(el, h) {
        el.style.height = "";
        el.style.height = el.scrollHeight + "px";
        el.style.overflow = (el.scrollHeight > +h) ? 'auto' : 'hidden';
    }

    message(text = '', classs = 'mmm') {
        const news_vilid = $_('#vilid_news')[0];
        if (news_vilid) {
            news_vilid.innerHTML = text;
            news_vilid.classList.remove('vilid_news_bad');
            news_vilid.classList.remove('vilid_news_good');
            news_vilid.classList.add(classs);
        };
    }

    clearImg() {
        $_('#news_foto')[0].type = "text";
        $_('#news_foto')[0].type = "file";
        this.news_foto = this.temp_foto;
        $_('#foto_load')[0].style.backgroundImage = (this.temp_foto.length < 5)
            ? `url(/img/nofoto.png)`
            : `url(/img/news/${this.news_token}/${this.news_foto}_cover_resized_footer.jpg)`;
    }

    removeImg() {
        $_('#foto_load')[0].style.backgroundImage = `url(/img/nofoto.png)`;
        $_('#news_foto')[0].type = "text";
        $_('#news_foto')[0].type = "file";
        this.news_foto = "";
    }

    validIMG(event) {
        const files = event.target.files;
        if (!['image/jpg', 'image/jpeg', 'image/png', 'image/bmp'].includes(files[0].type)) {
            this.message(`Недоступний формат. Доступними є: jpg, jpeg, png`, 'vilid_news_bad');
            $_('#news_foto')[0].value = '';
        } else {
            if (files[0].size > 5000000) {
                this.message(`Надто великий розмір. Максимально 5Mb`, 'vilid_news_bad');
                $_('#news_foto')[0].value = '';
            } else {
                this.message('');
            };
        };
    }

    async createGallery(img_base64, formData) {
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
    }

    async notEmpty(fields) {
        const valid = [], fields_names = [], names = [' НАЗВА', ' ОПИС'];
        [...fields].forEach((element, index) => {
            if (element === '' || element === undefined) {
                valid.push(false);
                fields_names.push(names[index]);
            };
        });
        const trueSendNews = (!valid.includes(false)) ? true : false;
        this.message(!trueSendNews ? `<span>Поля є обовяковими: ${fields_names} </span>` : '', 'vilid_news_bad');
        return trueSendNews;
    }

    async save(param) {
        const save_cover = $_('#load_cover')[0];
        const news_title = $_('#news_title')[0].value;
        const news_description = $_('#news_description')[0].value;
        const news_editor = $_('.ql-editor')[0].children;
        const validating_fields = [news_title, news_description];
        // console.log('news_save_status', param);
        // console.log('news_status', this.news_status);
        // console.log('news_token', this.news_token);
        // console.log('news_title', news_title);
        // console.log('news_description', news_description);
        // console.log('news_foto', this.news_foto);
        // console.log('news_editor', news_editor);
        if (await this.notEmpty(validating_fields)) {
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
            const cover_name = (!this.news_foto.includes('base64')) ? this.news_foto : generate_token(6);
            let formData = new FormData();
            const obj = {
                token: this.news_token,
                title: news_title,
                description: news_description,
                cover: cover_name,
                article: article,
                gallery: Object.keys(img_base64),
                httpnames: img_https_names
            };
            formData.append("obj", JSON.stringify(obj));
            formData.append("token", this.news_token);
            if (this.news_foto && this.news_foto.includes('base64')) {
                const base64Cover = await fetch(`${this.news_foto}`);
                formData.append("cover", await base64Cover.blob(), `${cover_name}_cover.jpg`);
            };
            await this.createGallery(img_base64, formData);
            fetch(`/blog/${this.news_status}`, {
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
                this.closeBtn();
                (param === 'save')
                    ? this.showWindow('news', 'Save', 'edit', this.news_token)
                    : (this.show('news', 'Res', { message: 'Новину збережено!'}), setTimeout(() => {
                        this.closeBtn();
                        this.list();
                    }, 3000));
            })
            .finally(() => {
                save_cover.style.display = 'none';
            })
            .catch(error => {
                this.message(`<span>Виникла помилка під час збереження статті. Спробуйте зберегти ще раз.</span>`, 'vilid_news_bad');
                [...img_arr].forEach(function(element) {
                    const img_keys = Object.keys(img_base64);
                    const original_img = element.src.split('/')[element.src.split('/').length -1].replace("/", "");
                    if (img_keys.includes(original_img)) {
                        element.src = img_base64[original_img];
                    };
                });
                this.list();
                this.news_status = this.news_status === 'create' ? this.news_status : 'edit';
                console.log(error);
            });
        };
    };

    async open(id) {
        return await service.open(id, 'blog', this)
        .then((resultat) => {
            const data = {};
            this.news_foto = resultat.cover;
            const port = (window.location.hostname.includes('127.0.0.1')) ? ":8054" : "";
            const alias = `
                <a href="/blog/${resultat.alias}"
                    title="Створюється автоматично із назви статті!"
                    target="_blank">
                    ${window.location.hostname}${port}/blog/${resultat.alias}
                </a>`;
            data.news_foto = this.news_foto,
            data.article = resultat.article.split("\n"),
            data.alias = alias,
            data.title = resultat.title,
            data.description = resultat.description,
            data.create = `Створено: <span>${resultat.date_create}</span>`;
            if (this.news_foto !== '') {
                this.temp_foto = this.news_foto;
                data.foto = `url(/img/news/${this.news_token}/${this.news_foto}_cover_resized_footer.jpg)`;
            };
            if (resultat.date_update !== '') {
                data.update = `Оновлено: <span>${resultat.date_update}</span>`;
            };
            return data;
        })
    }

    async list(count = '1000', target = '_admin') {
        const result = await service.list('blog', `list/${count}`, target);
        result.res.forEach(element => {
            const data = {};
            data.target = target;
            data.title = element.title;
            data.alias = element.alias;
            data.open_btn = target === '_footer' ? `onclick="window.open('/blog/${element.alias}')"` : '';
            data.cover = element.cover !== '' ? `/img/news/${element.id_blog}/${element.cover}_cover_resized${target}.jpg`: '/img/nofoto.png';
            data.description = target !== '_footer' ? `<p style="font-size:12px;">${element.description}</p>` : '';
            data.adm_btn = target === '_admin' ? `
                <i class='fas fa-ellipsis-h' onclick='news.show("news", "menu", {}, "${element.id_blog}")'></i>
                <i class="fa fa-share" onclick="window.open('/blog/${element.alias}')"></i>` : '';
            result.place.innerHTML += `${this.template('newsList', data)}`;
        });
    }

    delete(id) {
        service.delete(id, 'blog', this)
    }
};

class Time extends ModalWindow{
    arrow = '';
    minutes = '';
    hArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    mArr = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
    hStart = 0;
    mStart = 0;
    time_place = '';

    constructor(){
        super()
    }

    showWindow(module, type, el){
        this.hStart = 0;
        this.mStart = 0;
        this.show(module, type);
        this.hours = $_('.hours')[0];
        this.minutes = $_('.minutes')[0];
        $_('.admTime')[0].addEventListener('click', () => {
            el.value = `${this.hours.innerHTML}:${this.minutes.innerHTML}`;
            this.closeSub();
            // mainTimeInput.classList.remove('err_input');
            // checkForm();
        });
    }

    selectTime(type, arrow) {
        if (type === 'hour') {
            if (arrow === 'up') {
                this.hStart++
                if (this.hStart === 24) {this.hStart = 0}
                this.hours.innerHTML = this.hArr[this.hStart];
            };
            if (arrow === 'down') {
                this.hStart--
                if (this.hStart === -1) {this.hStart = 23}
                this.hours.innerHTML = this.hArr[this.hStart];
            };
        };
        if (type === 'minute') {
            if (arrow === 'up') {
                this.mStart++
                if (this.mStart === 13) {this.mStart = 0}
                this.minutes.innerHTML = this.mArr[this.mStart];
            };
            if (arrow === 'down') {
                this.mStart--
                if (this.mStart === -1) {this.mStart = 12}
                this.minutes.innerHTML = this.mArr[this.mStart];
            };
        };
    }

    showTimeList(el) {
        $_('.add_time')[0].style.display = el.value === '' ? 'none' : 'table';
    }

    plusTime(element, type) {
        const transferBody = $_('.add_time')[0];
        const transferBodyChild = transferBody.children;
        const plusTransBody = document.createElement("div");
        plusTransBody.setAttribute('class', 'add');
        plusTransBody.innerHTML = this.template('timeField', {});
        class classLists { constructor(){}
            style(element, first, second){
                element.classList.replace(`fa-${first}`, `fa-${second}`);
                element.setAttribute('onclick', `time.plusTime(this, '${second}')`);
            };
        };
        const classStyle = new classLists();
        if (type === 'plus') {
            classStyle.style(element, 'plus', 'minus');
            if (transferBodyChild.length < 10) { transferBody.appendChild(plusTransBody) };
            if (transferBodyChild.length === 10) { classStyle.style(transferBodyChild[transferBodyChild.length - 1].children[2], 'plus', 'minus') };
        };
        if (type === 'minus') {
            element.parentNode.remove();
            if (transferBodyChild.length < 10) { classStyle.style(transferBodyChild[transferBodyChild.length - 1].children[2], 'minus', 'plus') };
        };
        const timeLabels = $_('.time_label');
        for (const [index, iterator] of timeLabels.entries()) {
            timeLabels[index].innerHTML = `Відправлення ${index + 1}`;
        };
    }

    setTime(value) {
        mainTimeInput.value = value;
        modal.innerHTML = '';
        mainTimeInput.classList.remove('err_input');
        checkForm();
    }




};

const feedback = new Feedback();
const time = new Time();
const town = new Towns();
const transfer = new Transfers();
const news = new News();