const sortObjsByProperty = (objs, property) => {
  return objs.sort((a, b) => a[property] - b[property])
}

const countInstances = (s) => {
  return s.reduce((acc, arr) => {
    for (const item of arr) {
      acc[item] = acc[item] !== undefined ? acc[item] + 1 : 1
    }

    return acc
  }, {})
}

export { sortObjsByProperty, countInstances }
