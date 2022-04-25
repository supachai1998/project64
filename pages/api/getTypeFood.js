import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const { body, method, query } = req;
    const { id } = body
    res.setHeader('Content-Type', 'application/json');
    let data = []
    try {
        switch (method) {
            case "POST":
                await prisma.foodType.create({
                    data: body
                })
                res.status(200).json({ status: true })
                break;
            case "DELETE":

                await prisma.foodType.delete({
                    where: {
                        id: id,
                    }
                })
                res.status(200).json({ status: true })
                break;
            case "PATCH":

                await prisma.foodType.update({
                    where: {
                        id: id,
                    },
                    data: body
                })
                res.status(200).json({ status: true })

                break;

            default:
                const { order } = query
                switch (order) {
                    case 'des': {
                        let _tep = []
                        data = await prisma.foodType.findMany()
                        for (const x of data) {
                            const count = await prisma.food.count({ where: { foodTypeId: x.id } })
                            if (count > 0) _tep.push({...x,count : count})
                        }
                        if (_tep.length > 0) return res.status(200).json(_tep) 
                        else return res.status(404).send("data not found")

                    } break;
                    default: {
                        data = await prisma.foodType.findMany()
                    }
                }
                !!data && data.length > 0 ? res.status(200).json(data) : res.status(404).send("data not found")
                break;
        }
    } catch (e) { res.status(400).json({ message: "bad request", error: e.message }) }
}
