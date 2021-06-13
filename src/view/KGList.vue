<template>
  <div class="list-container">
    <div class="button-group-left">
    </div>
    <div class="button-group-right">
      <el-upload
          class="upload"
          action="#"
          :limit="1"
          :on-change="getUploadGraph"
          accept="application/json"
          :file-list="fileList">
        <el-button type="info">上传图谱</el-button>
      </el-upload>
      <el-button type="info" plain @click="deleteManyKGs">批量删除</el-button>
      <el-upload
          class="upload"
          action="#"
          :limit="1"
          :on-change="getTextGraph"
          accept=".txt"
          :file-list="textFileList">
        <el-button type="info" plain>文本构建</el-button>
      </el-upload>
      <el-button type="info" plain @click="getNewGraph">创建图谱</el-button>
      <el-button type="info" plain @click="fuseGraph">知识融合</el-button>
    </div>
    <div class="div-kg-list">
      <ul class="kg-list">
        <li v-for="(kg, index) in KGs" :bind="kg.id" class="kg-list-item">
          <el-checkbox
              class="kg-checkbox"
              :checked="KGs[index].isSelected"
              @change="handleCheckChange(index)"
          >
          </el-checkbox>
          <div class="kg-meta">
            <div class="kg-meta-img">
              <el-image class="kg-img"
                        :src="kg.imgsrc"
                        fit="cover"
                        :preview-src-list="[kg.imgsrc]"
              ></el-image>
            </div>
            <div class="kg-meta-content">
              <h4 class="kg-name" style="color: #409eff" v-if="isGraphOpening && kg.id === selectedKGId">{{ kg.name }}
                打开中</h4>
              <h4 class="kg-name" v-else>{{ kg.name }}</h4>
              <div class="kg-description">{{ kg.description }}</div>
            </div>
          </div>
          <div class="kg-action">
            <el-tooltip content="编辑图谱信息" placement="top-end">
              <el-button type="text" @click="editKG(kg.id)"><i class="action-icon el-icon-edit"></i></el-button>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="删除图谱" placement="top">
              <el-button type="text" @click="deleteKG(kg.id)"><i class="action-icon el-icon-delete"></i></el-button>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="打开图谱" placement="top-start">
              <el-button type="text" @click="openKG(kg.id, kg.name)"><i class="action-icon el-icon-view"></i>
              </el-button>
            </el-tooltip>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog title="编辑选项" :visible.sync="EditGraphDialogVisible" custom-class="customWidth">
      <el-form>
        <el-form-item label="图谱id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingGraphEntry.id" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="图谱名称" :label-width="formLabelWidth">
          <el-input
              v-model="EditingGraphEntry.name"
              class="withoutColor"
              maxlength="15"
              show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="图谱图片url" :label-width="formLabelWidth">
          <el-input
              v-model="EditingGraphEntry.imgsrc"
              class="withoutColor"
              maxlength="275"
              show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="图谱描述" :label-width="formLabelWidth">
          <el-input
              v-model="EditingGraphEntry.description"
              type="textarea"
              class="withoutColor"
              maxlength="1000"
              show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelGraphEdit">取消</el-button>
        <el-button type="primary" @click="saveGraphEdit">保存修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import {
  deleteGraphAPI,
  getAllGraphAPI,
  updateGraphAPI,
  fuseGraphAPI,
} from "../api/KGList";
import {createGraphAPI} from "../api/KG";
import $ from 'jquery'

