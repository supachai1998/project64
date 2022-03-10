import { prisma } from "/prisma/client";
export default async function handler(req, res) {
    const { body, method } = req;
    const { id, } = body
    res.setHeader('Content-Type', 'application/json');
    try {
        switch (method) {
            case "POST":
                await prisma.user.create({
                    data: body
                })
                res.status(200).json({ status: true })
                break;
            case "DELETE":

                await prisma.user.delete({
                    where: {
                        id: id,
                    }
                })
                res.status(200).json({ status: true })
                break;
            case "PATCH":

                await prisma.user.update({
                    where: {
                        id: id,
                    },
                    data: body
                })
                res.status(200).json({ status: true })

                break;

            default:
                const data = await prisma.user.findMany()
                !!data && data.length > 0 ? res.status(200).json(data) : res.status(404).send("data not found")
                break;
        }
    } catch (error) { 
        res.status(400).send(error.message)
    }



}
