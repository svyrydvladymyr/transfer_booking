const {autorisationCheck, getTableRecord, log} = require('./service');

module.exports = async (req, res) => {
    const word = req.body.word;
    let userLlang = 'en-US';
    console.log(word);


    autorisationCheck(req, res)
    .then((user) => {
        if (user === false) { throw new Error('error-autorisation') };
        userLlang = user.my_lang;
        return `SELECT * FROM words WHERE word_lang = '${user.my_lang}' && (word = '${word}' || word_translation = '${word}')`;
    })
    .then(await getTableRecord)
    .then((word) => {  

        console.log('word', word);



        // const {Translate} = require('@google-cloud/translate').v2;        
        // const translate = new Translate({
        //     credentials: {
        //         "type": "service_account",
        //         "project_id": "rwords-335111",
        //         "private_key_id": "96fcf382a9b94d7fb8e68fa5a40c4974fa2535c6",
        //         "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCHpu0tYryuSMXV\nT74ei6bIYol0RuThqV8wVPwnxtAXpQ/rTZWrappnRTQ1+vK2PA+rpJioxCNW7++f\nh4ni1HWS0iFK7XbzbOe6BoKyGAYNOow9xbXNfK5enXEA4C2mHhnC3Vtj2Mi7OEhf\nQ3Xdc/WExB9pW6MeFY9FgXz0eYvZHdkeSqnsjMnSI9wFQMPfJfzNr5Dpv/9WXnWn\nVAXXddS3NUvjgAUFOnO2fOmItQS6GhilB8Xcb6MxGPsskB/QdAm/A3TKoAdkKVhg\nk7fma0CXb11+OycQvqlJzT0sg+8pEvz/NQq7wEoHwVQJ2LjYSZGeQpLWTkuYue9D\neerWHugHAgMBAAECggEAAKy95Unmcl9+TG9XHMPJEpoa4O8xWEYFaTIjBvegNV3m\n1F7Qbcfb+MOJXPNgnbNyyIHLGJvRKS+MW5jLAMvZwd81ty+zNcbG6E/7+nLQJOSz\nqeL/4oPKQkI6O6zhzT+9FREQ0VBUv0mqYn7taSqYgA6RsW55Qz8MNWZNftHT9kKD\n5UITp9ZWQqhhizjsYjPA+BmJzyDOBkqHuaByCjhy4pHEzCzsFeCZ40W4H23en++A\n5U0tR3xmVmSzM9RlFbh71JQlM5LyEuxcpJnM2GbbArS9I2Ca1cvYjm3xYWdmNnvm\n70gVHBoHCjCvg9P2ogxkzsoP4bBNJIRe2+XAwK9jMQKBgQC+MnG4WXA4lRC2Zs7V\neatEOvP5xrOijrXgib+QNqwcu8WXCeovwrqHSqKD0wluTRX4b3doTw6nKiXL3fAS\nAVQjbFCyDmcpPR0G+GNUDLPWvk+hOU1RqUvTaMCCdCssQa9jT0Egf3qFPIX7jbbe\nkO+Vw7UDKWNKrm5frbzNBkD6iwKBgQC2lX0iVEubc4pZwjNrKB61jA1Upn4bhtSL\nkaq1f2wwHXmgegBs+bcTyNMFARAPgucz/omgkMWjdBLpyXHKL0Rf/ehVBFogN/th\n7VaErGfG2uQtQf1fTDbgqB4nmeTXaaeXL/B3cMc6ahK+Kt+HB7kdehD19QUM1kKg\npojHFm6D9QKBgEBWXgOHNZ/eRNX+tu6dhqLA8nDGl1NgxQNcdVF6PQRHPFKYRwC6\n9U/4njrLc4A9UTZFtnWxcHp5lml8/M2KZ4TIChABMUJQ6vXFpgvzdA4rOFKISLBb\n/UtZPu2iEEybN5H3aEdu9+oEDCqIyJhHHNRjbGLSaEUF9k4lPh14hRh7AoGAEbDe\nVQsx4DgLubK1ZLaYcyLEz+Tp5yTjRzqv/bIA+5B/jmsDy4tOj94vhBacRcR7PnB1\nSVd9rt66Tmi0W9DEoUBq2IH5cZG7C7wBXA2QaJYg8bmpISizUIU5lsC0iaK1GFMO\ny6PjyecpNb/VtLGs4AxJxGsfOCUyg3pfWlr0DlkCgYEAqzHJCq/cGteCOu+Sul4w\nMeBME6llBR1oCcECY8dXTkfCVqN4PB1/GxGELq0aUXmNw8rLzrfnDeyT1qL7oran\nlX8ANh/xI38hpTzirkQ/SzYk2joNQjMdiSKKWJqVY1QhBjGZv682KfHJPp+tSQeB\nMx/jIgskGuo3QqAt1cRqS6E=\n-----END PRIVATE KEY-----\n",
        //         "client_email": "rwords@rwords-335111.iam.gserviceaccount.com",
        //         "client_id": "101812102755906001681",
        //         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        //         "token_uri": "https://oauth2.googleapis.com/token",
        //         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        //         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/rwords%40rwords-335111.iam.gserviceaccount.com"
        //       },
        //     projectId: 'rwords-335111'});
        
        // async function quickStart() {
        //   const text = 'checdfhfghking';        
        //   const target = 'uk';        
        //   const [translation] = await translate.translate(text, target);
        //   console.log(`Text: ${text}`);
        //   console.log(`Translation: ${translation}`);
        // }
        
        // quickStart();

        const translate = require('google-translate-api');
 
        translate('I speak Dutch!', {from: 'en', to: 'nl'}).then(res => {
            console.log(res.text);
            //=> Ik spreek Nederlands!
            console.log(res.from.text.autoCorrected);
            //=> true
            console.log(res.from.text.value);
            //=> I [speak] Dutch!
            console.log(res.from.text.didYouMean);
            //=> false
        }).catch(err => {
            console.error(err);
        });

        if (word.err) { throw new Error(word.err) }; 
        if (word == '') { 
            res.send({"NO":`<div class='add-word-btn-wrap'><b>Такого слова в нашому переліку немає! Ви можете його добавити!</b><button id='add' onclick="showModal('add')"><i class='fas fa-plus'></i></button></div>`}); 
        }; 
        if (word != '') {
            res.send({"words": word}); 
        }


    })
    .catch((err) => {
        log('words-error', err);
        res.status(500).send('SERVER ERROR: 500 (Internal Server Error)');
    });
};