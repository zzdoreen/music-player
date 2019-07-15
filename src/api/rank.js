import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function getMusicList(topid) {
  //const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  /*const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParams, {
    needNewCode: 0,
    hostUin: 0,
    notice: 0,
    format: 'json',
    platform: 'yqq.json',
    g_tk: 1657268401,
    data:encodeURI('%7B"detail"%3A%7B"module"%3A"musicToplist.ToplistInfoServer"%2C"method"%3A"GetDetail"%2C"param"%3A%7B"topId"%3A'+topid+'%2C"offset"%3A0%2C"num"%3A20%2C"period"%3A"2019_26"%7D%7D%2C"comm"%3A%7B"ct"%3A24%2C"cv"%3A0%7D%7D')
  })
  return jsonp(url, data, options)*/
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22detail%22%3A%7B%22module%22%3A%22musicToplist.ToplistInfoServer%22%2C%22method%22%3A%22GetDetail%22%2C%22param%22%3A%7B%22topId%22%3A'+topid+'%2C%22offset%22%3A0%2C%22num%22%3A20%2C%22period%22%3A%222019_26%22%7D%7D%2C%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A0%7D%7D'
  return jsonp(url, options)
}
