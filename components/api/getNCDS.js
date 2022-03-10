import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const data = await prisma.ncds.findMany({
      include: {
        images: true
      },
    }) || null
    if(!!data && data.length > 0)return res.status(200).json(data); else return res.status(404).send("data not found")
  }
  