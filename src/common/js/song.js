import {getLyric} from '@/api/song'
import {ERR_OK} from '@/api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    getLyric(this.mid).then((res)=>{
      if(res.retcode === ERR_OK){
        this.lyric = res.lyric
        console.log(this.lyric)
      }
    })
  }
  /*
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }*/
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

export function createRank(musicData) {
  return new Song({
    id: musicData.songId,
    mid: '002J4UUk29y8BY',
    singer: filterSinger(musicData.singerName),
    name: musicData.title,
    album: musicData.albumMid,
    duration: '360',
    image: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000002J4UUk29y8BY.jpg?max_age=2592000',
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songId}.m4a?fromtag=46`
  })
}
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function getSongKey(songmid){
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({},{
    callback:'musicJsonCallback',
    loginUin:3051522991,
    format:'jsonp',
    platform:'yqq',
    needNewCode:0,
    cid:205361747,
    uin:3051522991,
    guid:5931742855,
    songmid:songmid,
    filename:`C400${songmid}.m4a`
  })
  return jsonp(url,data)
}

