
export function getParameterByName(name: string, url: string): string | null {
  if (!url) url = window.location.href
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * 格式化日期选项
 */
class DateFormatOption {
  'M+': number //月
  'd+': number //日
  'h+': number //小时
  'm+': number //分
  's+': number //秒
  'q+': number //季度
  'S+': number //毫秒
}
export function formatUnixTime(
  val: string | number,
  fmt = 'yyyy-MM-dd hh:mm:ss',
) {
  const date = new Date(val)

  /*
  let date = null
  if (isUnixTime) {
    date = new Date(val);
  } else {
    date = val
  }
  */

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    )
  }

  const options = new DateFormatOption()
  options['M+'] = date.getMonth() + 1
  options['d+'] = date.getDate()
  options['h+'] = date.getHours()
  options['m+'] = date.getMinutes()
  options['s+'] = date.getSeconds()
  options['q+'] = Math.floor((date.getMonth() + 3) / 3)
  options['S+'] = date.getMilliseconds()
  for (const k in options) {
    const key = k as keyof DateFormatOption // 转换key格式
    if (new RegExp(`(${key})`).test(fmt)) {
      const str = options[key] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length),
      )
    }
  }

  return fmt
}

const bianceSpotBaseUri = 'https://www.binance.com/en/trade/'
const bianceFuturesBaseUri = 'https://www.binance.com/zh-CN/futures/'

export const generateBianceUri = (
  symbol: string,
  exchange = 'USDT',
  isSpot = true,
): { asset: string; assetUri: string } => {
  let assetUri = ''
  let asset = symbol
  const isInclude = symbol.search(new RegExp(`${exchange}`))

  if (isInclude !== -1) {
    const targetSymbol = symbol.match(new RegExp(`(\\S*)${exchange}`)) || []
    asset = targetSymbol[1]
    if (isSpot) {
      assetUri = `${bianceSpotBaseUri}${asset}_${exchange}`
    } else {
      assetUri = `${bianceFuturesBaseUri}${asset}_${exchange}`
    }
  }

  return { asset, assetUri }
}