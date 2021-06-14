<template>
  <div id="index">
    <img id="logo" alt="Vue logo" src="../assets/kojima-logo.png">
    <h1>Kojima Studio Presents</h1>
  </div>
</template>

<script>
export default {
  name: "index",
  components: {
  },
  data(){
    return {}
  },
  methods:{
    jumpToEditor(){
      this.$router.push({name:'/Kojima-Coin/KGEditor'})
    }
  }
}
</script>
<style scoped lang="less">
#index{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #303133;
  padding-top: 100px;
}
h1{
  font-weight: 600;
  font-size: 33px;
}
#logo{
  height: 320px;
}
</style>