<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImg">
      <div class="play-wrapper" >
        <div class="play" @click="random" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      class="list"
      ref="list"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <songList :rank="rank" :songs="songs" @select="selectItem"></songList>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import songList from "@/base/song-list/song-list";
import scroll from "@/base/scroll/scroll";
import loading from "@/base/loading/loading";
import {mapActions} from 'vuex';

export default {
  data() {
    return {
      scrollY: 0
    };
  },
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  components: {
    scroll,
    songList,
    loading
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImg.clientHeight;
    this.minTranslateY = -this.imageHeight + 40;
    this.$refs.list.$el.style.top = `${this.$refs.bgImg.clientHeight}px`;
  },
  methods: {
    random(){
      this.randomPlay({
        list:this.songs
        })
    },
    goBack() {
      //window.history.go(-1);
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item,index){
      this.selectPlay({
        list:this.songs,
        index,
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      let zindex = 0;
      let scale = 1;
      let blur = 0;
      const percent = Math.abs(newY / this.imageHeight);
      if (newY < this.minTranslateY) {
        zindex = 10;
        this.$refs.bgImg.style.height = "40px";
        this.$refs.bgImg.style.paddingTop = "0";
        this.$refs.playBtn.style.display = 'none';

      } else {
        zindex = 0;
        this.$refs.bgImg.style.height = 0;
        this.$refs.bgImg.style.paddingTop = "70%";
        this.$refs.playBtn.style.display = '';
      }

      if (newY > 0) {
        scale = 1 + percent;
        zindex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      this.$refs.filter.style.backdropFilter = `blur(${blur}px)`;
      this.$refs.bgImg.style.transform = `scale(${scale})`;
      this.$refs.layer.style.transform = `translate3D(0,${translateY}px,0)`;
      this.$refs.bgImg.style.zIndex = zindex;
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
  }

  .play-wrapper {
    position: absolute;
    bottom: 20px;
    z-index: 50;
    width: 100%;

    .play {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-theme;
      color: $color-theme;
      border-radius: 100px;
      font-size: 0;

      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
  }

  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>