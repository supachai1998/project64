import { prisma } from "/prisma/client";

export default async function handler(req, res) {
  const { body, method } = req;
  let data = null
  const {id} = body
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
        await prisma.blogs.update({
          where: {
            id: id,
          },
          data: body
        })
        res.status(200).json({ status: true })

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