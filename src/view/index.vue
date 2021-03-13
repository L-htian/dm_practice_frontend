<template>
  <div id="index">
    <img id="logo" alt="Vue logo" src="../assets/kojima-logo.png">
    <h1>Kojima Studio Represents</h1>
  </div>
</template>

<script>
export default {
  name: "index",
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

<style scoped>
#index{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #303133;
  padding-top: 100px;
}
#logo{
  height: 320px;
}
</style>