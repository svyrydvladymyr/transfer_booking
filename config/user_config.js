
const permit = ['town', 'townlist', 'transfer', 'transferlist', 'orderstatus', 'saveposition', 'feedbacklist', 'sendanswer'];
const data = ['orderslist'];
const id = [];

const userDate = {
    'permit' : 'userid, permission',
    'data' : 'userid, email, phone, phone_verified, permission',
    'id' : 'userid'
};

module.exports = (req, res) => {
    // console.log('iii', req.originalUrl);
    const originalUrl = req.originalUrl; 
    const url = originalUrl !== undefined ? originalUrl.replace('/', '') : '';
    let param = '';    

    // console.log('url', url);
    
    permit.includes(url) ? param = userDate.permit : null;
    data.includes(url) ? param = userDate.data : null;
    id.includes(url) ? param = userDate.id : null;
    // console.log('param', param);
    return param;
}