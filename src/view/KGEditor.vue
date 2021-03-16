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
  components: {
    KGBuilder
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
#kg_container {
  height: 100vh;
  width: 100%;
}
/*全屏背景色更改*/
#kg_container:fullscreen{
  background-color: rgba(255,255,255,0);
}
#kg_container:-webkit-full-screen {
  background-color: rgba(255,255,255,0);
}
#kg_container:-moz-full-screen {
  background-color: rgba(255,255,255,0);
}
::backdrop{
  background-color: rgba(255,255,255,0);
}
</style>