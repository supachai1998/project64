import { prisma } from "/prisma/client";

export default async function handler(req, res) {
  const { body } = req;
  let data = null
  switch (body) {
    case "type":
       res.status(200).json([
        {name_th: "โรคไม่ติดต่อเรื้อรัง",name_en:"NCDS"},{name_en:"FOOD", name_th:"อาหาร"},{name_en:"ALL" ,name_th: "ทั้งหมด"}
      ])
      break;

    default:
      data = await prisma.blogs.findMany()
      break;
  }

  !!data && data.length > 0 ? res.status(200).json(data) : res.status(404).json(null)
}
