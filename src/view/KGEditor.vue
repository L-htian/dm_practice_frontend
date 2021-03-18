<template>
  <div>
    <div id="kg_container">
      <KGBuilder class="kgBuilder" pid="kg_container" v-if="showKGBuilder" :wantNew="getNew"
                 :hasUploaded="upLoaded" :fileList="uploadFileList"></KGBuilder>
      <Uploader class="uploader" v-show="showUploader"></Uploader>
    </div>
  </div>
</template>

<script>
import KGBuilder from "@/components/KGBuilder";
import Uploader from "@/components/Uploader";
import {Loading} from 'element-ui';

export default {
  name: "KGEditor",
  components: {
    Uploader,
    KGBuilder
  },
  data() {
    return {
      showKGBuilder: false,
      showUploader: true,
      getNew: false,
      upLoaded: false,
      uploadFileList: []
    }
  },
  mounted() {
    let loadingInstance = Loading.service({fullscreen: true});
    setTimeout(() => {
      loadingInstance.close();
      window.Event.$on('getNewGraph', val => {
        if (val) {
          // console.log(val)
          this.getNew = val
          this.showKGBuilder = true
          this.showUploader = false
        }
      })
      window.Event.$on('UploadFile', val => {
        this.upLoaded = val
        this.showKGBuilder = true
        this.showUploader = false
      })
      window.Event.$on('transferFileArray', val => {
        this.uploadFileList = val
      })
    }, 1000)
  }
}
</script>

<style scoped>
#kg_container .kgBuilder {
  height: 100vh;
  width: 100%;
}

#kg_container .uploader {
  position: fixed;
  top: 22%;
  left: 38%;
}

/*全屏背景色更改*/
#kg_container:fullscreen {
  background-color: rgba(255, 255, 255, 0);
}

#kg_container:-webkit-full-screen {
  background-color: rgba(255, 255, 255, 0);
}

#kg_container:-moz-full-screen {
  background-color: rgba(255, 255, 255, 0);
}

::backdrop {
  background-color: rgba(255, 255, 255, 0);
}
</style>