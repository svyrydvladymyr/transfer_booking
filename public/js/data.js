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
            <p class="del_info">Підтвердіть видалення</p>
            <p class="del_info">Зверніть увагу, що після видалення міста також будуть недоступні маршрути з цим містом</p>
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
            <input type="text" id="from" name="from" maxlength="40" inputparam="" value="" placeholder="Трансфер з ..." oninput="validationInput(this)" onfocus="showModal('transferTowns', {'param': 'from'})">
            <input type="text" id="to" name="to" maxlength="40" inputparam="" value="" placeholder="Трансфер до ..." oninput="validationInput(this)" onfocus="showModal('transferTowns', {'param': 'to'})">
            <p class="transfer_dup_to">Поля "Трансфер з" і "Трансфер до" не можуть співпадати!</p>
            <p class="transfer_empty_to">Поля "Трансфер з" і "Трансфер до" не може бути пустим!</p>
            <div> 
                <p>Груповий</p>
                <input type="number" id="gr" name="gr" min="1" max="50000" placeholder="Ціна за груповий" oninput="validationPrice(this)">
            </div>
            <p class="transfer_price_gr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
            <div> 
                <p>Приватний</p>
                <input type="number" id="pr" name="pr" min="1" max="50000" placeholder="Ціна за приватний" oninput="validationPrice(this)">
            </div>
            <p class="transfer_price_pr">Перевищує допустимі значення! (доступно з 1грн до 50000грн)</p>
            <p class="transfer_price_empt">Хоча б одна ціна має бути вказана!</p>
            <div class="add_time">
                <div class="add">    
                    <p class="time_label">Відправлення 1</p>            
                    <input type="text" name="translate" placeholder="Час групового перевезення...">
                    <i class='fas fa-plus' onclick="plusTranslate(this, 'plus')"></i>
                </div>  
            </div>
            

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
    ``,
    transferEdit:
    ``,
    transferEditRes:
    ``,
    transferDel:
    ``,
    transferDelRes:
    ``
};   

