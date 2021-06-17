<template>
  <div>
    <!--左上侧边栏 图谱名-->
    <div class="graph_name">
      <el-input class="input_graph_name"
                v-model="graph_name"
                placeholder="请命名"
                v-if="show_input"
                @keyup.enter.native="handleChange"
                style="font-size: 16px;width:82%;float: left;border: 1px;outline: none"
                maxlength="15"
                show-word-limit
      >
      </el-input>
      <el-button icon="el-icon-check" style="float:right;width:17%;border:0;padding-left: 14px"
                 @click="handleChange"></el-button>
    </div>

    <!--左下侧边栏 搜索-->
    <div class="sidebar-left">

      <el-autocomplete
          class="my-autocomplete"
          v-model="searchString"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
          @keyup.enter.native="handleSearch"
          @input="changeStyle('block', '.el-autocomplete-suggestion')"
          @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
      >
        <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            @click="handleSearch"
            style="cursor: pointer"
        >
        </i>
      </el-autocomplete>

      <!--动态添加搜索到的结果-->
      <ul class="showResult"
          style="list-style:none;margin:0;padding-left: 0;padding-top:5px;height: 89%;overflow:auto">
        <li v-for="re in searchResult" class="searchResultItem">
          <div class="showResultItem">
            <span @click="handleChoose(re)" style="cursor:pointer">{{ re.name }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!--右上侧边栏-->
    <div class="sidebar-right">
      <div class="sidebar-item">
        <i class="el-icon-close sidebar-icon"></i>
        <span class="choose sidebar-span" @click="closeGraph">关闭图谱</span>
      </div>
      <div class="sidebar-item">
        <i class="iconfont icon-shujuku sidebar-icon"></i>
        <span class="choose sidebar-span" @click="updateAllClick">同步图谱到数据库</span>
      </div>
      <div class="sidebar-item">
        <i class="iconfont icon-paiban sidebar-icon"></i>
        <span class="sidebar-span">排版模式</span>
        <el-switch
            v-model="isTypesettingModeOn"
            active-color="#a0a5af"
            inactive-color="#dcdfe6"
            style="float: right;margin-right: 3%;padding-top: 3px"
        >
        </el-switch>
      </div>
      <div class="sidebar-item">
        <i class="el-icon-help sidebar-icon"></i>
        <el-popover
            placement="left"
            width="400"
            trigger="click"
        >
          <el-table
              :data="NodePrimitives"
              height="200"
              border
              style="width: 100%"
              :row-class-name="tableNodeRowClassName"
          >
            <el-table-column label="图元名" width="100" property="name"></el-table-column>
            <el-table-column label="节点颜色" width="120" property="color"></el-table-column>
            <el-table-column label="节点边框颜色" width="120" property="strokeColor"></el-table-column>
            <el-table-column label="节点字体颜色" width="120" property="textColor"></el-table-column>
            <el-table-column label="节点字体大小" width="120" property="textSize"></el-table-column>
            <el-table-column label="节点半径" width="80" property="r"></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button @click="deleteNodePrimitive(scope.row.id)" type="text" size="small">删除</el-button>
                <el-button @click="useNodePrimitive(scope.row.id)" type="text" size="small">应用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span class="sidebar-span choose" slot="reference" v-if="this.usingNodePrimitiveId === -1">节点图元</span>
          <span class="sidebar-span choose" slot="reference" v-else style="color: #409eff">节点图元 应用中</span>
        </el-popover>
        <el-tooltip content="取消应用节点图元" placement="top">
          <el-button type="text" @click="cancelUsingNodePrimitive"
                     style="font-size: 16px;float: right;margin-right: 3%;padding: 3px 0 0;"><i
              class="el-icon-circle-close"></i></el-button>
        </el-tooltip>
        <el-tooltip content="新建节点图元" placement="top">
          <el-button type="text" @click="showNodePrimitiveDialog"
                     style="font-size: 16px;float: right;margin-right: 3%;padding: 3px 0 0;"><i
              class="el-icon-circle-plus-outline"></i></el-button>
        </el-tooltip>
      </div>
      <div class="sidebar-item">
        <i class="el-icon-sort sidebar-icon"></i>
        <el-popover
            placement="left"
            width="400"
            trigger="click"
        >
          <el-table
              :data="LinkPrimitives"
              height="200"
              border
              style="width: 100%"
              :row-class-name="tableLinkRowClassName"
          >
            <el-table-column label="连接图元名" width="100" property="name"></el-table-column>
            <el-table-column label="连接颜色" width="120" property="color"></el-table-column>
            <el-table-column label="连接字体颜色" width="120" property="textColor"></el-table-column>
            <el-table-column label="连接字体大小" width="120" property="textSize"></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button @click="deleteLinkPrimitive(scope.row.id)" type="text" size="small">删除</el-button>
                <el-button @click="useLinkPrimitive(scope.row.id)" type="text" size="small">应用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span class="sidebar-span choose" slot="reference" v-if="this.usingLinkPrimitiveId === -1">连接图元</span>
          <span class="sidebar-span choose" slot="reference" v-else style="color: #409eff">连接图元 应用中</span>
        </el-popover>
        <el-tooltip content="取消应用连接图元" placement="top">
          <el-button type="text" @click="cancelUsingLinkPrimitive"
                     style="font-size: 16px;float: right;margin-right: 3%;padding: 3px 0 0;"><i
              class="el-icon-circle-close"></i></el-button>
        </el-tooltip>
        <el-tooltip content="新建连接图元" placement="top">
          <el-button type="text" @click="showLinkPrimitiveDialog"
                     style="font-size: 16px;float: right;margin-right: 3%;padding: 3px 0 0;"><i
              class="el-icon-circle-plus-outline"></i></el-button>
        </el-tooltip>
      </div>
    </div>

    <!--右下侧边栏-->
    <div class="sidebar-right-bottom">
      <div id="pieCount" style="height: 100%;width: 100%"></div>
    </div>

    <!--图谱容器-->
    <div id="grid_container">
      <div id="grid" class="grid"></div>
    </div>

    <!--下方工具栏-->
    <div class="svg-set-box clearfix">
      <!--下方工具栏 左-->
      <div class="ctwh-dibmr leftBox" style="float: left;">
        <div class="tools-left">
          <el-tooltip effect="light"
                      content="添加节点"
                      placement="top"
          >
            <el-button icon="el-icon-plus" circle
                       @click="addOneNode"
            ></el-button>
          </el-tooltip>
        </div>
        <div class="tools-left">
          <el-tooltip effect="light"
                      content="保存为图片"
                      placement="top"
          >
            <el-button icon="el-icon-picture-outline" circle
                       @click="exportImage"
            ></el-button>
          </el-tooltip>
        </div>
        <div class="tools-left">
          <el-tooltip effect="light"
                      content="保存为Json"
                      placement="top"
          >
            <el-button icon="iconfont icon-json" circle
                       @click="exportJson"
            ></el-button>
          </el-tooltip>
        </div>
        <div class="tools-left">
          <el-tooltip effect="light"
                      content="保存为XML"
                      placement="top"
          >
            <el-button icon="iconfont icon-xml" circle
                       @click="exportXML"
            ></el-button>
          </el-tooltip>
        </div>
      </div>
      <!--下方工具栏 中-->
      <div class="ctwh-dibmr cancelBox">
        <el-tooltip v-if="isCancelOperationShow"
                    effect="light"
                    :content="cancelOperationMessage"
                    placement="top"
        >
          <el-button icon="el-icon-close" circle
                     @click="cancelOperation"
                     v-if="isCancelOperationShow"
          ></el-button>
        </el-tooltip>
      </div>
      <!--下方工具栏 右-->
      <div class="ctwh-dibmr rightBox" style="float: right;">
        <div class="tools-right">
          <el-tooltip effect="light"
                      content="放大"
                      placement="top"
          >
            <el-button icon="el-icon-zoom-in" circle
                       @click="zoomIn"
            ></el-button>
          </el-tooltip>
        </div>
        <div class="tools-right">
          <el-tooltip effect="light"
                      content="缩小"
                      placement="top"
          >
            <el-button icon="el-icon-zoom-out" circle
                       @click="zoomOut"
            ></el-button>
          </el-tooltip>
        </div>
        <div class="tools-right">
          <el-tooltip effect="light"
                      content="还原"
                      placement="top"
          >
            <el-button icon="el-icon-refresh-right" circle
                       @click="refresh"
            ></el-button>
          </el-tooltip>
        </div>
        <div class="tools-right">
          <el-tooltip effect="light"
                      content="全屏"
                      placement="top"
                      v-if="!isFullscreen"
          >
            <el-button icon="el-icon-full-screen" circle
                       @click="showFull"
                       v-if="!isFullscreen"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="light"
                      content="退出全屏"
                      placement="top"
                      v-if="isFullscreen"
                      class="tools"
          >
            <el-button icon="el-icon-full-screen" circle
                       @click="exitFullScreen"
                       class="tools"
                       v-if="isFullscreen"
            ></el-button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!--link编辑-->
    <el-dialog title="联系选项" :visible.sync="EditLinkDialogVisible" custom-class="customWidth">
      <el-form>
        <el-divider class="form-divider" content-position="left">持股联系信息</el-divider>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.id" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="源节点id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.sourceId" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="目标节点id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.targetId" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="持股比例" :label-width="formLabelWidth">
          <el-input-number v-model="EditingLinkEntity.holdRatio" :precision="2" :min="0" :max="100"
                           class="withoutColor"></el-input-number>
        </el-form-item>
        <el-divider class="form-divider" content-position="left">持股联系样式</el-divider>
        <el-form-item label="联系线条颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.color" class="lineColor"></el-input>
          <el-color-picker v-model="EditingLinkEntity.color" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="联系名颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.textColor" class="lineColor"></el-input>
          <el-color-picker v-model="EditingLinkEntity.textColor" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="联系名大小" :label-width="formLabelWidth">
          <el-input-number v-model="EditingLinkEntity.textSize" :min="0" class="withoutColor"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelLinkEdit">取消</el-button>
        <el-button type="warning" @click="deleteLink">删除联系</el-button>
        <el-button type="primary" @click="saveLinkEdit">保存修改</el-button>
      </div>
    </el-dialog>
    <!--node编辑-->
    <el-dialog title="节点选项" :visible.sync="EditNodeDialogVisible" custom-class="customWidth">
      <el-form>
        <el-divider class="form-divider" content-position="left">公司节点样式</el-divider>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingNodeEntity.id" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="公司节点名" :label-width="formLabelWidth">
          <el-input v-model="EditingNodeEntity.name" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="公司注册资本" :label-width="formLabelWidth">
          <el-input-number v-model="EditingNodeEntity.regAsset" :min="0" class="withoutColor"></el-input-number>
        </el-form-item>
        <el-form-item label="公司类型标签" :label-width="formLabelWidth">
          <el-tag
              type="info"
              effect="plain"
              :key="tag"
              v-for="tag in EditingNodeEntity.tags"
              closable
              :disable-transitions="false"
              @close="handleTagClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="TagInputVisible"
              v-model="tagInputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleTagInputConfirm"
              @blur="handleTagInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput">添加持股董高监</el-button>
        </el-form-item>
        <el-form-item label="是否国有" :label-width="formLabelWidth">
          <el-switch v-model="EditingNodeEntity.stateOwned"></el-switch>
        </el-form-item>
        <el-divider class="form-divider" content-position="left">节点样式</el-divider>
        <el-form-item label="节点填充颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingNodeEntity.color" class="lineColor"></el-input>
          <el-color-picker v-model="EditingNodeEntity.color" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="节点边框颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingNodeEntity.strokeColor" class="lineColor"></el-input>
          <el-color-picker v-model="EditingNodeEntity.strokeColor" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="节点名颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingNodeEntity.textColor" class="lineColor"></el-input>
          <el-color-picker v-model="EditingNodeEntity.textColor" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="节点名大小" :label-width="formLabelWidth">
          <el-input-number v-model="EditingNodeEntity.textSize" :min="0" class="withoutColor"></el-input-number>
        </el-form-item>
        <el-form-item label="节点半径" :label-width="formLabelWidth">
          <el-input-number v-model="EditingNodeEntity.r" :min="0" class="withoutColor"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNodeEdit">取消</el-button>
        <el-button type="primary" @click="saveNodeEdit">保存修改</el-button>
      </div>
    </el-dialog>

    <!--node图元添加-->
    <el-dialog title="添加节点图元" :visible.sync="AddNodePrimitiveVisible" custom-class="customWidth">
      <el-form>
        <el-form-item label="节点图元名" :label-width="formLabelWidth">
          <el-input v-model="AddNodePrimitiveEntity.name" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="节点填充颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="AddNodePrimitiveEntity.color" class="lineColor"></el-input>
          <el-color-picker v-model="AddNodePrimitiveEntity.color" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="节点边框颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="AddNodePrimitiveEntity.strokeColor" class="lineColor"></el-input>
          <el-color-picker v-model="AddNodePrimitiveEntity.strokeColor" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="节点名颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="AddNodePrimitiveEntity.textColor" class="lineColor"></el-input>
          <el-color-picker v-model="AddNodePrimitiveEntity.textColor" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="节点名大小" :label-width="formLabelWidth">
          <el-input-number v-model="AddNodePrimitiveEntity.textSize" :min="0" class="withoutColor"></el-input-number>
        </el-form-item>
        <el-form-item label="节点半径" :label-width="formLabelWidth">
          <el-input-number v-model="AddNodePrimitiveEntity.r" :min="0" class="withoutColor"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddNodePrimitive">取消</el-button>
        <el-button type="primary" @click="createNodePrimitive">添加</el-button>
      </div>
    </el-dialog>
    <!--link图元添加-->
    <el-dialog title="添加联系图元" :visible.sync="AddLinkPrimitiveVisible" custom-class="customWidth">
      <el-form>
        <el-form-item label="联系图元名" :label-width="formLabelWidth">
          <el-input v-model="AddLinkPrimitiveEntity.name" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="联系线条颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="AddLinkPrimitiveEntity.color" class="lineColor"></el-input>
          <el-color-picker v-model="AddLinkPrimitiveEntity.color" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="联系名颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="AddLinkPrimitiveEntity.textColor" class="lineColor"></el-input>
          <el-color-picker v-model="AddLinkPrimitiveEntity.textColor" class="colorPiker"></el-color-picker>
        </el-form-item>
        <el-form-item label="联系名大小" :label-width="formLabelWidth">
          <el-input-number v-model="AddLinkPrimitiveEntity.textSize" :min="0" class="withoutColor"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddLinkPrimitive">取消</el-button>
        <el-button type="primary" @click="createLinkPrimitive">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog title="风险值展示" :visible.sync="ShowRiskVisible">
      <div class="risk-item">国有股比例： {{ RiskVO.stateOwnedRatio }}</div>
      <div class="risk-item">入度： {{ RiskVO.inDegree }}</div>
      <div class="risk-item">出度： {{ RiskVO.outDegree }}</div>
      <div class="risk-item">注册资本/元：{{ RiskVO.regAsset }}</div>
      <div class="risk-item">风险值： {{ RiskVO.risk }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelShowRisk">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {Loading} from 'element-ui';
import * as d3 from 'd3';
import $ from 'jquery';
import '@/static/iconfont/iconfont.css';
import '@/static/js/saveSvgAsPng.js';
import _ from 'underscore';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {
  createLinkAPI,
  createNodeAPI,
  deleteLinkAPI,
  deleteNodeAPI,
  updateLinkAPI,
  updateNodeAPI,
  updateAPI,
  saveAsJsonAPI,
  saveAsXmlAPI,
  getSearchHistoryAPI,
  searchNodeAPI,
  createGraphAPI,
  changeGraphNameAPI,
  deleteNodePrimitiveAPI,
  deleteLinkPrimitiveAPI,
  createNodePrimitiveAPI,
  createLinkPrimitiveAPI,
  getCountDataAPI,
  getGraphAPI,
  getNodePrimitiveAPI,
  getLinkPrimitiveAPI,
  uploadAPI,
  getGraphByTextAPI, getSingleGraphInfoAPI, getSingleNodeRiskAPI
} from '../api/KG.js';


export default {
  name: "KGBuilder",
  props: {
    pid: String,
    wantNew: Boolean,
    hasUploaded: Boolean,
    fileList: Array,
    graphInfo: Object,
  },
  computed: {
    ...mapGetters([
      'selectedKGId',
      'selectedKGName',
      'uploadedFile',
      'isGraphOpening',
      'getGraphNew',
      'getUploaded',
      'getTextUpload',
      'uploadedTextFile',
      'fusedGraph',
      'getFused'
    ])
  },
  data() {
    return {
      // 静态量
      formLabelWidth: "120px",
      show_input: true,
      // 默认图元
      DefaultNodePrimitive: {
        color: 'rgb(94,95,95)',
        strokeColor: '#d5dede',
        textColor: '#33434b',
        textSize: 14,
        r: 30,
      },
      DefaultLinkPrimitive: {
        color: 'rgba(132,137,132,0.45)',
        textColor: '#33434b',
        textSize: 14,
      },
      // 默认颜色
      DefaultActiveNodeColor: '#c5d065',
      DefaultButtonGroupColor: '#d1d6d7',
      DefaultButtonGroupStrokeColor: '#fff',
      DefaultButtonGroupTextColor: '#0c0c0c',
      DefaultButtonGroupActiveColor: '#627f73',
      DefaultNodeStrokeColor: '#d5dede',
      DefaultNodeTextColor: '#33434b',
      DefaultNodeColor: 'rgb(94,95,95)',
      DefaultLinkColor: 'rgba(132,137,132,0.45)',
      DefaultLinkActiveColor: '#878585',
      DefaultLinkTextColor: '#33434b',
      DefaultArrowColor: 'rgba(158,152,152,0.98)',
      // 默认字体大小
      DefaultNodeTextSize: 14,
      DefaultLinkTextSize: 14,
      // 默认节点半径
      defaultR: 30,
      // 组件的宽
      width: 1503.2,
      // 组件的高
      height: 800,

      // 动态量
      charts: {},
      tags: [],
      countData: [],

      searchResult: [],
      searchString: '',

      graph_name: '未命名',
      // 图元
      AddNodePrimitiveVisible: false,
      AddLinkPrimitiveVisible: false,
      AddNodePrimitiveEntity: {
        id: 0,
        name: '节点图元',
        color: 'rgb(94,95,95)',
        strokeColor: '#d5dede',
        textColor: '#33434b',
        textSize: 14,
        r: 30,
      },
      AddLinkPrimitiveEntity: {
        id: 0,
        name: '连接图元',
        color: 'rgba(132,137,132,0.45)',
        textColor: '#33434b',
        textSize: 14,
      },
      NodePrimitives: [],
      LinkPrimitives: [],
      // 正在使用的图元id
      usingNodePrimitiveId: -1,
      usingLinkPrimitiveId: -1,
      // 排版模式
      isTypesettingModeOn: false,
      nextNodeId: 0,
      nextLinkId: 0,
      cancelOperationMessage: '',
      isCancelOperationShow: false,
      EditingLinkEntity: {
        id: 0,
        sourceId: '',
        targetId: '',
        name: '',
        holdRatio: 0,
        color: '',
        textColor: '',
        textSize: 0,
      },
      EditingNodeEntity: {
        id: 0,
        name: '',
        regAsset: 0,
        stateOwned: false,
        tags: [],
        r: 0,
        color: '',
        strokeColor: '',
        textColor: '',
        textSize: 0
      },
      EditLinkDialogVisible: false,
      EditNodeDialogVisible: false,
      TagInputVisible: false,
      tagInputValue: '',
      isAddingNode: false,
      isAddingLink: false,
      isEditingNode: false,
      isEditingLink: false,
      txx: 0,
      tyy: 0,

      ShowRiskVisible: false,
      RiskVO: {
        stateOwnedRatio: 0,
        regAsset: 0,
        inDegree: 0,
        outDegree: 0,
        risk: 0
      },
      RiskFormula: '',

      // 图容器
      graphContainer: {},
      // 矢量图
      svg: {},
      // 缩放设置
      zoom: null,
      // 箭头
      arrowMarker: {},
      // d3力导布局设置
      simulation: {},
      // 网格线
      linearX: {},
      linearY: {},
      xAxis: {},
      yAxis: {},
      gX: {},
      gY: {},
      // 是否全屏
      isFullscreen: false,
      // svg图形对象
      qaGraphNode: {},
      qaButtonGroup: {},
      qaGraphNodeText: {},
      qaGraphLink: {},
      qaGraphLinkText: {},
      // 节点和连接
      graph: {
        nodes: [],
        links: [],
      },
      // 所有节点的名字
      NodeNameMap: new Map(),
      // 节点工具栏的内容
      toolbarData: [
        {name: '编辑', value: 1, code: 'edit'},
        {name: '连线', value: 1, code: 'link'},
        {name: '删除', value: 1, code: 'delete'},
        {name: '风险', value: 1, code: 'risk'},
      ],
      NodeButtonAction: '',
      // 正在选择的节点id
      SelectedNodeId: '',
      // 正在选择的源节点id，联系用
      SelectedSourceNodeId: '',
      // 正在选择的目标节点id，联系用
      SelectedTargetNodeId: '',
      // 正在选择的联系id
      SelectedLinkId: ''
    }
  },
  components: {},
  mounted() {
    this.drawPieChart();
    this.getEchartsData();
    this.initGraphContainer();
    this.initJQueryEvents();
    let np = getNodePrimitiveAPI();
    let lp = getLinkPrimitiveAPI();
    this.NodePrimitives = np === undefined ? [] : np;
    this.LinkPrimitives = lp === undefined ? [] : lp;
    this.initGraph();
  },
  created() {
  },
  beforeCreate() {
  },
  beforeDestroy() {
  },
  watch: {
    isTypesettingModeOn: function (val) {
      // 排版模式启动
      let loadingInstance = Loading.service({fullscreen: true});
      if (val) {
        for (let i = 0; i < this.graph.nodes.length; i++) {
          let node = d3.select('#node' + this.graph.nodes[i].id);
          let endX = Number(node.attr('cx'));
          let endY = Number(node.attr('cy'));
          this.graph.nodes[i].force_x = endX;
          this.graph.nodes[i].force_y = endY;
          this.graph.nodes[i].fx = this.graph.nodes[i].type_setting_x;
          this.graph.nodes[i].fy = this.graph.nodes[i].type_setting_y;
          this.graph.nodes[i].x = this.graph.nodes[i].type_setting_x;
          this.graph.nodes[i].y = this.graph.nodes[i].type_setting_y;
          node
              .attr('cx', this.graph.nodes[i].type_setting_x)
              .attr('cy', this.graph.nodes[i].type_setting_y);
          d3.select('#nodetext' + this.graph.nodes[i].id)
              .attr('x', this.graph.nodes[i].type_setting_x)
              .attr('y', this.graph.nodes[i].type_setting_y);
          d3.select('#nodebtg' + this.graph.nodes[i].id)
              .attr('cx', this.graph.nodes[i].type_setting_x)
              .attr('cy', this.graph.nodes[i].type_setting_y);
        }
        // 固定节点
        d3.selectAll('.axis--x').classed('notshow', false);
        d3.selectAll('.axis--y').classed('notshow', false);
      }
      // 排版模式关闭
      else {
        for (let i = 0; i < this.graph.nodes.length; i++) {
          let node = d3.select('#node' + this.graph.nodes[i].id);
          let endX = Number(node.attr('cx'));
          let endY = Number(node.attr('cy'));
          this.graph.nodes[i].fx = null;
          this.graph.nodes[i].fy = null;
          this.graph.nodes[i].type_setting_x = endX;
          this.graph.nodes[i].type_setting_y = endY;
          this.graph.nodes[i].x = this.graph.nodes[i].force_x;
          this.graph.nodes[i].y = this.graph.nodes[i].force_y;
          node
              .attr('cx', this.graph.nodes[i].force_x)
              .attr('cy', this.graph.nodes[i].force_y);
          d3.select('#nodetext' + this.graph.nodes[i].id)
              .attr('x', this.graph.nodes[i].force_x)
              .attr('y', this.graph.nodes[i].force_y);
          d3.select('#nodebtg' + this.graph.nodes[i].id)
              .attr('cx', this.graph.nodes[i].force_x)
              .attr('cy', this.graph.nodes[i].force_y);
        }
        d3.selectAll('.axis--x').classed('notshow', true);
        d3.selectAll('.axis--y').classed('notshow', true);
      }
      this.simulation.restart();
      loadingInstance.close();
    }
  },
  methods: {
    ...mapMutations([
      'set_selectedKGId',
      'set_selectedKGName',
      'set_isGraphOpening'
    ]),
    // 初始化知识图谱
    initGraph() {
      let _this = this;
      if (_this.isGraphOpening) {
        _this.graph_name = _this.selectedKGName;
        let updateVO = getGraphAPI(_this.selectedKGId);
        _this.graph.nodes = updateVO === undefined ? [] : updateVO.nodes;
        _this.graph.links = updateVO === undefined ? [] : updateVO.links;
        for (let i = 0; i < updateVO.nodes.length; i++) {
          _this.NodeNameMap.set(updateVO.nodes[i].name, i);
        }
        _this.getEchartsData()
        _this.updateGraph();
      } else if (_this.getFused) {
        _this.graph.nodes = _this.fusedGraph === undefined ? [] : _this.fusedGraph.nodes;
        _this.graph.links = _this.fusedGraph === undefined ? [] : _this.fusedGraph.links;
        for (let i = 0; i < _this.graph.nodes.length; i++) {
          _this.NodeNameMap.set(_this.graph.nodes[i].name, i);
        }
        _this.set_isGraphOpening(true);
        _this.set_selectedKGId(_this.fusedGraph.graphId);
        _this.graph_name = getSingleGraphInfoAPI(_this.selectedKGId).name;
        _this.getEchartsData()
        _this.set_selectedKGName(_this.graph_name);
        _this.updateGraph();
      } else if (_this.getUploaded && !_this.getGraphNew && !_this.getTextUpload) {
        let file = _this.uploadedFile[0];
        let reader = new FileReader();
        let document = "";
        reader.readAsText(file.raw);
        reader.onload = (e) => {
          try {
            document = JSON.parse(e.target.result);
            let uploadData = uploadAPI(document);
            console.log(uploadData);
            _this.set_selectedKGId(uploadData.graphId);
            _this.set_isGraphOpening(true);
            _this.graph.nodes = uploadData.nodes;
            _this.graph.links = uploadData.links;
            for (let i = 0; i < _this.graph.nodes.length; i++) {
              _this.NodeNameMap.set(_this.graph.nodes[i].name, i);
            }
            _this.graph_name = getSingleGraphInfoAPI(_this.selectedKGId).name;
            _this.set_selectedKGName(_this.graph_name);
            _this.getEchartsData()
            _this.updateGraph();
          } catch (err) {
            this.$message.error('Load JSON document from file error: ' + err.message);
          }
        }
      } else if (_this.getTextUpload && !_this.getGraphNew) {
        let file = _this.uploadedTextFile[0];
        let reader = new FileReader();
        let document = "";
        reader.readAsText(file.raw);
        reader.onload = (e) => {
          try {
            document = e.target.result;
            let uploadData = getGraphByTextAPI(document);
            console.log(uploadData);
            _this.set_selectedKGId(uploadData.graphId);
            _this.set_isGraphOpening(true);
            _this.graph.nodes = uploadData.nodes;
            _this.graph.links = uploadData.links;
            for (let i = 0; i < _this.graph.nodes.length; i++) {
              _this.NodeNameMap.set(_this.graph.nodes[i].name, i);
            }
            _this.updateGraph();
          } catch (err) {
            this.$message.error('Load TXT document from file error: ' + err.message);
          }
        }
      } else if (_this.getGraphNew) {
        _this.set_isGraphOpening(true);
        _this.graph_name = getSingleGraphInfoAPI(_this.selectedKGId).name;
        _this.set_selectedKGName(_this.graph_name);
        _this.updateGraph();
      }
    },
    initJQueryEvents() {
      let _this = this
      $(function () {
        $(".grid").bind("click", function (event) {
          let cursor = document.getElementById("grid").style.cursor;
          if (cursor === 'crosshair' && _this.isAddingNode) {
            d3.select('.grid').style("cursor", "");
            _this.txx = event.offsetX;
            _this.tyy = event.offsetY;
            _this.createNode();
          }
          event.preventDefault();
        });
      })
    },
    // 初始化图容器
    initGraphContainer() {
      this.graphContainer = d3.select('#grid')
      if (this.isFullscreen) {
        this.width = window.screen.width
        this.height = window.screen.height
      } else {
        this.width = $('#grid').width();
        this.height = $('#grid').height();
      }
      this.svg = this.graphContainer.append('svg')
      let svgWidth = this.width
      let svgHeight = this.height
      this.svg.attr('width', svgWidth)
      this.svg.attr('height', svgHeight)
      this.svg.attr('id', 'svg_index')
      this.svg.attr('preserveAspectRatio', 'xMidYMidmeet')
      // d3力导布局模拟设置初始化
      this.simulation = d3
          .forceSimulation()
          .force('charge', d3.forceManyBody().strength(-100)) // 节点之间的电荷力，正值为引力负值为斥力
          .force('link', d3.forceLink().distance(function (d) {
            return 250
          }).id(function (d) {
            return d.id
          })) // 节点之间的弹力，通过link牵引
          .force('collide', d3.forceCollide().radius(30).strength(1)) // 节点碰撞力，防止节点重叠
          .force('center', d3.forceCenter(this.width / 2, this.height / 2)) // 向心力，节点围绕在某一点旁
      // 网格图初始化
      this.linearX = d3.scaleLinear()
          .domain([-1, this.width + 1])
          .range([-1, this.width + 1]);
      this.linearY = d3.scaleLinear()
          .domain([-1, this.height + 1])
          .range([-1, this.height + 1]);
      this.xAxis = d3.axisBottom(this.linearX)
          .ticks((this.width + 2) / (this.height + 2) * 10)
          .tickSize(this.height)
          .tickPadding(8 - this.height);
      this.yAxis = d3.axisRight(this.linearY)
          .ticks(10)
          .tickSize(this.width)
          .tickPadding(8 - this.width);
      this.gX = this.svg.append("g")
          .attr("class", "axis--x notshow")
          .call(this.xAxis);
      this.gY = this.svg.append("g")
          .attr("class", "axis--y notshow")
          .call(this.yAxis);
      // 元素g是用来组合对象的容器。添加到g元素上的变换会应用到其所有的子元素上。
      // 添加到g元素的属性会被其所有的子元素继承。
      // 此外，g元素也可以用来定义复杂的对象，之后可以通过<use>元素来引用它们。
      this.qaGraphLink = this.svg.append('g').attr('class', 'line')
      this.qaGraphLinkText = this.svg.append('g').attr('class', 'linetext')
      this.qaGraphNode = this.svg.append('g').attr('class', 'node')
      this.qaGraphNodeText = this.svg.append('g').attr('class', 'nodetext')
      this.nodebuttonGroup = this.svg.append('g').attr('class', 'nodebutton')
      this.addArrowMaker()
      // .buttongroup
      this.svg.on('click', function () {
        d3.selectAll('use').classed('notshow', true);
      }, false)
    },
    // 制作箭头
    addArrowMaker() {
      let arrowMarker = this.svg
          .append('marker')
          .attr('id', 'arrow')
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', '12')
          .attr('markerHeight', '12')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', '22')
          .attr('refY', '0')
          .attr('orient', 'auto')
      let arrowPath = 'M0,-5L10,0L0,5' // 定义箭头形状
      arrowMarker.append('path').attr('d', arrowPath).attr('fill', this.DefaultArrowColor)
    },
    // 更新知识图谱
    updateGraph() {
      let _this = this;
      let data = _this.formatData();
      let nodes = data.nodes;
      let links = data.links;

      // 如果节点之间有多条连接
      if (links.length > 0) {
        _.each(links, function (link) {
          let same = _.where(links, {
            'source': link.source,
            'target': link.target
          });
          let sameAlt = _.where(links, {
            'source': link.target,
            'target': link.source
          });
          let sameAll = same.concat(sameAlt);
          _.each(sameAll, function (s, i) {
            s.sameIndex = (i + 1);
            s.sameTotal = sameAll.length;
            s.sameTotalHalf = (s.sameTotal / 2);
            s.sameUneven = ((s.sameTotal % 2) !== 0);
            s.sameMiddleLink = ((s.sameUneven === true) && (Math.ceil(s.sameTotalHalf) === s.sameIndex));
            s.sameLowerHalf = (s.sameIndex <= s.sameTotalHalf);
            if (s.sameLowerHalf) {
              if (same.indexOf(s) !== -1) {
                s.sameArcDirection = 1;
              } else {
                s.sameArcDirection = 0;
              }
            } else {
              if (same.indexOf(s) !== -1) {
                s.sameArcDirection = 0;
              } else {
                s.sameArcDirection = 1;
              }
            }
            s.sameIndexCorrected = s.sameLowerHalf ? s.sameIndex : (s.sameIndex - Math.ceil(s.sameTotalHalf));
          });
        });
        let maxSame = _.chain(links)
            .sortBy(function (x) {
              return x.sameTotal;
            })
            .last()
            .value().sameTotal;

        _.each(links, function (link) {
          link.maxSameHalf = Math.round(maxSame / 2);
        });
      }

      // 定义按钮组引用的use元素
      _this.drawToolButton();
      // 更新连线
      let graphLink = _this.drawLink(links);
      // 更新连线文字
      let graphLinkText = _this.drawLinkText(links);
      // 更新节点
      let graphNode = _this.drawNode(nodes);
      // 更新节点文字
      let graphNodeText = _this.drawNodeText(nodes);
      // 更新按钮组
      let graphNodeButtonGroup = _this.drawButtonGroup(nodes);

      // tick 每到一个时刻都需要调用方法来更新节点的坐标
      _this.simulation.nodes(nodes).on('tick', ticked);
      _this.simulation.force('link').links(links);
      _this.simulation.alpha(1).alphaTarget(0).alphaDecay(0.05).restart();

      // 生成连线
      function linkArc(d) {
        if (d.target.x === d.source.x && d.target.y === d.source.y) {
          let drx = (d.sameIndexCorrected + 1) * 10,
              dry = (d.sameIndexCorrected + 2) * 10,
              xRotation = -45,
              largeArc = 1,
              sweep = 1;
          return "M" + d.source.x + "," + d.source.y + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + (d.target.x + 1) + "," + (d.target.y + 1);
        } else {
          let dx = (d.target.x - d.source.x),
              dy = (d.target.y - d.source.y),
              dr = Math.sqrt(dx * dx + dy * dy),
              unevenCorrection = (d.sameUneven ? 0 : 0.5);
          let arc;
          if (d.sameMiddleLink) {
            arc = 0;
          } else {
            let curvature = 2
            arc = (1.0 / curvature) * ((dr * d.maxSameHalf) / (d.sameIndexCorrected - unevenCorrection));
          }
          return "M" + d.source.x + "," + d.source.y + "A" + arc + "," + arc + " 0 0," + d.sameArcDirection + " " + d.target.x + "," + d.target.y;
        }
      }

      function ticked() {
        graphLink.attr('d', linkArc)
        // 更新节点坐标
        graphNode
            .attr('cx', function (d) {
              if (_this.isTypesettingModeOn) {
                return d.x;
              } else return d.x;
            })
            .attr('cy', function (d) {
              if (_this.isTypesettingModeOn) return d.y;
              else return d.y;
            })
        // 更新节点操作按钮组坐标
        graphNodeButtonGroup
            .attr('cx', function (d) {
              if (_this.isTypesettingModeOn) return d.x;
              else return d.x;
            })
            .attr('cy', function (d) {
              if (_this.isTypesettingModeOn) return d.y;
              else return d.y;
            })
            .attr('transform', function (d) {
              if (_this.isTypesettingModeOn) return 'translate(' + d.x + ',' + d.y + ') scale(1)';
              else return 'translate(' + d.x + ',' + d.y + ') scale(1)';
            })
        // 更新文字坐标
        graphNodeText
            .attr('x', function (d) {
              if (_this.isTypesettingModeOn) return d.x;
              else return d.x;
            })
            .attr('y', function (d) {
              if (_this.isTypesettingModeOn) return d.y;
              else return d.y;
            })
      }

      // 鼠标滚轮缩放
      // 最小缩放到0.1，最大扩大到4倍
      _this.zoom = d3.zoom().scaleExtent([0.1, 4]).on('zoom', _this.zoomed)
      _this.svg.call(_this.zoom)
      _this.svg.on('dblclick.zoom', null)

      // 为按钮组绑定事件
      _this.svg.selectAll(".buttongroup").on('click', function (d, i) {
        if (_this.NodeButtonAction) {
          switch (_this.NodeButtonAction) {
            case "EDIT":
              _this.isEditingNode = true;
              _this.txx = d.x;
              _this.tyy = d.y;
              _this.SelectedNodeId = d.id;
              for (let j = 0; j < _this.graph.nodes.length; j++) {
                if (_this.graph.nodes[j].id === _this.SelectedNodeId) {
                  _this.EditingNodeEntity.id = _this.SelectedNodeId;
                  _this.EditingNodeEntity.name = _this.graph.nodes[j].name;
                  _this.EditingNodeEntity.regAsset = _this.graph.nodes[j].regAsset;
                  _this.EditingNodeEntity.stateOwned = _this.graph.nodes[j].stateOwned;
                  _this.EditingNodeEntity.color = _this.graph.nodes[j].color;
                  _this.EditingNodeEntity.textColor = _this.graph.nodes[j].textColor;
                  _this.EditingNodeEntity.strokeColor = _this.graph.nodes[j].strokeColor;
                  _this.EditingNodeEntity.textSize = _this.graph.nodes[j].textSize;
                  _this.EditingNodeEntity.r = _this.graph.nodes[j].r;
                  _this.EditingNodeEntity.tags = _this.graph.nodes[j].tags;
                  _this.isEditingNode = true;
                  _this.EditNodeDialogVisible = true;
                  break;
                }
              }
              break;
            case "LINK":
              _this.isAddingLink = true;
              _this.isCancelOperationShow = true;
              _this.cancelOperationMessage = '取消添加连线';
              d3.select('.grid').style("cursor", "pointer");
              _this.SelectedSourceNodeId = d.id;
              break;
            case "DELETE":
              _this.SelectedNodeId = d.id;
              let out_buttongroup_id = '.out_buttongroup_' + i;
              _this.deleteNode(out_buttongroup_id);
              break;
            case "RISK":
              let RiskData = getSingleNodeRiskAPI(d.id);
              console.log(RiskData);
              if (RiskData.success) {
                _this.SelectedNodeId = d.id;
                _this.RiskVO = $.extend({}, RiskData.content);
                _this.ShowRiskVisible = true;
              } else {
                _this.$message({
                  type: 'error',
                  message: RiskData.content
                })
              }
              break;
          }
        }
      })

      // 按钮事件绑定
      _this.svg.selectAll(".action_edit").on("click", function (d) {
        _this.NodeButtonAction = 'EDIT';
      });
      _this.svg.selectAll(".action_link").on("click", function (d) {
        _this.NodeButtonAction = 'LINK';
      });
      _this.svg.selectAll(".action_delete").on("click", function (d) {
        _this.NodeButtonAction = 'DELETE';
      });
      _this.svg.selectAll(".action_risk").on("click", function (d) {
        _this.NodeButtonAction = 'RISK';
      });

      _this.svg.selectAll(".action_edit").on("mouseenter", function (d) {
        _this.svg.selectAll(".action_edit_path").style('fill', _this.DefaultButtonGroupActiveColor)
      });
      _this.svg.selectAll(".action_link").on("mouseenter", function (d) {
        _this.svg.selectAll(".action_link_path").style('fill', _this.DefaultButtonGroupActiveColor)
      });
      _this.svg.selectAll(".action_delete").on("mouseenter", function (d) {
        _this.svg.selectAll(".action_delete_path").style('fill', _this.DefaultButtonGroupActiveColor)
      });
      _this.svg.selectAll(".action_risk").on("mouseenter", function (d) {
        _this.svg.selectAll(".action_risk_path").style('fill', _this.DefaultButtonGroupActiveColor)
      });

      _this.svg.selectAll(".action_edit").on("mouseleave", function (d) {
        _this.svg.selectAll(".action_edit_path").style('fill', _this.DefaultButtonGroupColor)
      });
      _this.svg.selectAll(".action_link").on("mouseleave", function (d) {
        _this.svg.selectAll(".action_link_path").style('fill', _this.DefaultButtonGroupColor)
      });
      _this.svg.selectAll(".action_delete").on("mouseleave", function (d) {
        _this.svg.selectAll(".action_delete_path").style('fill', _this.DefaultButtonGroupColor)
      });
      _this.svg.selectAll(".action_risk").on("mouseleave", function (d) {
        _this.svg.selectAll(".action_risk_path").style('fill', _this.DefaultButtonGroupColor)
      });
    },
    // 建立实体，实体，关系三元组
    // 返回所有节点信息和所有三元组
    formatData() {
      let _this = this
      let links = _this.graph.links
      let nodes = _this.graph.nodes
      nodes.forEach(function (node) {
        if (typeof (node.id) === 'string') node.id = parseInt(node.id);
        if (typeof (node.type_setting_x) === 'undefined' || node.type_setting_x === '') node.type_setting_x = 0;
        if (typeof (node.type_setting_y) === 'undefined' || node.type_setting_y === '') node.type_setting_y = 0;
        if (typeof (node.force_x) === 'undefined' || node.force_x === '') node.force_x = 0;
        if (typeof (node.force_y) === 'undefined' || node.force_y === '') node.force_y = 0;
        if (typeof (node.type_setting_x) === 'string') node.type_setting_x = parseFloat(node.type_setting_x);
        if (typeof (node.type_setting_y) === 'string') node.type_setting_y = parseFloat(node.type_setting_y);
        if (typeof (node.force_x) === 'string') node.force_x = parseFloat(node.force_x);
        if (typeof (node.force_y) === 'string') node.force_y = parseFloat(node.force_y);
        if (_this.isTypesettingModeOn) {
          node.x = node.type_setting_x;
          node.y = node.type_setting_y;
          node.fx = node.type_setting_x;
          node.fy = node.type_setting_y;
        } else {
          node.x = node.force_x;
          node.y = node.force_y;
          node.fx = null;
          node.fy = null;
        }
        if (typeof (node.color) === 'undefined' || node.color === '') node.color = _this.DefaultNodeColor;
        if (typeof (node.textColor) === 'undefined' || node.textColor === '') node.textColor = _this.DefaultNodeTextColor;
        if (typeof (node.strokeColor) === 'undefined' || node.strokeColor === '') node.strokeColor = _this.DefaultNodeStrokeColor;
        if (typeof (node.textSize) === 'undefined' || node.textSize === '') node.textSize = _this.DefaultNodeTextSize;
        if (typeof (node.r) === 'undefined' || node.r === '') node.r = _this.defaultR;
        if (typeof (node.tags) === 'undefined') node.tags = [];
        if (typeof (node.regAsset) === 'undefined') node.regAsset = 0;
        if (typeof (node.stateOwned) === 'undefined') node.stateOwned = false;
      })
      let resLinks = [];
      links.forEach(function (link) {
        if (typeof (link.id) === 'string') node.id = parseInt(link.id);
        let sourceNode = nodes.filter(function (node) {
          return node.id === link.sourceId;
        })[0];
        if (!sourceNode) return;
        let targetNode = nodes.filter(function (node) {
          return node.id === link.targetId;
        })[0];
        if (!targetNode) return;
        if (typeof (link.color) === 'undefined' || link.color === '') link.color = _this.DefaultLinkColor;
        if (typeof (link.textColor) === 'undefined' || link.textColor === '') link.textColor = _this.DefaultLinkTextColor;
        if (typeof (link.textSize) === 'undefined' || link.textSize === '') link.textSize = _this.DefaultLinkTextSize;
        if (typeof (link.holdRatio) === 'undefined') link.holdRatio = 0;
        resLinks.push({source: sourceNode.id, target: targetNode.id, lk: link});
      })
      let data = {}
      data.nodes = nodes
      data.links = resLinks
      return data
    },
    // 制作节点工具栏
    drawToolButton() {
      let _this = this
      let nodes = _this.graph.nodes
      //先删除所有为节点自定义的按钮组
      d3.selectAll('svg >defs').remove()
      // 制作饼型工具栏，这里的pie是一个函数
      let pie = d3.pie().value(function (d) {
        return d.value // value是每个按钮占的比例
      })
      let piedata = pie(_this.toolbarData)
      // 添加defs标签，defs标签是用来引用的图形元，不会真正渲染
      let nodeButtonGroup = _this.svg.append('defs')
      // 节点半径数组
      let nodeRList = []
      nodes.forEach(function (node) {
        if (!node.r) {
          node.r = _this.defaultR
        }
        // 按半径分别定义每种按钮组的图标
        if (nodeRList.indexOf(node.r) === -1) {
          nodeRList.push(node.r)
          let nodebtg = nodeButtonGroup.append('g').attr("id", "out_circle_" + node.r)

          let buttonGroupEnter = nodebtg
              .selectAll('.buttongroup')
              .data(piedata)
              .enter()
              // 这里传入的参数实际上是它本身，下同
              .append('g')
              .attr('class', function (d) {
                return 'action_' + d.data.code
              })
              .attr('cursor', 'pointer')

          // 绘制同心圆
          let arc = d3.arc().innerRadius(node.r).outerRadius(node.r + 30)

          // 设置工具栏形状
          buttonGroupEnter
              .append('path')
              .attr('class', function (d) {
                return 'action_' + d.data.code + '_path'
              })
              // d属性代表路径，通过描述路径绘制出svg图像
              .attr('d', function (d) {
                return arc(d)
              })
              .attr('fill', _this.DefaultButtonGroupColor) // 填充
              .style('opacity', 0.6)
              .attr('stroke', _this.DefaultButtonGroupStrokeColor) // 轮廓
              .attr('stroke-width', 2)

          // 设置工具栏文字
          buttonGroupEnter
              .append('text')
              // transform 代表变换
              .attr('transform', function (d) {
                return 'translate(' + arc.centroid(d) + ')'
              })
              .attr('text-anchor', 'middle')
              .text(function (d) {
                return d.data.name
              }).style('fill', function () {
            return _this.DefaultButtonGroupTextColor
          })
              .attr('font-size', 10)
        }
      })
    },
    // 绘制节点
    drawNode(nodes) {
      let _this = this
      let node = _this.qaGraphNode.selectAll('circle').data(nodes, function (d) {
        return d.id
      })
      // 关于d3 data() enter() exit()的解释，见https://www.cnblogs.com/jarvisniu/p/4734605.html
      node.exit().remove()
      let nodeEnter = node.enter().append('circle')
      // 绑定单击事件
      nodeEnter.on('click', function (d) {
        let out_buttongroup_id = '.out_buttongroup_' + d.id
        // 单击节点，改变节点工具栏显示状态
        _this.svg.selectAll('use').classed('notshow', true)
        // classed 是为对象增加class属性而不覆盖原有class属性
        _this.svg.selectAll(out_buttongroup_id).classed('notshow', false)
        // 如果正在添加联系
        if (_this.isAddingLink) {
          _this.SelectedTargetNodeId = d.id
          // 支不支持自联接再议
          // if (_this.SelectedSourceNodeId === _this.SelectedTargetNodeId) {
          //   d3.select('.grid').style("cursor", "")
          //   _this.isAddingLink = false
          //   _this.isCancelOperationShow = false
          //   _this.cancelOperationMessage = ''
          //   _this.$message({
          //     type: 'error',
          //     message: '连接出错：不支持节点自身连接自身！'
          //   })
          //   event.stopPropagation()
          //   return
          // }
          d3.select('.grid').style("cursor", "");
          _this.isAddingLink = false
          _this.isCancelOperationShow = false
          _this.cancelOperationMessage = ''
          _this.createLink()
        }
        // 阻止事件冒泡到父元素
        event.stopPropagation()
      })
      nodeEnter.on('dblclick', function (d) {
        event.stopPropagation()
      })
      // 绑定鼠标移入事件
      nodeEnter.on('mouseenter', function (d) {
        // 改变边缘宽度
        d3.select(this).style('stroke-width', '6')
        event.stopPropagation()
      })
      // 绑定鼠标移出事件
      nodeEnter.on('mouseleave', function (d) {
        d3.select(this).style('stroke-width', '2')
        // 其他节点显示
        d3.select('.node').style('fill-opacity', 1)
        d3.select('.nodetext').style('fill-opacity', 1)
        d3.selectAll('.line').style('stroke-opacity', 1)
        d3.selectAll('.linetext').style('fill-opacity', 1)
      })
      // 绑定鼠标悬停事件
      nodeEnter.on('mouseover', function (d) {
        // 隐藏所有节点
        d3.selectAll('.node').style('fill-opacity', 0.1)
        // 寻找相关节点
        let relatedNodeIds = []
        relatedNodeIds.push(d.id)
        let relatedNodes = _this.graph.links.filter(function (n) {
          return n.sourceId === d.id || n.targetId === d.id
        })
        relatedNodes.forEach(function (i) {
          relatedNodeIds.push(i.sourceId)
          relatedNodeIds.push(i.targetId)
        })
        // 显示相关节点
        _this.qaGraphNode
            .selectAll('circle')
            .style('fill-opacity', function (node) {
              if (relatedNodeIds.indexOf(node.id) > -1) {
                return 1.0
              }
            })
        // 隐藏所有节点文字
        d3.selectAll('.nodetext').style('fill-opacity', 0.1)
        // 显示相关节点文字
        _this.qaGraphNodeText
            .selectAll('text')
            .style('fill-opacity', function (node) {
              if (relatedNodeIds.indexOf(node.id) > -1) {
                return 1.0
              }
            })
        // 隐藏所有连线
        d3.selectAll('.line').style('stroke-opacity', 0.1)
        // 显示相关连线
        _this.qaGraphLink
            .selectAll('path')
            .style('stroke-opacity', function (link) {
              if (link.lk.targetId === d.id || link.lk.sourceId === d.id) {
                return 1.0
              }
            })
        // 隐藏所有连线文字
        d3.selectAll('.linetext').style('fill-opacity', 0.1)
        // 显示相关连线文字
        _this.qaGraphLinkText
            .selectAll('textPath')
            .style('fill-opacity', function (link) {
              if (link.lk.targetId === d.id || link.lk.sourceId === d.id) {
                return 1.0
              }
            })
      })
      // 绑定拖动事件
      nodeEnter.call(
          d3.drag()
              .on('start', _this.dragStart)
              .on('drag', _this.dragging)
              .on('end', _this.dragEnd)
      )
      // 使用merge函数对node的数据进行更新
      // 这里更新的是title
      node = nodeEnter.merge(node).text(function (d) {
        return d.name
      })
      // 设置节点样式
      node.style('stroke', function (d) {
        if (d.strokeColor) return d.strokeColor
        else return _this.DefaultNodeStrokeColor
      })
      node.style('stroke-opacity', 0.6)
      node.attr('r', function (d) {
        if (d.r) return d.r
        else return _this.defaultR
      })
          .attr('class', 'single-node')
          .attr('id', function (d) {
            return 'node' + d.id
          })
      node.attr('fill', function (d, i) {
        if (d.color) return d.color
        else return _this.DefaultNodeColor
      })
      // 为节点设置title属性
      node.append('title').text(function (d) {
        if (d.name) return d.name
        else return '节点'
      })
      return node
    },
    // 绘制节点上的文字
    drawNodeText(nodes) {
      let _this = this
      let nodeText = _this.qaGraphNodeText.selectAll('text')
          .data(nodes, function (d) {
            return d.id
          })
      nodeText.exit().remove()
      let nodeTextEnter = nodeText.enter().append('text')
      nodeTextEnter.call(
          d3.drag()
              .on('start', _this.dragStart)
              .on('drag', _this.dragging)
              .on('end', _this.dragEnd)
      )
      nodeText = nodeTextEnter.merge(nodeText).text(function (d) {
        return d.name
      })
      // 设置节点文字样式
      nodeText
          .attr('class', 'single-nodetext')
          .attr('id', function (d) {
            return 'nodetext' + d.id;
          })
          .style('fill', function (d) {
            if (d.textColor) return d.textColor
            else return _this.DefaultNodeTextColor
          })
          .attr('dy', function (d) {
            if (d.r) return (d.r * 8 / 5) + 'px'
            else return '3.2em'
          })
          .attr('font-family', 'Microsoft YaHei')
          .attr('font-size', function (d) {
            if (d.textSize) return d.textSize
            else return _this.DefaultNodeTextSize
          })
          .attr('text-anchor', 'middle')
          .text(function (d) {
            return d.name
          })
      nodeText.append('title').text(function (d) {
        if (d.name) return d.name
        else return '节点'
      })
      return nodeText
    },
    drawButtonGroup(nodes) {
      let _this = this
      let nodeButton = _this.nodebuttonGroup
          .selectAll('use')
          .data(nodes, function (d) {
            return d.id
          })
      nodeButton.exit().remove()
      let nodeButtonEnter = nodeButton
          .enter()
          .append('use') // 为每个节点组添加一个 use 子元素
      nodeButton = nodeButtonEnter.merge(nodeButton)
      nodeButton
          .attr('r', function (d) {
            if (!d.r) {
              return _this.defaultR
            }
            return d.r
          })
          .attr('id', function (d) {
            return d.id
          })
          // 指定use引用的内容
          .attr('xlink:href', function (d) {
            if (!d.r) {
              return '#out_circle_' + _this.defaultR
            }
            return '#out_circle_' + d.r
          })
          .attr('class', function (d) {
            return 'buttongroup out_buttongroup_' + d.id
          })
          .attr("id", function (d) {
            return "nodebtg" + d.id
          })
          .classed('notshow', true)
      return nodeButton
    },
    // 绘制关系
    drawLink(links) {
      let _this = this
      let link = this.qaGraphLink.selectAll('.line >path').data(links, function (d) {
        return d.id
      })
      link.exit().remove()
      // 设置关系样式
      let linkEnter = link.enter().append('path')

      linkEnter.on('mouseenter', function () {
        d3.select(this)
            .style('stroke-width', '3')
            .attr('stroke', _this.DefaultLinkActiveColor)
            .attr('marker-end', 'url(#arrow)')
      })
      linkEnter.on('mouseleave', function () {
        d3.select(this)
            .style('stroke-width', '2')
            .attr('stroke', function (d) {
              if (d.lk.color) return d.lk.color
              else return _this.DefaultLinkColor
            })
            .attr('marker-end', 'url(#arrow)')
      })
      link = linkEnter.merge(link)
      link.attr('class', 'link')
          .attr('stroke-width', '2')
          .attr('stroke', function (d) {
            if (d.lk.color) return d.lk.color
            else return _this.DefaultLinkColor
          })
          .attr('fill', 'none')
          .attr('id', function (d) {
            return "invis_" + d.lk.sourceId + "-" + d.lk.id + "-" + d.lk.targetId
          })
          .attr('marker-end', 'url(#arrow)') // 箭头
      return link
    },
    // 绘制关系上的文字
    drawLinkText(links) {
      let _this = this
      let linkText = _this.qaGraphLinkText
          .selectAll('text')
          .data(links, function (d) {
            return d.id
          })
      linkText.exit().remove()

      let linkTextEnter = linkText.enter()
          .append('text')
          .attr('class', 'link-text')
          .style('fill', function (d) {
            if (d.lk.textColor) return d.lk.textColor
            else return _this.DefaultLinkTextColor
          })
          .append('textPath')
          .attr('class', 'link-textPath')
          .attr("startOffset", "50%")
          .attr("text-anchor", "middle")
          .attr("xlink:href", function (d) {
            return "#invis_" + d.lk.sourceId + "-" + d.lk.id + "-" + d.lk.targetId;
          })
          .style('font-family', 'Microsoft YaHei')
          .style('font-size', function (d) {
            if (d.lk.textSize) return d.lk.textSize
            else return _this.DefaultLinkTextSize
          })
          .text(function (d) {
            if (d.lk.name) return d.lk.name
            else return '联系'
          })

      linkTextEnter.on('dblclick', function (d) {
        _this.SelectedLinkId = d.lk.id;
        _this.isEditingLink = true;
        _this.EditingLinkEntity.name = d.lk.name;
        _this.EditingLinkEntity.holdRatio = d.lk.holdRatio;
        _this.EditingLinkEntity.id = d.lk.id;
        _this.EditingLinkEntity.sourceId = d.lk.sourceId;
        _this.EditingLinkEntity.targetId = d.lk.targetId;
        _this.EditingLinkEntity.color = d.lk.color;
        _this.EditingLinkEntity.textColor = d.lk.textColor;
        _this.EditingLinkEntity.textSize = d.lk.textSize;
        _this.EditLinkDialogVisible = true;
      })
      linkText = linkTextEnter.merge(linkText);

      d3.selectAll('.link-text')
          .style('fill', function (d) {
            if (d.lk.textColor) return d.lk.textColor
            else return _this.DefaultLinkTextColor
          })

      d3.selectAll('.link-textPath')
          .attr("startOffset", "50%")
          .attr("text-anchor", "middle")
          .attr("xlink:href", function (d) {
            return "#invis_" + d.lk.sourceId + "-" + d.lk.id + "-" + d.lk.targetId;
          })
          .style('font-family', 'Microsoft YaHei')
          .style('font-size', function (d) {
            if (d.lk.textSize) return d.lk.textSize
            else return _this.DefaultLinkTextSize
          })
          .text(function (d) {
            if (d.lk.name) return d.lk.name
            else return '联系'
          })

      return linkText
    },
    dragStart(d) {
      if (!d3.event.active) this.simulation.alphaTarget(0.8).restart();
      d.fx = d.x;
      d.fy = d.y;
    },
    dragging(d) {
      if (this.isTypesettingModeOn) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      } else {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
    },
    dragEnd(d) {
      if (this.isTypesettingModeOn) {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      } else {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    },
    // 滚轮zoom事件
    zoomed() {
      let transform = d3.event.transform;
      d3.selectAll('.node').attr('transform', transform);
      d3.selectAll('.nodetext').attr('transform', transform);
      d3.selectAll('.line').attr('transform', transform);
      d3.selectAll('.linetext').attr('transform', transform);
      d3.selectAll('.nodebutton').attr('transform', transform);
      this.gX.call(this.xAxis.scale(transform.rescaleX(this.linearX)));
      this.gY.call(this.yAxis.scale(transform.rescaleY(this.linearY)));
    },
    // 点击zoom事件
    zoomClick(direction) {
      let _this = this
      // 每次放大/缩小的程度
      let factor = 0.2
      let targetZoom = 1
      let extent = _this.zoom.scaleExtent()
      targetZoom = 1 + factor * direction
      if (targetZoom < extent[0] || targetZoom > extent[1]) return false
      _this.zoom.scaleBy(_this.svg, targetZoom)
    },
    // 放大
    zoomIn() {
      this.zoomClick(1)
    },
    // 缩小
    zoomOut() {
      this.zoomClick(-1)
    },
    // 复原
    refresh() {
      // zoomIdentity是缩放中心点
      this.svg.transition()
          .duration(750)
          .call(this.zoom.transform, d3.zoomIdentity);
    },
    // 全屏
    showFull() {
      this.isFullscreen = !this.isFullscreen
      let full = document.getElementById('kg_container')
      this.fullScreen(full)
      //组件通信给header传值
      window.Event.$emit('isFullScreen', this.isFullscreen)
    },
    exitFullScreen() {
      this.isFullscreen = !this.isFullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
      window.Event.$emit('isFullScreen', this.isFullscreen)
    },
    fullScreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    // 清空记录关系
    emptyLinkEntity() {
      this.EditingLinkEntity = {
        id: 0,
        sourceId: '',
        targetId: '',
        name: '',
        holdRatio: 0,
        r: 0,
        color: '',
        textColor: '',
        textSize: 0,
      }
    },
    // 清空记录节点
    emptyNodeEntity() {
      this.EditingNodeEntity = {
        id: 0,
        name: '',
        regAsset: 0,
        stateOwned: false,
        color: '',
        strokeColor: '',
        textColor: '',
        textSize: 0,
        tags: [],
      }
    },
    cancelLinkEdit() {
      this.emptyLinkEntity()
      this.SelectedLinkId = 0
      this.isEditingLink = false
      this.EditLinkDialogVisible = false
    },
    cancelNodeEdit() {
      this.emptyNodeEntity()
      this.SelectedNodeId = 0
      this.isEditingNode = false
      this.EditNodeDialogVisible = false
    },
    saveLinkEdit() {
      this.updateLinkInfo()
      this.emptyLinkEntity()
      this.SelectedLinkId = 0
      this.isEditingLink = false
      this.EditLinkDialogVisible = false
      this.$message({
        type: 'success',
        message: '保存更改成功！'
      })
    },
    saveNodeEdit() {
      if (this.NodeNameMap.has(this.EditingNodeEntity.name)) {
        let index = this.NodeNameMap.get(this.EditingNodeEntity.name);
        if (this.graph.nodes[index].id !== this.EditingNodeEntity.id) {
          this.$message({
            type: 'warning',
            message: '节点名和已有节点名重复！'
          });
          return;
        }
      }
      this.updateNodeInfo();
      this.emptyNodeEntity();
      this.SelectedNodeId = 0;
      this.isEditingNode = false;
      this.EditNodeDialogVisible = false;
      this.$message({
        type: 'success',
        message: '保存更改成功！'
      });
    },
    // 删除节点及相关联系
    deleteNode(out_buttongroup_id) {
      let _this = this;
      _this.$confirm('该操作不可撤销', '将要删除节点和所有以该节点为源或目标的关系，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loadingInstance = Loading.service({fullscreen: true});
        // 移除节点旁工具栏
        _this.svg.selectAll(out_buttongroup_id).remove();
        // 移除与节点相关的关系
        for (let i = 0; i < _this.graph.links.length; i++) {
          if (_this.graph.links[i].sourceId === _this.SelectedNodeId ||
              _this.graph.links[i].targetId === _this.SelectedNodeId) {
            _this.graph.links.splice(i, 1);
            i = i - 1;
          }
        }
        // 移除节点和节点、名字映射关系
        for (let i = 0; i < _this.graph.nodes.length; i++) {
          if (_this.graph.nodes[i].id === _this.SelectedNodeId) {
            _this.NodeNameMap.delete(_this.graph.nodes[i].name);
            _this.graph.nodes.splice(i, 1);
            break;
          }
        }
        deleteNodeAPI(_this.SelectedNodeId);
        _this.updateGraph();
        _this.SelectedNodeId = 0;
        _this.getEchartsData();
        loadingInstance.close();
        _this.$message({
          type: 'success',
          message: '删除节点成功！'
        });
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '操作已取消'
        });
      })
    },
    // 取消添加节点/联系
    cancelOperation() {
      d3.select('.grid').style("cursor", "")
      if (this.isAddingNode) {
        this.isAddingNode = false
      } else if (this.isAddingLink) {
        this.isAddingLink = false
      }
      this.cancelOperationMessage = ''
      this.isCancelOperationShow = false
    },
    // 当添加节点按钮被按下，鼠标样式改变为+
    // 当鼠标再次在界面中点击，创建节点，鼠标样式恢复
    addOneNode() {
      this.isAddingNode = true
      this.cancelOperationMessage = '取消添加节点'
      this.isCancelOperationShow = true
      d3.select('.grid').style("cursor", "crosshair")
    },
    getRandom() {
      return Math.floor(Math.random() * (this.graph.nodes.length + 1) * 50);
    },
    // 添加节点方法
    createNode() {
      let _this = this;
      let newNode = {};
      let loadingInstance = Loading.service({fullscreen: true});
      let transform = d3.select('.node').attr('transform');
      if (transform) {
        let XYK = []
        XYK = transform.replace('translate', '').replaceAll('(', '').replaceAll(')', '').replace(' scale', ',').split(',');
        let resX = (_this.txx - Number(XYK[0])) / Number(XYK[2]);
        let resY = (_this.tyy - Number(XYK[1])) / Number(XYK[2]);
        newNode.x = resX;
        newNode.y = resY;
        if (_this.isTypesettingModeOn) {
          newNode.fx = resX;
          newNode.fy = resY;
        } else {
          newNode.fx = null;
          newNode.fy = null;
        }
        newNode.force_x = resX;
        newNode.force_y = resY;
        newNode.type_setting_x = resX;
        newNode.type_setting_y = resY;
      } else {
        newNode.x = _this.txx;
        newNode.y = _this.tyy;
        if (_this.isTypesettingModeOn) {
          newNode.fx = _this.txx;
          newNode.fy = _this.tyy;
        } else {
          newNode.fx = null;
          newNode.fy = null;
        }
        newNode.force_x = _this.txx;
        newNode.force_y = _this.tyy;
        newNode.type_setting_x = _this.txx;
        newNode.type_setting_y = _this.tyy;
      }
      newNode.r = _this.defaultR;
      newNode.textSize = _this.DefaultNodeTextSize;
      newNode.graphId = _this.selectedKGId;
      newNode.regAsset = 0;
      newNode.stateOwned = false;
      while (true) {
        newNode.name = '节点' + _this.getRandom();
        if (!_this.NodeNameMap.has(newNode.name)) break;
      }
      newNode.id = createNodeAPI(newNode);
      _this.NodeNameMap.set(newNode.name, _this.graph.nodes.length);
      _this.graph.nodes.push(newNode);
      _this.updateGraph();
      _this.isCancelOperationShow = false;
      _this.cancelOperationMessage = 0;
      _this.isAddingNode = false;
      _this.getEchartsData();
      loadingInstance.close();
    },
    deleteLink() {
      let _this = this
      _this.$confirm('该操作不可撤销', '将要删除该联系，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loadingInstance = Loading.service({fullscreen: true});
        for (let i = 0; i < _this.graph.links.length; i++) {
          if (_this.graph.links[i].id === _this.SelectedLinkId) {
            _this.graph.links.splice(i, 1)
            break
          }
        }
        deleteLinkAPI(_this.SelectedLinkId)
        _this.updateGraph()
        _this.SelectedLinkId = 0
        _this.isEditingLink = false
        _this.emptyLinkEntity()
        _this.EditLinkDialogVisible = false
        loadingInstance.close();
        _this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch(() => {
        _this.SelectedLinkId = 0
        _this.isEditingLink = false
        _this.emptyLinkEntity()
        _this.EditLinkDialogVisible = false
        _this.$message({
          type: 'info',
          message: '操作已取消'
        })
      })
    },
    createLink() {
      let _this = this;
      let newShip = {};
      let loadingInstance = Loading.service({fullscreen: true});
      newShip.sourceId = _this.SelectedSourceNodeId;
      newShip.targetId = _this.SelectedTargetNodeId;
      newShip.name = '持股比例 ' + 0 + '%';
      newShip.textSize = _this.DefaultLinkTextSize;
      newShip.holdRatio = 0;
      newShip.graphId = _this.selectedKGId;
      newShip.id = createLinkAPI(newShip);
      _this.graph.links.push(newShip);
      _this.updateGraph();
      _this.isAddingLink = false;
      _this.SelectedSourceNodeId = 0;
      _this.SelectedTargetNodeId = 0;
      loadingInstance.close();
    },
    updateNodeInfo() {
      let _this = this;
      let loadingInstance = Loading.service({fullscreen: true});
      for (let i = 0; i < _this.graph.nodes.length; i++) {
        if (_this.SelectedNodeId === _this.graph.nodes[i].id) {
          _this.graph.nodes[i].name = _this.EditingNodeEntity.name;
          _this.graph.nodes[i].regAsset = _this.EditingNodeEntity.regAsset;
          _this.graph.nodes[i].stateOwned = _this.EditingNodeEntity.stateOwned;
          _this.graph.nodes[i].color = _this.EditingNodeEntity.color;
          _this.graph.nodes[i].textColor = _this.EditingNodeEntity.textColor;
          _this.graph.nodes[i].strokeColor = _this.EditingNodeEntity.strokeColor;
          _this.graph.nodes[i].textSize = _this.EditingNodeEntity.textSize;
          _this.graph.nodes[i].r = _this.EditingNodeEntity.r;
          _this.graph.nodes[i].tags = _this.EditingNodeEntity.tags;
          let nodeToUpdate = _this.graph.nodes[i];
          updateNodeAPI(nodeToUpdate);
          this.getEchartsData();
          break;
        }
      }
      _this.updateGraph();
      loadingInstance.close();
    },
    updateLinkInfo() {
      let _this = this;
      let loadingInstance = Loading.service({fullscreen: true});
      for (let i = 0; i < _this.graph.links.length; i++) {
        if (_this.SelectedLinkId === _this.graph.links[i].id) {
          _this.graph.links[i].name = '持股比例 ' + _this.EditingLinkEntity.holdRatio + '%';
          _this.graph.links[i].holdRatio = _this.EditingLinkEntity.holdRatio;
          _this.graph.links[i].color = _this.EditingLinkEntity.color;
          _this.graph.links[i].textColor = _this.EditingLinkEntity.textColor;
          _this.graph.links[i].textSize = _this.EditingLinkEntity.textSize;
          let linkToUpdate = _this.graph.links[i];
          updateLinkAPI(linkToUpdate);
          break;
        }
      }
      _this.updateGraph();
      loadingInstance.close();
    },
    // 保存为图片
    exportImage() {
      d3.selectAll('.buttongroup').remove()
      var serializer = new XMLSerializer();
      var svg1 = document.getElementById('svg_index');
      var toExport = svg1.cloneNode(true);
      var bb = svg1.getBBox();
      toExport.setAttribute('viewBox', bb.x + ' ' + bb.y + ' ' + bb.width + ' ' + bb.height);
      toExport.setAttribute('width', bb.width);
      toExport.setAttribute('height', bb.height);
      var source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(toExport);
      var image = new Image;
      image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      var canvas = document.createElement("canvas");
      canvas.width = bb.width;
      canvas.height = bb.height;
      var context = canvas.getContext("2d");
      context.fillStyle = '#fff';//#fff设置保存后的PNG 是白色的
      context.fillRect(0, 0, 10000, 10000);
      image.onload = function () {
        context.drawImage(image, 0, 0);
        var a = document.createElement("a");
        a.download = `Kojima_Coin_${new Date().valueOf()}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      }
      this.updateGraph()
    },
    // 导出为Json
    exportJson() {
      // 前端导出json实现
      let content = JSON.stringify(getGraphAPI(this.selectedKGId), null, 2)
      let eleLink = document.createElement('a');
      eleLink.download = `Kojima_Coin_${new Date().valueOf()}.json`;
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      let blob = new Blob([content]);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
      // 后端导出json实现
      // saveAsJsonAPI()
    },
    // 导出为XML
    exportXML() {
      // 前端导出xml实现
      // const xml2js = require('xml2js')
      // let builder = new xml2js.Builder()
      // let dataXml = builder.buildObject(this.graph)
      // let eleLink = document.createElement('a');
      // eleLink.download = `Kojima_Coin_${new Date().valueOf()}.xml`;
      // eleLink.style.display = 'none';
      // // 字符内容转变成blob地址
      // let blob = new Blob([dataXml]);
      // eleLink.href = URL.createObjectURL(blob);
      // // 触发点击
      // document.body.appendChild(eleLink);
      // eleLink.click();
      // // 然后移除
      // document.body.removeChild(eleLink);
      // 后端导出xml实现
      const xml2js = require('xml2js')
      let builder = new xml2js.Builder()
      let dataXml = builder.buildObject(getGraphAPI(this.selectedKGId))
      let eleLink = document.createElement('a');
      eleLink.download = `Kojima_Coin_${new Date().valueOf()}.xml`;
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      let blob = new Blob([dataXml]);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    },
    // 自动填充搜索栏方法补充
    querySearch(queryString, cb) {
      if (!queryString) {
        let resultsH = getSearchHistoryAPI()
        let results = []
        for (let i of resultsH) {
          results.push({"value": i})
        }
        results = queryString
            ? results.filter(this.createFilter(queryString))
            : results
        cb(results)
      } else {
        this.handleSearch()
      }
    },
    createFilter(queryString) {
      return (item) => {
        return item.value.toUpperCase().match(queryString.toUpperCase());
      };
    },
    handleSelect(item) {
      this.searchString = item.value
      this.searchResult = searchNodeAPI(this.selectedKGId, this.searchString)
      this.changeStyle("none", ".el-autocomplete-suggestion");
    },
    handleSearch() {
      this.searchResult = searchNodeAPI(this.selectedKGId, this.searchString)
      this.changeStyle("none", ".el-autocomplete-suggestion");
    },
    changeStyle(status, className) {
      let dom = document.querySelectorAll(className);
      dom[0].style.display = status;
    },
    // 使节点在屏幕中央
    handleChoose(node) {
      // 节点坐标
      let nodeElement = d3.select('#node' + node.id);
      let X = Number(nodeElement.attr('cx'));
      let Y = Number(nodeElement.attr('cy'));
      this.svg.transition()
          .duration(750)
          .call(this.zoom.translateTo, X, Y);
    },
    // tag 相关
    showTagInput() {
      this.TagInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleTagInputConfirm() {
      let inputValue = this.tagInputValue;
      if (inputValue) {
        if (this.EditingNodeEntity.tags.indexOf(inputValue) !== -1) {
          this.$message({
            type: 'warning',
            message: '持股董高监和已有持股董高监重复！'
          });
          return;
        }
        this.EditingNodeEntity.tags.push(inputValue);
      }
      this.TagInputVisible = false;
      this.tagInputValue = '';
    },
    handleTagClose(tag) {
      this.EditingNodeEntity.tags.splice(this.EditingNodeEntity.tags.indexOf(tag), 1);
    },
    handleChange() {
      changeGraphNameAPI(this.selectedKGId, this.graph_name);
      this.set_selectedKGName(this.graph_name);
      this.$message({
        message: "修改图谱名称成功",
        type: 'success'
      })
    },
    closeGraph() {
      let _this = this;
      this.$confirm('确定关闭图谱？', '图谱会保存到数据库。', {
        confirmButtonText: '保存并关闭',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.updateAllClick();
        this.set_isGraphOpening(false);
        this.set_selectedKGId(-1);
        this.set_selectedKGName('');
        this.$router.push({name: 'KGList'});
        // location.reload();
      })
    },
    updateAllClick() {
      let loadingInstance = Loading.service({fullscreen: true});
      this.updateAll();
      this.getEchartsData();
      loadingInstance.close();
      this.$message({
        type: 'success',
        message: '已同步到数据库'
      })
    },
    // 更新整个图谱到数据库
    updateAll() {
      for (let i = 0; i < this.graph.nodes.length; i++) {
        if (this.isTypesettingModeOn) {
          this.graph.nodes[i].type_setting_x = this.graph.nodes[i].fx;
          this.graph.nodes[i].type_setting_y = this.graph.nodes[i].fy;
        } else {
          this.graph.nodes[i].force_x = this.graph.nodes[i].x;
          this.graph.nodes[i].force_y = this.graph.nodes[i].y;
        }
      }
      let updateVO = {
        graphId: this.selectedKGId,
        nodes: this.graph.nodes,
        links: this.graph.links
      };
      updateAPI(updateVO);
    },
    // 图元相关
    showNodePrimitiveDialog() {
      this.AddNodePrimitiveVisible = true;
    },
    emptyAddNodePrimitiveEntity() {
      this.AddNodePrimitiveEntity = {
        id: 0,
        name: '节点图元',
        color: 'rgb(94,95,95)',
        strokeColor: '#d5dede',
        textColor: '#33434b',
        textSize: 14,
        r: 30,
      };
    },
    createNodePrimitive() {
      // 因为不想写生成器，所以同步调用获取图元id
      this.AddNodePrimitiveEntity.id = createNodePrimitiveAPI(this.AddNodePrimitiveEntity);
      this.NodePrimitives.push($.extend({}, this.AddNodePrimitiveEntity));
      this.AddNodePrimitiveVisible = false;
      this.emptyAddNodePrimitiveEntity();
    },
    cancelAddNodePrimitive() {
      this.AddNodePrimitiveVisible = false;
      this.emptyAddNodePrimitiveEntity();
    },
    showLinkPrimitiveDialog() {
      this.AddLinkPrimitiveVisible = true;
    },
    emptyAddLinkPrimitiveEntity() {
      this.AddLinkPrimitiveEntity = {
        id: 0,
        name: '连接图元',
        color: 'rgba(132,137,132,0.45)',
        textColor: '#33434b',
        textSize: 14,
      };
    },
    createLinkPrimitive() {
      // 因为不想写生成器，所以同步调用获取图元id
      this.AddLinkPrimitiveEntity.id = createLinkPrimitiveAPI(this.AddLinkPrimitiveEntity);
      this.LinkPrimitives.push($.extend({}, this.AddLinkPrimitiveEntity));
      this.AddLinkPrimitiveVisible = false;
      this.emptyAddLinkPrimitiveEntity();
    },
    cancelAddLinkPrimitive() {
      this.AddLinkPrimitiveVisible = false;
      this.emptyAddLinkPrimitiveEntity();
    },
    deleteNodePrimitive(id) {
      if (this.usingNodePrimitiveId !== -1) {
        this.$message({
          message: '有图元正在使用中！请先取消使用',
          type: 'error'
        })
        return;
      }
      let _this = this;
      _this.$confirm('该操作不可撤销', '将要删除节点图元，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === _this.usingNodePrimitiveId) _this.cancelUsingNodePrimitive();
        for (let i = 0; i < _this.NodePrimitives.length; i++) {
          if (_this.NodePrimitives[i].id === id) {
            _this.NodePrimitives.splice(i, 1);
            break;
          }
        }
        deleteNodePrimitiveAPI(id);
        _this.$message({
          type: 'success',
          message: '删除节点图元成功！'
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '取消删除节点图元'
        })
      })
    },
    deleteLinkPrimitive(id) {
      if (this.usingLinkPrimitiveId !== -1) {
        this.$message({
          message: '有图元正在使用中！请先取消使用',
          type: 'error'
        })
        return;
      }
      let _this = this;
      _this.$confirm('该操作不可撤销', '将要删除节点图元，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === _this.usingLinkPrimitiveId) _this.cancelUsingLinkPrimitive();
        for (let i = 0; i < _this.LinkPrimitives.length; i++) {
          if (_this.LinkPrimitives[i].id === id) {
            _this.LinkPrimitives.splice(i, 1);
            break;
          }
          _this.$message({
            type: 'success',
            message: '删除连接图元成功！'
          })
        }
        deleteLinkPrimitiveAPI(id);
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '取消删除连接图元'
        })
      })
    },
    useNodePrimitive(id) {
      let _this = this;
      _this.usingNodePrimitiveId = id;
      for (let i = 0; i < _this.NodePrimitives.length; i++) {
        if (_this.NodePrimitives[i].id === id) {
          _this.DefaultNodeColor = _this.NodePrimitives[i].color;
          _this.DefaultNodeStrokeColor = _this.NodePrimitives[i].strokeColor;
          _this.DefaultNodeTextColor = _this.NodePrimitives[i].textColor;
          _this.DefaultNodeTextSize = _this.NodePrimitives[i].textSize;
          _this.defaultR = _this.NodePrimitives[i].r;
          break;
        }
      }
    },
    useLinkPrimitive(id) {
      let _this = this;
      _this.usingLinkPrimitiveId = id;
      for (let i = 0; i < _this.LinkPrimitives.length; i++) {
        if (_this.LinkPrimitives[i].id === id) {
          _this.DefaultLinkColor = _this.LinkPrimitives[i].color;
          _this.DefaultLinkTextColor = _this.LinkPrimitives[i].textColor;
          _this.DefaultLinkTextSize = _this.LinkPrimitives[i].textSize;
        }
      }
    },
    tableNodeRowClassName({row, rowIndex}) {
      if (row.id === this.usingNodePrimitiveId) return 'success-row';
      else return '';
    },
    tableLinkRowClassName({row, rowIndex}) {
      if (row.id === this.usingLinkPrimitiveId) return 'success-row';
      else return '';
    },
    cancelUsingNodePrimitive() {
      this.usingNodePrimitiveId = -1;
      this.DefaultNodeColor = this.DefaultNodePrimitive.color;
      this.DefaultNodeStrokeColor = this.DefaultNodePrimitive.strokeColor;
      this.DefaultNodeTextColor = this.DefaultNodePrimitive.textColor;
      this.DefaultNodeTextSize = this.DefaultNodePrimitive.textSize;
      this.defaultR = this.DefaultNodePrimitive.r;
    },
    cancelUsingLinkPrimitive() {
      this.usingLinkPrimitiveId = -1;
      this.DefaultLinkColor = this.DefaultLinkPrimitive.color;
      this.DefaultLinkTextColor = this.DefaultLinkPrimitive.textColor;
      this.DefaultLinkTextColor = this.DefaultLinkPrimitive.textSize;
    },
    // param: tagName
    // paramType: string
    showTagNode(tagName) {
      let nodes = this.graph.nodes;
      nodes.forEach(function (node) {
        if (node.tags.indexOf(tagName) !== -1) {
          let id = node.id;
          d3.select("#node" + id).classed('notshow', false);
          d3.select("#nodetext" + id).classed('notshow', false);
        }
      })
      console.log(tagName);
    },
    // 统计饼图
    drawPieChart() {
      const echarts = require('echarts');
      this.charts = echarts.init(document.getElementById("pieCount"))
      // 饼图添加点击事件
      this.charts.on('mousedown', (params) => {
        d3.selectAll('.single-node').classed('notshow', true);
        d3.selectAll('.single-nodetext').classed('notshow', true);
        d3.selectAll('.link').classed('notshow', true);
        d3.selectAll('.linetext').classed('notshow', true);
        d3.selectAll('.nodebutton').classed('notshow', true);
        this.showTagNode(params.name);
      });
      this.charts.on('mouseup', (params) => {
        d3.selectAll('.single-node').classed('notshow', false);
        d3.selectAll('.single-nodetext').classed('notshow', false);
        d3.selectAll('.link').classed('notshow', false);
        d3.selectAll('.linetext').classed('notshow', false);
        d3.selectAll('.nodebutton').classed('notshow', false);
      });
      this.charts.on('mouseout', (params) => {
        d3.selectAll('.single-node').classed('notshow', false);
        d3.selectAll('.single-nodetext').classed('notshow', false);
        d3.selectAll('.link').classed('notshow', false);
        d3.selectAll('.linetext').classed('notshow', false);
        d3.selectAll('.nodebutton').classed('notshow', false);
      });
      this.charts.setOption({
        title: {
          text: '持股人统计',
          x: 'center',
          textStyle: {
            fontSize: 10
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: '持股人统计',
            type: 'pie',
            label: {
              normal: {
                position: 'inner',
                show: false
              }
            },
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }, true)

    },
    getEchartsData() {
      let co = getCountDataAPI(this.selectedKGId);
      if (co === undefined) {
        co = []
      }
      this.countData = [];
      for (let i = 0; i < co.length; i++) {
        let re = {};
        re.name = co[i].name;
        re.value = co[i].num;
        this.countData.push(re);
      }
      this.charts.setOption({
        series: [{
          data: this.countData
        }]
      })
    },
    cancelShowRisk() {
      this.ShowRiskVisible = false;
      this.SelectedNodeId = -1;
      this.RiskVO.risk = 0;
      this.RiskVO.inDegree = 0;
      this.RiskVO.outDegree = 0;
      this.RiskVO.regAsset = 0;
      this.RiskVO.stateOwnedRatio = 0;
    }
  }
}
</script>
<!--css-->
<style>
#grid {
  position: fixed;
  top: 10%;
  left: 23%;
  right: 23%;
  bottom: 10%;
}

.sidebar-left {
  left: 30px;
  width: 18%;
  top: 20%;
  position: fixed;
  border: thick double #dcdfe6;
  height: 70%;
}

.my-autocomplete {
  padding-top: 10px;
  font-size: 16px
}

.graph_name {
  border: thick double #dcdfe6;
  top: 10%;
  position: fixed;
  left: 30px;
  width: 18%;
}

.graph_name #name_card {
  height: 40px;
}

/*.graph_name_text {*/
/*  padding-top: 9px;*/
/*  padding-bottom: 5px;*/
/*}*/

/*.el-input__inner {*/
/*  text-align: center;*/
/*}*/

.showResult {
  user-select: none;
  background: none;
}

.searchResultItem {
  width: 100%;
  height: 10%;
  left: 0;
  top: 0;
  display: inline-block;
  box-sizing: border-box;
  background: none;
  padding-left: 0;
  padding-top: 14px;
  text-align: center;
  font-size: 16px;
  color: rgba(0, 0, 0, .65);;
}

.searchResultItem:hover {
  background: rgba(230, 233, 239, 0.5);
}

.sidebar-right {
  right: 30px;
  width: 18%;
  top: 10%;
  position: fixed;
  border: thick double #dcdfe6;
  height: 50%;
  user-select: none;
  background: none;
}

.sidebar-item {
  width: 100%;
  height: 12%;
  left: 0;
  top: 0;
  display: inline-block;
  box-sizing: border-box;
  background: none;
  padding-left: 15px;
  padding-top: 10px;
  text-align: left;
  font-size: 16px;
  color: rgba(0, 0, 0, .65);;
}

.sidebar-item:hover {
  background: rgba(230, 233, 239, 0.5);
}

.sidebar-span {
  float: left;
}

.sidebar-icon {
  margin-right: 10px;
  float: left;
  font-size: 16px;
  padding-top: 2px;
}

.choose {
  cursor: pointer;
}

/* 正在应用的颜色 */
.el-table .success-row {
  background: #f0f9eb;
}

.sidebar-right-bottom {
  right: 30px;
  width: 18%;
  top: 65%;
  position: fixed;
  border: thick double #dcdfe6;
  height: 25%;
  user-select: none;
  background: none;
}

circle {
  cursor: pointer;
}

text {
  cursor: pointer;
  max-width: 25px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.svg-set-box {
  width: 97%;
  height: 46px;
  line-height: 46px;
  padding-left: 15px;
  color: #7f7f7f;
  /* background: #f7f7f7; */
  position: absolute;
  bottom: 10px;
  text-align: center;
  user-select: none;
}

.ctwh-dibmr {
  display: inline-block;
  user-select: none;
}

.cancelBox {
  margin: 0 auto;
}

.leftBox {
  margin-left: 8%;
}

.rightBox {
  margin-right: 8%;
}

.tools-left {
  margin-left: 30px;
  float: left;
}

.tools-right {
  margin-right: 30px;
  float: right;
}

ul,
li {
  list-style: none;
}

.notshow {
  display: none;
}

.nodetext {
  pointer-events: all;
  cursor: pointer;
}

/*dialog宽度调整*/
.customWidth {
  width: 28%;
}

/*form-item样式*/
.lineColor {
  width: 70%;
  float: left;
}

.colorPiker {
  width: 25%;
  float: left;
}

.withoutColor {
  width: 97%;
  float: left;
}

.form-divider {
  line-height: 24px;
}

/* tag添加器样式 */
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

/*risk*/
.risk-item {
  width: 75%;
  font-size: 18px;
}

/*input文字居中显示*/
input::-ms-input-placeholder {
  text-align: center;
}

input::-webkit-input-placeholder {
  text-align: center;
  font-size: 16px;
}

.graph_name .el-input__inner {
  border: 0;
}
</style>