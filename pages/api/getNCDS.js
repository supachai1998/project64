import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const data = await prisma.ncds.findMany() || null
    data ? res.status(200).json(data) : res.status(200).json({})
  }
  