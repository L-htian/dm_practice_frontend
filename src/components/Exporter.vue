<template>
  <div class="export">
    <a class="btn-download" @click="exportXml">
      <i class="icon-download"></i>导出为Xml</a>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Exporter",
  data() {},
  methods: {
    exportXml: function () {
      axios.get('/exportXml', {
        responseType: 'arraybuffer'
      }).then((response) => {
        //创建一个blob对象,file的一种
        let blob = new Blob([response.data], {type: 'application/xml'})
        let link = document.createElement('a')
        var myDate = new Date();
        link.href = window.URL.createObjectURL(blob)
        link.download = 'Coin' + '_' + myDate.toLocaleDateString() + '.xml'
        link.click()
      })
    }
  }

}
</script>

<style scoped>

</style>