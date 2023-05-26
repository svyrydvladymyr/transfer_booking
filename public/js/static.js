const body = $_('body')[0];

//for showing containers
const header_node = $_('.header')[0];
const content_cont = $_('.content_container')[0];
const option_cont = $_('.options_container')[0];
const call_cont = $_('.call_container')[0];
const showContainers = () => {
    if (content_cont !== undefined && option_cont !== undefined && call_cont !== undefined) {
        let heightBlok, heightBlok2, heightBlok3;
        if (body.offsetWidth > 1280) {
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

//for changing menu in skroling process
const menu = $_('.menu_container')[0];
const social = $_('.social_wrap')[0];
const toTop = $_('#toTop')[0];
const menuOnScroll = () => {
    const socialValue = social !== undefined ? social.clientHeight : 0;
    toTop.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";
    if (body.offsetWidth > 1280) {
        (document.body.scrollTop > socialValue || document.documentElement.scrollTop > socialValue)
            ? menu.classList.add('menu_scroll')
            : menu.classList.remove('menu_scroll');
    };
    if (body.offsetWidth <= 1280) {
        if (mobileMenu.classList.contains('menu_container_wrap_mobile_active')) {
            mobileMenu.classList.remove("menu_container_wrap_mobile_active");
            $_('.container_menu')[0].classList.remove("change");
        };
        if ($_('.mobile_menu_contacts')[0].classList.contains('mobile_menu_contacts_active')) {
            mobileMenuContact.classList.remove("mobile_menu_contacts_active");
        };
    };
};

//on load
window.onload = function(event) { 
    showContainers();
    menuOnScroll()
    const tab_cont = $_('.tabs_container')[0];
    const info_cont = $_('.info_container')[0];
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
        setToMainForm(transid, transtype, transobj);
    };
};

//for close mobile menu
const mobileMenu = $_('.menu_container_wrap_mobile')[0];
const mobileMenuContact = $_('.mobile_menu_contacts')[0];
window.onclick = function(event) {        
    if (!event.target.matches(['.container_menu', '.bar1', '.bar2', '.bar3', '.logo_mobile', '.menu_container_wrap_mobile'])) {
        if (mobileMenu.classList.contains('menu_container_wrap_mobile_active')) {
            mobileMenu.classList.remove("menu_container_wrap_mobile_active");
            $_('.container_menu')[0].classList.remove("change");
        };
    };
    if (!event.target.matches('.fa-ellipsis-v')) {
        if ($_('.mobile_menu_contacts')[0].classList.contains('mobile_menu_contacts_active')) {
            mobileMenuContact.classList.remove("mobile_menu_contacts_active");
        };
    };
};

//on scroll
window.onscroll = function() {
    showContainers();
    menuOnScroll();
};

//to resize the traffic settings block
if ($_('.options_container')[0]) { 
    let touchstartX = 0;
    let touchendX = 0;
    const slider = $_('.options_wrap')[0];
    const options = () => {
        let item = 3
        if (body.offsetWidth > 768 && body.offsetWidth < 1100) { item = 2 }; 
        if (body.offsetWidth <= 768) { item = 1 }; 
        const wrapSize = $_('.options_container')[0].offsetWidth;
        $_('.options_wrap > .blok').forEach(element => { element.style.width = `${wrapSize / item}px` });
    };
    options();
    window.addEventListener('resize', options, true);
    const options_left = () => {
        const wrap = $_('.options_wrap')[0];
        const boxW = wrap.children[0].offsetWidth;
        const firstChild = wrap.children[0];        
        wrap.insertBefore(firstChild, wrap.firstChild);
        wrap.style.cssText  = `transition:.2s;transform:translateX(${-boxW}px)`;
        setTimeout(() => {
            wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
            wrap.appendChild(firstChild);
        }, 100);
    };
    const options_right = () => {
        const wrap = $_('.options_wrap')[0];
        const boxW = wrap.children[0].offsetWidth;
        const lastChild = wrap.children[wrap.children.length - 1];  
        wrap.appendChild(lastChild);
        wrap.style.cssText  = `transition:.2s;transform:translateX(${+boxW}px)`;
        setTimeout(() => {
            wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
            wrap.insertBefore(lastChild, wrap.firstChild);            
        }, 100);
    };
    const optionSlider = () => {
        const lenghtSwipe = touchendX - touchstartX;
        if (lenghtSwipe < -40) { if (touchendX < touchstartX) options_left() };
        if (lenghtSwipe > 40) { if (touchendX > touchstartX) options_right() };        
    };
    slider.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;        
    });      
    slider.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        optionSlider();
    });
    $_('.arrow_left')[0].addEventListener('click', options_left, true);
    $_('.arrow_right')[0].addEventListener('click', options_right, true);
};

