export const groupByNcds = (list, _key) => {
    const result = Object.values(list.reduce((rv, x) => {
        // console.log(x)
        rv[x[_key]] = rv[x[_key]] || { 
            [_key]: x[_key],
            name_th : x.ncds.name_th,
            name_en : x.ncds.name_en,
            data: [] 
        };
        rv[x[_key]].data.push({ ...x });
        return rv;
    }, {}));
    return result

};