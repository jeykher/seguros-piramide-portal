
const colors = ["info","warning","success","primary","info","warning","success","primary"]

function setColors(data,field){
    const keyField = data.map((reg)=>(reg[field]))
    const uniqueset = new Set(keyField)
    return  [...uniqueset]
}

function getColors(arrayFields, field){
    const isAuthor = (element) => element === field;
    const index = arrayFields.findIndex(isAuthor)
    return colors[index]
}

export {setColors,getColors}