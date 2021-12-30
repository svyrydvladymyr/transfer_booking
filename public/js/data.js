template = {
    townAdd:
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times'></i>
        </div>
        <div class="modal_place" id="townAdd">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <input type="text" id="ua" name="ua" maxlength="50" placeholder="Назва українською" oninput="creatingIdTown(this), validationInput(this)">
            <p class="town_dup_ua">Така назва вже є в базі!</p>
            <p class="town_empty_ua">Не може бути пустим!</p>
            <input type="text" id="en" name="en" maxlength="50" placeholder="Name in English" oninput="validationInput(this)">
            <p class="town_dup_en">Така назва вже є в базі!</p>
            <p class="town_empty_en">Не може бути пустим!</p>
            <input type="text" id="ru" name="ru" maxlength="50" placeholder="Название на русском" oninput="validationInput(this)">
            <p class="town_dup_ru">Така назва вже є в базі!</p>
            <p class="town_empty_ru">Не може бути пустим!</p>
            <p class="form_send" onclick="formSend('townAdd')">Добавити в базу</p>
        </div>        
    </div>`,
    townAddRes:
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times'></i>
        </div>
        <div class="modal_place" id="townAdd">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <p class="res_mess">Місто додано до списку!</p>
        </div>        
    </div>`,
    townEdit: 
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times'></i>
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
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times'></i>
        </div>
        <div class="modal_place" id="townEdit">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <p class="res_mess">Зміни внесено!</p>
        </div>        
    </div>`,
    townDel:
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times'></i>
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
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times'></i>
        </div>
        <div class="modal_place" id="townDel">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <p class="res_mess">Місто видалено із списку!</p>
        </div>        
    </div>`
};   

