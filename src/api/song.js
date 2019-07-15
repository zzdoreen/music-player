import jsonp from '@/common/js/jsonp'
import {commonParams} from './config'
export function getLyric(mid){
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  const data = Object.assign({}, commonParams,{
    g_tk:1318452308,
    pcachetime:+new Date(),
    loginUin: 1061831341,
    format: 'json',
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    songmid:mid,
    notice:0,
  })
  return jsonp(url, data)

}
