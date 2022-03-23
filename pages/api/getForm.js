import { prisma } from "/prisma/client";
export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  },
}
export default async function handler(req, res,) {
  res.setHeader('Content-Type', 'application/json');
  const { method, query } = req;
  let body = req.body
  let data = null
  try {
    let { id } = body
    switch (method) {
      case "POST":
        await prisma.form.create({
          data: JSON.parse(body)
        })
        return res.status(200).json({ status: true })
      case "DELETE":

        await prisma.form.delete({
          where: {
            id: parseInt(id),
          }
        })
        return res.status(200).json({ status: true })
      case "PATCH":

        // console.log(dataOld)
        if (!id) {
          const _body = body
          let _data = _body.new
          const _dataOld = _body.old
          let { subForm } = _data
          delete _data['subForm']
          subForm = subForm.map(v1 => { return { ...v1, choice: v1.choice.map(v => { return { ...v, score: Number(v.score) } }) } })
          const createSubform = subForm.filter(val => !val.id).map((v1) => { return { ...v1, choice: { create: [...v1.choice] } } })
          const updateSubform = subForm.map(val => {
            if (val.id) {
              return {
                where: { id: val.id },
                data: { name: val.name }
              }
            }
          })
          const deleteSubform = _dataOld.subForm.map(val => {
            if (subForm.every(val2 => val.id !== val2.id)) {
              return { id: val.id }
            }
          })
          const update = {
            where: { id: _dataOld.id },
            data: {
              ..._data,
              subForm: {
                ...(createSubform.length > 0) && { create: createSubform },
                ...(updateSubform.length > 0) && { updateMany: updateSubform },
                ...(deleteSubform.length > 0) && { deleteMany: deleteSubform }
              },
            }
          }
          try {
            await prisma.form.update(update)
          } catch (e) {
            console.log(e)
            return res.status(500).json({
              status: "error when form update",
              ...update
            })
          }
          subForm.map(async ({ id, name, formId, choice }, ind) => {
            if (!id) {
              try {
                // console.log(id, name, formId, choice )
                // await prisma.subForm.create({
                //   data: choice
                // })
              } catch (e) {
                console.log(e); return res.status(500).json({
                  status: "error in loop create",
                  ...choice,
                })
              }

            } else {
              const createchoice = choice.filter(val => !val.id)
              const updatechoice = choice.map(val => {
                if (val.id) {
                  return {
                    where: { id: val.id },
                    data: { name: val.name, detail: val.detail, score: val.score }
                  }
                }
              })
              const deletechoice = _dataOld?.subForm[ind]?.choice?.map(val => {
                if (choice.every(val2 => val.id !== val2.id)) {
                  return { id: val.id }
                }
              })
              const update = {
                where: { id: id },
                data: {
                  name: name,
                  choice: {
                    ...(createchoice?.length > 0) && { create: createchoice },
                    ...(updatechoice?.length > 0) && { updateMany: updatechoice },
                    ...(deletechoice?.length > 0) && { deleteMany: deletechoice }
                  }
                }
              }
              try {
                await prisma.subForm.update(update)
              } catch (e) {
                console.log(e); return res.status(500).json({
                  status: "error in loop update",
                  ...update,
                })
              }
            }
          })
          return res.status(200).json({ status: true })
        } else {
          await prisma.form.update({
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
          { name_th: "โรคไม่ติดต่อเรื้อรัง", name_en: "NCDS" }, { name_en: "FOOD", name_th: "อาหาร" }, { name_en: "ALL", name_th: "ทั้งหมด" }
        ])

      default:
        const _id = parseInt(query.id)
        if (_id) {
          if (!query.select) {
            data = await prisma.form.findFirst({

              where: { ncdsId: _id },
              select: {
                id: true,
                subForm: {
                  include: {
                    choice: {
                      orderBy :{
                        score:"desc"
                      }
                    }
                  },
                },
                ncds: {
                  select: {
                    id: true,
                    name_th: true,
                    name_en: true
                  }
                }
              },
              
            })
          } else {
            const { select } = query
            data = await prisma.form.findFirst({

              where: { id: _id },
              select: { [select]: true }
            })
          }
          if(data)return res.status(200).json(data)
        } else {
          data = await prisma.form.findMany({

            select: {
              id: true,
              subForm: {
                include: {
                  choice: true
                },
              },
              ncds: {
                select: {
                  id: true,
                  name_th: true,
                  name_en: true
                }
              }
            },
          })
        }
        if(!!data && data.length > 0) return res.status(200).json(data) 
        else res.status(404).send({ error: "data not found" })
        break;
    }
  } catch (e) { console.log(e); res.status(500).send(body) }
}