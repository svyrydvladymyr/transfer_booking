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
    townEdit: 
    ``,
    townDel: 
    ``
};   

