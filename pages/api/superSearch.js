import { prisma } from "/prisma/client";
export default async function handler(req, res) {
    const { body, method, query } = req;
    let data = null
    let { txt } = query
    res.setHeader('Content-Type', 'application/json');
    try {
        switch (method) {
            case "GET":{
                data = await prisma.food.findMany({
                    where: { name_th: { contains: txt } },
                    include: {
                        image: true,
                    }
                }) || await prisma.food.findMany({
                    where: { name_en: { contains: txt } },
                    include: {
                        image: true,
                    }
                }) || await prisma.ncds.findMany({
                    where: { name_th: { contains: txt } },
                    include: {
                        image: true,
                    }
                }) || await prisma.ncds.findMany({
                    where: { name_en: { contains: txt } },
                    include: {
                        image: true,
                    }
                }) || await prisma.blog.findMany({
                    where: { name: { contains: txt } },
                    include: {
                        image: true,
                    }
                })
                if (!!data && data.length > 0 )return res.status(200).json(data)
            }
            break;
        }
        return res.status(400).json({ error :"data not found" , query : txt , data : data })
    } catch (error) {
        return res.status(500).json({ error :error, query : txt })
    }
}