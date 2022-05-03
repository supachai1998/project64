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
        const { addSubForm, addForm } = query
        try {
          if (addSubForm) {
            let subForm = body.subForm.map(v1 => { return { ...v1, choice: v1.choice.map(v => { return { ...v, score: Number(v.score) } }) } })
            subForm = subForm.map((v1) => { return { ...v1, choice: { create: [...v1.choice] } } })
            await prisma.form.create({
              data: {
                ...body,
                subForm: { create: [...subForm] }
              },
            })
          } else if (addForm) {
            for (const row of JSON.parse(body)) {
              try {
                const dup = await prisma.form.findFirst({
                  where: {
                    title: row.title
                  }
                })
                // row[ncdsId] = parseInt(row[ncdsId])
                console.log(row)
                if (dup === null) await prisma.form.create({ data: { ...row }, })
                else return res.status(400).send({ statusText: `duplicate title : ${row.title}` })
              } catch (e) { console.error(e.message); return res.status(400).send({ statusText: e.message }) }
            }
          } else {
            await prisma.form.create({
              data: JSON.parse(body),
            })
          }
        } catch (e) {
          if (e.message.includes("constraint")) {
            return res.status(404).send({ statusText: "มีค่าซ้ำ" })
          }
        }
        return res.status(200).json({ status: true })
      case "DELETE":
        const { allForm } = query
        let ncdsId = null
        if (Array.isArray(id)) {
          const result = await Promise.all(id.map(async _ => {
            const f = await prisma.form.delete({
              where: {
                id: _,
              }
            })
            return f
          }))
          // console.log(result)
          if (ncdsId === null) ncdsId = result[0].ncdsId

        } else if (allForm) {
          const result = await Promise.all(await body.map(async ({ id }) => {
            const f = await prisma.form.delete({
              where: {
                id: parseInt(id),
              }
            })
            return f
          }))
          // console.log(result)
          if (ncdsId === null) ncdsId = result[0].ncdsId
        } else {
          const formId = parseInt(id)
          const f = await prisma.form.delete({
            where: {
              id: formId,
            }
          })
          // console.log(f)
          if (ncdsId === null) ncdsId = f.ncdsId
        }
        // console.log(ncdsId)
        if (ncdsId) {
          console.log(count)
          const count = await prisma.form.count({
            where: {
              ncdsId,
            }
          })
          if (count === 0) {
            const result = await prisma.resultForm.findMany({
              where: { ncdsId }
            })
            result.map(async v => await prisma.resultForm.delete({
              where: {
                id: v.id
              }
            }))
          }
        }
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
            return res.status(400).json({
              statusText: "error when form update",
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
                console.log(e); return res.status(400).json({
                  statusText: "error in loop create",
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
                console.log(e); return res.status(400).json({
                  statusText: "error in loop update",
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
        const { user, haveData } = query

        if (_id) {
          if (user) {
            const formExits = await prisma.form.findMany({
              where: { ncdsId: _id },
              select: {
                id: true,
                title: true,
                ncdsId: true,
                subForm: {
                  include: {
                    choice: {
                      orderBy: {
                        score: "desc"
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
            if (formExits.length <= 0) {
              return res.status(400).json({
                statusText: "data form not found"
              })
            } else {
              const resultForm = await prisma.resultForm.findMany({
                where: { ncdsId: _id },
              })
              if (resultForm?.length <= 0) return res.status(401).json({
                statusText: "data resultForm not found"
              })
              const subFormExits = formExits.every(val => val.subForm.length > 0)
              if (subFormExits) {
                return res.status(200).json(formExits)
              } else {
                return res.status(403).json({
                  statusText: "data subform not found"
                })
              }
            }
          } else if (!query.select) {
            data = await prisma.form.findMany({
              where: { ncdsId: _id },
              select: {
                id: true,
                title: true,
                ncdsId: true,
                subForm: {
                  include: {
                    choice: {
                      orderBy: {
                        score: "desc"
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
            data = await prisma.form.findMany({

              where: { id: _id },
              select: { [select]: true }
            })
          }
          if (data) return res.status(200).json(data)
        } else if (haveData) {
          let haveForm = new Set();
          const formExits = await prisma.form.findMany({
            select: {
              ncdsId: true,
              subForm: {
                select: {
                  id: true
                }
              }
            }
          })
          for (const { ncdsId, subForm } of formExits) {
            if (subForm.length > 0) {
              const resultForm = await prisma.resultForm.findMany({
                where: { ncdsId: ncdsId },
                select: { id: true }
              })
              if (resultForm.length > 0) {
                haveForm.add(ncdsId)

              }
            }
          }
          return res.json([...haveForm])
        } else {
          try {
            data = await prisma.form.findMany({

              select: {
                id: true,
                title: true,
                ncdsId: true,
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
          } catch (e) {
            if (e.message.includes("Field ncds is required to return data, got `null`")) {
              const total = await prisma.form.findMany()
              for (const x of total) {
                try {
                  await prisma.form.findFirst({
                    where: { id: x.id },
                    select: {
                      ncds: {
                        select: {
                          id: true,
                          name_th: true,
                          name_en: true
                        }
                      }
                    }
                  })
                } catch (e) {
                  console.error("data ", x, "has problem try delete")
                  await prisma.form.delete({
                    where: { id: x.id }
                  })
                }
              }
            }
          }
        }
        if (!!data && data.length > 0) return res.status(200).json(data)
        else res.status(404).send({ statusText: "data not found" })
        break;
    }
  } catch (e) { console.log(e); res.status(500).send({ statusText: "something error", raw: body }) }
}