export default {
  name: "KGList",
  data() {
    return {
      fileList: [],
      textFileList: [],
      newGraph: [],
      formLabelWidth: "120px",
      EditingGraphId: 0,
      EditingGraphEntry: {
        name: '',
        id: 0,
        imgsrc: '',
        description: '',
      },
      KGs: [],
      EditGraphDialogVisible: false,
    }
  },
  watch: {},
  computed: {
    ...mapGetters([
      'selectedKGId',
      'isGraphOpening'
    ])
  },
  mounted() {
    this.KGs = getAllGraphAPI();
    for (let i = 0; i < this.KGs.length; i++) {
      this.KGs[i].isSelected = false;
    }
  },
  methods: {
    ...mapMutations([
      'set_selectedKGId',
      'set_selectedKGName',
      'set_isGraphOpening',
      'set_current',
      'set_getUpload',
      'set_getGraphNew',
      'set_uploadedFile',
      'set_getTextUpload',
      'set_uploadedTextFile',
      'set_fusedGraph',
      'set_getFused'
    ]),
    getNewGraph() {
      this.set_getGraphNew(true)
      this.newGraph = createGraphAPI();
      this.set_selectedKGId(this.newGraph.id);
      this.$router.push({name: 'KGEditor'});
    },
    getUploadGraph(file, fileList) {
      this.set_getUpload(true);
      this.set_uploadedFile($.extend([], [file]));
      this.$router.push({name: 'KGEditor'});
    },
    getTextGraph(file, fileList) {
      this.set_getTextUpload(true);
      this.set_uploadedTextFile($.extend([], [file]));
      this.$router.push({name: 'KGEditor'});
    },
    fuseGraph() {
      let toBeMixed = [];
      for (let i = 0; i < this.KGs.length; i++) {
        if (this.KGs[i].isSelected) {
          toBeMixed.push(this.KGs[i]);
        }
      }
      if (toBeMixed.length === 0) {
        this.$message({
          type: 'info',
          message: '无图谱被勾选'
        });
      } else if (toBeMixed.length === 1) {
        this.$message({
          type: 'info',
          message: '只有一个图谱能叫融合吗？'
        });
      } else {
        let re = fuseGraphAPI(toBeMixed);
        // this.set_isGraphOpening(true);
        // this.set_selectedKGId(re.graphId);
        this.set_fusedGraph($.extend({}, re));
        this.set_getFused(true);
        this.$router.push({name: 'KGEditor'});
      }
    },
    emptyEditingGraphEntry() {
      this.EditingGraphEntry =
          {
            name: '',
            id: 0,
            imgsrc: '',
            description: '',
          }
    },
    handleCheckChange(index) {
      this.KGs[index].isSelected = !this.KGs[index].isSelected;
    },
    cancelGraphEdit() {
      this.EditGraphDialogVisible = false
      this.EditingGraphId = 0
      this.emptyEditingGraphEntry()
      this.$message({
        type: 'info',
        message: '已取消编辑图谱'
      })
    },
    saveGraphEdit() {
      let _this = this;
      this.EditGraphDialogVisible = false;
      for (let i = 0; i < _this.KGs.length; i++) {
        if (_this.KGs[i].id === _this.EditingGraphId) {
          _this.KGs[i].id = _this.EditingGraphEntry.id;
          _this.KGs[i].name = _this.EditingGraphEntry.name;
          _this.KGs[i].description = _this.EditingGraphEntry.description;
          _this.KGs[i].imgsrc = _this.EditingGraphEntry.imgsrc;
          break;
        }
      }
      updateGraphAPI(_this.EditingGraphEntry);
      this.EditingGraphId = 0;
      this.emptyEditingGraphEntry();
      this.$message({
        type: 'success',
        message: '编辑图谱成功'
      })
    },
    deleteManyKGs() {
      let _this = this;
      let toBeDeleted = [];
      for (let i = 0; i < this.KGs.length; i++) {
        if (_this.KGs[i].isSelected) {
          if (_this.isGraphOpening && _this.selectedKGId === _this.KGs[i].id) {
            _this.$message({
              type: 'error',
              message: '选中的图谱中有图谱正在打开，请先关闭该图谱！'
            })
            return;
          }
          toBeDeleted.push(_this.KGs[i].id);
        }
      }
      if (toBeDeleted.length === 0) {
        this.$message({
          type: 'info',
          message: '无图谱被勾选'
        })
      } else {
        _this.$confirm('该操作不可撤销', '将要删除选中的图谱，是否继续？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let i = 0;
          while (i < _this.KGs.length) {
            if (toBeDeleted.indexOf(_this.KGs[i].id) !== -1) {
              deleteGraphAPI(_this.KGs[i].id);
              _this.KGs.splice(i, 1);
            } else {
              i++;
            }
          }
          _this.$message({
            type: 'success',
            message: '删除图谱成功'
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '操作已取消'
          })
        })
      }
    },
    deleteKG(graphId) {
      let _this = this;
      if (_this.isGraphOpening && _this.selectedKGId === graphId) {
        _this.$message({
          type: 'error',
          message: '该图谱正在打开，请先关闭该图谱！'
        })
      } else {
        _this.$confirm('该操作不可撤销', '将要删除该图谱，是否继续？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < _this.KGs.length; i++) {
            if (_this.KGs[i].id === graphId) {
              _this.KGs.splice(i, 1);
              break;
            }
          }
          deleteGraphAPI(graphId);
          _this.$message({
            type: 'success',
            message: '删除图谱成功'
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '操作已取消'
          })
        })
      }
    },
    editKG(graphId) {
      if (this.isGraphOpening) {
        this.$message({
          type: 'error',
          message: '有图谱已打开，请先关闭该图谱！'
        })
      } else {
        let _this = this;
        _this.EditingGraphId = graphId;
        _this.EditGraphDialogVisible = true;
        for (let i = 0; i < _this.KGs.length; i++) {
          if (_this.KGs[i].id === graphId) {
            _this.EditingGraphEntry.id = _this.KGs[i].id;
            _this.EditingGraphEntry.name = _this.KGs[i].name;
            _this.EditingGraphEntry.description = _this.KGs[i].description;
            _this.EditingGraphEntry.imgsrc = _this.KGs[i].imgsrc;
            break;
          }
        }
      }
    },
    openKG(graphId, graphName) {
      if (this.isGraphOpening) {
        this.$message({
          type: 'error',
          message: '有图谱已打开，请先关闭该图谱！'
        })
      } else {
        this.set_selectedKGId(graphId);
        this.set_selectedKGName(graphName);
        this.set_isGraphOpening(true);
        this.set_current("3");
        this.$router.push('/Kojima-Coin/KGEditor');
      }
    }
  }
}
</script>

