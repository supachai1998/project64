import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    let { body, method, query } = req;
    let { id } = body
    let data = null
    try {
        res.setHeader('Content-Type', 'application/json');

        switch (method) {
            case "POST":
                body = JSON.parse(body)
                await prisma.food.create({
                    data: body
                })
                return res.status(200).json({ status: true })
            case "DELETE":

                await prisma.food.delete({
                    where: {
                        id: id,
                    }
                })
                return res.status(200).json({ status: true })
            case "PATCH":
                body = JSON.parse(body)
                data = body.new
                const dataOld = body.old
                id = dataOld.id
                const { ref, image, FoodNcds } = data
                delete data['image']
                delete data['ref']
                delete data['FoodNcds']
                const createImage = image.filter(val => !val.id)
                const updateImage = image.map(val => {
                    if (val.id) {
                        return {
                            where: { id: val.id },
                            data: { name: val.name }
                        }
                    }
                })
                const deleteImage = dataOld.image.filter(val => {
                    if (image.every(val2 => val.id !== val2.id)) {
                        return {
                            where: { id: val.id },
                            data: { name: val.name }
                        }
                    }
                })
                const createRef = ref.filter(val => !val.id)
                const updateRef = ref.map(val => {
                    if (val.id) {
                        return {
                            where: { id: val.id },
                            data: { url: val.url }
                        }
                    }
                })
                const deleteRef = dataOld.ref.filter(val => {
                    if (ref.every(val2 => val.id !== val2.id)) {
                        return {
                            where: { id: val.id },
                            data: { url: val.url }
                        }
                    }
                })
                const createFoodNcds = FoodNcds.filter(val => !val.id)
                const updateFoodNcds = FoodNcds.map(val => {
                    if (val.id) {
                        return {
                            where: { id: val.id },
                            data: {
                                detail: val.detail,
                                suggess: val.suggess,
                                video: val.video,
                            }
                        }
                    }
                })
                const deleteFoodNcds = dataOld.FoodNcds.filter(val => {
                    if (FoodNcds.every(val2 => val.id !== val2.id)) {
                        return {
                            where: { id: val.id },
                            data: {
                                detail: val.detail,
                                suggess: val.suggess,
                                video: val.video,
                            }
                        }
                    }
                })

                await prisma.food.update({
                    where: { id: id },
                    data: {
                        ...data,
                        image: {
                            ...(createImage.length > 0) && { create: createImage },
                            ...(updateImage.length > 0) && { updateMany: updateImage },
                            ...(deleteImage.length > 0) && { deleteMany: deleteImage }
                        },
                        ref: {
                            ...(createRef.length > 0) && { create: createRef },
                            ...(updateRef.length > 0) && { updateMany: updateRef },
                            ...(deleteRef.length > 0) && { deleteMany: deleteRef }
                        },
                        FoodNcds: {
                            ...(createFoodNcds.length > 0) && { create: createFoodNcds },
                            ...(updateFoodNcds.length > 0) && { updateMany: updateFoodNcds },
                            ...(deleteFoodNcds.length > 0) && { deleteMany: deleteFoodNcds }
                        }
                    }
                })
                return res.status(200).json({ status: true })



            default:

                const { select, BestFood } = query
                id = parseInt(query.id) || null
                if (BestFood) {
                    data = await prisma.food.findMany({
                        orderBy: [
                            { views: 'desc', },
                            { calories: 'asc', },
                        ],
                        include: {
                            image: true,
                            ref: true,
                        },
                        take: 5,
                    })
                    if (!!data && data.length > 0) {return res.status(200).json(data)} else {return res.status(404).json([])}
                }
                if (query.categories) {
                    data = await prisma.food.findMany({
                        where: { foodTypeId: parseInt(query.categories) },
                        include: {
                            image: true,
                            ref: true,
                        }
                    })
                    if (!!data && data.length > 0) { return res.status(200).json(data) } else { return res.status(404).json([]) }
                }
                if (query.name) {
                    data = await prisma.food.findMany({
                        where: { name_th: { contains: query.name } },
                        include: {
                            image: true,
                            ref: true,
                            FoodNcds: true
                        }
                    }) || await prisma.food.findMany({
                        where: { name_en: { contains: query.name } },
                        include: {
                            image: true,
                            ref: true,
                            FoodNcds: true
                        }
                    })
                    if (!!data & data.length > 0) return res.status(200).json(data)
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
                            ref: true,
                            FoodNcds: {
                                include: {
                                    ncds: {
                                        select: {
                                            name_th: true,
                                            name_en: true,
                                            image: {
                                                select: { name: true }
                                            }
                                        }
                                    },
                                }
                            }
                        }
                    })
                    if (data.id) return res.status(200).json(data)
                }else if (select) {
                    let _ = {}
                    for (const val of select.split(",")) {
                        _ = {..._, [val]: true }
                    }
                    data = await prisma.food.findMany({
                        select: _
                    })
                } else {
                    data = await prisma.food.findMany({
                        include: {
                            image: true,
                            ref: true,
                            FoodNcds: {
                                include: {
                                    ncds: {
                                        select: {
                                            name_th: true,
                                            name_en: true,
                                        }
                                    },
                                }
                            }
                        }
                    })
                    if (!!data & data.length > 0) {return res.status(200).json(data)}else{return res.status(404).json([])}
                }
                if (!!data && data.length > 0) return res.status(200).json(data) 
                else return res.status(404).send({
                    query: query.name,
                    message: "data not found",
                    data: data
                })
        }
    } catch (e) { console.log(e); return res.status(400).json({ message: "bad request", error: e.message }) }
}
