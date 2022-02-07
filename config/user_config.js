const permit = ['town', 'townlist', 'transfer', 'transferlist', 'orderstatus', 'saveposition', 'sendanswer'];
const data = ['orderslist', 'feedbacklist'];
const id = [];

const userDate = {
    'permit' : 'userid, permission',
    'data' : 'userid, email, phone, phone_verified, permission',
    'id' : 'userid'
};

module.exports = (req, res) => {
    const originalUrl = req.originalUrl; 
    const url = originalUrl !== undefined ? originalUrl.replace('/', '') : '';
    let param = '';    
    permit.includes(url) ? param = userDate.permit : null;
    data.includes(url) ? param = userDate.data : null;
    id.includes(url) ? param = userDate.id : null;
    return param;
};