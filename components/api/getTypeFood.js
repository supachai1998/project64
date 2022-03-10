import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const { body, method } = req;
    const { id } = body
    try {
        switch (method) {
            case "POST":
                await prisma.foodType.create({
                    data: body
                })
                return res.status(200).json({ status: true })
            case "DELETE":

                await prisma.foodType.delete({
                    where: {
                        id: id,
                    }
                })
                return res.status(200).json({ status: true })
            case "PATCH":

                await prisma.foodType.update({
                    where: {
                        id: id,
                    },
                    data: body
                })
                return res.status(200).json({ status: true })


            default:
                const data = await prisma.foodType.findMany()

                if(!!data && data.length > 0) return res.status(200).json(data); else return res.status(404).send("data not found")
        }
    } catch (e) { res.status(400).json({ message: "bad request", error: e.message }) }
  }
  