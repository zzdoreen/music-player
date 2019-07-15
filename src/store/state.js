import {playMode} from '@/common/js/config'
import {loadSearch, loadPlay, loadFavorite} from '@/common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,  //全屏
  playlist: [],   //播放列表
  sequenceList: [],   //顺序列表
  mode: playMode.sequence,  //播放模式 0顺序  1循环  2随机
  currentIndex: -1, //当前播放的索引
  disc: {},
  topList: {},
  vkey:'',
  //searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state