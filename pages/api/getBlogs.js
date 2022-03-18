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

        await prisma.blogs.create({
          data: body
        })
        res.status(200).json({ status: true })
        break;
      case "DELETE":

        await prisma.blogs.delete({
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
                data: { name: val.name }
              }
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
              }
            }
          })
          res.status(200).json({ status: true })
        } else {
          await prisma.blogs.update({
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
        const { select, id, BestBlog } = query
        if (BestBlog) {
          data = await prisma.blogs.findMany({
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
            data = await prisma.blogs.findFirst({
              where: { id: id }
            })
          } else {
            data = await prisma.blogs.findFirst({
              where: { id: id },
              select: { [select]: true }
            })
          }
        }
        else if (query.type) {
          data = await prisma.blogs.findMany({
            where: { type: query.type.toUpperCase() },
            include: {
              subBlog: true,
              image: true,
              ref: true
            },
          })
          // console.log(data,query.type)
        } else {
          data = await prisma.blogs.findMany({
            include: {
              subBlog: true,
              image: true,
              ref: true
            },
          })
        }

        if (!Array.isArray(data)) {
          const total_vote = data.vote_1 + data.vote_2 + data.vote_3 + data.vote_4 + data.vote_5
          const avg_vote = parseFloat(((1 * data.vote_1 + 2 * data.vote_2 + 3 * data.vote_3 + 4 * data.vote_4 + 5 * data.vote_5) / total_vote).toFixed(2)) || -1
          return res.status(200).json({ ...data, total_vote, avg_vote })
        } else if (Array.isArray(data) && data.length > 0) {
          data = data.map(item => {
            const total_vote = item.vote_1 + item.vote_2 + item.vote_3 + item.vote_4 + item.vote_5
            const avg_vote = parseFloat(((1 * item.vote_1 + 2 * item.vote_2 + 3 * item.vote_3 + 4 * item.vote_4 + 5 * item.vote_5) / total_vote).toFixed(2)) || -1
            return { ...item, avg_vote, total_vote }
          })
          return res.status(200).json(data)
        }
    }
    return res.status(404).send({ error: "data not found", query: query })
  } catch (e) { console.log(e); return res.status(500).send(e) }
}