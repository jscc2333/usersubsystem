exports.convertToArray = function (object) {
  let array = []
  for (item in object) {
    array.push(object[item])
  }
  return array
}

exports.convertToIntegral = function (integral, array) {
  array.forEach(element => {
    integral += Math.floor(element.price / 10)
  });
  return integral
}

exports.compareTime = function (past, now) {
  const pastArray = past.toString().split('-')
  const nowArray = now.toString().split('-')
  if (nowArray[0] - pastArray[0] > 0) {
    return true
  } else if (nowArray[0] - pastArray[0] === 0) {
    if (nowArray[1] - pastArray[1] > 0) {
      return true
    } else if (nowArray[1] - pastArray[1] === 0) {
      if (nowArray[2] - pastArray[2] > 0) {
        return true
      } else { 
        return false
      }
    } else { 
      return false
    }
  } else { 
    return false
  }
}