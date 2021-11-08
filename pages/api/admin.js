import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const { body, method } = req;

    switch (method) {
        case "POST":
            try {
                const { name, password, email } = body
                const data = await prisma.user.create({
                    data: {
                        "name": name,
                        "password": password,
                        "email": email
                    }
                })
                res.status(200).json({status:true})
            } catch (e) { res.status(500).json({ msg: "ไม่สามารถเพิ่มข้อมูลได้", error: e }) }
            break;
        case "DELETE":
            try {
                const { id, } = body
                const data = await prisma.user.delete({
                    where: {
                        id: id,
                    }
                })
                res.status(200).json({status:true})
            } catch (e) { res.status(500).json({ msg: "ไม่สามารถลบข้อมูลได้", error: e }) }
            break;

        default:
            let data = await prisma.user.findMany()

            !!data && data.length > 0 ? res.status(200).json(data) : res.status(200).json({})
            break;
    }



}
