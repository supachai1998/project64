import { prisma } from "/prisma/client";
import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs'


export const config = {
    api: {
        bodyParser: false,
    },
}
const saveFile = async (file) => {
    console.log(file)
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`./public/uploads/${file.name}`, data);
    await fs.unlinkSync(file.path);
    return true;
};
const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
export default async function handler(req, res) {

    const { body, method } = req;
    if (method === "POST") {
        const saveDir = "./public/uploads"
        const form = new formidable.IncomingForm();
        form.uploadDir = saveDir;
        form.keepExtensions = true;
        form.keepFilenames = true;
        try {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        error: "There was an error parsing the files",
                    });
                }

                await Object.keys(files).forEach(async (key) => {
                    const { name } = files[key]
                    const path = `${saveDir}/${name}`
                    console.log(`Save ${path}`)            // files are logged correctly.
                    // await formdata.append([key], fs.createReadStream(path));
                    await saveFile(files.file);
                });
                res.status(200).json({ status: "upload file success" })
            })
        } catch (e) {console.log(e.message); res.status(500).json({ status: e.message }) }

    }



}
