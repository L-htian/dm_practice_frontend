<template>
  <div class="Uploader">
    <el-upload
        class="uploadFile"
        drag
        action="#"
        :limit="1"
        :on-change="jumpToEditor"
        accept="application/json"
        :file-list="fileList">
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传Json文件</div>
    </el-upload>
    <div class="orText">或者您可以</div>
    <el-button class="newGraphButton" type="info" round @click="getNewGraph">创建新的图谱</el-button>
  </div>

</template>

<script>
import Vue from 'vue'

export default {
  name: "Uploader",
  data() {
    return {
      fileList: [],
      getUpload: false,
      getGraphNew: false,
    }
  },
  provide() {

  },
  beforeDestroy() {
  },
  methods: {
    setUrl: function () {
      return "http://localhost:8089/api/KG/upload"
    },
    jumpToEditor(file, fileList) {
      // this.$router.push({name: '/Kojima-Coin/KGEditor'})
      this.fileList = fileList
      if (!this.getUpload) {
        this.getUpload = !this.getUpload
      }
      window.Event.$emit('UploadFile', this.getUpload)
      window.Event.$emit('transferFileArray', this.fileList)
    },
    getNewGraph() {
      this.getGraphNew = true
      window.Event.$emit('getNewGraph', this.getGraphNew)
    },

  }
}

</script>

<style scoped>

.el-upload__text {
  text-align: center;
  font-size: medium;
  padding-top: 79px;
}

.el-upload__tip {
  font-size: medium;
  font-weight: bolder;
}

.orText {
  position: fixed;
  font-size: large;
  color: #606266;
  top: 56%;
  left: 46.5%;
}

.newGraphButton {
  position: fixed;
  top: 64%;
  left: 45.3%;
}
</style>