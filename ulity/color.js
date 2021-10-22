
export const color = (type="",shard="") =>{
     const mem = ["gray", "red", 'yellow', 'green', 'blue', 'purple', 'pink', 'indigo']
     const random = Math.floor(Math.random()*mem.length-1)
     return `${type}-${mem[random]}-${shard}`
}