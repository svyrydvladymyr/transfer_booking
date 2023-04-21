const Url = require("url-parse");
const Jimp = require("jimp");
const fs = require("fs");
const { query, validValue, readyFullDate, token, clienttoken } = require("../service");

class NewsServise {
    async replaceImagesPath(body) {
        const image_path = `/img/news/${body.token}`;
        // body.fotobase = 'fghdfghdfg';
        // body.fotobase = [1, 2];
        // body.fotobase = {"aaaa": "aaaa",
        //         "bbbb": "bbbb"
        //         };
        // console.log('image_namesimage_namesimage_namesimage_names', body.fotobase);

        const image_names = body.fotobase ? Object.keys(body.fotobase).join("|") : '';

        // console.log(typeof body.fotobase);
        console.log('image_namesimage_namesimage_namesimage_names', image_names);
        return (image_names !== "" && typeof body.fotobase !== "string")
            ? body.article.replace(new RegExp(`${image_names}`, "gi"), (name) => `${image_path}/${name}.jpg`)
            : body.article;
    }

    async create(req, res) {
        const body = req.body;

        // console.log('body', body);
        const sql = `INSERT INTO blog (id_blog, title, description, article, date_create)
            VALUES ('${await validValue(body.token)}',
                    '${await validValue(body.title)}',
                    '${await validValue(body.description)}',
                    '${await validValue(await this.replaceImagesPath(body), "news")}',
                    '${readyFullDate(new Date(), "")}')`;
        return await this.save(req, body, sql);
    }

    async edit(req, res) {
        const body = req.body;
        const sql = `UPDATE blog
            SET title = '${await validValue(body.title)}',
                description = '${await validValue(body.description)}',
                article = '${await validValue(await this.replaceImagesPath(body), "news")}',
                date_update = '${readyFullDate(new Date(), "")}'
            WHERE id_blog = '${body.token}'`;
        return await this.save(req, body, sql);
    }

    async save(req, body, sql) {
        const cover = body.cover;
        if (body.title === "" || body.title === undefined || body.description === "" || body.description === undefined) {
            throw new Error("Bad value!");
        };
        return await query(sql)
        .then(() => {
            // console.log('covercovercovercover', cover);
            const dir = `${__dirname}/../../public/img/news/${body.token}`;
            const cover_is = (body.cover_is === 'is' && cover === "") ? ["cover", "cover_resized", "cover_resized_big"] : [];
            const httpnames = req.body.httpnames.map((element) => element.split("/")[element.split("/").length - 1].replace(/.jpg/g, ""));
            const image_base = Object.keys(body.fotobase);
            const for_save = [...cover_is, ...httpnames, ...image_base];

            console.log("httpnames", httpnames);

            console.log("for_save", for_save);

            const file_is = fs.existsSync(dir) ? fs.readdirSync(dir).map((file) => file.replace(/.jpg/g, "")) : [];

            console.log("file_is", file_is);

            file_is.forEach((element) => {
                if (!for_save.includes(element)) {
                    if (fs.existsSync(`${dir}/${element}.jpg`)) {
                        fs.unlink(`${dir}/${element}.jpg`, (error) => {
                            error && console.log("File deleted error:", error);
                        });
                    };
                };
            });



            // if (body.cover_is === 'none' && cover === "") {
            //     ["cover", "cover_resized", "cover_resized_big"].forEach((element) => {
            //         if (fs.existsSync(`${dir}/${element}.jpg`)) {
            //             fs.unlink(`${dir}/${element}.jpg`, (error) => {
            //                 error && console.log("File deleted error:", error);
            //             });
            //         };
            //     });
            // };
            if (cover !== "") {
                const base64 = cover.replace(/data:.*;base64,/g, "");
                const buffer = Buffer.from(base64, "base64");
                !fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
                return Jimp.read(buffer)
                .then((image) => {
                    image.resize(1400, Jimp.AUTO)
                        .write(`${dir}/cover.jpg`);
                    image.cover(300, 200, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_TOP)
                        .write(`${dir}/cover_resized.jpg`);
                    image.cover(600, 400, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_TOP)
                        .write(`${dir}/cover_resized_big.jpg`);
                    return "News saved!";
                })
                .catch((error) => {
                    throw new Error(error);
                });
            } else {
                return "News saved!";
            };
        });
    }

    async fotos(req, res) {
        const image_base = Object.keys(req.body.fotobase);
        const dir = `${__dirname}/../../public/img/news/${req.body.token}`;

        if (req.body && image_base.length > 0) {
            !fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
            // const path = `${req.headers.origin}/img/news/${req.body.token}/`;


            console.log("dir", dir);
            console.log("req.body.token", req.body.token);
            // console.log("path", path);

            console.log("req.headers.origin", req.headers.origin);
            console.log("foto_fffffffffff", image_base);
            console.log("foto_fffffffffff", image_base.length);
            // console.log("httpnames", httpnames);
            // console.log("for_save", for_save);
            // console.log("file_is", file_is);


            return new Promise((resolve, reject) => {
                let x = 0;
                Object.entries(req.body.fotobase).forEach(([key, value]) => {
                    const base64 = value.replace(/data:image\/jpeg;base64,/g, "");
                    const buffer = Buffer.from(base64, "base64");
                    Jimp.read(buffer)
                    .then((image) => {
                        image
                        .resize(1400, Jimp.AUTO)
                        .write(`${dir}/${key}.jpg`);
                        (++x === image_base.length) && resolve("Foto added!")
                    })
                    .catch((error) => reject(error));
                });
            });
        } else {
            throw new Error("List of photos empty!")
        };
    };

    async open(req, res) {
        console.log("req.params[userid]oooooooooooooooooo", req.params["newsid"]);

        const newsid = req.params["newsid"];
        const cover = `${__dirname}/../../public/img/news/${newsid}/cover.jpg`;
        const file_path = fs.existsSync(cover) ? `/img/news/${newsid}/cover` : "/img/nofoto.png";
        const sql = `SELECT id_blog, title, description, cover, date_create, article, date_update FROM blog WHERE id_blog = '${newsid}'`;
        return await query(sql).then((result) => {
            // console.log('result', result[0]);

            console.log('result[0].date_update', result[0].date_update);
            result[0].cover = file_path;
            result[0].date_update = (result[0].date_update !== null) ? readyFullDate(result[0].date_update) : '';
            result[0].date_create = readyFullDate(result[0].date_create);
            // console.log('result', result[0]);

            return result[0];
        });
    };

    async list() {
        const sql = `SELECT id_blog, title, description, date_create, date_update FROM blog`;
        return await query(sql).then((result) => result);
    };
}

module.exports = new NewsServise();
