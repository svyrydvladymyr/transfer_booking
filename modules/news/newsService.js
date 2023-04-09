const multer  = require('multer');
const Jimp = require("jimp");
const fs = require('fs');
const {query, checOnTrueVal, readyFullDate, token, clienttoken} = require('../service');

class NewsServise {
    limits = {
        fieldNameSize: 15,
        fileSize: 5242880
    };
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            try {
                const dir = `${__dirname}/../../public/img/news/${JSON.parse(req.body.obj).token}`;
                !fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
                cb(null, dir);
            } catch (error) {
                cb(new Error(`Error creating folder: ${error}!`));
            }
        },
        filename: (req, file, cb) => {
            cb(null, `cover.jpg`);
        },
    });
    fileFilter(req, file, cb) {
        ["image/jpg", "image/jpeg", "image/png"].includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error(`Bad format file: ${file.mimetype}!`));
    }

    async create(req, res) {
        return new Promise((resolve, reject) => {
            const upload = multer({ storage: this.storage, fileFilter: this.fileFilter, limits: this.limits });
            const createArticle = upload.single("cover");
            createArticle(req, res, async (error) => {
                (error) && reject(error);
                const body = JSON.parse(req.body.obj);



                console.log("error", error);
                console.log("file", req.file);
                console.log("file", req.file.path);
                console.log("body", body);

                let buff_cover = fs.readFileSync(req.file.path);

                console.log('buff', buff);

                let base64data = buff.toString('base64');
                // console.log('base64data', base64data);


                const buffer = Buffer.from(base64data, "base64");
                Jimp.read(buffer, (err, res) => {
                    if (err) throw new Error(err);
                    res.quality(20).write("cover_resized.jpg");
                });



                return resolve("News created!");
            });
        });
    }
}

module.exports = new NewsServise();