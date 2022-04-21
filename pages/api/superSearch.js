import { prisma } from "/prisma/client";
export default async function handler(req, res) {
    const { body, method, query } = req;
    let data = []
    let { txt, type, only } = query
    res.setHeader('Content-Type', 'application/json');
    try {
        switch (method) {
            case "GET": {
                // console.log(type)
                switch (type) {
                    default: {
                        let data_fetch
                        console.log(only)
                        if (only === "food" || only === "ALL") {
                            data_fetch = await prisma.food.findMany({
                                where: { name_th: { contains: txt } },
                                include: {
                                    image: true,
                                }
                            })
                            // console.log(data.length,data_fetch)
                            data = [...data, ...data_fetch]
                            data_fetch = await prisma.food.findMany({
                                where: { name_en: { contains: txt } },
                                include: {
                                    image: true,
                                }
                            })
                        }
                        // console.log(data.length,data_fetch)
                        if (only === "ncds" || only === "ALL") {
                            data = [...data, ...data_fetch]
                            data_fetch = await prisma.ncds.findMany({
                                where: { name_th: { contains: txt } },
                                include: {
                                    image: true,
                                }
                            })
                            // console.log(data.length,data_fetch)
                            data = [...data, ...data_fetch]

                            data_fetch = await prisma.ncds.findMany({
                                where: { name_en: { contains: txt } },
                                include: {
                                    image: true,
                                }
                            })
                            // console.log(data.length,data_fetch)
                            data = [...data, ...data_fetch]
                        }
                        if (only === "ncds" || only === "ALL") {
                            data_fetch = await prisma.blogs.findMany({
                                where: { name: { contains: txt } },
                                include: {
                                    image: true,
                                }
                            })
                            if (!!data_fetch) {
                                data_fetch = data_fetch.map(({ vote_1,
                                    vote_2,
                                    vote_3,
                                    vote_4,
                                    vote_5, ...rest }) => {
                                    const total_vote = vote_1 + vote_2 + vote_3 + vote_4 + vote_5
                                    const avg_vote = parseFloat(((1 * vote_1 + 2 * vote_2 + 3 * vote_3 + 4 * vote_4 + 5 * vote_5) / total_vote).toFixed(2)) || 0
                                    return {
                                        ...rest, total_vote, avg_vote,
                                        vote_1, vote_2, vote_3, vote_4, vote_5,
                                    }
                                })
                                data = [...data, ...data_fetch]
                            }
                        }
                        // console.log(data.length,data_fetch)
                    }
                }
                if (!!data && data.length > 0) return res.status(200).json(data)
                return res.status(404).json({ error: "Not Found", query: txt })
            }
        }
        return res.status(400).json({ error: "data not found", query: txt })
    } catch (error) {
        return res.status(500).json({ error: error.message, query: txt })
    }
}