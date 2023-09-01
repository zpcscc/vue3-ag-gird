// 创建随机电话号码
export const createRandomPhoneNumber = () => {
  let result = ''
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

/**
 * @name 高亮部分内容
 * @param value
 * @returns
 */
export const textHighlight = (text: string, searchValue: string) => {
  if (!text.length || !searchValue.length) return text
  const reg = new RegExp(searchValue, 'gi')
  const matchValue = text.match(reg) || []
  const result = text.replace(reg, `<span class="highlight">${matchValue[0]}</span>`)
  return result
}
