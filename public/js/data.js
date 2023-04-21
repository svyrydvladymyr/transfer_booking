template = {
    townAdd:
        `<p id="id_town"></p>
        <p class="form_info">Унікальний номер міста</p>
        <input type="text" id="uk" name="uk" maxlength="90" placeholder="Назва українською" oninput="creatingIdTown(this), validation(this, 'Input')">
        <p class="town_dup_uk">Така назва вже є в базі!</p>
        <p class="town_empty_uk">Не може бути пустим!</p>
        <input type="text" id="en" name="en" maxlength="90" placeholder="Name in English" oninput="validation(this, 'Input')">
        <p class="town_dup_en">Така назва вже є в базі!</p>
        <p class="town_empty_en">Не може бути пустим!</p>
        <input type="text" id="ru" name="ru" maxlength="90" placeholder="Название на русском" oninput="validation(this, 'Input')">
        <p class="town_dup_ru">Така назва вже є в базі!</p>
        <p class="town_empty_ru">Не може бути пустим!</p>
        <p class="form_send" onclick="formSend('townAdd')">Добавити в базу</p>`,
    townAddRes:
        `<p id="id_town"></p>
        <p class="form_info">Унікальний номер міста</p>
        <p class="res_mess">Місто додано до списку!</p>`,
    townEdit:
        `<p id="id_town"></p>
        <p class="form_info">Унікальний номер міста</p>
        <input type="text" id="uk" name="uk" maxlength="90" placeholder="Назва українською" oninput="validation(this, 'Input')">
        <p class="town_dup_uk">Така назва вже є в базі!</p>
        <p class="town_empty_uk">Не може бути пустим!</p>
        <input type="text" id="en" name="en" maxlength="90" placeholder="Name in English" oninput="validation(this, 'Input')">
        <p class="town_dup_en">Така назва вже є в базі!</p>
        <p class="town_empty_en">Не може бути пустим!</p>
        <input type="text" id="ru" name="ru" maxlength="90" placeholder="Название на русском" oninput="validation(this, 'Input')">
        <p class="town_dup_ru">Така назва вже є в базі!</p>
        <p class="town_empty_ru">Не може бути пустим!</p>
        <p class="form_send" onclick="formSend('townEdit')">Зберегти зміни</p>`,
    townEditRes:
        `<p id="id_town"></p>
        <p class="form_info">Унікальний номер міста</p>
        <p class="res_mess">Зміни внесено!</p>`,
    townDel:
        `<p id="id_town"></p>
        <p class="form_info">Унікальний номер міста</p>
        <p class="del_info" style="color:#991818;">Підтвердіть видалення!</p>
        <p class="del_info" style="color:#991818;">Зверніть увагу, що після видалення міста також будуть недоступні маршрути з цим містом</p>
        <p class="form_send" onclick="formSend('townDel')">Видалити остаточно!</p>`,
    townDelRes:
        `<p id="id_town"></p>
        <p class="form_info">Унікальний номер міста</p>
        <p class="res_mess">Місто видалено із списку!</p>`,
    transferAdd:
        `<input type="text" id="from" name="from" maxlength="120" inputparam="" value="" autocomplete="off" placeholder="Перевезення з ..." oninput="validation(this, 'Input')" onfocus="showModal('transferTowns', {'param': 'from'})" readonly>
        <input type="text" id="to" name="to" maxlength="120" inputparam="" value="" autocomplete="off" placeholder="Перевезення до ..." oninput="validation(this, 'Input')" onfocus="showModal('transferTowns', {'param': 'to'})" readonly>
        <p class="transfer_dup_to">Поля "Перевезення з" і "Перевезення до" не можуть співпадати!</p>
        <p class="transfer_empty_to">Поля "Перевезення з" і "Перевезення до" не можуть бути пустим!</p>
        <p class="transfer_duplicated">Такий маршрут вже існує! Його можна редагувати. Ціни для групових та приватних перевезень потрібно вказувати в одному маршруті.</p>
        <div class="price_form">
            <p>Груповий</p>
            <input type="number" id="gr" name="gr" min="0" max="50000" autocomplete="off" placeholder="Ціна за груповий..." oninput="validationPrice(this), showTimeList(this)">
        </div>
        <p class="transfer_price_gr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
        <div class="price_form">
            <p>Приватний</p>
            <input type="number" id="pr" name="pr" min="0" max="50000" autocomplete="off" placeholder="Ціна за приватний..." oninput="validationPrice(this)">
        </div>
        <p class="transfer_price_pr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
        <p class="transfer_price_empt">Хоча б одна ціна має бути вказана!</p>
        <div class="add_time" style="display: none">
            <div class="add">
                <p class="time_label">Відправлення 1</p>
                <input type="text" name="time" class="time" autocomplete="off" placeholder="Час перевезення..." onfocus="showModal('transferTimes', {}, this)" readonly>
                <i class='fas fa-plus' onclick="plusTime(this, 'plus')"></i>
            </div>
        </div>
        <p class="title">Поставте галочку щоб добавити в список обраних перевезень</p>
        <input type="checkbox" id="selection" name="selection">
        <p class="title" style="margin-top:5px">Поставте галочку щоб добавити в список <span style="color:#c95f5f">приватних перевезень</span> максисально 3 шт.</p>
        <input type="checkbox" id="privat" name="privat">
        <p class="title" style="margin-top:5px">Поставте галочку щоб добавити в список <span style="color:#c95f5f">перевезень мікроавтобусом</span> максисально 3 шт.</p>
        <input type="checkbox" id="microbus" name="microbus">
        <p class="form_send" onclick="formSendTransfer('transferAdd')">Добавити в базу</p>`,
    transferTowns:
        `<p>Натисніть на місто щоб вибрати</p>
        <div class="towns_select_list"></div>
        <p class="form_send" onclick="closeSubModal()">Закрити</p>`,
    transferTimes:
        `<p>Вкажіть час</p>
        <div class="time_modal_wrap">
            <div>
                <i class='fas fa-angle-up' onclick="selectTime('hour', 'up')"></i>
                <p class="hours">00</p>
                <i class='fas fa-angle-down' onclick="selectTime('hour', 'down')"></i>
            </div>
            <p class="dvokrapka">:</p>
            <div>
                <i class='fas fa-angle-up' onclick="selectTime('minute', 'up')"></i>
                <p class="minutes">00</p>
                <i class='fas fa-angle-down' onclick="selectTime('minute', 'down')"></i>
            </div>
        </div>
        <p class="form_send admTime">Підтвердити</p>`,
    transferEdit:
        `<input type="text" id="from" name="from" maxlength="120" inputparam="" value="" autocomplete="off" placeholder="Перевезення з ..." oninput="validation(this, 'Input')" onfocus="showModal('transferTowns', {'param': 'from'})" readonly>
        <input type="text" id="to" name="to" maxlength="120" inputparam="" value="" autocomplete="off" placeholder="Перевезення до ..." oninput="validation(this, 'Input')" onfocus="showModal('transferTowns', {'param': 'to'})" readonly>
        <p class="transfer_dup_to">Поля "Перевезення з" і "Перевезення до" не можуть співпадати!</p>
        <p class="transfer_empty_to">Поля "Перевезення з" і "Перевезення до" не можуть бути пустим!</p>
        <p class="transfer_duplicated">Такий маршрут вже існує! Його можна редагувати. Ціни для групових та приватних перевезень потрібно вказувати в одному маршруті.</p>
        <div class="price_form">
            <p>Груповий</p>
            <input type="number" id="gr" name="gr" min="1" max="50000" autocomplete="off" placeholder="Ціна за груповий..." oninput="validationPrice(this), showTimeList(this)">
        </div>
        <p class="transfer_price_gr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
        <div class="price_form">
            <p>Приватний</p>
            <input type="number" id="pr" name="pr" min="1" max="50000" autocomplete="off" placeholder="Ціна за приватний..." oninput="validationPrice(this)">
        </div>
        <p class="transfer_price_pr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
        <p class="transfer_price_empt">Хоча б одна ціна має бути вказана!</p>
        <div class="add_time" style="display: none">
            <div class="add">
                <p class="time_label">Відправлення 1</p>
                <input type="text" name="time" class="time" autocomplete="off" placeholder="Час перевезення..." onfocus="showModal('transferTimes', {}, this)" readonly>
                <i class='fas fa-plus' onclick="plusTime(this, 'plus')"></i>
            </div>
        </div>
        <p class="title">Поставте галочку що добавити в список обраних перевезень</p>
        <input type="checkbox" id="selection" name="selection">
        <p class="title" style="margin-top:5px">Поставте галочку щоб добавити в список <span style="color:#c95f5f">приватних перевезень</span> максисально 3 шт.</p>
        <input type="checkbox" id="privat" name="privat">
        <p class="title" style="margin-top:5px">Поставте галочку щоб добавити в список <span style="color:#c95f5f">перевезень мікроавтобусом</span> максисально 3 шт.</p>
        <input type="checkbox" id="microbus" name="microbus">
        <p class="form_send" onclick="formSendTransfer('transferEdit')">Зберегти зміни</p>`,
    transferDel:
        `<p id="id_transfer" paramid=""></p>
        <p class="del_info" style="color:#991818;">Підтвердіть видалення маршруту!</p>
        <p class="form_send" onclick="formSendTransfer('transferDel')">Видалити остаточно!</p>`,
    transferAddRes:
        `<p class="res_mess">Маршрут додано до бази маршрутів!</p>`,
    transferEditRes:
        `<p class="res_mess">Зміни до маршруту внесено до бази маршрутів!</p>`,
    transferDelRes:
        `<p class="res_mess">Маршрут видалено із списку!</p>`,
    mainformTimes:
        `<p class="mainform_title"></p>
        <div class="time_modal_wrap">
            <div>
                <i class='fas fa-angle-up' onclick="selectTime('hour', 'up')"></i>
                <p class="hours">00</p>
                <i class='fas fa-angle-down' onclick="selectTime('hour', 'down')"></i>
            </div>
            <p class="dvokrapka">:</p>
            <div>
                <i class='fas fa-angle-up' onclick="selectTime('minute', 'up')"></i>
                <p class="minutes">00</p>
                <i class='fas fa-angle-down' onclick="selectTime('minute', 'down')"></i>
            </div>
        </div>
        <p class="main_form_send admTime"><i class='fas fa-check'></i></p>`,
    mainformCalendar:
        `<p class="mainform_title"></p>
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
        </div>`,
    mainformTimeslimit:
        `<p class="mainform_title"></p>
        <div class="towns_select_list"></div>`,
    mainformFrom:
        `<p class="mainform_title"></p>
        <div class="towns_select_list"></div>`,
    mainformTo:
        `<p class="mainform_title"></p>
        <div class="towns_select_list"></div>`,
    editMenuTown: ``,
    editMenuTransfer: ``,
    orderInfo: ``,
    feedbackInfo: ``,
    confirmPhone: ``,
    newsAdd:
        `<p class="vilid_news" id="vilid_news"></p>
        <div class="main_info_wrap">
            <div class="main_foto">
                <div id="foto_load">
                    <label for="news_foto" id="news_foto_label"></label>
                    <input type="file" name="news_foto" id="news_foto" accept=".jpg, .jpeg, .png, .bmp" onchange="validIMG(event)" hidden />
                </div>
                <button class="clear_cover" id="clear_cover" onclick="clearCoverImg()">Очистити</button>
            </div>
            <div class="main_info">
                <textarea name="news_title" id="news_title" maxlength="260" placeholder="Назва статті" oninput="resizeTextarea(this, '60'), validation(this, 'Input', 'news')" onkeydown="return (event.keyCode!=13);"></textarea>
                <textarea name="news_description" id="news_description" maxlength="700" placeholder="Опис статті" oninput="resizeTextarea(this, '100'), validation(this, 'Input', 'news')" onkeydown="return (event.keyCode!=13);"></textarea>
            </div>
        </div>
        <div class="news_create"><p id="news_create"></p><p id="news_update"></p></div>
        <div id="editor"></div>
        <button class="save_new" id="save_news" onclick="saveNews('save')">Зберегти</button>
        <button class="save_new" id="save_close_news" onclick="saveNews('saveclose')">Зберегти і закрити</button>
        `,
    newsEdit:
        `<p class="vilid_news" id="vilid_news"></p>
        <div class="main_info_wrap">
            <div class="main_foto">
                <div id="foto_load">
                    <label for="news_foto" id="news_foto_label"></label>
                    <input type="file" name="news_foto" id="news_foto" accept=".jpg, .jpeg, .png, .bmp" onchange="validIMG(event)" hidden />
                </div>
                <button class="clear_cover" id="clear_cover" onclick="clearCoverImg()">Очистити</button>
            </div>
            <div class="main_info">
                <textarea name="news_title" id="news_title" maxlength="260" placeholder="Назва статті" oninput="resizeTextarea(this, '60'), validation(this, 'Input', 'news')" onkeydown="return (event.keyCode!=13);"></textarea>
                <textarea name="news_description" id="news_description" maxlength="700" placeholder="Опис статті" oninput="resizeTextarea(this, '100'), validation(this, 'Input', 'news')" onkeydown="return (event.keyCode!=13);"></textarea>
            </div>
        </div>
        <div class="news_create"><p id="news_create"></p><p id="news_update"></p></div>
        <div id="editor"></div>
        <button class="save_new" id="save_news" onclick="saveNews('save')">Зберегти</button>
        <button class="save_new" id="save_close_news" onclick="saveNews('saveclose')">Зберегти і закрити</button>
        `,
    newsDel:
        `<p id="id_news"></p>
        <p class="del_info" style="color:#991818;">Підтвердіть видалення новини!</p>
        <p class="form_send" onclick="formDeleteNews()">Видалити остаточно!</p>`,
    newsEditRes:
        `<p class="res_mess">Новину збережено!</p>`,
    transferDelRes:
        `<p class="res_mess">Маршрут видалено із списку!</p>`,
};



