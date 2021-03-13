<template>
  <div id="index">
    <img id="logo" alt="Vue logo" src="../assets/kojima-logo.png">
    <h1>Kojima Studio Presents</h1>
    <Uploader></Uploader>
  </div>
</template>

<script>
import Uploader from "@/components/Uploader";
export default {
  name: "index",
  components: {
    Uploader
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