import { prisma } from "/prisma/client";

export default async function handler(req, res) {
  const { body, method, query } = req;
  let data = null
  let { id } = body
  res.setHeader('Content-Type', 'application/json');
  try {
    switch (method) {
      case "POST":
        const _body = JSON.parse(body)
        try {
          await prisma.ncds.create({
            data: _body
          })
          return res.status(200).json({ status: true })
        } catch (e) { console.error(e); return res.status(500).json({ status: false, error: e, data: _body }) }
      case "DELETE":
        // if (!Array.isArray(id) || !id) return res.status(400).json({ statusText: "id is required" })
        if (Array.isArray(id)) {
          id.map(async _ => await prisma.ncds.delete({
            where: {
              id: _,
            }
          }))
        } else {
          await prisma.ncds.delete({
            where: {
              id: id,
            }
          })
        }
        return res.status(200).json({ status: true })

      case "PATCH":
        if (query.views) {
          await prisma.ncds.update({
            where: {
              id: parseInt(query.views),
            },
            data: {
              views: { increment: 1 }
            }
          })
          return res.status(200).json({ status: true })
        }
        // console.log(dataOld)
        if (!id) {
          data = body.new
          const dataOld = body.old
          id = dataOld.id
          const { ref, image } = data
          delete data['image']
          delete data['ref']
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
          // console.log()
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

          await prisma.ncds.update({
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
              }
            }
          })
          return res.status(200).json({ status: true })
        } else {
          await prisma.ncds.update({
            where: {
              id: id,
            },
            data: body
          })
          return res.status(200).json({ status: true })
        }
    }
    switch (body) {
      case "type":
        return res.status(200).json([
          { name_th: "????????????????????????????????????????????????????????????", name_en: "NCDS" }, { name_en: "FOOD", name_th: "???????????????" }, { name_en: "ALL", name_th: "?????????????????????" }
        ])

      default:
        let { select, id } = query
        id = id ? parseInt(id) : null
        if (id) {
          if (!query.select) {
            data = await prisma.ncds.findFirst({

              where: { id: id },
              include: {
                image: true,
                foodncds: true,
                relationBlog: true,
                ref: true,
              }
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
        } else if (select) {
          let _ = {}
          for (const val of select.split(",")) {
            _ = { ..._, [val]: true }
          }
          data = await prisma.ncds.findMany({
            select: _,
            take : 1000
          })
        } else {
          data = await prisma.ncds.findMany({

            include: {
              image: true,
              ref: true
            },
            take : 1000
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

