const multer  = require('multer');
const fs = require('fs');
const {query, checOnTrueVal, readyFullDate, token, clienttoken} = require('../service');

class NewsServise {
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
            console.log("filename", file);

            if (req.file === undefined) {
                cb(null, file.originalname);
            }
        },
    });

    fileFilter(req, file, cb) {
        ["image/jpg", "image/jpeg", "image/png"].includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error(`Bad format file: ${file.mimetype}!`));
    }

    async create(req, res) {
        return new Promise((resolve, reject) => {
            const upload = multer({ storage: this.storage, fileFilter: this.fileFilter });
            const createArticle = upload.single("cover");
            createArticle(req, res, async (error) => {
                (error) && reject(error);

                const body = JSON.parse(req.body.obj);

                console.log("error", error);
                console.log("file", req.file);
                console.log("body", body);

                setTimeout(() => {
                    return resolve("News created!");
                }, 5000);
            });
        });
    }
}

module.exports = new NewsServise();