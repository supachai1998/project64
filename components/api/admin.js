import { prisma } from "/prisma/client";
export default async function handler(req, res) {
    const { body, method } = req;
    const { id, } = body
    
    try {
        switch (method) {
            case "POST":
                await prisma.user.create({
                    data: body
                })
                return res.status(200).json({ status: true })
                
            case "DELETE":

                await prisma.user.delete({
                    where: {
                        id: id,
                    }
                })
                return res.status(200).json({ status: true })
                
            case "PATCH":

                await prisma.user.update({
                    where: {
                        id: id,
                    },
                    data: body
                })
                return res.status(200).json({ status: true })

                

            default:
                const data = await prisma.user.findMany()
                if (!!data && data.length > 0 ) return res.status(200).json(data); else return res.status(404).send("data not found")
                
        }
    } catch (error) { 
        return res.status(400).send(error.message)
    }



}
