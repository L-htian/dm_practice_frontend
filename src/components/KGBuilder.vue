<template>
  <div>
    <div id="grid_container" style="float:left;">
      <div id="grid" class="grid"></div>
    </div>
    <div class="svg-set-box clearfix">
      <div class="ctwh-dibmr leftBox" style="float: left;">
        <el-tooltip effect="light"
                    content="添加节点"
                    placement="top"
        >
          <el-button icon="el-icon-plus" circle
                     @click="addOneNode"
                     class="tools"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="light"
                    content="保存为图片"
                    placement="top"
        >
          <el-button icon="el-icon-picture-outline" circle
                     @click="exportImage"
                     class="tools"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="light"
                    content="保存为Json"
                    placement="top"
        >
          <el-button icon="iconfont icon-json" circle
                     @click="exportJson"
                     class="tools"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="light"
                    content="保存为XML"
                    placement="top"
        >
          <el-button icon="iconfont icon-xml" circle
                     @click="exportXML"
                     class="tools"
          ></el-button>
        </el-tooltip>
      </div>
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
      <div class="ctwh-dibmr rightBox" style="float: right;">
        <el-tooltip effect="light"
                    content="放大"
                    placement="top"
        >
          <el-button icon="el-icon-zoom-in" circle
                     @click="zoomIn"
                     class="tools"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="light"
                    content="缩小"
                    placement="top"
        >
          <el-button icon="el-icon-zoom-out" circle
                     @click="zoomOut"
                     class="tools"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="light"
                    content="还原"
                    placement="top"
        >
          <el-button icon="el-icon-refresh-right" circle
                     @click="refresh"
                     class="tools"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="light"
                    content="全屏"
                    placement="top"
                    v-if="!isFullscreen"
        >
          <el-button icon="el-icon-full-screen" circle
                     @click="showFull"
                     class="tools"
                     v-if="!isFullscreen"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="light"
                    content="退出全屏"
                    placement="top"
                    v-if="isFullscreen"
        >
          <el-button icon="el-icon-full-screen" circle
                     @click="exitFullScreen"
                     class="tools"
                     v-if="isFullscreen"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <el-dialog title="联系选项" :visible.sync="EditLinkDialogVisible" custom-class="customWidth">
      <el-form>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.id" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="源节点id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.sourceId" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="目标节点id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.targetId" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="联系名" :label-width="formLabelWidth">
          <el-input :disabled="false" v-model="EditingLinkEntity.name" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="联系线条颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.color" class="lineColor"></el-input>
          <el-color-picker v-model="EditingLinkEntity.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="联系名颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.textColor" class="lineColor"></el-input>
          <el-color-picker v-model="EditingLinkEntity.textColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelLinkEdit">取消</el-button>
        <el-button type="warning" @click="deleteLink">删除联系</el-button>
        <el-button type="primary" @click="saveLinkEdit">保存修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="节点选项" :visible.sync="EditNodeDialogVisible" custom-class="customWidth">
      <el-form>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingNodeEntity.id" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="节点名" :label-width="formLabelWidth">
          <el-input :disabled="false" v-model="EditingNodeEntity.name" class="withoutColor"></el-input>
        </el-form-item>
        <el-form-item label="节点填充颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingNodeEntity.color" class="lineColor"></el-input>
          <el-color-picker v-model="EditingNodeEntity.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="节点边框颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingNodeEntity.strokeColor" class="lineColor"></el-input>
          <el-color-picker v-model="EditingNodeEntity.strokeColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="节点名颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingNodeEntity.textColor" class="lineColor"></el-input>
          <el-color-picker v-model="EditingNodeEntity.textColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNodeEdit">取消</el-button>
        <el-button type="primary" @click="saveNodeEdit">保存修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import * as d3 from 'd3'
import $ from 'jquery'
import html2canvas from 'html2canvas'
import '@/static/iconfont/iconfont.css'

