import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const data = await prisma.ncds.findMany() || null
    !!data && data.length > 0 ? res.status(200).json(data) : res.status(404).send("data not found")
  }
  