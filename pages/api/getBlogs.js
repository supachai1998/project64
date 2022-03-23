import { prisma } from "/prisma/client";

export default async function handler(req, res) {
  const { body, method, query } = req;
  let data = null
  let id = body.id
  res.setHeader('Content-Type', 'application/json');
  try {
    switch (method) {
      case "POST":
        console.log(body)
        await prisma.blogs.create({
          data: body
        })
        return res.status(200).json({ status: true })

      case "DELETE":

        await prisma.blogs.delete({
          where: {
            id: id,
          }
        })
        return res.status(200).json({ status: true })

      case "PATCH":
        if (query.views) {
          await prisma.blogs.update({
            where: {
              id: parseInt(query.views),
            },
            data: {
              views: { increment: 1 }
            }
          })
          return res.status(200).json({ status: true })
        } else if (query.vote) {
          // console.log(query.vote ,query.id)
          data = await prisma.blogs.update({
            where: {
              id: parseInt(query.id),
            },
            data: {
              [query.vote]: { increment: 1 }
            }
          })
        }
        else if (!id) {
          data = body.new
          const dataOld = body.old
          id = data.id
          const { subBlog, image, ref, related } = data
          delete data['subBlog']
          delete data['image']
          delete data['ref']
          delete data['related']
          // console.log( image)
          const createSubBlogs = subBlog.filter(val => !val.id)
          const updateSubBlogs = subBlog.map(val => {
            if (val.id) {
              return {
                where: { id: val.id },
                data: { name: val.name, detail: val.detail, image: val.image }
              }
            }
          })
          const deleteSubBlogs = dataOld.subBlog.map(val => {
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
                data: { url: val.url }
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
          const createRelated = related.filter(val => !val.id)
          const updateRelated = related.map(val => {
            if (val.id) {
              return {
                where: { id: val.id },
                data: {
                  ...(val.foodId) && val.foodId,
                  ...(val.ncdsId) && val.ncdsId,
                }
              }
            }
          })
          const deleteRelated = dataOld.related.map(val => {
            if (related.every(val2 => val.id !== val2.id)) {
              return { id: val.id }
            }
          })
          // const _createSubBlogs = createSubBlogs.length > 0 && {createMany : createSubBlogs}

          await prisma.blogs.update({
            where: { id: id },
            data: {
              ...data,
              subBlog: {
                ...(createSubBlogs.length > 0) && { create: createSubBlogs },
                ...(updateSubBlogs.length > 0) && { updateMany: updateSubBlogs },
                ...(deleteSubBlogs.length > 0) && { deleteMany: deleteSubBlogs }
              },
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
              related: {
                ...(createRelated.length > 0) && { create: createRelated },
                ...(updateRelated.length > 0) && { updateMany: updateRelated },
                ...(deleteRelated.length > 0) && { deleteMany: deleteRelated }
              }
            }
          })
        } else {
          await prisma.blogs.update({
            where: { id: id },
            data: { ...body }
          })
        }
        return res.status(200).json({ status: true })

    }
    switch (body) {
      case "type":
        return res.status(200).json([
          { name_th: "โรคไม่ติดต่อเรื้อรัง", name_en: "NCDS" }, { name_en: "FOOD", name_th: "อาหาร" }, { name_en: "ALL", name_th: "ทั้งหมด" }
        ])


      default:
        let { select, id, BestBlog, approve } = query
        if (BestBlog) {
          data = await prisma.blogs.findMany({
            
            where: { approve: 1 },
            orderBy: [
              { views: 'desc', },
            ],
            include: {
              image: true,
              ref: true,
            },
            take: 5,
          })
        }
        else if (id) {

          if (!query.select) {
            id = parseInt(id)
            data = await prisma.blogs.findFirst({
              
              where: {
                id: id,
                approve: 1
              },
              include: {
                subBlog: true,
                image: true,
                ref: true,
                related: true,
              }
            })
          } else {
            data = await prisma.blogs.findFirst({
              
              where: {
                id: id,
                approve: 1
              },
              select: { [select]: true }
            })
          }
        }
        else if (query.type) {
          data = await prisma.blogs.findMany({
            
            where: {
              type: query.type.toUpperCase(),
              approve: 1
            },
            include: {
              subBlog: true,
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
          data = await prisma.blogs.findMany({
            
            where: { approve: 1 },
            select: _
          })
        } else if (approve) {
          data = await prisma.blogs.findMany({
            
            include: {
              subBlog: true,
              image: true,
              ref: true,
              related: {
                include: {
                  Foods: { select: { name_en: true, name_th: true, } },
                  ncds: { select: { name_en: true, name_th: true, } },
                }
              },
            },
          })
        }
        else {
          data = await prisma.blogs.findMany({
            
            where: { approve: 1 },
            include: {
              subBlog: true,
              image: true,
              ref: true,
              related: {
                include: {
                  Foods: { select: { name_en: true, name_th: true, } },
                  ncds: { select: { name_en: true, name_th: true, } },
                }
              },
            },
          })

        }
    }
    if (!Array.isArray(data)) {
      data["image"] = data.image.map(({ id, name }) => {
        return {
          id: id,
          status: "done",
          url: `/uploads/${name}`,
          name: name
        }
      })
      const total_vote = data.vote_1 + data.vote_2 + data.vote_3 + data.vote_4 + data.vote_5
      const avg_vote = parseFloat(((1 * data.vote_1 + 2 * data.vote_2 + 3 * data.vote_3 + 4 * data.vote_4 + 5 * data.vote_5) / total_vote).toFixed(2)) || 0
      return res.status(200).json({ ...data, total_vote, avg_vote })
    } else if (Array.isArray(data) && data.length > 0) {
      data = data.map(item => {
        const image = item.image.map(({ id, name }) => {
          return {
            id: id,
            status: "done",
            url: `/uploads/${name}`,
            name: name
          }
        })
        const total_vote = item.vote_1 + item.vote_2 + item.vote_3 + item.vote_4 + item.vote_5
        const avg_vote = parseFloat(((1 * item.vote_1 + 2 * item.vote_2 + 3 * item.vote_3 + 4 * item.vote_4 + 5 * item.vote_5) / total_vote).toFixed(2)) || 0
        return { ...item, avg_vote, total_vote, image }
      })
      return res.status(200).json(data)
    }
    return res.status(404).send({ error: "data not found", query: query })
  } catch (e) { console.log(e); return res.status(500).send(e) }
}