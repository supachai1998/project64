import { prisma } from "/prisma/client";

export default async function handler(req, res) {
  const { body, method, query } = req;
  let data = null
  let { id } = body
  res.setHeader('Content-Type', 'application/json');
  try {
    switch (method) {
      case "POST":
        console.log(body)

        await prisma.ncds.create({
          data: body
        })
        res.status(200).json({ status: true })
        break;
      case "DELETE":

        await prisma.ncds.delete({
          where: {
            id: id,
          }
        })
        res.status(200).json({ status: true })
        break;
      case "PATCH":

        // console.log(dataOld)
        if (!id) {
          data = body.new
          const dataOld = body.old
          id = dataOld.id
          const { subBlog, image } = data
          delete data['subBlog']
          delete data['image']
          // console.log( image)
          const createSubncds = subBlog.filter(val => !val.id)
          const updateSubncds = subBlog.map(val => {
            if (val.id) {
              return {
                where: { id: val.id },
                data: { name: val.name, detail: val.detail, image: val.image }
              }
            }
          })
          const deleteSubncds = dataOld.subBlog.map(val => {
            if (subBlog.every(val2 => val.id !== val2.id)) {
              return { id: val.id }
            }
          })
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
          // const _createSubncds = createSubncds.length > 0 && {createMany : createSubncds}

          await prisma.ncds.update({
            where: { id: id },
            data: {
              ...data,
              subBlog: {
                ...(createSubncds.length > 0) && { create: createSubncds },
                ...(updateSubncds.length > 0) && { updateMany: updateSubncds },
                ...(deleteSubncds.length > 0) && { deleteMany: deleteSubncds }
              },
              image: {
                ...(createImage.length > 0) && { create: createImage },
                ...(updateImage.length > 0) && { updateMany: updateImage },
                ...(deleteImage.length > 0) && { deleteMany: deleteImage }
              }
            }
          })
          res.status(200).json({ status: true })
        } else {
          await prisma.ncds.update({
            where: {
              id: id,
            },
            data: body
          })
          res.status(200).json({ status: true })
        }
        break;
    }
    switch (body) {
      case "type":
        res.status(200).json([
          { name_th: "โรคไม่ติดต่อเรื้อรัง", name_en: "NCDS" }, { name_en: "FOOD", name_th: "อาหาร" }, { name_en: "ALL", name_th: "ทั้งหมด" }
        ])
        break;

      default:
        const { select, id } = query
        if (id) {
          if (!query.select) {
            data = await prisma.ncds.findFirst({
              where: { id: id }
            })
          } else {
            data = await prisma.ncds.findFirst({
              where: { id: id },
              select: { [select]: true }
            })
          }
        }
        else if (query.type) {
          data = await prisma.ncds.findMany({
            where: { type: query.type },
            include: {
              image: true,
              ref: true
            },
          })
          // console.log(data,query.type)
        } else {
          data = await prisma.ncds.findMany({
            include: {
              image: true,
              ref: true
            },
          })
        }

        if (!Array.isArray(data)) {
          return res.status(200).json(data)
        } else if (Array.isArray(data) && data.length > 0) {
          return res.status(200).json(data)
        }
    }
    return res.status(404).send({ error: "data not found", query: query })
  } catch (e) { console.log(e); return res.status(500).send(e) }
}
  
