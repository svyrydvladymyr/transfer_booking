template = {
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
};



