<template>
  <div id="Uploader">
    <el-upload
        class="uploadFile"
        :action="setUrl()"
        :limit="1"
        accept="application/json,text/csv"
        :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传json,csv文件</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  data() {
    return {
      fileList:[]
    }
  },
  methods: {
    setUrl:function (){
      return "/api/KGUpload/upload"
    }
  }
}

</script>

<style scoped>
@import url("//unpkg.com/element-ui@2.15.1/lib/theme-chalk/index.css");
</style>