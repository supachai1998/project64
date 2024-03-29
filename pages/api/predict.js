import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs'
import nodefetch from 'node-fetch'


export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === "GET")  {
        const result = await fetch(`${process.env.NEXT_PUBLIC_PREDICT}`,{method:"GET"})
        if(result.ok) return res.status(200).json({statusMachine : true})
        else return res.status(500).json({statusMachine:false})
    }
    else if (req.method !== "POST") res.status(400).json({ error: "method not allowed" })
    else{
        try {
            // console.log("data",req.body)
            const formdata = new FormData();
            const form = new formidable.IncomingForm();
            // form.uploadDir = "./public/temp";
            form.keepExtensions = true;
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                    error: "There was an error parsing the files",
                    });
                }
                Object.keys(files).forEach(async(key) => {
                    console.log([key],files[key].path)            // files are logged correctly.
                    formdata.append([key], fs.createReadStream(files[key].path));
                    
                });
                
                const requestOptions = {
                    method: 'POST',
                    body: formdata,
                };
                // await fetch(`${process.env.NEXT_PUBLIC_PREDICT}`, requestOptions)
                await nodefetch(`${process.env.NEXT_PUBLIC_PREDICT}/backend/predict`, requestOptions)
                    .then(response => response.json())
                    .then(({ type, predict_topic, confident_percent }) => {
                        console.log(type, predict_topic, confident_percent)
                        switch (type) {
                            case 'ไม่ใช่อาหาร':
                                return res.status(200).json({ type: "ไม่ใช่อาหาร" })
                                
                            case 'ไม่ใช่ภาพ':
                                return res.status(200).json({ type: "ไม่ใช่ภาพ" })
                                
                            default:
                                return res.status(200).json({ name: predict_topic, confident: confident_percent.toFixed(2) })
                                
                        }
                    })
                    .catch(error => { return res.status(500).json({ error: error.message }) });
            });
        
        } catch (e) {return res.status(500).json({ error: e.message }) }
    }
}