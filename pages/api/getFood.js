import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const { body, method,query } = req;
    const { id } = body
    try {
        switch (method) {
            case "POST":
                await prisma.food.create({
                    data: body
                })
                res.status(200).json({ status: true })
                break;
            case "DELETE":

                await prisma.food.delete({
                    where: {
                        id: id,
                    }
                })
                res.status(200).json({ status: true })
                break;
            case "PATCH":

                await prisma.food.update({
                    where: {
                        id: id,
                    },
                    data: body
                })
                res.status(200).json({ status: true })

                break;

            default:
                let data = null
                if(query.name){
                     data = await prisma.food.findFirst({
                        where:{id:id}
                    })
                }else{
                     data = await prisma.food.findMany()
                }
                !!data && data.length > 0 ? res.status(200).json(data) : res.status(404).send({
                    query : query.name,
                    message:"data not found"
                })
                break;
        }
    } catch (e) { res.status(400).json({ message: "bad request", error: e.message }) }
  }
  