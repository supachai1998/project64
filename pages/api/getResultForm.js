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

        try {
          const data = JSON.parse(body)
          let count = 0
          let result;
          // search answer for recommend
          if (data.score >= 0) {
            const score = data.score
            const dataQuery = await prisma.resultForm.findMany({
              where: { ncdsId: data.ncdsId }
            })
            // console.log(score, dataQuery)
            if (dataQuery?.length > 0) {
              // find score between in data start to end
                result = dataQuery.findIndex(v => {
                return score >= v.start && score <= v.end // range of score
              })
              // console.log(result)
              let _data = dataQuery[result]
              if (!_data) {
                result = dataQuery.length - 1
                const lastData = dataQuery[result]
                if (score >= lastData.end) {
                  _data = lastData
                  // console.log(lastData)
                }
              }
              // console.log(_data)
              const sliceData = dataQuery.slice(0, result+1)
              // console.log(dataQuery,sliceData)
              if (result > 0) {
                const getRecommend = sliceData.map((v, ind) => {
                  const split = v.recommend.split('\n')
                  const re = split.map((v, i) => { 
                    count += 1; 
                    if(v.match(/^[0-9]*\./)?.index === 0) return v.replace(/^[0-9]*\./, `${count}.`) 
                    else return `${count}. ${v}`
                  })
                  return re
                }).reduce((a, b) => { return a.concat(b) }).map(v => `${v}`).join("\n")
                return res.status(200).json({ title: _data?.title, index: result, of: dataQuery.length, recommend: getRecommend })
              } else {
                return res.status(200).json({ title: _data?.title, index: result, of: dataQuery.length, recommend: _data?.recommend })

              }
            } else {
              return res.status(404).json({ statusText: "ไม่พบข้อมูล", error: "ไม่พบข้อมูลผลการประเมิน" })
            }
          }
          // create many record
          else {
            for (const row of data) {
              await prisma.resultForm.create({
                data: row,
              })
            }
            return res.status(200).json({ status: true })
          }
        } catch (e) {
          return res.status(500).json({ status: false, error: e.message })
        }
      case "DELETE":
        if (Array.isArray(id)) {
          id.map(async _ => await prisma.resultForm.delete({
            where: {
              id: parseInt(_),
            }
          }))
        }
        else {
          await prisma.resultForm.delete({
            where: {
              id: parseInt(id),
            }
          })
        }
        return res.status(200).json({ status: true })
      case "PATCH":
        try {
          const data = JSON.parse(body)
          for (const row of data) {
            await prisma.resultForm.update({
              where: {
                id: row.id,
              },
              data: {
                start: row.start,
                end: row.end,
                recommend: row.recommend,
                title: row.title,
              }
            })
          }
          return res.status(200).json({ status: true })
        } catch (e) {
          return res.status(400).json({ status: false, error: e.message })
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
            data = await prisma.resultForm.findMany({
              where: { ncdsId: _id },
              select: {
                id: true,
                title: true,
                start: true,
                end: true,
                recommend: true,
                ncdsId: true,
                ncds: {
                  select: {
                    name_th: true,
                    name_en: true
                  }
                }
              },
              take : 1000
            })
          }
        } else {
          return res.status(400).send({ statusText: "id(ncdsId) required" })
        }
        if (!!data && data.length > 0) return res.status(200).json(data)
        else return res.status(404).send({ statusText: "ไม่พบข้อมูล" })
    }
  } catch (e) { console.log(e); res.status(500).send({ statusText: "something error", e: e.message, raw: body }) }
}