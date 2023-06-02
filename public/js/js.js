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
    townTown() {
        return `<p class="mainform_title"></p>
        <div class="towns_select_list"></div>`
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
    timeTime() {
        return `<p class="mainform_title"></p>
        ${this.timeBody()}
        <p class="main_form_send admTime"><i class='fas fa-check'></i></p>`
    }
    timeTimelimit() {
        return `<p class="mainform_title"></p>
        <div class="towns_select_list"></div>`
    }

    //CALENDAR
    calendarCalendar() {
        return `<p class="mainform_title"></p>
        <div class="calendar_wrap">
            <div class="container">
                <div class="calendar">
                    <div class="year">
                        <i class="fas fa-angle-left prev_year"></i>
                        <div class="date_year">
                            <h1></h1>
                        </div>
                        <i class="fas fa-angle-right next_year"></i>
                    </div>
                    <div class="month">
                        <i class="fas fa-angle-left prev"></i>
                        <div class="date">
                            <h1></h1>
                        </div>
                        <i class="fas fa-angle-right next"></i>
                    </div>
                    <div class="weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div class="days"></div>
                </div>
            </div>
        </div>`
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

    //ORDER
    orderInfo(data) {
        const settings = (data.settings === 'true') ? `
            <p class="edit_menu" style="min-width: 200px; margin-top: 25px;" onclick="order.proof('${data.orders}', 'proof')">Підтвердити замовлення <i class='fas fa-check-double'></i></p>
            <p class="edit_menu" style="min-width: 200px; margin-bottom: 20px;" onclick="order.proof('${data.orders}', 'del')">Скасувати замовлення <i class='fas fa-times'></i></p>` : "";
        return `
            ${data.transfer_notexist ? '<p class="order_info block" style="color: #dd0a0a; font-weight: bold; background: #ffc6c6;">Маршрут недоступний!</p>' : ""}
            <p class="order_info title_order">
            ${data.order_from} ${data.order_from_origin && data.order_from_origin !== data.order_from ? '<span>(' + data.order_from_origin + ')</span>' : ''}
            - ${data.order_to}  ${data.order_to_origin && data.order_to_origin !== data.order_to ? '<span>(' + data.order_to_origin + ')</span>' : ''} </p>
            <p class="order_info name" style="border-radius: 5px 5px 0px 0px;"><span>${data.user_name}</span> - <span>${data.user_surname}</span></p>
            <p class="order_info name" style="border-radius: 0px; border-top: 1px solid #e1e1e1; border-bottom: 1px solid #e1e1e1;"><span>${data.user_email}</span></p>
            <p class="order_info name" style="border-radius: 0px 0px 5px 5px; margin-bottom: 7px;"><span>${data.user_tel}</span></p>
            <p class="order_info block">${service.lang[`date`]} - <span>${data.date}</span> &nbsp ${service.lang[`time`]} - <span>${data.time}</span></p>
            <p class="order_info block">${service.lang[`adult`]} - <span>${data.adult}</span> &nbsp ${service.lang[`children`]} - <span>${data.children}</span></p>
            <p class="order_info block">${service.lang[`equip`]} - <span>${service.lang[data.equip]}</span> &nbsp ${service.lang[`equip_child`]} - <span>${data.equip_child}</span></p>
            <p class="order_info block">${service.lang[`sum`]} - <span>${data.sum}</span> ${service.lang[`sum_type`]} &nbsp <span>${service.lang[`transfer_${data.type}`]}</span></p>
            <p class="order_info block">${service.lang[`bookdate`]} - <span>${data.book_date}</span></p>
            <p class="order_info block">${service.lang[`paid`]} - <span class="${data.paid}">${service.lang[`${data.paid}`]}</span></p>
            <p class="order_info block">${service.lang[`status`]} - <span class="${data.status}">${service.lang[`${data.status}`]}</span></p>
            ${settings}`;
    };

    //OTHER FUNCTIONS
    del(data) {
        const town_attentions = (data.module && data.module === 'town')
            ? '<p class="del_info" style="color:#991818;">Зверніть увагу, що після видалення міста також будуть недоступні маршрути з цим містом</p>' : '';
        return `<p class="del_info" style="color:#991818;">Підтвердіть видалення!</p>
        ${town_attentions}
        <p class="form_send" onclick="${data.module ? data.module : ''}.delete('${data.id ? data.id : ''}')">Видалити остаточно!</p>`
    }

    res(data) {
        return `<p class="res_mess">${data.message ? data.message : ''}</p>`
    }

    menu(data) {
        return `<p class="edit_menu" onclick="${data.module}.showWindow('${data.module}', 'Save', 'edit', '${data.id}')">Редагувати <i class='far fa-edit'></i></p>
        <p class="edit_menu" onclick="${data.module}.show('${data.module}', 'Del', {}, '${data.id}')">Видалити <i class='far fa-trash-alt'></i></p>`;
    }

    template(type, data) {
        const type_res = type.includes('menu') ? 'menu' : type;
        return this[type_res](data);
    };
};

class ModalWindow extends Templates {
    constructor(){
        super();
        this.modal_place = service.$('.modal_wrap')[0];
    }

    closeBtn() { this.modal_place.innerHTML = '' };
    closeSub() { service.$('.wrap_sub_modal')[0].innerHTML = '' };
    closeWrap(event) {
        let valClose = true;
        for (let element of event.target.children) {
            if (element.classList && element.classList.contains('modal_place')) {
                valClose = false;
            };
        };
        if (!valClose) { this.modal_place.innerHTML = '' };
    }

    show(module, type, data = {}, id) {
        const window_type = (type === "Del" || type === 'Res') ? type.toLowerCase() : module + type;
        data.module = module;
        id && (data.id = id);
        const place = (['Towns', 'Times'].includes(type)) ? service.$('.wrap_sub_modal')[0] : this.modal_place;
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

    constructor(){}

    $(value, parent = document) {return parent.querySelectorAll(value)};

    transliterate(word) {
        const a = {
            "Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z",
            "Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh",
            "щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O",
            "Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o",
            "л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'",
            "Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
        return word.split('').map((char) => a[char] || char ).join("");
    };

    tabs(tab) {
        tab = (tab === 'null' || tab === undefined) ? 0 : tab;
        const tabs = service.$('.tabs > p');
        const bodys = service.$('.tab_bodys > .body');
        tabs.forEach(element => { element.classList.remove('tab_active') });
        bodys.forEach(element => { element.classList.remove('body_active') });
        localStorage.setItem("tab", tab);
        tabs[tab].classList.add('tab_active');
        bodys[tab].classList.add('body_active');
    }

    slider(el) {
        const active = el.classList.contains('active_sl');
        service.$('.slider > p').forEach(element => { element.classList.remove('active_sl') });
        active ? null : el.classList.toggle('active_sl');
    };

    token(length, type = 'string') {
        let res = '';
        const array = (type === 'number') ? '123456789' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        for ( var i = 0; i < length; i++ ) {res += array.charAt(Math.floor(Math.random() * array.length))}
        return res;
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
                    const list = service.$(`.${module === 'blog' ? 'news' : module}_list${place}`)[0];
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

class HorizontalSliders {
    touchstart = 0;
    touchend = 0;
    startSwipe = 0;
    body = service.$('body')[0];

    options() {
        let item = 3
        if (options_sl.body.offsetWidth > 768 && options_sl.body.offsetWidth < 1100) { item = 2 };
        if (options_sl.body.offsetWidth <= 768) { item = 1 };
        const wrapSize = service.$('.options_container')[0].offsetWidth;
        service.$('.options_wrap > .blok').forEach(
            element => { element.style.width = `${wrapSize / item}px`;
        });
    };

    // optionsLeft() {
    //     const wrap = service.$('.options_wrap')[0];
    //     const boxW = wrap.children[0].offsetWidth;
    //     const firstChild = wrap.children[0];

    //     wrap.insertBefore(firstChild, wrap.firstChild);
    //     wrap.style.cssText  = `transition:.2s;transform:translateX(${-boxW}px)`;
    //     setTimeout(() => {
    //         wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
    //         wrap.appendChild(firstChild);
    //     }, 100);
    // }

    // optionsRight() {
    //     const wrap = service.$('.options_wrap')[0];
    //     const boxW = wrap.children[0].offsetWidth;
    //     const lastChild = wrap.children[wrap.children.length - 1];

    //     wrap.appendChild(lastChild);
    //     wrap.style.cssText  = `transition:.2s;transform:translateX(${+boxW}px)`;
    //     setTimeout(() => {
    //         wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
    //         wrap.insertBefore(lastChild, wrap.firstChild);
    //     }, 100);
    // }

    optionsMove(direction) {
        const wrap = service.$('.options_wrap')[0];
        const boxW = wrap.children[0].offsetWidth;
        const child = (direction === 'left') ? wrap.children[0] : wrap.children[wrap.children.length - 1];
        (direction === 'left') ? wrap.insertBefore(child, wrap.firstChild) : wrap.appendChild(child);
        wrap.style.cssText  = `transition:.2s;transform:translateX(${(direction === 'left') ? '-' : '+'}${boxW}px)`;
        setTimeout(() => {
            wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
            (direction === 'left') ?  wrap.appendChild(child) : wrap.insertBefore(child, wrap.firstChild);
        }, 100);
    }

    optionsLeft() {
        options_sl.optionsMove('left')
    }

    optionsRight() {
        options_sl.optionsMove('right')
    }



    optionSlider() {
        const lenght_swipe = options_sl.touchend - options_sl.touchstart;
        if (lenght_swipe < -40) { (options_sl.touchend < options_sl.touchstart) && this.optionsLeft() };
        if (lenght_swipe > 40) { (options_sl.touchend > options_sl.touchstart) && this.optionsRight() };
    }

    feedback() {
        service.$('.feedback_wrap > .feedback_block').forEach(element => {
            element.style.minWidth = `${service.$('.feedback_container')[0].offsetWidth}px`;
        });
    }

    feedbackPosition(i) {
        service.$('.feedback_wrap')[0].style.transform = `translateX(-${i}00%)`;
        service.$('.feedback_points > p').forEach(element => {
            element.style.backgroundColor = 'rgb(141, 141, 141)';
        });
        service.$('.feedback_points > p')[i].style.backgroundColor = '#ee9e07';
    }

    feedbackCount() {
        service.$('.feedback_points')[0].innerHTML = '';
        for (let i = 0; i < service.$('.feedback_wrap > .feedback_block').length; i++) {
            service.$('.feedback_points')[0].innerHTML += `<p onclick="feedback_sl.feedbackPosition(${i})"></p>`;
        };
        service.$('.feedback_points > p')[0].style.backgroundColor = '#ee9e07';
    }

    slideFeed() {
        if (feedback_sl.touchend > feedback_sl.touchstart) {
            if (this.startSwipe > 0) {
                this.startSwipe--
                this.feedbackPosition(this.startSwipe);
            };
        };
        if (feedback_sl.touchend < feedback_sl.touchstart) {
            const swipe_langht = service.$('.feedback_points > p').length;
            if (this.startSwipe < swipe_langht-1) {
                this.startSwipe++
                this.feedbackPosition(this.startSwipe);
            };
        };
    }
}

class Static {
    townsFrom = [];
    townsTo = [];
    transfersArr = [];
    body = service.$('body')[0];
    mobileMenu = service.$('.menu_container_wrap_mobile')[0];
    mobileMenuContact = service.$('.mobile_menu_contacts')[0];

    showContainers() {
        const header_node = service.$('.header')[0];
        const content_cont = service.$('.content_container')[0];
        const option_cont = service.$('.options_container')[0];
        const call_cont = service.$('.call_container')[0];
        if (content_cont !== undefined && option_cont !== undefined && call_cont !== undefined) {
            let heightBlok, heightBlok2, heightBlok3;
            if (this.body.offsetWidth > 1280) {
                heightBlok = header_node.offsetHeight + content_cont.offsetHeight;
                heightBlok2 = header_node.offsetHeight + content_cont.offsetHeight + (option_cont.offsetHeight / 1.5);
                heightBlok3 = header_node.offsetHeight + content_cont.offsetHeight + option_cont.offsetHeight + (call_cont.offsetHeight / 1.5);
                (document.documentElement.scrollTop + window.screen.height > heightBlok)
                    ? content_cont.style.opacity = '1'
                    : content_cont.style.opacity = '0';
                (document.documentElement.scrollTop + window.screen.height > heightBlok2)
                    ? option_cont.style.opacity = '1'
                    : option_cont.style.opacity = '0';
                (document.documentElement.scrollTop + window.screen.height > heightBlok3)
                    ? call_cont.style.opacity = '1'
                    : call_cont.style.opacity = '0';
            } else {
                content_cont.style.opacity = '1'
                option_cont.style.opacity = '1'
                call_cont.style.opacity = '1'
            };
        };
    };

    menuOnScroll() {
        const menu = service.$('.menu_container')[0];
        const social = service.$('.social_wrap')[0];
        const toTop = service.$('#toTop')[0];
        const socialValue = social !== undefined ? social.clientHeight : 0;
        toTop.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";
        if (this.body.offsetWidth > 1280) {
            (document.body.scrollTop > socialValue || document.documentElement.scrollTop > socialValue)
                ? menu.classList.add('menu_scroll')
                : menu.classList.remove('menu_scroll');
        };
        if (this.body.offsetWidth <= 1280) {
            if (this.mobileMenu.classList.contains('menu_container_wrap_mobile_active')) {
                this.mobileMenu.classList.remove("menu_container_wrap_mobile_active");
                service.$('.container_menu')[0].classList.remove("change");
            };
            if (service.$('.mobile_menu_contacts')[0].classList.contains('mobile_menu_contacts_active')) {
                this.mobileMenuContact.classList.remove("mobile_menu_contacts_active");
            };
        };
    };

    shoeMobilMenu(el) {
        el.classList.toggle("change");
        service.$('.menu_container_wrap_mobile')[0].classList.toggle("menu_container_wrap_mobile_active");
    }

    shoeMobilInfo() {
        service.$('.mobile_menu_contacts')[0].classList.toggle("mobile_menu_contacts_active");
    }

    sendToMainForm(transfid, type, obj) {
        localStorage.setItem("transfid", transfid);
        localStorage.setItem("transftype", type);
        localStorage.setItem("transffromid", obj.fromid);
        localStorage.setItem("transffrom", obj.from);
        localStorage.setItem("transftoid", obj.toid);
        localStorage.setItem("transfto", obj.to);
        window.location.href = "/";
    };

    setToMainForm(transfid, type, obj) {
        window.scrollTo({
            top: service.$('.main_form_container')[0].offsetTop - 140,
            behavior: "smooth"
        });
        order.formValid = 'book';
        order.inputFrom.value = obj.from;
        order.inputTo.value = obj.to;
        order.inputType.value = `transfer_${type}`;
        order.inputFrom.setAttribute("inputmainparam", obj.fromid);
        order.inputTo.setAttribute("inputmainparam", obj.toid);
        validationType(order.inputType);
        order.check();
    };

    transferLists() {
        fetch(`/towns/variables`, { method: 'GET' })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            if (resultat.res) {
                this.townsFrom = resultat.res.towns_from;
                this.townsTo = resultat.res.towns_to;
                this.transfersArr = resultat.res.transfers_arr;
                const privatWrap = service.$('.wrap_prevat')[0];
                const microbusWrap = service.$('.wrap_microbus')[0];
                const specialWrap = service.$('.wrap_special')[0];
                if (privatWrap !== undefined) {
                    privatWrap.innerHTML = '';
                    resultat.res.privat.forEach(priv => {
                        this.transfersArr.forEach(transf => {
                            if (transf.transfer_id === priv.transfer_id) {
                                privatWrap.innerHTML += `
                                <p onclick="loadStatic.setToMainForm('${transf.transfer_id}', 'pr',
                                    {'from': '${this.townsFrom[transf.transfer_from]}',
                                    'to': '${this.townsTo[transf.transfer_to]}',
                                    'fromid': '${transf.transfer_from}',
                                    'toid': '${transf.transfer_to}'})">
                                    <i class='fas fa-arrow-alt-circle-right'></i>${this.townsFrom[transf.transfer_from]} - ${this.townsTo[transf.transfer_to]}</p>
                                <p class="price"><span>${service.lang['from']}</span>${transf.price_pr}<span>${service.lang['sum_type']}</span></p>`
                            };
                        });
                    });
                };
                if (microbusWrap !== undefined) {
                    microbusWrap.innerHTML = '';
                    resultat.res.microbus.forEach(micro => {
                        this.transfersArr.forEach(transf => {
                            if (transf.transfer_id === micro.transfer_id) {
                                microbusWrap.innerHTML += `
                                <p onclick="loadStatic.setToMainForm('${transf.transfer_id}', 'gr',
                                    {'from': '${this.townsFrom[transf.transfer_from]}',
                                    'to': '${this.townsTo[transf.transfer_to]}',
                                    'fromid': '${transf.transfer_from}',
                                    'toid': '${transf.transfer_to}'})">
                                    <i class='fas fa-arrow-alt-circle-right'></i>${this.townsFrom[transf.transfer_from]} - ${this.townsTo[transf.transfer_to]}</p>
                                <p class="price"><span>${service.lang['from']}</span>${transf.price_gr}<span>${service.lang['sum_type']}</span></p>`
                            };
                        });
                    });
                };
                if (specialWrap !== undefined) {
                    specialWrap.innerHTML = '';
                    resultat.res.spec.forEach(spec => {
                        this.transfersArr.forEach(transf => {
                            if (transf.transfer_id === spec.transfer_id) {
                                specialWrap.innerHTML += `
                                <div>
                                    <p><i class='fas fa-arrow-alt-circle-right'></i>
                                        <span>${this.townsFrom[transf.transfer_from]}</span>
                                        <span>&nbsp-&nbsp</span>
                                        <span>${this.townsTo[transf.transfer_to]}</span>
                                    </p>
                                    <p class="price"><span>${service.lang['from']}</span>${transf.price_pr}<span>${service.lang['sum_type']}</span></p>
                                    <p class="special_btn" onclick="loadStatic.sendToMainForm('${transf.transfer_id}', 'pr',
                                        {'from': '${this.townsFrom[transf.transfer_from]}',
                                        'to': '${this.townsTo[transf.transfer_to]}',
                                        'fromid': '${transf.transfer_from}',
                                        'toid': '${transf.transfer_to}'}
                                    )">${service.lang['book']}</p>
                                </div>`
                            };
                        });
                    });
                };
            };
        });
    }
}

class ValidationClass {

}
const validationoooo = new ValidationClass();



//validation text input
const validation = (el, type, form = '') => {
    const val = `${el.value.replace(RegExpArr[`RegExp${type}`] , "")}`;
    el.value = val.replace(/\s\s+/g, ' ');
    if (form === 'feedback') {
        el.classList.remove('err_input');
        const arrInp = ['feedback_name', 'feedback_surname', 'feedback_email', 'feedback_phone', 'feedback_comment'];
        const arrTrue = [];
        arrInp.forEach(element => { if (service.$(`#${element}`)[0].value === '') { arrTrue.push(false)} });
        if (!arrTrue.includes(false)) { service.$(`.feedback_form_err`)[0].classList.add('hide_err') };
    } else if (['news', 'answer'].includes(form)) {
    } else {
        if (type ==='Input') {
            service.$(`.town_empty_${el.id}`)[0].style.display = 'none';
            service.$(`.town_dup_${el.id}`)[0].style.display = 'none';
            service.$(`.towns_error`)[0].style.display = 'none';
        } else {
            el.classList.remove('err_input');
            order.check();
        };
    };
};
const validationPrice = (el) => {
    service.$(`.transfer_price_empt`)[0].style.display = 'none';
    const priceVal = el.value, errMess = service.$(`.transfer_price_${el.id}`)[0];
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
    el.classList.remove('err_input');
    service.$(`.main_form_err_limit_pr`)[0].classList.add('hide_err');
    service.$(`.main_form_err_limit_gr`)[0].classList.add('hide_err');
    order.inputTime.value = '';
    if (el.value === 'transfer_pr') {
        order.peopleMax = 7;
        order.peopleType = 'pr';
        order.inputTime.setAttribute("setparam", '');
    };
    if (el.value === 'transfer_gr') {
        order.peopleMax = 50;
        order.peopleType = 'gr';
        if (order.inputFrom.value !== '' && order.inputTo.value !== '') {
            const fromParam = order.inputFrom.getAttribute("inputmainparam");
            const toParam = order.inputTo.getAttribute("inputmainparam");
            loadStatic.transfersArr.forEach(element => {
                if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr !== '') {
                    order.inputTime.setAttribute("setparam", 'limit');
                };
            });
        };
    };
    order.check();
};
const validationAdults = (el) => {
    order.check();
    (order.inputAdult.value > 0) ? order.inputAdult.classList.remove('err_input') : order.inputAdult.classList.add('err_input');
    order.peopleCount = +order.inputAdult.value + +order.inputChildren.value;
    const peopleTypeErr = service.$(`.main_form_err_limit_${order.peopleType}`)[0];
    // console.log('peopleType', peopleType);
    // console.log('peopleTypeErr', peopleTypeErr);

    if (order.peopleCount > order.peopleMax) {
        peopleTypeErr.classList.remove('hide_err');
        if (order.inputChildren.value !== '' && order.inputChildren.value !== '0') {
            order.inputAdult.classList.add('err_input');
            order.inputChildren.classList.add('err_input');
        } else {
            order.inputAdult.classList.add('err_input');
        };
    } else {
        peopleTypeErr.classList.add('hide_err');
        service.$(`.main_form_err_book`)[0].classList.add('hide_err');
        order.inputAdult.classList.remove('err_input');
        order.inputChildren.classList.remove('err_input');
    };
};
const validationChildren = (el) => {
    const equipchild =  service.$('.equip_child')[0];
    const equipchildInp =  service.$('.equip_child #equip_child')[0];
    equipchildInp.setAttribute('max', `${order.inputChildren.value}`);
    (equipchildInp.value > order.inputChildren.value) ? equipchildInp.value = order.inputChildren.value : null;
    (el.value < 1) ? equipchild.style.display = 'none' : null;
    (el.value > 0) ? equipchild.style.display = 'flex' : null;
    order.peopleCount = +order.inputAdult.value + +order.inputChildren.value;
    const peopleTypeErr = service.$(`.main_form_err_limit_${order.peopleType}`)[0];

    if (order.peopleCount > order.peopleMax) {
        peopleTypeErr.classList.remove('hide_err');
        if (order.inputAdult.value !== '' && order.inputAdult.value !== '0') {
            order.inputAdult.classList.add('err_input');
            order.inputChildren.classList.add('err_input');
        } else {
            order.inputChildren.classList.add('err_input');
        };
    } else {
        peopleTypeErr.classList.add('hide_err');
        service.$(`.main_form_err_book`)[0].classList.add('hide_err');
        order.inputAdult.classList.remove('err_input');
        order.inputChildren.classList.remove('err_input');
    };
};



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
        this.town_token = service.token(6);
        if (param === 'edit' ) {
            data = await this.open(id);
            this.town_id = data.town_id;
        };
        this.show(module, 'Save', data);
        this.town_id_place = service.$('#id_town')[0];
    }

    select(el, field) {
        transfer.labels.dup.style.display = 'none';
        transfer.labels.empty.style.display = 'none';
        transfer.labels.is.style.display = 'none';
        transfer.fields.modal.innerHTML = '';
        const place = transfer.fields[`${field}`];
        place.value = el.innerHTML;
        place.setAttribute('data-input', `${el.id}`);
        const to = transfer.fields.to.getAttribute("data-input");
        const from = transfer.fields.from.getAttribute("data-input");
        if (from === to) {
            transfer.labels.dup.style.display = 'block';
        };
    }

    creatingTownID(element) {
        const id = `${service.transliterate(element.value).replace( /[^a-zA-ZiIіІ]/g, "" )}_${this.town_token}`;
        this.town_id_place.innerHTML = id;
        this.town_id = id;
    };

    notEmpty(form) {
        const valid = [];
        ["uk", "en", "ru"].forEach(element => {
            const field = service.$(`#${form} > #${element}`)[0];
            if (field.value === '' || field.value === undefined) {
                service.$(`.town_empty_${element}`)[0].style.display = 'block';
                valid.push(false);
            };
        });
        return (!valid.includes(false)) ? true : false;
    }

    data(form) {
        const uk = service.$(`#${form} > #uk`)[0].value.replace(RegExpArr.RegExpInput , "");
        const en = service.$(`#${form} > #en`)[0].value.replace(RegExpArr.RegExpInput , "");
        const ru = service.$(`#${form} > #ru`)[0].value.replace(RegExpArr.RegExpInput , "");
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
                                service.$(`.town_dup_${key}`)[0].style.display = 'block';
                            };
                        };
                    };
                };
            })
            .catch(() => {
                service.$(`.towns_error`)[0].style.display = 'block';
            });
        };
    }

    townList(module, type, param) {
        fetch(`/towns/list`, { method: 'GET' })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            this.show(module, type);
            const tawns_list = service.$('.towns_select_list')[0];
            tawns_list.innerHTML = '';
            resultat.res.forEach(element => {
                tawns_list.innerHTML += `<p id="${element.town_id}" onclick="town.select(this, '${param}')">${element.name_uk}</p>`
            });
        });
    }

    async open(id) {
        return await service.open(id, 'towns', this);
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
        const sortWrap = service.$('#sortable')[0].children, sortArr = {};
        for (var i = 0; i < sortWrap.length; ++i) {
            sortArr[`${sortWrap[i].id}`] = `${i+1}${service.token(4, 'number')}`;
        };
        fetch(`/transfers/saveposition`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(sortArr) })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            if (resultat.res) {
                service.$('#save_position')[0].style.display = 'none';
                this.list();
            };
        });
    }

    setFields(form) {
        this.fields.from = service.$(`#from`, form)[0];
        this.fields.to = service.$(`#to`, form)[0];
        this.fields.gr = service.$(`#gr`, form)[0];
        this.fields.pr = service.$(`#pr`, form)[0];
        this.fields.selection = service.$(`#selection`, form)[0];
        this.fields.privat = service.$(`#privat`, form)[0];
        this.fields.microbus = service.$(`#microbus`, form)[0];
        this.fields.time = service.$('.time', form)[0];
        this.fields.modal = service.$('.wrap_sub_modal')[0];
        this.labels.dup = service.$(`.transfer_dup_to`, form)[0];
        this.labels.empty = service.$(`.transfer_empty_to`, form)[0];
        this.labels.is = service.$(`.transfer_duplicated`, form)[0];
        this.labels.price_gr = service.$(`.transfer_price_gr`, form)[0];
        this.labels.price_pr = service.$(`.transfer_price_pr`, form)[0];
        this.labels.price_empt = service.$(`.transfer_price_empt`, form)[0];
    }

    async showWindow(module, type, param, id){
        let data = {};
        this.transfer_form = module + type;
        this.transfer_param = param;
        this.transfer_id = service.token(6);
        if (param === 'edit' ) {
            data = await this.open(id);
            this.transfer_id = data.transfer_id;
        };
        this.show(module, 'Save', data);
        this.setFields(service.$(`#${module + type}`)[0]);
        if (param === 'edit' ) {
            const timeList = [];
            for (let i = 0; i < 10; i++) { if (data[`time${i + 1}`] !== '') { timeList.push(data[`time${i + 1}`])}};
            if (timeList.length > 0) {
                const transferBody = service.$('.add_time')[0];
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
            "times" : [...service.$('.time')].map((el) => el.value !== '' && el.value).filter((el) => el !== false),
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
                service.$(`.transfer_error`)[0].style.display = 'block';
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

class Order extends ModalWindow {
    peopleCount = 0;
    peopleMax = 50;
    peopleType = 'gr';
    number = 30;
    status = '';
    date = '3';
    formValid;
    inputFrom = service.$('#main_from')[0];
    inputTo = service.$('#main_to')[0];
    inputTime = service.$('#main_time')[0];
    inputType = service.$('#type_transfer')[0];
    typeGr = service.$(`#type_gr`)[0];
    typePr = service.$(`#type_pr`)[0];
    inputAdult = service.$('#adults')[0];
    inputChildren = service.$('#children')[0];
    inputEmail = service.$('#main_email')[0];
    inputPhone = service.$('#main_phone')[0];

    constructor(){
        super()
    }

    showSelectWindow(module, type, param, el){
        this.show(module, type);
        service.$(`#${module + type}`)[0].children[0].innerHTML = service.lang['town_title'];
        const list_wrap = service.$('.towns_select_list')[0];
        let towns_list = {};
        let input, param1, param2;
        if (param === 'from') {
            towns_list = loadStatic.townsFrom;
            input = this.inputTo;
            param1 = 'to';
            param2 = 'from';
        };
        if (param === 'to') {
            towns_list = loadStatic.townsTo;
            input = this.inputFrom;
            param1 = 'from';
            param2 = 'to';
        };
        list_wrap.innerHTML = '';
        if ((this.inputFrom.value !== '') && (this.inputTo.value !== '')) {
            for (const [key, value] of Object.entries(towns_list)) {
                list_wrap.innerHTML += `<p id="${key}" onclick="order.selectTownMain(this, '${param2}', 'clear')">${value}</p>`;
            };
        } else {
            if (input.value === '') {
                for (const [key, value] of Object.entries(towns_list)) {
                    list_wrap.innerHTML += `<p id="${key}" onclick="order.selectTownMain(this, '${param2}')">${value}</p>`;
                };
            } else {
                const another_value = service.$(`#main_${param1}`)[0].getAttribute('inputmainparam');
                const res_towns_list = [];
                loadStatic.transfersArr.forEach(element => {
                    if (element[`transfer_${param1}`] === another_value) {
                        res_towns_list.push({[`${element[`transfer_${param2}`]}`] : `${towns_list[element[`transfer_${param2}`]]}`});
                    };
                });
                res_towns_list.forEach(element => {
                    for (const [key, value] of Object.entries(element)) {
                        list_wrap.innerHTML += `<p id="${key}" onclick="order.selectTownMain(this, '${param2}')">${value}</p>`;
                    };
                });
            };
        };
    }

    selectTownMain(el, param, clear) {
        this.closeBtn();
        this.inputTime.value = '';
        const place = service.$(`#main_${param}`)[0];
        place.value = el.innerHTML;
        place.setAttribute("inputmainparam", el.id);
        service.$(`#main_${param}`)[0].classList.remove('err_input');
        if (clear === 'clear') {
            if (param === 'from') {
                this.inputTo.value = '';
                this.inputTo.setAttribute("inputmainparam", '');
            };
            if (param === 'to') {
                this.inputFrom.value = '';
                this.inputFrom.setAttribute("inputmainparam", '');
            };
        };
        order.check();
        if (this.inputFrom.value !== '' && this.inputTo.value !== '') {
            const fromParam = this.inputFrom.getAttribute("inputmainparam");
            const toParam = this.inputTo.getAttribute("inputmainparam");
            this.inputType.value = '';
            loadStatic.transfersArr.forEach(element => {
                if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr !== '' && element.price_pr === '') {
                    this.typeGr.selected = true;
                    this.typeGr.classList.remove('hide_err');
                    this.typePr.classList.add('hide_err');
                    this.inputTime.setAttribute("setparam", 'limit');
                    this.inputType.classList.remove('err_input');
                    this.peopleMax = 50;
                    this.peopleType = 'gr';
                } else if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr === '' && element.price_pr !== '') {
                    this.typePr.selected = true;
                    this.typePr.classList.remove('hide_err');
                    this.typeGr.classList.add('hide_err');
                    this.inputTime.setAttribute("setparam", '');
                    this.inputType.classList.remove('err_input');
                    this.peopleMax = 7;
                    this.peopleType = 'pr';
                } else if (element.transfer_from === fromParam && element.transfer_to === toParam && element.price_gr === ''){
                    this.typeGr.classList.add('hide_err');
                    this.inputTime.setAttribute("setparam", '');
                };
            });
        } else {
            this.inputTime.setAttribute("setparam", '');
            this.inputTime.value = '';
            this.typeGr.classList.remove('hide_err');
            this.typePr.classList.remove('hide_err');
            this.typeGr.selected = false;
        };
    };

    setParam(el, param) {
        this[param] = el.value;
        this.list(1)
    }

    proof(orderid, param) {
        const data = {"id": `${orderid}`, 'param': `${param}`};
        fetch(`/order/orderstatus`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(data)
        })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            if (resultat.res) {
                this.list(1);
                this.closeBtn();
            };
        });
    };

    list(page = 1) {
        let param = [];
        param.push(['reserv', 'proof', 'del'].includes(this.status) ? {"status": this.status} : {"status": ''});
        param.push(['3', '6', '12', ''].includes(this.date) ? {"date": this.date} : {"date": ''});
        const data = {page, param, 'numb' : this.number};
        fetch(`/order/list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(data)
        })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            if (resultat.res) {
                const list_wrap = service.$('.orders_list')[0];
                const pagination_wrap = service.$('.orders_pagination')[0];
                const present_pagination = pagination_wrap.children;
                const pagin_page = Math.ceil(resultat.res.count / this.number);
                list_wrap.innerHTML = '';
                pagination_wrap.innerHTML = '';
                if (pagin_page > 1) {
                    for (let i = 1; i <= pagin_page; i++) { pagination_wrap.innerHTML += `<p onclick="order.list(${i})">${i}</p>` };
                    present_pagination[page-1].style.color = '#fff';
                    present_pagination[page-1].style.backgroundColor = 'rgb(139 195 74)';
                    present_pagination[page-1].removeAttribute("onclick");
                };
                resultat.res.list.forEach(element => {
                    list_wrap.innerHTML += `<div class="order" onclick="order.showWindow('order', 'Info', '', '${element.orders}')">
                        <p>${element.order_from} - ${element.order_to}  </p>
                        <p>${service.lang['date']} - <span>${element.date}</span> </p>
                        <p>${service.lang['time']} - <span>${element.time}</span></p>
                        <p>${service.lang['sum']} - <span>${element.sum}</span> ${service.lang['sum_type']}</p>
                        <p><span>${service.lang['transfer_' + element.type]}</span></p>
                        <i class='fas fa-info-circle ${element.proof}'></i>
                    </div>`;
                });
            };
        });
    }

    async showWindow(module, type, param, id){
        const data = await this.open(id);
        this.show(module, type, data);
    }

    async open(id) {
        return await service.open(id, 'order', this);
    }

    mainFormBack() {
        service.$('#check')[0].style.display = 'flex';
        service.$('#booking')[0].style.display = 'none';
    }

    check() {
        let arrInp = [];
        if (this.formValid && this.formValid !== '') {
            const arrCall = ['main_from', 'main_to', 'adults', 'type_transfer'];
            const arrBook = [...arrCall, 'main_date', 'main_time'];
            const arrBookFinal = [...arrBook, 'main_name', 'main_surname', 'main_email', 'main_phone'];
            if (this.formValid === 'calk') {
                service.$(`.main_form_err_book`)[0].classList.add('hide_err');
                arrInp = arrCall;
                arrBook.forEach(element => { service.$(`#${element}`)[0].classList.remove('err_input') });
            };
            if (this.formValid === 'book') {
                service.$(`.main_form_err_calk`)[0].classList.add('hide_err');
                arrInp = arrBook;
                arrCall.forEach(element => { service.$(`#${element}`)[0].classList.remove('err_input') });
            };
            if (this.formValid === 'bookfinal') {
                service.$(`.main_form_err_bookfinal`)[0].classList.add('hide_err');
                arrInp = arrBookFinal;
            };
        };
        const arrTrue = [];
        arrInp.forEach(element => {
            const elemCheck = service.$(`#${element}`)[0];
            const peopleTypeErr = service.$(`.main_form_err_limit_${this.peopleType}`)[0];
            if (elemCheck.value === '') {
                arrTrue.push(false);
                elemCheck.classList.add('err_input');
            };
            if (this.peopleCount > this.peopleMax) {
                arrTrue.push(false);
                peopleTypeErr.classList.remove('hide_err');
                if (this.inputChildren.value !== '' && this.inputChildren.value !== '0') {
                    this.inputAdult.classList.add('err_input');
                    this.inputChildren.classList.add('err_input');
                } else {
                    this.inputAdult.classList.add('err_input');
                };
            } else {
                this.inputAdult.classList.remove('err_input');
                this.inputChildren.classList.remove('err_input');
            };

            if (this.inputAdult.value <= 0) {
                arrTrue.push(false);
                this.inputAdult.classList.add('err_input');
            };
            if (this.formValid === 'bookfinal') {
                if (this.inputEmail.value !== '' && !validEmail(this.inputEmail.value)) {
                    arrTrue.push(false);
                    this.inputEmail.classList.add('err_input');
                };
                if (this.inputPhone.value !== '' && !validPhone(this.inputPhone.value)) {
                    arrTrue.push(false);
                    this.inputPhone.classList.add('err_input');
                };
            };
        });
        if (arrTrue.includes(false)) {
            service.$('.main_form_price')[0].classList.add('hide_err');
            if (this.formValid && this.formValid !== '') {
                service.$(`.main_form_err_${this.formValid}`)[0].classList.remove('hide_err');
            };
            return false;
        } else {
            service.$('.main_form_price')[0].classList.add('hide_err');
            if (this.formValid && this.formValid !== '') {
                service.$(`.main_form_err_${this.formValid}`)[0].classList.add('hide_err');
            };
            return true;
        };
    }

    data() {
        const data = {};
        const from = this.inputFrom.getAttribute('inputmainparam');
        const to = this.inputTo.getAttribute('inputmainparam');
        loadStatic.transfersArr.forEach(element => {
            if (element.transfer_from === from && element.transfer_to === to) {
                data.transferId = element.transfer_id;
                data.transferFromName = this.inputFrom.value;
                data.transferToName = this.inputTo.value;
                data.adult = +this.inputAdult.value;
                data.children = +service.$('#children')[0].value;
                data.type = this.inputType.value;
                data.sum = (this.inputType.value === 'transfer_gr') ? element.price_gr * (data.adult + data.children) : element.price_pr;
                data.date = service.$('#main_date')[0].value;
                data.time = this.inputTime.value;
                data.equip = document.querySelector('input[name="equip"]:checked').value;
                data.equip_child = +service.$('#equip_child')[0].value;
                data.user_name = service.$('#main_name')[0].value;
                data.user_surname = service.$('#main_surname')[0].value;
                data.user_email = this.inputEmail.value;
                data.user_phone = this.inputPhone.value;
            };
        });
        return data;
    }

    culculate() {
        if (this.check()) {
            const data = this.data();
            if (data) {
                if (this.formValid === 'calk') {
                    service.$('.main_form_price')[0].classList.remove('hide_err');
                    service.$('.main_form_price > span')[0].innerHTML = data.sum;
                };
                if (this.formValid === 'book') {
                    const resInfo = service.$('.book_info')[0];
                    const resInfoBlock = `
                        <p class="main_form_color">${data.transferFromName} - ${data.transferToName}</p>
                        <p>${service.lang[`date`]} - <span class="main_form_color">${data.date}</span> &nbsp ${service.lang[`time`]} - <span class="main_form_color">${data.time}</span></p>
                        <p>${service.lang[`adult`]} - <span class="main_form_color">${data.adult}</span> &nbsp
                            ${service.lang[`children`]} - <span class="main_form_color">${data.children}</span> &nbsp
                            ${service.lang[`children_chear`]} - <span class="main_form_color">${data.equip_child}</span></p>
                        <p>${service.lang[`equip`]} - <span class="main_form_color">${service.lang[`${data.equip}`]}</span> &nbsp
                            <b class="main_form_color">${service.lang[`${data.type}`]}</b></p>
                        <p>${service.lang[`sum`]} - <span class="main_form_color">${data.sum}</span> </p>
                    `;
                    resInfo.innerHTML = resInfoBlock;
                    service.$('#check')[0].style.display = 'none';
                    service.$('#booking')[0].style.display = 'flex';
                };
                if (this.formValid === 'bookfinal') {
                    fetch(`/order/order`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json;charset=utf-8' },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.status === 200 && response.json())
                    .then(resultat => {
                        if (resultat.res) {
                            service.$('#check')[0].style.display = 'none';
                            service.$('#booking')[0].style.display = 'none';
                            service.$('#received')[0].style.display = 'flex';
                        };
                    });
                };
            };
        };
    };


}

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
        const message = service.$(`.feedback_form_err`)[0];
        arrInp.forEach(element => {
            const elemCheck = service.$(`#${element}`)[0];
            if (elemCheck.value === '') {
                arrTrue.push(false);
                elemCheck.classList.add('err_input');
            };
        });
        const emailCheck = service.$('#feedback_email')[0];
        if (emailCheck.value !== '' && !validEmail(emailCheck.value)) {
            arrTrue.push(false);
            emailCheck.classList.add('err_input');
        };
        const phoneCheck = service.$('#feedback_phone')[0];
        if (phoneCheck.value !== '' && !validPhone(phoneCheck.value)) {
            arrTrue.push(false);
            phoneCheck.classList.add('err_input');
        };
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
        feedbackArr.feedbackName = service.$('#feedback_name')[0].value;
        feedbackArr.feedbackSurname = service.$('#feedback_surname')[0].value;
        feedbackArr.feedbackEmail = service.$('#feedback_email')[0].value;
        feedbackArr.feedbackPhone = service.$('#feedback_phone')[0].value;
        feedbackArr.feedbackComment = service.$('#feedback_comment')[0].value;
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
                    if (service.$('.feedback_name')[0]) {service.$('.feedback_name')[0].value = ''};
                    if (service.$('.feedback_surname')[0]) {service.$('.feedback_surname')[0].value = ''};
                    if (service.$('.feedback_email')[0]) {service.$('.feedback_email')[0].value = ''};
                    if (service.$('#feedback_phone')[0]) {service.$('#feedback_phone')[0].value = ''};
                    service.$('#feedback_comment')[0].value = '';
                    service.$(`.feedback_sended`)[0].classList.remove('hide_err');
                    setTimeout(() => {
                        service.$(`.feedback_sended`)[0].classList.add('hide_err');
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
        const answer = service.$('#feedback_answer')[0].value;
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
                const list_wrap = service.$('.feedback_list')[0];
                const pagination_wrap = service.$('.feedback_pagination')[0];
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
        this.news_token = param === 'edit' ? id : service.token(6);
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
        service.$('#news_foto')[0].addEventListener("change", async (event) => {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onloadend = () => {
                this.temp_foto = this.news_foto === "" ? this.temp_foto : this.news_foto;
                service.$('#foto_load')[0].style.backgroundImage = `url(${reader.result})`;
                this.news_foto = reader.result;
            };
            if(file){
                reader.readAsDataURL(file);
            };
        });
        this.resizeTextarea(service.$('#news_title')[0], '60')
        this.resizeTextarea(service.$('#news_description')[0], '100');
        if (param === 'edit' ) {
            const editor = service.$('.ql-editor')[0];
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
        const news_vilid = service.$('#vilid_news')[0];
        if (news_vilid) {
            news_vilid.innerHTML = text;
            news_vilid.classList.remove('vilid_news_bad');
            news_vilid.classList.remove('vilid_news_good');
            news_vilid.classList.add(classs);
        };
    }

    clearImg() {
        service.$('#news_foto')[0].type = "text";
        service.$('#news_foto')[0].type = "file";
        this.news_foto = this.temp_foto;
        service.$('#foto_load')[0].style.backgroundImage = (this.temp_foto.length < 5)
            ? `url(/img/nofoto.png)`
            : `url(/img/news/${this.news_token}/${this.news_foto}_cover_resized_footer.jpg)`;
    }

    removeImg() {
        service.$('#foto_load')[0].style.backgroundImage = `url(/img/nofoto.png)`;
        service.$('#news_foto')[0].type = "text";
        service.$('#news_foto')[0].type = "file";
        this.news_foto = "";
    }

    validIMG(event) {
        const files = event.target.files;
        if (!['image/jpg', 'image/jpeg', 'image/png', 'image/bmp'].includes(files[0].type)) {
            this.message(`Недоступний формат. Доступними є: jpg, jpeg, png`, 'vilid_news_bad');
            service.$('#news_foto')[0].value = '';
        } else {
            if (files[0].size > 5000000) {
                this.message(`Надто великий розмір. Максимально 5Mb`, 'vilid_news_bad');
                service.$('#news_foto')[0].value = '';
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
        const save_cover = service.$('#load_cover')[0];
        const news_title = service.$('#news_title')[0].value;
        const news_description = service.$('#news_description')[0].value;
        const news_editor = service.$('.ql-editor')[0].children;
        const validating_fields = [news_title, news_description];
        if (await this.notEmpty(validating_fields)) {
            save_cover.style.display = 'flex';
            const img_arr = service.$('.ql-editor')[0].getElementsByTagName('img');
            const img_base64 = {};
            const img_https_names = [];
            [...img_arr].forEach(function(element) {
                if (element.src.includes('base64')) {
                    const img_token = service.token(9)
                    img_base64[img_token] = element.src;
                    element.src = img_token;
                };
                if (element.src.includes('http')) {
                    img_https_names.push(element.src);
                };
            });
            const article = [...news_editor].map((element) => element.outerHTML).join("\n");
            const cover_name = (!this.news_foto.includes('base64')) ? this.news_foto : service.token(6);
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
            data.open_btn = target === '_footer' ? `onclick="window.open('/blog/${element.alias}', '_self')"` : '';
            data.cover = element.cover !== '' ? `/img/news/${element.id_blog}/${element.cover}_cover_resized${target}.jpg`: '/img/nofoto.png';
            data.description = target !== '_footer' ? `<p style="font-size:12px;">${element.description}</p>` : '';
            data.adm_btn = target === '_admin' ? `
                <i class='fas fa-ellipsis-h' onclick='news.show("news", "menu", {}, "${element.id_blog}")'></i>
                <i class="fa fa-share" onclick="window.open('/blog/${element.alias}', '_blank')"></i>` : '';
            result.place.innerHTML += `${this.template('newsList', data)}`;
        });
    }

    delete(id) {
        service.delete(id, 'blog', this)
    }
};

class Calendar extends ModalWindow {
    weekdays = {
        uk : ["Нед", "Пон", "Вівт", "Сер", "Чет", "П`ят", "Суб"],
        en : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }
    months = {
        uk : ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        en : ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"]
    }
    date = '';

    constructor(){
        super();
    }

    showWindow(module, type, el){
        this.date = new Date();
        let val = 0;
        let current_year = this.date.getFullYear();
        this.show(module, type);
        service.$(`#${module + type}`)[0].children[0].innerHTML = service.lang['calendar_title'];
        const weekdays_place = service.$(".weekdays")[0];
        weekdays_place.innerHTML = '';
        this.weekdays[service.language].forEach(el => { weekdays_place.innerHTML += `<div>${el}</div>` });
        service.$(".prev_year")[0].addEventListener("click", () => {
            (val <= 0) ? val = 0 : val--;
            this.render(current_year + val);
        });
        service.$(".next_year")[0].addEventListener("click", () => {
            (val >= 15) ? val = 15 : val++;
            this.render(current_year + val);
        });
        service.$(".prev")[0].addEventListener("click", () => {
            this.date.setMonth(this.date.getMonth() - 1);
            (this.date.getMonth() === 11) && val--;
            this.render(current_year + val);
        });
        service.$(".next")[0].addEventListener("click", () => {
            this.date.setMonth(this.date.getMonth() + 1);
            (this.date.getMonth() === 0) && val++;
            this.render(current_year + val);
        });
        this.render(current_year + val);
    }

    render(current_year) {
        this.date.setDate(1);
        this.date.setYear(current_year);
        let days = "";
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const month_before = this.date.getDay();
        const month_after = 7 - new Date(year, month + 1, 0).getDay() - 1;
        const month_last_day = new Date(year, month + 1, 0).getDate();
        const today = `${date.show('yyyy-mm-dd', new Date())}`;
        for (let i = month_before; i > 0; i--) {
            days += `<div class="prev-date">${new Date(year, month, 0).getDate() - i + 1}</div>`;
        };
        for (let i = 1; i <= month_last_day; i++) {
            const sample = `${year}-${month + 1}-${i}`;
            const compare = `${date.show('yyyy-mm-dd', sample)}`;
            const select = date.show('dd/mm/yyyy', sample);
            if (compare === today) {
                days += `<div class="today" onclick="calendar.select('${select}')">${i}</div>`;
            } else if (compare < today) {
                days += `<div class="prev-date">${i}</div>`;
            } else {
                days += `<div onclick="calendar.select('${select}')">${i}</div>`;
            };
        };
        for (let i = 1; i <= month_after; i++) {
            days += `<div class="next-date">${i}</div>`;
        };
        service.$(`.date_year > h1`)[0].innerHTML = year;
        service.$(".date h1")[0].innerHTML = this.months[service.language][month];
        service.$(".days")[0].innerHTML = days;
    }

    select(date) {
        const inputPlace = service.$(`#main_date`)[0];
        inputPlace.value = date;
        inputPlace.classList.remove('err_input');
        this.closeBtn();
        order.check();
    };
};

class Time extends ModalWindow{
    arrow = '';
    hours = '';
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
        if (el.getAttribute("setparam") === 'limit') {
            this.show(module, `${type}limit`);
            service.$(`#${module + type}limit`)[0].children[0].innerHTML = service.lang[`time_title`];
            if (order.inputFrom.value !== '' && order.inputTo.value !== '') {
                const timeArrForm = [];
                const from = order.inputFrom.getAttribute("inputmainparam");
                const to = order.inputTo.getAttribute("inputmainparam");
                loadStatic.transfersArr.forEach(element => {
                    if (element.transfer_from === from && element.transfer_to === to && element.price_gr !== '') {
                        for (let i = 0; i < 10; i++) {
                            if (element[`time${i+1}`] !== '') { timeArrForm.push(element[`time${i+1}`])};
                        };
                    };
                });
                timeArrForm.forEach(element => {
                    service.$('.towns_select_list')[0].innerHTML += `<p onclick="time.setTime('${element}')">${element}</p>`;
                });
            };
        } else {
            this.show(module, type);
            this.hours = service.$('.hours')[0];
            this.minutes = service.$('.minutes')[0];
            service.$(`#${module + type}`)[0].children[0].innerHTML = service.lang[`time_title`];
            service.$('.admTime')[0].addEventListener('click', () => {
                el.value = `${this.hours.innerHTML}:${this.minutes.innerHTML}`;
                if (module === 'time') {
                    this.closeBtn();
                    order.inputTime.classList.remove('err_input');
                    order.check();
                } else {
                    this.closeSub();
                };
            });
        };
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
        service.$('.add_time')[0].style.display = el.value === '' ? 'none' : 'table';
    }

    plusTime(element, type) {
        const transferBody = service.$('.add_time')[0];
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
        const timeLabels = service.$('.time_label');
        for (const [index, iterator] of timeLabels.entries()) {
            timeLabels[index].innerHTML = `Відправлення ${index + 1}`;
        };
    }

    setTime(value) {
        order.inputTime.value = value;
        this.closeBtn();
        order.inputTime.classList.remove('err_input');
        order.check();
    }
};

const service = new Services();
const loadStatic = new Static();
const feedback_sl = new HorizontalSliders();
const options_sl = new HorizontalSliders();
const date = new ShowDate();
const time = new Time();
const calendar = new Calendar();
const order = new Order();
const feedback = new Feedback();
const town = new Towns();
const transfer = new Transfers();
const news = new News();

window.onload = function() {
    if (service.$('.feedback_container')[0]) {
        const fb_slider_wrap = service.$('.feedback_wrap')[0];
        feedback_sl.feedback();
        feedback_sl.feedbackCount();
        window.addEventListener('resize', feedback_sl.feedback, true);
        fb_slider_wrap.addEventListener('touchstart', e => {
            feedback_sl.touchstart = e.changedTouches[0].screenX;
        });
        fb_slider_wrap.addEventListener('touchend', e => {
            feedback_sl.touchend = e.changedTouches[0].screenX;
            feedback_sl.slideFeed();
        });
    };
    if (service.$('.options_container')[0]) {
        const op_slider_wrap = service.$('.options_wrap')[0];
        options_sl.options();
        window.addEventListener('resize', options_sl.options, true);
        op_slider_wrap.addEventListener('touchstart', e => {
            options_sl.touchstart = e.changedTouches[0].screenX;
        });
        op_slider_wrap.addEventListener('touchend', e => {
            options_sl.touchend = e.changedTouches[0].screenX;
            options_sl.optionSlider();
        });
        service.$('.arrow_left')[0].addEventListener('click', options_sl.optionsLeft, true);
        service.$('.arrow_right')[0].addEventListener('click', options_sl.optionsRight, true);
    };
    loadStatic.showContainers();
    loadStatic.menuOnScroll()
    const tab_cont = service.$('.tabs_container')[0];
    const info_cont = service.$('.info_container')[0];
    if (tab_cont !== undefined && info_cont !== undefined) {
        tab_cont.style.opacity = '1';
        tab_cont.style.transition = '1.5s';
        info_cont.style.opacity = '1';
        info_cont.style.transition = '1.5s';
        setTimeout(() => {
            tab_cont.style.transition = '0s';
            info_cont.style.transition = '0s';
        }, 1500);
    };
    if (localStorage.getItem("transfid") !== null && localStorage.getItem("transfid") !== '') {
        const transid = localStorage.getItem("transfid");
        const transtype = localStorage.getItem("transftype");
        const transobj = {
            'from' : `${localStorage.getItem("transffrom")}`,
            'to' : `${localStorage.getItem("transfto")}`,
            'fromid' : `${localStorage.getItem("transffromid")}`,
            'toid' : `${localStorage.getItem("transftoid")}`};
        localStorage.setItem("transfid", '');
        localStorage.setItem("transftype", '');
        localStorage.setItem("transffromid", '');
        localStorage.setItem("transffrom", '');
        localStorage.setItem("transftoid", '');
        localStorage.setItem("transfto", '');
        loadStatic.setToMainForm(transid, transtype, transobj);
    };

};

window.onclick = function(event) {
    if (!event.target.matches(['.container_menu', '.bar1', '.bar2', '.bar3', '.logo_mobile', '.menu_container_wrap_mobile'])) {
        if (loadStatic.mobileMenu.classList.contains('menu_container_wrap_mobile_active')) {
            loadStatic.mobileMenu.classList.remove("menu_container_wrap_mobile_active");
            service.$('.container_menu')[0].classList.remove("change");
        };
    };
    if (!event.target.matches('.fa-ellipsis-v')) {
        if (service.$('.mobile_menu_contacts')[0].classList.contains('mobile_menu_contacts_active')) {
            loadStatic.mobileMenuContact.classList.remove("mobile_menu_contacts_active");
        };
    };
};

window.onscroll = function() {
    loadStatic.showContainers();
    loadStatic.menuOnScroll();
}