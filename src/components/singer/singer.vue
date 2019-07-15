<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
import ListView from "@/base/listview/listview";
import { getSingerList } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import Singer from "@/common/js/singer";
import { mapMutations } from "vuex";
import { playlistMixin } from "@/common/js/mixin";

const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";

export default {
  components: {
    ListView
  },
  data() {
    return {
      singers: []
    };
  },
  created() {
    this.getSinger();
  },
  methods: {
    getSinger() {
      getSingerList().then(res => {
        if (res.code == ERR_OK) {
          this.singers = this.normalizeSinger(res.data.list);
        }
      });
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      //console.log(singer)
      this.setSinger(singer) // => this.$store.commit('SET_SINGER')
    },
    normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        );
      });

      // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        map = hot.concat(ret)
        return map
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
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
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _normalizeSinger(list) {

        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }

</script>
-->
<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
