import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
//  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  //const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

  const data = Object.assign({}, commonParams, {
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    notice:0,
    data:encodeURI('{"comm":{"ct":24,"cv":0},"singer":{"method":"get_singer_detail_info","param":{"sort":5,"singermid":"'+singerId+'","sin":0,"num":100},"module":"music.web_singer_info_svr"}}')
  })

  return jsonp(url, data)
}

export function getSongVkey(songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commonParams,{
    callback: 'musicJsonCallback',
    loginUin: 3051522991,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 3051522991,
    guid: 5931742855,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })
  return jsonp(url, data)
}
