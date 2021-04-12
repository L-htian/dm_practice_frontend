<template>
  <div class="list-container">
    <ul class="kg-list" style="overflow:auto">
      <li v-for="kg in KGs" class="kg-list-item">
        <div class="kg-meta">
          <div class="kg-meta-img">
            <el-image class="kg-img"
                      :src="kg.imgsrc"
                      fit="cover"
                      :preview-src-list="[kg.imgsrc]"
            ></el-image>
          </div>
          <div class="kg-meta-content">
            <h4 class="kg-name">{{ kg.name }}</h4>
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
            <el-button type="text" @click="openKG(kg.id, kg.name)"><i class="action-icon el-icon-view"></i></el-button>
          </el-tooltip>
        </div>
      </li>
    </ul>
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
              maxlength="255"
              show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="图谱描述" :label-width="formLabelWidth">
          <el-input
              v-model="EditingGraphEntry.description"
              type="textarea"
              class="withoutColor"
              maxlength="255"
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
} from "../api/KGList";

export default {
  name: "KGList",
  data() {
    return {
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
  mounted() {
    this.KGs = getAllGraphAPI();
  },
  methods: {
    ...mapMutations([
      'set_selectedKGId',
      'set_selectedKGName',
      'set_isGraphOpening',
      'set_current'
    ]),
    emptyEditingGraphEntry() {
      this.EditingGraphEntry =
          {
            name: '',
            id: 0,
            imgsrc: '',
            description: '',
          }
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
    deleteKG(graphId) {
      let _this = this
      _this.$confirm('该操作不可撤销', '将要删除该图谱，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < _this.KGs.length; i++) {
          if (_this.KGs[i].id === graphId) {
            _this.KGs.splice(i, 1)
            break
          }
        }
        deleteGraphAPI(graphId)
        this.$message({
          type: 'success',
          message: '删除图谱成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        })
      })
    },
    editKG(graphId) {
      let _this = this
      _this.EditingGraphId = graphId
      _this.EditGraphDialogVisible = true
      for (let i = 0; i < _this.KGs.length; i++) {
        if (_this.KGs[i].id === graphId) {
          _this.EditingGraphEntry.id = _this.KGs[i].id;
          _this.EditingGraphEntry.name = _this.KGs[i].name;
          _this.EditingGraphEntry.description = _this.KGs[i].description;
          _this.EditingGraphEntry.imgsrc = _this.KGs[i].imgsrc;
          break;
        }
      }
    },
    openKG(graphId, graphName) {
      this.set_selectedKGId(graphId);
      this.set_selectedKGName(graphName);
      this.set_isGraphOpening(true);
      this.set_current(3);
      this.$router.push('/Kojima-Coin/KGEditor');
    }
  }
}
</script>

<style scoped>
.list-container {
  padding-top: 60px;
  margin-right: 10%;
  margin-left: 10%;
  width: 80%;
}

.kg-list {
  width: 100%;
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

.kg-meta {
  display: flex;
  flex: 1;
  align-items: flex-start;
  float: left;
  width: 54%;
  margin-left: 8%;
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
</style>