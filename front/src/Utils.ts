export class Utils {
  static sortObjsByProperty = (objs, property) => {
    return objs.sort((a, b) => a[property] - b[property])
  }
}
