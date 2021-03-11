<template>
  <div id="index">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>Kojima Coin</h1>
    <div>

    </div>
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
      this.$router.push({name:'KGEditor'})
    }
  }
}
</script>

<style scoped>
#index{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>