//to resize the feedback block
if ($_('.feedback_container')[0]) { 
    let touchstartFeedX = 0;
    let touchendFeedX = 0;
    const sliderFeedback = $_('.feedback_wrap')[0];
    const feedback = () => {
        $_('.feedback_wrap > .feedback_block').forEach(element => { element.style.minWidth = `${$_('.feedback_container')[0].offsetWidth}px` });
    };
    feedback();
    window.addEventListener('resize', feedback, true);
    function feedbackPosition(i){
        $_('.feedback_wrap')[0].style.transform = `translateX(-${i}00%)`;        
        $_('.feedback_points > p').forEach(element => { element.style.backgroundColor = 'rgb(141, 141, 141)' });
        $_('.feedback_points > p')[i].style.backgroundColor = '#ee9e07';
    };
    const feedbackCount = () => {
        $_('.feedback_points')[0].innerHTML = '';
        for (let i = 0; i < $_('.feedback_wrap > .feedback_block').length; i++) { $_('.feedback_points')[0].innerHTML += `<p onclick="feedbackPosition(${i})"></p>` };
        $_('.feedback_points > p')[0].style.backgroundColor = '#ee9e07';
    };
    feedbackCount();
    let stertSwipe = 0;
    const swipeLanght = $_('.feedback_points > p').length;
    function slideFeed() {
        if (touchendFeedX > touchstartFeedX) {
            if (stertSwipe > 0) {
                stertSwipe--
                feedbackPosition(stertSwipe);
            };
        };
        if (touchendFeedX < touchstartFeedX) {
            if (stertSwipe < swipeLanght-1) {
                stertSwipe++
                feedbackPosition(stertSwipe);
            };
        };
    };
    sliderFeedback.addEventListener('touchstart', e => {
        touchstartFeedX = e.changedTouches[0].screenX;
    });    
    sliderFeedback.addEventListener('touchend', e => {
        touchendFeedX = e.changedTouches[0].screenX;
        slideFeed();
    });
};

//load variables list
const loadVariablesList = () => {
    send('', `/towns/variables`, (result) => {
        const resultat = JSON.parse(result);
        if (resultat.res) {
            townsFrom = resultat.res.towns_from;
            townsTo = resultat.res.towns_to;
            transfersArr = resultat.res.transfers_arr;
            const langName = getLang('lang');
            const privatWrap = $_('.wrap_prevat')[0];
            const microbusWrap = $_('.wrap_microbus')[0];
            const specialWrap = $_('.wrap_special')[0];
            if (privatWrap !== undefined) {
                privatWrap.innerHTML = '';
                resultat.res.privat.forEach(priv => {
                    transfersArr.forEach(transf => {
                        if (transf.transfer_id === priv.transfer_id) {
                            privatWrap.innerHTML += `
                            <p onclick="setToMainForm('${transf.transfer_id}', 'pr',
                                {'from': '${townsFrom[transf.transfer_from]}',
                                'to': '${townsTo[transf.transfer_to]}',
                                'fromid': '${transf.transfer_from}',
                                'toid': '${transf.transfer_to}'})">
                                <i class='fas fa-arrow-alt-circle-right'></i>${townsFrom[transf.transfer_from]} - ${townsTo[transf.transfer_to]}</p>
                            <p class="price"><span>${lang[`from${langName}`]}</span>${transf.price_pr}<span>${lang[`sum_type${langName}`]}</span></p>`
                        };
                    });
                });
            };
            if (microbusWrap !== undefined) {
                microbusWrap.innerHTML = '';
                resultat.res.microbus.forEach(micro => {
                    transfersArr.forEach(transf => {
                        if (transf.transfer_id === micro.transfer_id) {
                            microbusWrap.innerHTML += `
                            <p onclick="setToMainForm('${transf.transfer_id}', 'gr',
                                {'from': '${townsFrom[transf.transfer_from]}',
                                'to': '${townsTo[transf.transfer_to]}',
                                'fromid': '${transf.transfer_from}',
                                'toid': '${transf.transfer_to}'})">
                                <i class='fas fa-arrow-alt-circle-right'></i>${townsFrom[transf.transfer_from]} - ${townsTo[transf.transfer_to]}</p>
                            <p class="price"><span>${lang[`from${langName}`]}</span>${transf.price_gr}<span>${lang[`sum_type${langName}`]}</span></p>`
                        };
                    });
                });
            };
            if (specialWrap !== undefined) {
                specialWrap.innerHTML = '';
                resultat.res.spec.forEach(spec => {
                    transfersArr.forEach(transf => {
                        if (transf.transfer_id === spec.transfer_id) {
                            specialWrap.innerHTML += `
                            <div>
                                <p><i class='fas fa-arrow-alt-circle-right'></i>
                                    <span>${townsFrom[transf.transfer_from]}</span>
                                    <span>&nbsp-&nbsp</span>
                                    <span>${townsTo[transf.transfer_to]}</span>
                                </p>
                                <p class="price"><span>${lang[`from${langName}`]}</span>${transf.price_pr}<span>${lang[`sum_type${langName}`]}</span></p>
                                <p class="special_btn" onclick="sendToMainForm('${transf.transfer_id}', 'pr',
                                    {'from': '${townsFrom[transf.transfer_from]}',
                                    'to': '${townsTo[transf.transfer_to]}',
                                    'fromid': '${transf.transfer_from}',
                                    'toid': '${transf.transfer_to}'}
                                )">${lang[`book${langName}`]}</p>
                            </div>`
                        };
                    });
                });
            };
        };
    }, 'GET');
};