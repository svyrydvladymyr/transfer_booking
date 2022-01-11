template = {
    townAdd:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="townAdd">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <input type="text" id="ua" name="ua" maxlength="0" placeholder="Назва українською" oninput="creatingIdTown(this), validationInput(this)">
            <p class="town_dup_ua">Така назва вже є в базі!</p>
            <p class="town_empty_ua">Не може бути пустим!</p>
            <input type="text" id="en" name="en" maxlength="0" placeholder="Name in English" oninput="validationInput(this)">
            <p class="town_dup_en">Така назва вже є в базі!</p>
            <p class="town_empty_en">Не може бути пустим!</p>
            <input type="text" id="ru" name="ru" maxlength="50" placeholder="Название на русском" oninput="validationInput(this)">
            <p class="town_dup_ru">Така назва вже є в базі!</p>
            <p class="town_empty_ru">Не може бути пустим!</p>
            <p class="form_send" onclick="formSend('townAdd')">Добавити в базу</p>
        </div>        
    </div>`,
    townAddRes:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="townAdd">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <p class="res_mess">Місто додано до списку!</p>
        </div>        
    </div>`,
    townEdit: 
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="townEdit">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <input type="text" id="ua" name="ua" maxlength="50" placeholder="Назва українською" oninput="validationInput(this)">
            <p class="town_dup_ua">Така назва вже є в базі!</p>
            <p class="town_empty_ua">Не може бути пустим!</p>
            <input type="text" id="en" name="en" maxlength="50" placeholder="Name in English" oninput="validationInput(this)">
            <p class="town_dup_en">Така назва вже є в базі!</p>
            <p class="town_empty_en">Не може бути пустим!</p>
            <input type="text" id="ru" name="ru" maxlength="50" placeholder="Название на русском" oninput="validationInput(this)">
            <p class="town_dup_ru">Така назва вже є в базі!</p>
            <p class="town_empty_ru">Не може бути пустим!</p>
            <p class="form_send" onclick="formSend('townEdit')">Зберегти зміни</p>
        </div>        
    </div>`,
    townEditRes:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="townEdit">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <p class="res_mess">Зміни внесено!</p>
        </div>        
    </div>`,
    townDel:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="townDel">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <p class="del_info" style="color:#991818;">Підтвердіть видалення!</p>
            <p class="del_info" style="color:#991818;">Зверніть увагу, що після видалення міста також будуть недоступні маршрути з цим містом</p>
            <p class="form_send" onclick="formSend('townDel')">Видалити остаточно!</p>
        </div>        
    </div>`,
    townDelRes:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="townDel">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <p class="res_mess">Місто видалено із списку!</p>
        </div>        
    </div>`,
    transferAdd:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="transferAdd">
            <input type="text" id="from" name="from" maxlength="60" inputparam="" value="" autocomplete="off" placeholder="Перевезення з ..." oninput="validationInput(this)" onfocus="showModal('transferTowns', {'param': 'from'})">
            <input type="text" id="to" name="to" maxlength="60" inputparam="" value="" autocomplete="off" placeholder="Перевезення до ..." oninput="validationInput(this)" onfocus="showModal('transferTowns', {'param': 'to'})">
            <p class="transfer_dup_to">Поля "Перевезення з" і "Перевезення до" не можуть співпадати!</p>
            <p class="transfer_empty_to">Поля "Перевезення з" і "Перевезення до" не можуть бути пустим!</p>
            <div> 
                <p>Груповий</p>
                <input type="number" id="gr" name="gr" min="0" max="50000" autocomplete="off" placeholder="Ціна за груповий..." oninput="validationPrice(this), showTimeList(this)">
            </div>
            <p class="transfer_price_gr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
            <div> 
                <p>Приватний</p>
                <input type="number" id="pr" name="pr" min="0" max="50000" autocomplete="off" placeholder="Ціна за приватний..." oninput="validationPrice(this)">
            </div>
            <p class="transfer_price_pr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
            <p class="transfer_price_empt">Хоча б одна ціна має бути вказана!</p>
            <div class="add_time" style="display: none">
                <div class="add">    
                    <p class="time_label">Відправлення 1</p>            
                    <input type="text" name="time" class="time" autocomplete="off" placeholder="Час перевезення..." onfocus="showModal('transferTimes', {}, this)">
                    <i class='fas fa-plus' onclick="plusTime(this, 'plus')"></i>
                </div>  
            </div>
            <p class="title">Поставте галочку щоб добавити в список обраних перевезень</p>
            <input type="checkbox" id="selection" name="selection">
            <p class="form_send" onclick="formSendTransfer('transferAdd')">Добавити в базу</p>
        </div>  
        <div class="wrap_sub_modal"></div>      
    </div>`,
    transferTowns:
    `<div class="modal_body">
        <div class="modal_place" id="transferTowns">
            <p>Натисніть на місто щоб вибрати</p>
            <div class="towns_select_list"></div>
            <p class="form_send" onclick="closeSubModal()">Закрити</p>
        </div>        
    </div>`,
    transferAddRes:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="townDel">     
            <p class="res_mess">Маршрут додано до бази маршрутів!</p>
        </div>        
    </div>`,
    transferTimes:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeSubModal()"></i>
        </div>
        <div class="modal_place" id="transferTimes">     
            <p>Вкажіть час</p>
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
            <p class="form_send admTime">Підтвердити</p>
        </div>        
    </div>`,
    transferEdit:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="transferEdit" paramid="">
            <input type="text" id="from" name="from" maxlength="60" inputparam="" value="" autocomplete="off" placeholder="Перевезення з ..." oninput="validationInput(this)" onfocus="showModal('transferTowns', {'param': 'from'})">
            <input type="text" id="to" name="to" maxlength="60" inputparam="" value="" autocomplete="off" placeholder="Перевезення до ..." oninput="validationInput(this)" onfocus="showModal('transferTowns', {'param': 'to'})">
            <p class="transfer_dup_to">Поля "Перевезення з" і "Перевезення до" не можуть співпадати!</p>
            <p class="transfer_empty_to">Поля "Перевезення з" і "Перевезення до" не можуть бути пустим!</p>
            <div> 
                <p>Груповий</p>
                <input type="number" id="gr" name="gr" min="1" max="50000" autocomplete="off" placeholder="Ціна за груповий..." oninput="validationPrice(this), showTimeList(this)">
            </div>
            <p class="transfer_price_gr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
            <div> 
                <p>Приватний</p>
                <input type="number" id="pr" name="pr" min="1" max="50000" autocomplete="off" placeholder="Ціна за приватний..." oninput="validationPrice(this)">
            </div>
            <p class="transfer_price_pr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
            <p class="transfer_price_empt">Хоча б одна ціна має бути вказана!</p>
            <div class="add_time" style="display: none">
                <div class="add">    
                    <p class="time_label">Відправлення 1</p>            
                    <input type="text" name="time" class="time" autocomplete="off" placeholder="Час перевезення..." onfocus="showModal('transferTimes', {}, this)">
                    <i class='fas fa-plus' onclick="plusTime(this, 'plus')"></i>
                </div>  
            </div>
            <p class="title">Поставте галочку що добавити в список обраних перевезень</p>
            <input type="checkbox" id="selection" name="selection">
            <p class="form_send" onclick="formSendTransfer('transferEdit')">Добавити в базу</p>
        </div>  
        <div class="wrap_sub_modal"></div>      
    </div>`,
    transferEditRes:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="transferEdit">     
            <p class="res_mess">Зміни до маршруту внесено до бази маршрутів!</p>
        </div>        
    </div>`,
    transferDel:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="transferDel">     
            <p id="id_transfer" paramid=""></p>     
            <p class="del_info" style="color:#991818;">Підтвердіть видалення маршруту!</p>
            <p class="form_send" onclick="formSendTransfer('transferDel')">Видалити остаточно!</p>
        </div>        
    </div>`,
    transferDelRes:
    `<div class="modal_body">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="transferDel">
            <p class="res_mess">Маршрут видалено із списку!</p>
        </div>        
    </div>`,
    mainformTimes:
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="mainformTimes">     
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
            <p class="main_form_send admTime"><i class='fas fa-check'></i></p>
        </div>        
    </div>`,
    mainformTimeslimit:
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times' onclick="closeModal(event)"></i>
        </div>
        <div class="modal_place" id="mainformTimeslimit">     
        </div>        
    </div>`
};   

