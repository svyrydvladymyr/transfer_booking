const multer  = require('multer');
const Jimp = require("jimp");
const fs = require("fs");
const rimraf = require("rimraf");
const { query, validValue, readyFullDate, translit } = require("../service");

class NewsServise {
    limits = {
        fieldNameSize: 15,
        fileSize: 9242880
    };
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            try {
                const dir = `${__dirname}/../../public/img/news/${JSON.parse(req.body.obj).token}`;
                !fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
                cb(null, dir);
            } catch (error) {
                cb(new Error(`Foto error: Error creating folder: ${error}!`));
            }
        },
        filename: (req, file, cb) => {
            if (file.fieldname === 'cover') {
                req.body.cover = file.originalname.replace(/_cover.jpg/g, "");
                cb(null, file.originalname)
            } else {
                cb(null, file.originalname)
            };
        },
    });

    fileFilter(req, file, cb) {
        ["image/jpg", "image/jpeg", "image/png"].includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error(`Bad format file: ${file.mimetype}!`));
    }

    async cover(cover, cover_name, dir) {
        try {
            const image = await Jimp.read(cover[0].path);
            image.resize(1400, Jimp.AUTO)
                .write(`${dir}/${cover_name}_cover.jpg`);
            image.cover(600, 400, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE)
                .write(`${dir}/${cover_name}_cover_resized_footer.jpg`);
            image.cover(600, 300, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE)
                .write(`${dir}/${cover_name}_cover_resized_main.jpg`);
            image.cover(300, 200, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE)
                .write(`${dir}/${cover_name}_cover_resized_admin.jpg`);
            return "Cover saved!";
        } catch (error) {
            throw new Error(`Foto error: ${error}`);
        };
    };

    async gallery(gallery, dir) {
        if (gallery.length > 0 && fs.existsSync(dir)) {
            return new Promise((resolve, reject) => {
                let x = 0;
                gallery.forEach((value) => {
                    Jimp.read(value.path)
                    .then((image) => {
                        image
                        .resize(1400, Jimp.AUTO)
                        .write(`${dir}/${value.originalname}`);
                        (++x === gallery.length) && resolve("Gallery saved!")
                    })
                    .catch((error) => reject(`Foto error: ${error}`));
                });
            });
        } else {
            throw new Error("Foto error: List of photos empty!")
        };
    };

    async replaceImagesPath(body) {
        const image_path = `/img/news/${body.token}`;
        const image_names = body.gallery ? body.gallery.join("|") : '';
        return (image_names !== "" && typeof body.gallery !== "string")
            ? body.article.replace(new RegExp(`${image_names}`, "gi"), (name) => `${image_path}/${name}.jpg`)
            : body.article;
    };

    async create(body, cover) {
        const title = await validValue(body.title);
        const description = await validValue(body.description);
        return `INSERT INTO blog (id_blog, alias, title, description, cover, article, date_create)
            VALUES ('${await validValue(body.token)}',
                    '${translit(title.replace(/\s\s+/g, ' ').trim().replace(/ /gi, '-').toLowerCase())}',
                    '${title.replace(/\s\s+/g, ' ').trim()}',
                    '${description.replace(/\s\s+/g, ' ').trim()}',
                    '${cover ? cover : ''}',
                    '${await validValue(await this.replaceImagesPath(body), "news")}',
                    '${readyFullDate(new Date(), "")}')`;
    };

    async edit(body, cover) {
        const title = await validValue(body.title);
        const description = await validValue(body.description);
        const alias = await validValue(body.title, 'alias');
        return `UPDATE blog
            SET alias = '${translit(alias.replace(/\s\s+/g, ' ').trim().replace(/ /gi, '-').toLowerCase())}',
                title = '${title.replace(/\s\s+/g, ' ').trim()}',
                description = '${description.replace(/\s\s+/g, ' ').trim()}',
                ${cover ? `cover = '${cover}',` : ""}
                article = '${await validValue(await this.replaceImagesPath(body), "news")}',
                date_update = '${readyFullDate(new Date(), "")}'
            WHERE id_blog = '${body.token}'`;
    };

    async deleteFotos(body, dir) {
        const cover_is_names = fs.readdirSync(dir).map((file) => file.includes('cover') ? file.replace(/.jpg/g, "") : '');
        const for_save = [
            ...(body.cover && body.cover !== '') ? cover_is_names.filter((name) => name.includes(body.cover)) : [],
            ...body.httpnames.map((element) => element.split("/")[element.split("/").length - 1].replace(/.jpg/g, "")),
            ...body.gallery ? body.gallery : []
        ].filter((name) => name.length > 0);
        const file_is = fs.readdirSync(dir).map((file) => file.replace(/.jpg/g, ""));
        let x = 0;
        file_is.forEach((element) => {
            if (!for_save.includes(element)) {
                if (fs.existsSync(`${dir}/${element}.jpg`)) {
                    fs.unlink(`${dir}/${element}.jpg`, (error) => {
                        error && console.log("File deleted error:", error);
                    });
                };
            };
            (++x === for_save.length) && console.log("---news---: Photos deleted!");
        });
    };

    async save(req, res, route) {
        return new Promise((resolve, reject) => {
            const upload = multer({ storage: this.storage, fileFilter: this.fileFilter, limits: this.limits })
            .fields([{ name: 'cover', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]);
            upload(req, res, async (error) => {
                (error) && reject(error);
                try {
                    const body = JSON.parse(req.body.obj);
                    body.cover = (req.body.cover) ? req.body.cover : body.cover;
                    const dir = `${__dirname}/../../public/img/news/${body.token}`;
                    const sql = await this[route](body, req.body.cover);
                    return await query(sql)
                    .then(async (resultat) => {
                        resultat.affectedRows === 0 && reject('No record saved!');
                        if (fs.existsSync(dir)) {
                            await this.deleteFotos(body, dir);
                        };
                        if (req.files.cover) {
                            console.log('---news---:', await this.cover(req.files.cover, req.body.cover, dir));
                        };
                        if (req.files.gallery) {
                            console.log('---news---:', await this.gallery(req.files.gallery, dir));
                        };
                        return resolve("News saved!");
                    });
                } catch (error) {
                    return reject(error)
                };
            });
        });
    };

    async open(req, res, route, alias) {

        console.log('req.params["newsid"]', req.params["newsid"]);
        console.log('openalias', alias);

        const newsid = req.params["newsid"] ? req.params["newsid"] : alias;

        console.log('opennewsid', newsid);

        const sql = `SELECT id_blog, alias, title, description, cover, date_create, article, date_update FROM blog WHERE id_blog = '${newsid}' OR alias = '${newsid}'`;
        return await query(sql).then((result) => {
            if (result[0]) {

                console.log('result[0]', result[0]);
                const cover = `${__dirname}/../../public/img/news/${result[0].id_blog}/${result[0].cover}_cover.jpg`;

                const main_img = (alias && fs.existsSync(cover)) ? `/img/news/${result[0].id_blog}/${result[0].cover}_cover.jpg` : '';
                const file_path = fs.existsSync(cover) ? `${result[0].cover}` : "";
                result[0].main_img = main_img;
                result[0].cover = file_path;
                result[0].date_update = (result[0].date_update !== null) ? readyFullDate(result[0].date_update) : '';
                result[0].date_create = readyFullDate(result[0].date_create);
                return result[0];
            } else {
                throw new Error("Page not found");
            };
        });
    };

    async list(req) {
        const limit = req.params["limit"];
        const sql = `SELECT id, id_blog, alias, title, description, cover FROM blog ORDER BY id DESC LIMIT ${limit}`;
        return await query(sql).then((result) => {
            return [...result].map(element => {
                const cover = `${__dirname}/../../public/img/news/${element.id_blog}/${element.cover}_cover.jpg`;
                const file_path = fs.existsSync(cover) ? `${element.cover}` : "";
                element.cover = file_path;
                return element;
            });
        });
    };

    async delete(req) {
        const newsid = req.params["newsid"];
        const sql = `DELETE FROM blog WHERE id_blog='${newsid}'`;;
        return await query(sql)
            .then((resultat) => {
                if (resultat.affectedRows === 1) {
                    const dir = `${__dirname}/../../public/img/news/${newsid}`;
                    if (fs.existsSync(dir)) { rimraf.sync(`${dir}`); };
                    return "News deleted!";
                } else {
                    throw new Error("News not found");
                };
            });
    };
}

module.exports = new NewsServise();
