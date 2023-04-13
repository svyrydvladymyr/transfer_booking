const Url = require('url-parse');
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
    };

    async create(req, res) {
        return new Promise((resolve, reject) => {
            const upload = multer({ storage: this.storage, fileFilter: this.fileFilter, limits: this.limits });
            const createArticle = upload.single("cover");
            createArticle(req, res, async (error) => {
                (error) && reject(error);
                const body = JSON.parse(req.body.obj);
                const dir = `${__dirname}/../../public/img/news/${body.token}`;
                const image_path = `${req.headers.origin}/img/news/${body.token}`;
                const image_names = (body.foto) ? body.foto.join('|') : '';
                const article = (image_names !== '')
                    ? body.article.replace(new RegExp(`${image_names}`, "gi"), name => `${image_path}/${name}.jpg`)
                    : body.article;

                console.log("error", error);
                // console.log("req.url", req);
                console.log("req.url", req.headers.host);
                console.log("req.url", req.headers.origin);

                console.log("body", body);
                console.log('image_names', image_names);
                console.log("article", article);

                if (req.file) {
                    console.log("file", req.file);
                    console.log("file", req.file.path);
                    Jimp.read(req.file.path)
                    .then((image) => {
                        image
                        .cover(300, 200, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_TOP)
                        .write(`${dir}/cover_resized.jpg`);
                        image
                        .cover(600, 400, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_TOP)
                        .write(`${dir}/cover_resized_big.jpg`);
                    })
                    .catch((error) => reject(error) );
                };
                const sql = `INSERT INTO blog (id_blog, name, description, article, date_create)
                    VALUES ('${checOnTrueVal(body.token)}',
                            '${checOnTrueVal(body.title)}',
                            '${checOnTrueVal(body.description)}',
                            '${article}',
                            '${readyFullDate(new Date(), '')}')`;
                return await query(sql)
                    .then(() => resolve("News created!"))
                    .catch((error) => reject(error) );
            });
        });
    };

    async fotos(req, res) {
        const dir = `${__dirname}/../../public/img/news/${req.body.token}`;
        const path = `${req.headers.origin}/img/news/${req.body.token}/`
        const image_base = Object.keys(req.body.fotobase);
        const httpnames = req.body.httpnames.map(element => element.split("/")[element.split("/").length - 1].replace(/.jpg/g, '') );
        const for_save = ['cover', 'cover_resized', 'cover_resized_big', ...httpnames, ...image_base];
        const file_is = fs.readdirSync(dir).map( file => file.replace(/.jpg/g, '') );


        console.log("dir", dir);
        console.log("path", path);
        console.log("httpnames", httpnames);
        console.log("for_save", for_save);
        console.log("req.headers.origin", req.headers.origin);
        // console.log('foto_fffffffffff', req.body);
        console.log('foto_fffffffffff', image_base);
        console.log('foto_fffffffffff', image_base.length);
        console.log('file_is', file_is);



        file_is.forEach(element => {
            if (!for_save.includes(element)) {
                fs.unlink(`${dir}/${element}.jpg`, (error) =>{
                    (error) && console.log('File deleted error:', error);
                });
            };
        });

        if (req.body && image_base.length > 0) {

            Object.entries(req.body.fotobase).forEach(([key, value]) => {
                const base64 = value.replace(/data:image\/jpeg;base64,/g, '');
                const buffer = Buffer.from(base64, "base64");
                Jimp.read(buffer)
                .then((image) => {
                    image
                    .resize(1400, Jimp.AUTO)
                    // .cover(400, 250, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_TOP)
                    .write(`${dir}/${key}.jpg`);
                })
                .catch((error) => 'errrrrrrr' );
            });

        };
        return 'Foto added!'
    };

    async open(req, res) {
        console.log('req.params[userid]oooooooooooooooooo', req.params['userid']);
        return {
            token: req.params['userid'],
            title: 'iiiiii',
            description: 'iiiiii iiiiiiiiiii iiiiiiiii',
            article: 'iiiiiiiiiii',
        }
    }
}

module.exports = new NewsServise();