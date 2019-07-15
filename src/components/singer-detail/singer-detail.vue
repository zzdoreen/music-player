<template>
  <transition name="slide">
    <musicList :title="title" :bg-image="bgImg" 
    class="singer-detail" :songs="songList"></musicList>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSingerDetail,getSongVkey } from "@/api/singer";
import { createSong } from "@/api/song";
import { ERR_OK } from "@/api/config";
import musicList from "@/components/music-list/music-list";
export default {
  data() {
    return {
      songList: []
    };
  },
  components: {
    musicList,
    scroll
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImg() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    //console.log(this.$route.params.id)
    this.singerId = this.$route.params.id;
    getSingerDetail(this.singerId).then(res => {
      if (res.code === ERR_OK) {
        this.songList = res.singer.data.songlist;
        //console.log(this.songList)
      }
    })
  }

};
</script>
<style lang="stylus" scoped ref="stylesheet/stylus">
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
