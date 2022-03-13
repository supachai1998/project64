import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    try {
        const { body, method, query } = req;
        const { id } = body
        res.setHeader('Content-Type', 'application/json');

        switch (method) {
            case "POST":
                await prisma.food.create({
                    data: body
                })
                return res.status(200).json({ status: true })
                break;
            case "DELETE":

                await prisma.food.delete({
                    where: {
                        id: id,
                    }
                })
                return res.status(200).json({ status: true })
                break;
            case "PATCH":

                await prisma.food.update({
                    where: {
                        id: id,
                    },
                    data: body
                })
                return res.status(200).json({ status: true })

                break;

            default:
                let data = null
                const { select } = query
                let {id} = query
                id = parseInt(query.id)
                if (query.categories) {
                    data = await prisma.food.findMany({
                        where: { foodTypeId: parseInt(query.categories) },
                        include: {
                            image: true,
                        }
                    })
                    if (!!data && data.length > 0) return res.status(200).json(data)
                }
                if (query.name) {
                    data = await prisma.food.findMany({
                        where: { name_th: { contains: query.name } },
                        include: {
                            image: true,
                            FoodNcds: true
                        }
                    }) || await prisma.food.findMany({
                        where: { name_en: { contains: query.name } },
                        include: {
                            image: true,
                            FoodNcds: true
                        }
                    })
                    if (!!data & data.length) return res.status(200).json(data)
                }
                if (query.id) {
                    if (select) {
                        data = await prisma.food.findFirst({
                            where: { id: id },
                            select: { [select]: true }
                        })
                        if (!!data) return res.status(200).json(data)
                    }
                    data = await prisma.food.findFirst({
                        where: { id: id },
                        include: {
                            image: true,
                            FoodNcds: true
                        }
                    })
                    if (data.id) return res.status(200).json(data)
                } else {
                    data = await prisma.food.findMany()
                }
                if (!!data && data.length > 0) return res.status(200).json(data); else return res.status(404).send({
                    query: query.name,
                    message: "data not found",
                    data: data
                })
                break;
        }
    } catch (e) { return res.status(400).json({ message: "bad request", error: e.message }) }
}
