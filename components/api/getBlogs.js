import { prisma } from "/prisma/client";

export default async function handler(req, res) {
  const { body, method } = req;
  let data = null
  let { id } = body
  console.log(id)
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
        data = await prisma.blogs.findMany({
          include: {
            subBlog: true,
            image: true
          },
        })
        !!data && data.length > 0 ? res.status(200).json(data) : res.status(404).send("data not found")
        break;
    }
  } catch (e) { console.log(e); res.status(500).send(e) }
}