export default {
  name: "KGBuilder",
  props: ['pid'],
  data() {
    return {
      // labelLocation:"left",
      cancelOperationMessage: '',
      isCancelOperationShow: false,
      formLabelWidth: "120px",
      EditingLinkEntity: {
        id: '',
        sourceId: '',
        targetId: '',
        name: '',
        color: '',
        textColor: '',
      },
      EditingNodeEntity: {
        id: '',
        name: '',
        color: '',
        strokeColor: '',
        textColor: '',
      },
      EditLinkDialogVisible: false,
      EditNodeDialogVisible: false,
      isAddingNode: false,
      isEditingNode: false,
      isEditingLink: false,
      txx: {},
      tyy: {},
      // 默认颜色
      DefaultButtonGroupColor: '#d1d6d7',
      DefaultButtonGroupColorHover: '#ce458a',
      DefaultButtonGroupStrokeColor: '#fff',
      DefaultButtonGroupTextColor: '#0c0c0c',
      DefaultNodeStrokeColor: '#d5dede',
      DefaultNodeTextColor: '#33434b',
      DefaultNodeColor: 'rgb(94,95,95)',
      DefaultLinkColor: 'rgba(132,137,132,0.45)',
      DefaultLinkActiveColor: '#878585',
      DefaultLinkTextColor: '#0c0c0c',
      DefaultArrowColor: 'rgba(158,152,152,0.98)',

      theme: 0,
      // 是否正在加载
      loading: false,
      // 组件的宽
      width: 1503.2,
      // 组件的高
      height: 800,
      // 图容器
      graphContainer: {},
      // 矢量图
      svg: {},
      // 缩放设置
      zoom: null,
      //
      arrowMarker: {},
      // d3力导布局设置
      simulation: {},
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
      // 默认节点半径
      defaultR: 30,
      // 节点工具栏的内容
      toolbarData: [
        {name: '编辑', value: 1, code: 'edit'},
        {name: '连线', value: 1, code: 'link'},
        {name: '删除', value: 1, code: 'delete'},
      ],
      // 正在选中的节点的id
      selectId: 0,
      nodeRecordList: [],
      nodebuttonAction: '',
      // 正在选择的节点id
      selectnodeid: '',
      // 正在选择的源节点id，联系用
      selectsourcenodeid: '',
      // 正在选择的目标节点id，联系用
      selecttargetnodeid: '',
      // 正在选择的联系id
      selectrelationid: ''
    }
  },
  components: {},
  mounted() {
    this.initGraphContainer()
    this.initJQueryEvents()
    this.initGraph()
  },
  created() {
  },
  watch: {},
  methods: {
    testNode() {
      this.graph.nodes = [
        {
          "name": "田所浩二",
          "id": "114514",
        },
        {
          "name": "远野",
          "id": "1919810",
        }
      ]
      this.graph.links = [
        {
          "sourceId": "114514",
          "targetId": "1919810",
          "id": "9527",
          "name": "是先辈",
        }
      ]
    },
    cancelOperation() {
      d3.select('.grid').style("cursor", "")
      if (this.isAddingNode) {
        this.isAddingNode = false
      } else if (this.isAddinglink) {
        this.isAddinglink = false
      }
      this.cancelOperationMessage = ''
      this.isCancelOperationShow = false
    },
    initJQueryEvents() {
      let _this = this
      $(function () {
        $(".grid").bind("click", function (event) {
          let cursor = document.getElementById("grid").style.cursor;
          if (cursor == 'crosshair' && _this.isAddingNode) {
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
        this.width = $('#' + this.pid).width()
        this.height = $('#' + this.pid).height()
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
          .force('charge', d3.forceManyBody().strength(-1500)) // 节点之间的电荷力，正值为引力负值为斥力
          .force('link', d3.forceLink().distance(30).id(function (d) {
            return d.id
          })) // 节点之间的弹力，通过link牵引
          .force('collide', d3.forceCollide().radius(30).strength(0.8).iterations(2)) // 节点碰撞力，防止节点重叠
          .force('center', d3.forceCenter(this.width / 2, this.height / 2)) // 向心力，节点围绕在某一点旁
      // 元素g是用来组合对象的容器。添加到g元素上的变换会应用到其所有的子元素上。
      // 添加到g元素的属性会被其所有的子元素继承。
      // 此外，g元素也可以用来定义复杂的对象，之后可以通过<use>元素来引用它们。
      this.qaGraphLink = this.svg.append('g').attr('class', 'line')
      this.qaGraphLinkText = this.svg.append('g').attr('class', 'linetext')
      this.qaGraphNode = this.svg.append('g').attr('class', 'node')
      this.qaGraphNodeText = this.svg.append('g').attr('class', 'nodetext')
      this.nodebuttonGroup = this.svg.append('g').attr('class', 'nodebutton')
      this.addArrowMaker()
      // 定义按钮组引用的use元素
      this.drawToolButton()
      // .buttongroup
      this.svg.on('click', function () {
        d3.selectAll('use').classed('notshow', true)
      }, false)
    },
    // 初始化知识图谱
    // todo 传入不同的图文件，逻辑放入api
    initGraph() {
      let _this = this
      _this.testNode()
      _this.updateGraph()
    },
    // 制作箭头
    addArrowMaker() {
      let arrowMarker = this.svg
          .append('marker')
          .attr('id', 'arrow')
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', '12')
          .attr('markerHeight', '18')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', '22')
          .attr('refY', '0')
          .attr('orient', 'auto')
      let arrowPath = 'M0,-5L10,0L0,5' // 定义箭头形状
      arrowMarker.append('path').attr('d', arrowPath).attr('fill', this.DefaultArrowColor)
    },
    // 更新知识图谱
    updateGraph() {
      let _this = this
      let data = _this.formatData()
      let nodes = data.nodes
      let links = data.links

      // 更新节点
      let graphNode = _this.drawNode(nodes)
      // 更新节点文字
      let graphNodeText = _this.drawNodeText(nodes)
      // 更新按钮组
      let graphNodeButtonGroup = _this.drawButtonGroup(nodes)
      // 更新连线
      let graphLink = _this.drawLink(links)
      // 更新连线文字
      let graphLinkText = _this.drawLinkText(links)

      // tick 每到一个时刻都需要调用方法来更新节点的坐标
      _this.simulation.nodes(nodes).alphaTarget(0).alphaDecay(0.03).on('tick', ticked)
      _this.simulation.force('link').links(links)
      _this.simulation.force('center', d3.forceCenter(_this.width / 2, _this.height / 2))
      _this.simulation.alpha(1).restart()

      function ticked() {
        // 更新连线坐标
        graphLink
            .attr('x1', function (d) {
              return d.source.x
            })
            .attr('y1', function (d) {
              return d.source.y
            })
            .attr('x2', function (d) {
              return d.target.x
            })
            .attr('y2', function (d) {
              return d.target.y
            })
        // 刷新连接线上的文字位置
        graphLinkText
            .attr('x', function (d) {
              if (!d.source.x || !d.target.x) return 0
              let x = (parseFloat(d.source.x) + parseFloat(d.target.x)) / 2
              return x
            })
            .attr('y', function (d) {
              if (!d.source.y || !d.target.y) return 0
              let y = (parseFloat(d.source.y) + parseFloat(d.target.y)) / 2
              return y
            })
        // 更新节点坐标
        graphNode
            .attr('cx', function (d) {
              return d.x
            })
            .attr('cy', function (d) {
              return d.y
            })
        // 更新节点操作按钮组坐标
        graphNodeButtonGroup
            .attr('cx', function (d) {
              return d.x
            })
            .attr('cy', function (d) {
              return d.y
            })
            .attr('transform', function (d) {
              return 'translate(' + d.x + ',' + d.y + ') scale(1)'
            })
        // 更新文字坐标
        graphNodeText
            .attr('x', function (d) {
              return d.x
            })
            .attr('y', function (d) {
              return d.y
            })
      }

      // 鼠标滚轮缩放
      // 最小缩放到0.1，最大扩大到4倍
      _this.zoom = d3.zoom().scaleExtent([0.1, 4]).on('zoom', _this.zoomed)
      _this.svg.call(_this.zoom)
      _this.svg.on('dblclick.zoom', null)

      // 为按钮组绑定事件
      _this.svg.selectAll(".buttongroup").on('click', function (d, i) {
        if (_this.nodebuttonAction) {
          switch (_this.nodebuttonAction) {
            case "EDIT":
              _this.isEditingNode = true;
              _this.txx = d.x;
              _this.tyy = d.y;
              _this.selectnodeid = d.id;
              for (let j = 0; j < _this.graph.nodes.length; j++) {
                if (_this.graph.nodes[j].id == _this.selectnodeid) {
                  _this.EditingNodeEntity.id = _this.selectnodeid;
                  _this.EditingNodeEntity.name = _this.graph.nodes[j].name;
                  _this.EditingNodeEntity.color = _this.graph.nodes[j].color;
                  _this.EditingNodeEntity.textColor = _this.graph.nodes[j].textColor;
                  _this.EditingNodeEntity.strokeColor = _this.graph.nodes[j].strokeColor;
                  _this.isEditingNode = true;
                  _this.EditNodeDialogVisible = true;
                  break;
                }
              }
              break;
            case "LINK":
              _this.isAddinglink = true;
              _this.isCancelOperationShow = true;
              _this.cancelOperationMessage = '取消添加连线';
              d3.select('.grid').style("cursor", "pointer");
              _this.selectsourcenodeid = d.id;
              break;
            case "DELETE":
              _this.selectnodeid = d.id;
              let out_buttongroup_id = '.out_buttongroup_' + i;
              _this.deleteNode(out_buttongroup_id);
              break;
          }
        }
      })

      // 按钮事件绑定
      _this.svg.selectAll(".action_edit").on("click", function (d) {
        _this.nodebuttonAction = 'EDIT';
      });
      _this.svg.selectAll(".action_link").on("click", function (d) {
        _this.nodebuttonAction = 'LINK';
      });
      _this.svg.selectAll(".action_delete").on("click", function (d) {
        _this.nodebuttonAction = 'DELETE';
      });
    },
    // 建立实体，实体，关系三元组
    // 返回所有节点信息和所有三元组
    formatData() {
      let _this = this
      let links = _this.graph.links
      let nodes = _this.graph.nodes
      nodes.forEach(function (node) {
        if (typeof (node.fx) === 'undefined' || node.fx === '') node.fx = null
        if (typeof (node.fy) === 'undefined' || node.fy === '') node.fy = null
        if (typeof (node.fx) === 'string') node.fx = parseFloat(node.fx)
        if (typeof (node.fy) === 'string') node.fy = parseFloat(node.fy)
        if (typeof (node.color) === 'undefined' || node.color === '') node.color = _this.DefaultNodeColor
        if (typeof (node.textColor) === 'undefined' || node.textColor === '') node.textColor = _this.DefaultNodeTextColor
        if (typeof (node.strokeColor) === 'undefined' || node.strokeColor === '') node.strokeColor = _this.DefaultNodeStrokeColor
      })
      let resLinks = []
      links.forEach(function (link) {
        let sourceNode = nodes.filter(function (node) {
          return node.id == link.sourceId
        })[0]
        if (!sourceNode) return
        let targetNode = nodes.filter(function (node) {
          return node.id == link.targetId
        })[0]
        if (!targetNode) return
        if (typeof (link.color) === 'undefined' || link.color === '') link.color = _this.DefaultLinkColor
        if (typeof (link.textColor) === 'undefined' || link.textColor === '') link.textColor = _this.DefaultLinkTextColor
        resLinks.push({source: sourceNode.id, target: targetNode.id, lk: link})
      })
      let data = {}
      data.nodes = nodes
      data.links = resLinks
      return data
    },
    // 制作节点工具栏
    drawToolButton() {
      let _this = this
      let nodeButtonGroup = _this.svg.append('defs')
      let nodebtg = nodeButtonGroup.append('g').attr("id", "out_circle")

      // 制作饼型工具栏，这里的pie是一个函数
      let pie = d3.pie().value(function (d) {
        return d.value
      })
      let piedata = pie(_this.toolbarData)

      let buttonGroupEnter = nodebtg
          .selectAll('.buttongroup')
          .data(piedata)
          .enter()
          // 这里传入的参数实际上是它本身，下同
          .append('g')
          .attr('class', function (d) {
            return 'action_' + d.data.code
          })


      // 绘制同心圆
      let arc = d3.arc().innerRadius(_this.defaultR).outerRadius(_this.defaultR + 30)
      // let arcHover=d3.arc().innerRadius(_this.defaultR).outerRadius(_this.defaultR + 40)
      // 设置工具栏形状
      buttonGroupEnter
          .append('path')
          // d属性代表路径，通过描述路径绘制出svg图像
          .attr('d', function (d) {
            return arc(d)
          })
          // .attr("style", "pointer-events: auto;")
          .attr('fill', _this.DefaultButtonGroupColor) // 填充
          .style('opacity', 0.6)
          .attr('stroke', _this.DefaultButtonGroupStrokeColor) // 轮廓
          .attr('stroke-width', 2)
      // .on("mouseover", function(d) {
      //   d3.select(this).attr('fill',_this.DefaultButtonGroupColorHover)
      //   console.log('mouseover')
      // })
      // .on("mouseout", function(d) {
      //   d3.select(this).attr('fill',_this.DefaultButtonGroupColor)
      //   console.log('mouseout')
      // })


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
        console.log('单击节点，id：' + d.id)
        let out_buttongroup_id = '.out_buttongroup_' + d.id
        let selectBtnGroup = d3.select(out_buttongroup_id)._groups[0][0]
        // 单击节点，改变节点工具栏显示状态
        _this.svg.selectAll('use').classed('notshow', true)
        // classed 是为对象增加class属性而不覆盖原有class属性
        _this.svg.selectAll(out_buttongroup_id).classed('notshow', false)
        // 如果正在添加联系
        if (_this.isAddinglink) {
          _this.selecttargetnodeid = d.id
          if (_this.selectsourcenodeid == _this.selecttargetnodeid) {
            d3.select('.grid').style("cursor", "")
            _this.isAddinglink = false
            _this.isCancelOperationShow = false
            _this.cancelOperationMessage = ''
            _this.$message({
              type: 'error',
              message: '连接出错：不支持节点自身连接自身！'
            })
            event.stopPropagation()
            return
          }
          for (let i = 0; i < _this.graph.links.length; i++) {
            if ((_this.graph.links[i].sourceId == _this.selectsourcenodeid &&
                _this.graph.links[i].targetId == _this.selecttargetnodeid) ||
                (_this.graph.links[i].sourceId == _this.selecttargetnodeid &&
                    _this.graph.links[i].targetId == _this.selectsourcenodeid)) {
              d3.select('.grid').style("cursor", "")
              _this.isAddinglink = false
              _this.isCancelOperationShow = false
              _this.cancelOperationMessage = ''
              _this.$message({
                type: 'error',
                message: '连接出错：两节点之间已经存在一条连接！'
              })
              event.stopPropagation()
              return
            }
          }
          d3.select('.grid').style("cursor", "");
          _this.isAddinglink = false
          _this.isCancelOperationShow = false
          _this.cancelOperationMessage = ''
          _this.createLink()
          d.fixed = false

        }
        // 阻止事件冒泡到父元素
        event.stopPropagation()
      })
      nodeEnter.on('dblclick', function (d) {
        console.log('双击节点，id：' + d.id)
        event.stopPropagation()
      })
      // 绑定鼠标移入事件
      nodeEnter.on('mouseenter', function (d) {
        console.log('鼠标移入节点，id：' + d.id)
        // 改变边缘宽度
        d3.select(this).style('stroke-width', '6')
        event.stopPropagation()
      })
      // 绑定鼠标移出事件
      nodeEnter.on('mouseleave', function (d) {
        console.log('鼠标移出节点，id：' + d.id)
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
          return n.sourceId == d.id || n.targetId == d.id
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
            .selectAll('line')
            .style('stroke-opacity', function (link) {
              if (link.lk.targetId == d.id || link.lk.sourceId == d.id) {
                return 1.0
              }
            })
        // 隐藏所有连线文字
        d3.selectAll('.linetext').style('fill-opacity', 0.1)
        // 显示相关连线文字
        _this.qaGraphLinkText
            .selectAll('.linetext')
            .style('fill-opacity', function (link) {
              if (link.lk.targetId == d.id || link.lk.sourceId == d.id) {
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
          .style('fill', function (d) {
            if (d.textColor) return d.textColor
            else return _this.DefaultNodeTextColor
          })
          .attr('class', 'nodetext')
          .attr('dy', '3.6em')
          .attr('font-family', 'Microsoft YaHei')
          .attr('font-size', 16)
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
      d3.selectAll('.nodebutton >g').remove()
      let nodeButton = _this.nodebuttonGroup
          .selectAll('.nodebutton')
          .data(nodes, function (d) {
            return d.id
          })
      nodeButton.exit().remove()
      let nodeButtonEnter = nodeButton
          .enter()
          .append('g')
          .append('use') // 为每个节点组添加一个 use 子元素
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
            // if (!d.r) {
            //   return '#out_circle_' + _this.defaultR
            // }
            // return '#out_circle_' + d.r
            return '#out_circle'
          })
          .attr('class', function (d) {
            return 'buttongroup out_buttongroup_' + d.id
          })
          .classed('notshow', true)
      nodeButton = nodeButtonEnter.merge(nodeButton)
      return nodeButton
    },
    // 绘制关系
    drawLink(links) {
      let _this = this
      let link = this.qaGraphLink.selectAll('line').data(links, function (d) {
        return d.id
      })
      link.exit().remove()
      // 设置关系样式
      let linkEnter = link.enter().append('line')

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
      linkEnter.on('dblclick', function (d) {
        _this.selectrelationid = d.lk.id
        _this.isEditingLink = true
        _this.EditingLinkEntity.name = d.lk.name
        _this.EditingLinkEntity.id = d.lk.id
        _this.EditingLinkEntity.sourceId = d.lk.sourceId
        _this.EditingLinkEntity.targetId = d.lk.targetId
        _this.EditingLinkEntity.color = d.lk.color
        _this.EditingLinkEntity.textColor = d.lk.textColor
        _this.EditLinkDialogVisible = true
      })
      link = linkEnter.merge(link)
      link.attr('class', 'link')
          .attr('stroke-width', '2')
          .attr('stroke', function (d) {
            if (d.lk.color) return d.lk.color
            else return _this.DefaultLinkColor
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
      // 设置关系文字样式
      let linkTextEnter = linkText.enter().append('text')

      linkText = linkTextEnter.merge(linkText).text(function (d) {
        if (d.lk.name) return d.lk.name
        else return '联系'
      })

      linkText
          .attr('class', 'linetext')
          .style('fill', function (d) {
            if (d.lk.textColor) return d.lk.textColor
            else return _this.DefaultLinkTextColor
          })
          .append('textPath')
          .attr("startOffset", "60%")
          .attr("text-anchor", "middle")
          // .attr("xlink:href", function (d) {
          //   return "#invis_" + d.lk.sourceId + "-" + d.lk.name + "-" + d.lk.targetId;
          // })
          .style('font-family', 'Microsoft YaHei')
          .style('font-size', '14px')
          .text(function (d) {
            if (d.lk.name) return d.lk.name
            else return '联系'
          })
      return linkText
    },
    dragStart(d) {
      if (!d3.event.active) this.simulation.alphaTarget(0.8).restart()
      d.fx = d.x
      d.fy = d.y
    },
    dragging(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    },
    dragEnd(d) {
      if (!d3.event.active) this.simulation.alphaTarget(0)
      d.fx = d3.event.x
      d.fy = d3.event.y
    },
    // 滚轮zoom事件
    zoomed() {
      d3.selectAll('.node').attr('transform', d3.event.transform)
      d3.selectAll('.nodetext text').attr('transform', d3.event.transform)
      d3.selectAll('.line').attr('transform', d3.event.transform)
      d3.selectAll('.linetext text').attr('transform', d3.event.transform)
      d3.selectAll('.nodebutton').attr('transform', d3.event.transform)
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
      this.svg.call(this.zoom.transform, d3.zoomIdentity)
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
    // 创建node的id
    nodeIdBuilder() {
      if (this.graph.nodes.length == 0) return '0'
      let id = 0
      let existedIds = []
      this.graph.nodes.forEach(function (node) {
        existedIds.push(node.id)
      })
      existedIds.sort((num1, num2) => {
        return num2 - num1
      })
      id = Number(existedIds[0]) + 1
      return id.toString()
    },
    // 创建link的id
    linkIdBuilder() {
      if (this.graph.links.length == 0) return '0'
      let id = 0
      let existedIds = []
      this.graph.links.forEach(function (link) {
        existedIds.push(link.id)
      })
      existedIds.sort((num1, num2) => {
        return num2 - num1
      })
      id = Number(existedIds[0]) + 1
      return id.toString()
    },
    // 清空记录关系
    emptyLinkEntity() {
      this.EditingLinkEntity = {
        id: '',
        sourceId: '',
        targetId: '',
        name: '',
        color: '',
        textColor: '',
      }
    },
    // 清空记录节点
    emptyNodeEntity() {
      this.EditingNodeEntity = {
        id: '',
        name: '',
        color: '',
        strokeColor: '',
        textColor: '',
      }
    },
    cancelLinkEdit() {
      this.emptyLinkEntity()
      this.selectrelationid = ''
      this.isEditingLink = false
      this.EditLinkDialogVisible = false
    },
    cancelNodeEdit() {
      this.emptyNodeEntity()
      this.selectnodeid = ''
      this.isEditingNode = false
      this.EditNodeDialogVisible = false
    },
    saveLinkEdit() {
      this.updateLinkInfo()
      this.emptyLinkEntity()
      this.selectrelationid = ''
      this.isEditingLink = false
      this.EditLinkDialogVisible = false
      this.$message({
        type: 'success',
        message: '保存更改成功！'
      })
    },
    saveNodeEdit() {
      this.updateNodeInfo()
      this.emptyNodeEntity()
      this.selectnodeid = ''
      this.isEditingNode = false
      this.EditNodeDialogVisible = false
      this.$message({
        type: 'success',
        message: '保存更改成功！'
      })
    },
    // 删除节点及相关联系
    deleteNode(out_buttongroup_id) {
      let _this = this
      _this.$confirm('该操作不可撤销', '将要删除节点和所有以该节点为源或目标的关系，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 移除节点旁工具栏
        _this.svg.selectAll(out_buttongroup_id).remove()
        // 移除与节点相关的关系
        for (let i = 0; i < _this.graph.links.length; i++) {
          if (_this.graph.links[i].sourceId == _this.selectnodeid ||
              _this.graph.links[i].targetId == _this.selectnodeid) {
            _this.graph.links.splice(i, 1)
            i = i - 1
          }
        }
        // 移除节点
        for (let i = 0; i < _this.graph.nodes.length; i++) {
          if (_this.graph.nodes[i].id == _this.selectnodeid) {
            _this.graph.nodes.splice(i, 1)
            break;
          }
        }
        _this.updateGraph()
        _this.selectnodeid = ''
        _this.$message({
          type: 'success',
          message: '删除节点成功！'
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '操作已取消'
        })
      })
    },
    // 当添加节点按钮被按下，鼠标样式改变为+
    // 当鼠标再次在界面中点击，创建节点，鼠标样式恢复
    addOneNode() {
      this.isAddingNode = true
      this.cancelOperationMessage = '取消添加节点'
      this.isCancelOperationShow = true
      d3.select('.grid').style("cursor", "crosshair")
    },
    // 添加节点方法
    createNode() {
      let _this = this
      let newNode = {}
      newNode.name = '节点'
      newNode.id = _this.nodeIdBuilder()
      newNode.x = _this.txx
      newNode.y = _this.tyy
      newNode.fx = _this.txx
      newNode.fy = _this.tyy
      _this.graph.nodes.push(newNode)
      _this.updateGraph()
      _this.isCancelOperationShow = false
      _this.cancelOperationMessage = ''
      _this.isAddingNode = false
    },
    // 删除联系
    deleteLink() {
      let _this = this
      _this.$confirm('该操作不可撤销', '将要删除该联系，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < _this.graph.links.length; i++) {
          if (_this.graph.links[i].id == _this.selectrelationid) {
            _this.graph.links.splice(i, 1)
            break
          }
        }
        _this.updateGraph()
        _this.selectrelationid = ''
        _this.isEditingLink = false
        _this.emptyLinkEntity()
        _this.EditLinkDialogVisible = false
        _this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch(() => {
        _this.selectrelationid = ''
        _this.isEditingLink = false
        _this.emptyLinkEntity()
        _this.EditLinkDialogVisible = false
        _this.$message({
          type: 'info',
          message: '操作已取消'
        })
      })
    },
    // 添加联系
    createLink() {
      let _this = this
      let newShip = {}
      newShip.sourceId = _this.selectsourcenodeid
      newShip.targetId = _this.selecttargetnodeid
      newShip.id = _this.linkIdBuilder()
      newShip.name = '联系'
      _this.graph.links.push(newShip)
      _this.updateGraph()
      _this.isAddinglink = false
      _this.selectsourcenodeid = '';
      _this.selecttargetnodeid = '';
    },
    // 更改节点信息
    updateNodeInfo() {
      let _this = this
      for (let i = 0; i < _this.graph.nodes.length; i++) {
        if (_this.selectnodeid == _this.graph.nodes[i].id) {
          _this.graph.nodes[i].name = _this.EditingNodeEntity.name
          _this.graph.nodes[i].color = _this.EditingNodeEntity.color
          _this.graph.nodes[i].textColor = _this.EditingNodeEntity.textColor
          _this.graph.nodes[i].strokeColor = _this.EditingNodeEntity.strokeColor
          break
        }
      }
      _this.updateGraph()
    },
    // 更改关系信息
    updateLinkInfo() {
      let _this = this
      for (let i = 0; i < _this.graph.links.length; i++) {
        if (_this.selectrelationid == _this.graph.links[i].id) {
          _this.graph.links[i].name = _this.EditingLinkEntity.name
          _this.graph.links[i].color = _this.EditingLinkEntity.color
          _this.graph.links[i].textColor = _this.EditingLinkEntity.textColor
          break
        }
      }
      _this.updateGraph()
    },
    // 保存为图片
    exportImage() {
      html2canvas(document.querySelector(".grid")).then(function (canvas) {
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');  //将画布内的信息导出为png图片数据
        var timestamp = Date.parse(new Date());
        a.download = timestamp;  //设定下载名称
        a.click(); //点击触发下载
      });
    },
    // 导出为Json
    exportJson() {
      // todo
      axios.get('/saveAsJson', {
        responseType: 'arraybuffer'
      }).then((response) => {
        const blob = new Blob([response.data], {type: 'application/xml;charset=utf-8'});
        const fileName = `${new Date().valueOf()}.json`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      })
    },
    // 导出为XML
    exportXML() {
      // todo
    }
  }
}
</script>

<style>
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
}

.ctwh-dibmr {
  display: inline-block;
}

.ss-d {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  border-radius: 50%;
  background: #dedede;
}

.sd1 {
  width: 30px;
  height: 30px;
}

.sd2 {
  width: 26px;
  height: 26px;
}

.sd3 {
  width: 20px;
  height: 20px;
}

.sd4 {
  width: 16px;
  height: 16px;
}

.sd-active {
  background: #08aefc !important;
}

.cancelBox {
  margin: 0 auto;
}

.leftBox {
  margin-left: 15%;
}

.rightBox {
  margin-right: 15%;
}

.tools {
  margin-left: 30px;
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
  stroke-dasharray: 0 0 0 0;
  stroke-dashoffset: 10;
  transition: all ease 0.1s;
}

.nodetext:hover {
  stroke-dashoffset: 0;
  stroke-dasharray: 100;
}

/*dialog宽度调整*/
.customWidth {
  width: 28%;
}

/*form-item样式*/
.lineColor {
  width: 80%;
  float: left;
}

.withoutColor {
  width: 97%;
  float: left;
}

/*path.hover{*/
/*  background-color: rgba(0, 0, 0, .5);*/
/*}*/
/*#kg_container:fullscreen{*/
/*  background-color: rgba(255,255,255,0);*/
/*}*/
</style>