<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="sliderData.length" class="slider-wrapper" ref="sliderWrapper">
          <slider :sliderData="sliderData">
            <div v-for="(item,key) in sliderData" :key="key">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click.stop="selectItem(item)" v-for="(item,key) in discList" :key="key" class="item">
              <div class="icon">
                <img @load="loadImg" v-lazy="item.picUrl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.songListDesc"></h2>
                <p class="desc" v-html="item.songListAuthor"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import slider from "@/base/slider/slider";
import { getRecommend } from "@/api/recommend.js";
import { ERR_OK } from "@/api/config.js";
//import axios from "axios";
import Loading from "@/base/loading/loading";
import Scroll from "@/base/scroll/scroll";
import {mapMutations} from 'vuex'

export default {
  components: {
    slider,
    Loading,
    Scroll
  },
  data() {
    return {
      sliderData: [],
      discList: []
    };
  },
  created() {
    getRecommend().then(res => {
      if (res.code == ERR_OK) {
        this.discList = res.data.songList;
        this.sliderData = res.data.slider;
        //console.log(res)
      }
    });
  },
  methods: {
    loadImg() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        this.$refs.scroll.refresh();
      }
    },
    selectItem(item){
      this.$router.push({
        path:`/recommend/${item.id}`
      })
      this.setDisc(item)
      //console.log(item)
      return false;
    },
    ...mapMutations({
      setDisc:'SET_DISC'
    })
  }
};
</script>
<!--
  export default {
    mixins: [playlistMixin],
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
  }
-->
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
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
