import RefData from './data/refData'
import { textHighlight } from './utils'

// 自定义渲染国家列视图
export const countryCellRenderer = (params: { value: string }, searchValue: string) => {
  const flag =
    "<img border='0' width='15' height='10' style='margin-bottom: 2px' src='https://www.ag-grid.com/example-assets/flags/" +
    (RefData.COUNTRY_CODES as any)[params.value] +
    ".png'>"
  return flag + ' ' + textHighlight(params.value, searchValue)
}

// 自定义渲染技能列视图
export const skillsCellRenderer = (params: any) => {
  const data = params.data
  const skills: string[] = []
  RefData.IT_SKILLS.forEach(function (skill) {
    if (data && data.skills && data.skills[skill]) {
      skills.push(
        '<img src="https://www.ag-grid.com/example-assets/skills/' +
          skill +
          '.png" width="16px" title="' +
          skill +
          '" />'
      )
    }
  })
  return skills.join(' ')
}

// 自定义渲染百分比视图
export const percentCellRenderer = (params: any) => {
  const value = params.value
  const eDivPercentBar = document.createElement('div')
  eDivPercentBar.className = 'div-percent-bar'
  eDivPercentBar.style.width = value + '%'
  if (value < 20) {
    eDivPercentBar.style.backgroundColor = 'red'
  } else if (value < 60) {
    eDivPercentBar.style.backgroundColor = '#ff9900'
  } else {
    eDivPercentBar.style.backgroundColor = '#00A000'
  }
  const eValue = document.createElement('div')
  eValue.className = 'div-percent-value'
  eValue.innerHTML = value + '%'
  const eOuterDiv = document.createElement('div')
  eOuterDiv.className = 'div-outer-div'
  eOuterDiv.appendChild(eValue)
  eOuterDiv.appendChild(eDivPercentBar)
  return eOuterDiv
}
