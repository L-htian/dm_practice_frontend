<template>
  <div>
    <div id="kg_container">
      <KGBuilder pid="kg_container"></KGBuilder>
    </div>
  </div>
</template>

<script>
import KGBuilder from "@/components/KGBuilder";

export default {
  name: "KGEditor",
  comments:{
    KGBuilder
  },
  data(){
    return{}
  }
}
</script>

<style scoped>
#kg_container {
  height: 100vh;
  width: 100%;
}
</style>