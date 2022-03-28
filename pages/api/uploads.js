import { prisma } from "/prisma/client";
import formidable from 'formidable';
import fs from 'fs'


export const config = {
    api: {
        bodyParser: false,
    },
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-+_';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
const saveFile = async (saveDir,file, name) => {
    const data = fs.readFileSync(file.path);
    const save_name = `${saveDir}/${name}`
    console.log(save_name)
    fs.writeFileSync(save_name, data);
    await fs.unlinkSync(file.path);
};

const removeFile = async (dir) => {
    const files = fs.readdirSync(dir)
    let db_name = []
    let data = await prisma.imageNCDS.findMany({
        where: { name: { in: files } },
        select: { name: true },
    })
    db_name = [...db_name, ...data]
    data = await prisma.imageFood.findMany({
        where: { name: { in: files } },
        select: { name: true },
    })
    db_name = [...db_name, ...data]
    data = await prisma.imageBlog.findMany({
        where: { name: { in: files } },
        select: { name: true },
    })
    db_name = [...db_name, ...data]
    data = await prisma.subBlog.findMany({
        where: { image: { in: files } },
        select: { image: true },
    })
    db_name = [...db_name, ...data]
    for (const file of files) {
        if (!((db_name.map(v => v.name).indexOf(file) > -1) || db_name.map(v => v.image).indexOf(file) > -1)) {
            await fs.unlink(`${dir}/${file}`, function (err) {
                console.log(`${dir}/${file} deleted!`);
            });
        }
    }
    return true
}

export default async function handler(req, res) {
    const saveDir = "public/static"

    const { body, method, query } = req;
    if (method === "GET") {
        removeFile(saveDir) && res.status(200).json({ status: true })
    }
    else if (method === "POST") {
        const form = new formidable.IncomingForm();
        form.uploadDir = saveDir;
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir);
        }
        form.keepExtensions = true;
        form.keepFilenames = true;
        try {

            (async () => {
                await form.parse(req, async (err, fields, files) => {
                    if (err) {
                        return res.status(400).json({
                            error: "There was an error parsing the files",
                        });
                    }
                    (async () => {
                        for (const key in files) {
                            const { name } = files[key]
                            const ext = name.split(".")
                            const _name = `${makeid(15)}.${ext[ext.length - 1]}`
                            // await formdata.append([key], fs.createReadStream(path));
                            await saveFile(saveDir,files.file, _name);
                            res.status(200).json({ name: _name })
                        }
                    })()
                })


            })()
        } catch (e) { console.log(e); return res.status(500).json({ status: e.message }) }

    }



}
