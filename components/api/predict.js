import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    if (req.method === "GET")  {
        await fetch(`${process.env.NEXT_PUBLIC_PREDICT}`,{method:"GET"})
    }
    else if (req.method !== "POST") res.status(400).json({ error: "method not allowed" })
    else{
        try {
            const formdata = new FormData();
            const form = new formidable.IncomingForm();
            // form.uploadDir = "./public";
            form.keepExtensions = true;
            await form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                    error: "There was an error parsing the files",
                    });
                }
                Object.keys(files).forEach((key) => {
                    console.log([key],files[key].path)            // files are logged correctly.
                    formdata.append([key], fs.createReadStream(files[key].path));
                });
                const requestOptions = {
                    method: 'POST',
                    body: formdata,
                };
                // await fetch(`${process.env.NEXT_PUBLIC_PREDICT}`, requestOptions)
                await fetch(`${process.env.NEXT_PUBLIC_PREDICT}/backend/predict`, requestOptions)
                    .then(response => response.json())
                    .then(({ type, predict_topic, confident_percent }) => {
                        console.log(type, predict_topic, confident_percent)
                        switch (type) {
                            case 'ไม่ใช่อาหาร':
                                res.status(200).json({ type: "ไม่ใช่อาหาร" })
                                break;
                            case 'ไม่ใช่ภาพ':
                                res.status(200).json({ type: "ไม่ใช่ภาพ" })
                                break;
                            default:
                                res.status(200).json({ name: predict_topic, confident: confident_percent.toFixed(2) })
                                break;
                        }
                    })
                    .catch(error => { res.status(500).json({ error: error.message }) });
            });
        
        } catch (e) { res.status(500).json({ error: e.message }) }
    }
}