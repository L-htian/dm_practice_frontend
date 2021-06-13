<template>
  <div>
    <div id="kg_container">
      <KGBuilder class="kgBuilder" pid="kg_container" :wantNew="getNew"
                 :hasUploaded="upLoaded" :fileList="uploadFileList" :graphInfo="getGraph"></KGBuilder>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import KGBuilder from "@/components/KGBuilder";

export default {
  name: "KGEditor",
  components: {
    KGBuilder
  },
  data() {
    return {
      getNew: false,
      upLoaded: false,
      uploadFileList: [],
      getGraph: []
    }
  },
  computed: {
    ...mapGetters([
      'isGraphOpening',
      'selectedKGId'
    ])
  },
  mounted() {
    if (!this.isGraphOpening) {
      window.Event.$on('getNewGraph', val => {
        if (val) {
          this.getNew = val
        }
      })
      window.Event.$on('UploadFile', val => {
        this.upLoaded = val
      })
      window.Event.$on('transferFileArray', val => {
        this.uploadFileList = val
      })
      window.Event.$on('getGraphInfo', val => {
        this.getGraph = val
      })
    }
  },
  methods: {
    ...mapMutations([
      'set_selectedKGId',
      'set_isGraphOpening'
    ]),
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