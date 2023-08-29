// 创建随机电话号码
export const createRandomPhoneNumber = () => {
  let result = '+'
  for (let i = 0; i < 12; i++) {
    result += Math.round(Math.random() * 10)
    if (i === 2 || i === 5 || i === 8) {
      result += ' '
    }
  }
  return result
}

export const pad = (num: number, totalStringSize: number) => {
  let asString = num + ''
  while (asString.length < totalStringSize) asString = '0' + asString
  return asString
}


