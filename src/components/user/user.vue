<template>
    <div class="user">
        <div class="avatar">
            <img src="../../common/image/avatar.jpg" alt="">
        </div>
        <input type="text" class="input1 username" placeholder="用户名">
        <input type="text" class="input1 password" placeholder="密码">
        <br>
        <button class="btn" @click="submit">登&nbsp;&nbsp;陆</button>
        <button class="btn" @click="del">删&nbsp;&nbsp;除</button>
    </div>
</template>
<script>
export default {
    methods: {
        submit(){
             this.$router.push('/userCenter')
             var name = document.querySelector('.username')
             var pass = document.querySelector('.password')
             pass.value = ''
             name.value = ''
        },
        del(){
            var name = document.querySelector('.username')
            var pass = document.querySelector('.password')
            pass.value = ''
            name.value = ''
        }
    },
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.user
    margin 0 auto;
    text-align center;
    .avatar
        margin 20px auto;
        border-radius 50%;
        border 5px solid rgba(255,255,255,0.2);
        overflow hidden; 
        width 100px;
        height 100px;
        img 
            width 100%;
    .input1
        width 70%;
        margin-bottom 20px;
        height 40px;
        line-height 40px;
        border-radius 6px;
        padding 0 20px;
        background #333;
        color rgba(255,255,255,0.5)
    .username
        margin-top 30px;
    .btn
        width 35%;
        height 40px;
        box-sizing border-box;
        border 2px solid #ffcd32;
        background none ;
        border-radius 6px;
        margin:0 5%;
        color #ffcd32;
    .btn:hover
        background #ffcd32;
        color:white
</style>
