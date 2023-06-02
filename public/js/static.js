// const body = service.$('body')[0];

// //to resize the traffic settings block
// if (service.$('.options_container')[0]) {
//     let touchstartX = 0;
//     let touchendX = 0;
//     const slider = service.$('.options_wrap')[0];

//     const options = () => {
//         let item = 3
//         if (body.offsetWidth > 768 && body.offsetWidth < 1100) { item = 2 };
//         if (body.offsetWidth <= 768) { item = 1 };
//         const wrapSize = service.$('.options_container')[0].offsetWidth;
//         service.$('.options_wrap > .blok').forEach(element => { element.style.width = `${wrapSize / item}px` });
//     };

//     options();
//     window.addEventListener('resize', options, true);

//     const options_left = () => {
//         const wrap = service.$('.options_wrap')[0];
//         const boxW = wrap.children[0].offsetWidth;
//         const firstChild = wrap.children[0];
//         wrap.insertBefore(firstChild, wrap.firstChild);
//         wrap.style.cssText  = `transition:.2s;transform:translateX(${-boxW}px)`;
//         setTimeout(() => {
//             wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
//             wrap.appendChild(firstChild);
//         }, 100);
//     };
//     const options_right = () => {
//         const wrap = service.$('.options_wrap')[0];
//         const boxW = wrap.children[0].offsetWidth;
//         const lastChild = wrap.children[wrap.children.length - 1];
//         wrap.appendChild(lastChild);
//         wrap.style.cssText  = `transition:.2s;transform:translateX(${+boxW}px)`;
//         setTimeout(() => {
//             wrap.style.cssText  = `transition:0s;transform:translateX(0px)`;
//             wrap.insertBefore(lastChild, wrap.firstChild);
//         }, 100);
//     };
//     const optionSlider = () => {
//         const lenghtSwipe = touchendX - touchstartX;
//         if (lenghtSwipe < -40) { if (touchendX < touchstartX) options_left() };
//         if (lenghtSwipe > 40) { if (touchendX > touchstartX) options_right() };
//     };



//     slider.addEventListener('touchstart', e => {
//         touchstartX = e.changedTouches[0].screenX;
//     });
//     slider.addEventListener('touchend', e => {
//         touchendX = e.changedTouches[0].screenX;
//         optionSlider();
//     });
//     service.$('.arrow_left')[0].addEventListener('click', options_left, true);
//     service.$('.arrow_right')[0].addEventListener('click', options_right, true);
// };

//to resize the feedback block
// if (service.$('.feedback_container')[0]) {
//     let touchstartFeedX = 0;
//     let touchendFeedX = 0;

//     const sliderFeedback = service.$('.feedback_wrap')[0];

//     const feedback = () => {
//         service.$('.feedback_wrap > .feedback_block').forEach(element => {
//             element.style.minWidth = `${service.$('.feedback_container')[0].offsetWidth}px`;
//         });
//     };

//     feedback();
//     window.addEventListener('resize', feedback, true);


//     const feedbackPosition = (i) => {
//         service.$('.feedback_wrap')[0].style.transform = `translateX(-${i}00%)`;
//         service.$('.feedback_points > p').forEach(element => {
//             element.style.backgroundColor = 'rgb(141, 141, 141)';
//         });
//         service.$('.feedback_points > p')[i].style.backgroundColor = '#ee9e07';
//     };

//     const feedbackCount = () => {
//         service.$('.feedback_points')[0].innerHTML = '';
//         for (let i = 0; i < service.$('.feedback_wrap > .feedback_block').length; i++) {
//             service.$('.feedback_points')[0].innerHTML += `<p onclick="feedbackPosition(${i})"></p>`;
//         };
//         service.$('.feedback_points > p')[0].style.backgroundColor = '#ee9e07';
//     };


//     feedbackCount();

//     let stertSwipe = 0;
//     const swipeLanght = service.$('.feedback_points > p').length;

//     const slideFeed = () => {
//         if (touchendFeedX > touchstartFeedX) {
//             if (stertSwipe > 0) {
//                 stertSwipe--
//                 feedbackPosition(stertSwipe);
//             };
//         };
//         if (touchendFeedX < touchstartFeedX) {
//             if (stertSwipe < swipeLanght-1) {
//                 stertSwipe++
//                 feedbackPosition(stertSwipe);
//             };
//         };
//     };

//     sliderFeedback.addEventListener('touchstart', e => {
//         touchstartFeedX = e.changedTouches[0].screenX;
//     });
//     sliderFeedback.addEventListener('touchend', e => {
//         touchendFeedX = e.changedTouches[0].screenX;
//         slideFeed();
//     });
// };





