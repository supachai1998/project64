import { prisma } from "/prisma/client";

export default async function handler(req, res) {
    const { body, method } = req;
    const { id, name, password, email } = body
    try {
        switch (method) {
            case "POST":
                await prisma.user.create({
                    data: {
                        "name": name,
                        "password": password,
                        "email": email
                    }
                })
                res.status(200).json({ status: true })
                break;
            case "DELETE":

                await prisma.user.delete({
                    where: {
                        id: id,
                    }
                })
                res.status(200).json({ status: true })
                break;
            case "PATCH":

                await prisma.user.update({
                    where: {
                        id: id,
                    },
                    data: body
                })
                res.status(200).json({ status: true })

                break;

            default:
                const data = await prisma.user.findMany()

                !!data && data.length > 0 ? res.status(200).json(data) : res.status(404).json({})
                break;
        }
    } catch (e) { res.status(400).json({ message: "bad request", error: e.message }) }



}