<style scoped>
.button-group-left {
  position: relative;
  margin-top: 15px;
  float: left;
  background-color: #ffffff;
}

.button-group-right {
  position: relative;
  margin-top: 15px;
  float: right;
  background-color: #ffffff;
}

.list-container {
  padding-top: 60px;
  margin-right: 10%;
  margin-left: 7%;
  width: 85%;
  overflow: hidden;
}

.kg-list {
  width: 95%;

}

.kg-list-item {
  width: 96%;
  min-height: 20%;
  height: auto;
  background: none;
  border: 1px solid #dcdfe6;
  border-radius: 25px;
  margin: 2%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.kg-list-item:hover {
  background: rgba(0, 0, 0, 0.2);
}

.kg-checkbox {
  float: left;
  margin-left: 4%;
}

.kg-meta {
  display: flex;
  flex: 1;
  align-items: flex-start;
  float: left;
  width: 54%;
  margin-left: 4%;
}

.kg-meta-img {
  float: left;
}

.kg-img {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 10px;
  height: 100px;
  width: 75px;
}

.kg-meta-content {
  margin-left: 10px;
  float: left;
}

.kg-name {
  text-align: left;
  margin-top: 5px;
  margin-bottom: 5px;
  color: rgba(0, 0, 0, .65);
  font-size: 22px;
  line-height: 24px;
}

.kg-description {
  text-align: left;
  margin-top: 5px;
  margin-bottom: 5px;
  color: rgba(0, 0, 0, .45);
  font-size: 18px;
  line-height: 24px;
}

.kg-action {
  width: 30%;
  float: left;
  flex: 0 0 auto;
  margin-left: 8%;
  padding: 0;
}

.action-icon {
  font-size: 20px;
}

.withoutColor {
  width: 97%;
  float: left;
}


.div-kg-list {
  position: relative;
  top: 10px;
  overflow-x: auto;
  overflow-y: auto;
  height: 585px;
  width: 100%;
}

.upload {
  display: inline-block;
  padding: 0 12px;
}

::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
</style>