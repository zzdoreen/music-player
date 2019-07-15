import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
//import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  //es6语法，对象的合并
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}
/*
export function getDiscList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    needNewCode: 0,
    uin:0,
    loginUin:0,
    hostUin:0,
  })
  return jsonp(url, data, options)
}
*/

/*export function getSongList(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk:67232076
  })

  return jsonp(url, data, options)
}
*/
export function getSongList(disstid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'

  const data = Object.assign({}, commonParams, {
    albummid:disstid,
    ct: 24,
    g_tk: 1657268401,
    platform: 'yqq',
    hostUin: 0,
    notice:0,
    needNewCode: 0,
    format:'json'
  })

  return jsonp(url, data, options)
}
