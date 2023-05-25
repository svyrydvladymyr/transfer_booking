template = {
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
    orderInfo: ``,
    feedbackInfo: ``,
};



