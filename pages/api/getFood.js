import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const { body, method, query } = req;
    const { id } = body
    res.setHeader('Content-Type', 'application/json');
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
                if (query.categories) {
                    data = await prisma.food.findMany({
                        where: { foodTypeId: parseInt(query.categories) },
                        include: {
                            image: true,
                        }
                    })
                    !!data && data.length > 0 && res.status(200).json(data)
                }
                if (query.name) {
                    data = await prisma.food.findMany({
                        where: { name_th : {contains: query.name} },
                        include: {
                            image: true,
                            FoodNcds: true
                        }
                    })
                    !!data & data.length && res.status(200).json(data)
                }
                if (query.id) {
                    data = await prisma.food.findFirst({
                        where: { id: parseInt(query.id) },
                        include: {
                            image: true,
                            FoodNcds: true
                        }
                    })
                    data.id && res.status(200).json(data)
                } else {
                    data = await prisma.food.findMany()
                }
                !!data && data.length > 0 ? res.status(200).json(data) : res.status(404).send({
                    query: query.name,
                    message: "data not found",
                    data: data
                })
                break;
        }
    } catch (e) { res.status(400).json({ message: "bad request", error: e.message }) }
}
