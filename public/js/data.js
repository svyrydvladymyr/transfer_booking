template = {
    town:
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times'></i>
        </div>
        <div class="modal_place" id="town">
            <p id="id_town"></p>
            <p class="form_info">Унікальний номер міста</p>            
            <input type="text" id="ua" name="ua" maxlength="50" placeholder="Назва українською" oninput="creatingIdTown(this)">
            <input type="text" id="en" name="en" maxlength="50" placeholder="Name in English">
            <input type="text" id="ru" name="ru" maxlength="50" placeholder="Название на русском">
            <p class="form_send" onclick="formSend('town')">Добавити в базу</p>
        </div>        
    </div>`
};   

