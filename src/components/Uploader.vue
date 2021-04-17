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
import {createGraphAPI, uploadAPI} from "../api/KG";
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: "Uploader",
  data() {
    return {
      fileList: [],
      getUpload: false,
      getGraphNew: false,
      newGraph: []
    }
  },
  computed: {
    ...mapGetters([
      'selectedKGId',
      'uploadedData'
    ])
  },
  provide() {

  },
  beforeDestroy() {
  },
  methods: {
    ...mapMutations([
      'set_selectedKGId',
      'set_uploadedData'
    ]),
    setUrl: function () {
      return "http://localhost:8089/api/KG/upload"
    },
    jumpToEditor(file, fileList) {
      this.fileList = fileList
      if (!this.getUpload) {
        this.getUpload = !this.getUpload;
        // todo upload
      }
      window.Event.$emit('UploadFile', this.getUpload)
      window.Event.$emit('transferFileArray', this.fileList)
    },
    getNewGraph() {
      this.getGraphNew = true
      window.Event.$emit('getNewGraph', this.getGraphNew)
      this.newGraph = this.getNewGraphInfo()
      this.set_selectedKGId(this.newGraph.id)
      window.Event.$emit('getGraphInfo', this.newGraph)
    },
    // todo 创建空白图谱获得Id
    getNewGraphInfo() {
      return createGraphAPI()
    }
  }
}

</script>

<style scoped>
.Uploader {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
  align-items: center;
  justify-content: center;
}

.newGraphButton {
  position: fixed;
  top: 64%;
  margin: auto;
  align-items: center;
  justify-content: center;
}
</style>