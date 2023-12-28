const sortObjsByProperty = (objs, property) => {
  return objs.sort((a, b) => a[property] - b[property])
}

export { sortObjsByProperty }
