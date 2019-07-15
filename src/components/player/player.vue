<template>
  <div class="player" v-show="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img
            width="100%"
            height="100%"
            :src="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${currentSong.album.mid}.jpg`"
          />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer[0].name"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCss">
                <img class="image" :src="imgUrl" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div>
                <p ref="lyricLine" class="text"></p>
              </div>
            </div>
          </scroll>
        </div>

        <!-- 进度条 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <!-- 当前播放时间 -->
            <div class="progress-bar-wrapper">
              <bar :percent="currentTime/currentSong.interval" @percentChange="percentChange"></bar>
            </div>
            <span class="time time-r">{{format(currentSong.interval)}}</span>
            <!-- 总时长 -->
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                class="icon icon-not-favorite"
              ></i>
              <!-- @click="toggleFavorite(cureentSong)" :class="getFavoriteIcon(currentSong)" -->
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen">
        <div class="icon" @click="open">
          <img :class="cdCss" width="40" height="40" :src="imgUrl" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer[0].name"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="currentTime/currentSong.interval">
            <i class="icon-mini" @click="togglePlaying" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist :mode="iconMode" ref="playlist"></playlist>
    <audio
      muted
      ref="audio"
      @timeupdate="updateTime"
      @canplay="ready"
      @error="error"
      @ended="end"
      :src="songUrl"
    ></audio>
  </div>
</template>


<script type="text/ecmascript-6">
import playlist from "@/components/playlist/playlist";
import { mapGetters, mapMutations, mapActions } from "vuex";
import scroll from "@/base/scroll/scroll";
import bar from "@/base/progress-bar/progress-bar";
import progressCircle from "@/base/progress-circle/progress-circle";
import animations from "create-keyframe-animation";
import { prefixStyle } from "@/common/js/dom";
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/util";
import { getSongVkey } from "@/api/singer";
//import { playerMixin } from '@/common/js/mixin';
//import { getLyric } from "@/api/song";

const transform = prefixStyle("transform");
export default {
  //mixins:[playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0
    };
  },
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    imgUrl() {
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.currentSong.album.mid}.jpg`;
    },
    songUrl() {
      return `http://dl.stream.qqmusic.qq.com/C400${this.currentSong.mid}.m4a?guid=5931742855&vkey=${this.vkey}&uin=685&fromtag=38`;
    },
    cdCss() {
      return this.playing ? "play" : "play pause";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    ...mapGetters([
      "vkey",
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      "favoriteList"
    ])
  },
  components: {
    scroll,
    bar,
    progressCircle,
    playlist
  },
  methods: {
    showPlayList() {
      this.$refs.playlist.show();
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    percentChange(percent) {
      this.$refs.audio.currentTime = percent * this.currentSong.interval;
      this.setPlayingState(true);
      this.$refs.audio.play();
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      /* 时间戳 过滤器 */
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const seconde = this.pad(interval % 60);
      return `${minute}:${seconde}`;
    },
    pad(num, n = 2) {
      /* 补位 补零  n代表字符串的长度*/
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setVkey: "SET_VKEY",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
      setFavorite:"SET_FAVORITE_LIST"
    }),
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
    },
    error() {
      this.songReady = true;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    enter(el, done) {
      const { x, y, scale } = this.getPosAndScale();
      let animation = {
        0: {
          //起点 小图标的点
          transform: `translate3D(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          //移动终点 自己本身的位置 缩放动态效果
          transform: `translate3D(0,0,0) scale(1.1)`
        },
        100: {
          //动画终点 所有效果停止
          transform: `translate3D(0,0,0) scale(1})`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 800,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter(el) {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      const { x, y, scale } = this.getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3D(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.style.transition = "all 0.9s";
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave(el) {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    getPosAndScale() {
      //小图标的宽度 左边距 下边距
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;

      //大图标的上边距 宽度
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;

      //缩放的比例
      const scale = targetWidth / width;

      //左偏移的量 下的偏移量
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

      return { x, y, scale };
    },
    togglePlaying() {
      this.setPlayingState(!this.playing);
    },

    /* toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      } 
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return "icon-favorite";
      }  
      return "icon-not-favorite";
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id;
      });
      return index > -1;
    }, */
    ...mapActions(["savePlayHistory", "saveFavoriteList", "deleteFavoriteList"])
  },
  watch: {
    currentSong(newsong, oldsong) {
      if (!newsong.id) {
        return;
      }
      if (newsong.id === oldsong.id) {
        return;
      }
      setTimeout(() => {
        this.$refs.audio.play();
        /*this.getLyric(this.currentSong.mid).then(res => {
          //console.log(res)
          /* var ret = res.data;
          if (typeof ret === "string") {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
          console.log(res.json(ret)) */
        // });
      }, 1000);
      getSongVkey(this.currentSong.mid).then(res => {
        let vkey = res.data.items[0].vkey;
        this.setVkey(vkey);
      });
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      if (audio) {
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause();
        });
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>