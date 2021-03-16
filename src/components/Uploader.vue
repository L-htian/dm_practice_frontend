<template>
  <div class="Uploader">
    <el-upload
        class="uploadFile"
        drag
        :action="setUrl()"
        :limit="1"
        :on-success="jumpToEditor"
        accept="application/json,text/csv"
        :file-list="fileList">
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传Json文件</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "Uploader",
  data() {
    return {
      fileList:[]
    }
  },
  methods: {
    setUrl:function (){
      return "http://localhost:8089/api/KG/upload"
    },
    jumpToEditor() {
      this.$router.push('/Kojima-Coin/index')
    },
    // showFile:function (response,file,fileList){
    //   console.log(response.fileList)
    // }
  }
}

</script>

<style scoped>
.Uploader /deep/ .uploadFile {
  border-color: #303133;
}
.el-upload__text{
  text-align: center;
  font-size: medium;
  padding-top: 79px;
}
.el-upload__tip{
  font-size: medium;
  font-weight: bolder;
}
</style>