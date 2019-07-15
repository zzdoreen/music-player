<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '@/components/music-list/music-list'
  import {getMusicList} from '@/api/rank'
  import {ERR_OK} from '@/api/config'
  import {mapGetters} from 'vuex'
  import {createRank} from '@/common/js/song'

  export default {
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        return this.topList.picUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData(){
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then(res=>{
          var data = res.detail.data.data.song
         // console.log(data)
          for(var i=0;i<data.length;i++){
            this.songs.push({
              name:data[i].title,
              singer:[{name:data[i].singerName}],
              album:{
                name:'',
                mid:data[i].albumMid
                },
              mid:data[i].albumMid,
              url:`http://ws.stream.qqmusic.qq.com/${data[i].songId}.m4a?fromtag=46`,
              image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data[i].albumMid}.jpg?max_age=2592000`
            })
          }
        }).catch(err=>{
          console.log(err)
        })
      },
       _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item
          if (musicData.songId && musicData.albumMid) {
            ret.push(createRank(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>