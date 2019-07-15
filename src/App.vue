<template>
  <div id="app">
    <Header></Header>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Header from 'components/header/header'
import Tab from 'components/tab/tab'
import player from 'components/player/player'
export default {
  name: 'App',
  components:{Header,Tab,player},
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable';
#app {
  
}
</style>
