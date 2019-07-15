<template>
  <transition name="disc">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '@/components/music-list/music-list'
  import {getSongList} from '@/api/recommend'
  import {ERR_OK} from '@/api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from '@/common/js/song'

  export default {
    computed: {
      title() {
        return this.disc.songListDesc
      },
      bgImage() {
        return this.disc.picUrl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.disc.album_pic_mid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.album_pic_mid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>