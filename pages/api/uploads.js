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
const saveFile = async (file, name) => {
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`./public/uploads/${name}`, data);
    await fs.unlinkSync(file.path);
};


export default async function handler(req, res) {

    const { body, method } = req;
    if (method === "POST") {
        const saveDir = "./public/uploads"
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
                            await saveFile(files.file, _name);
                            res.status(200).json({name:_name})
                        }
                    })()
                })
            })()
        } catch (e) { console.log(e); return res.status(500).json({ status: e.message }) }

    }



}
