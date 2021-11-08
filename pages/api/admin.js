import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const { body, method } = req;

    if (method === "POST") {
        try{
            const { name, password, email } = body
            const data = await prisma.user.create({
                data:{
                    "name":name ,
                    "password":password,
                    "email":email
                }
            })

        }catch(e){res.status(500).json({msg:"ไม่สามารถเพิ่มข้อมูลได้",error:e})}
    }

    let data  = await prisma.user.findMany()

    !!data && data.length > 0 ? res.status(200).json(data) : res.status(200).json({})
}
