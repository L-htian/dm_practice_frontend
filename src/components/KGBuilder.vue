<template>
  <div>
    <div id="grid_container" style="float:left">
      <div id="grid"></div>
    </div>
  </div>
  <div class="svg-set-box clearfix">
    <div class="ctwh-dibmr">
      <ul class="toolbar">
        <li>
          <a href="javascript:;" @click="addOneNode">
            <span><i class="el-icon-plus"></i>添加节点</span>
          </a>
        </li>
        <li>
          <a href="javascript:;">
            <span><i class="el-icon-picture-outline"></i>保存为图片</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="ctwh-dibmr" style="float: right">
      <ul class="toolbar">
        <li>
          <a href="javascript:;" @click="zoomIn">
            <span><i class="el-icon-zoom-in"></i>放大</span>
          </a>
        </li>
        <li>
          <a href="javascript:;" @click="zoomOut">
            <span><i class="el-icon-zoom-out"></i>缩小</span>
          </a>
        </li>
        <li>
          <a href="javascript:;" @click="refresh">
            <span><i class="el-icon-refresh-right"></i>还原</span>
          </a>
        </li>
        <li>
          <a
              v-if="!isFullscreen"
              id="fullScreenBtn"
              href="javascript:;"
              @click="showFull"
          >
            <span><i class="el-icon-full-screen"></i>全屏</span>
          </a>
          <a
              v-else
              id="cancelFullScreenBtn"
              href="javascript:;"
              @click="exitFullScreen"
          >
            <span><i class="el-icon-full-screen"></i>退出全屏</span>
          </a>
        </li>
      </ul>
    </div>
    <el-dialog title="联系选项" :visible.sync="EditLinkDialogVisible">
      <el-form>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.id"></el-input>
        </el-form-item>
        <el-form-item label="源节点id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.sourceId "></el-input>
        </el-form-item>
        <el-form-item label="目标节点id" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.targetId"></el-input>
        </el-form-item>
        <el-form-item label="联系名" :label-width="formLabelWidth">
          <el-input :disabled="false" v-model="EditingLinkEntity.name"></el-input>
        </el-form-item>
        <el-form-item label="联系线条颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.color"></el-input>
          <el-color-picker v-model="EditingLinkEntity.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="联系名颜色" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="EditingLinkEntity.textColor"></el-input>
          <el-color-picker v-model="EditingLinkEntity.textColor"></el-color-picker>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import * as d3 from '../static/js/d3.v4.min'
import $ from 'jquery'
import '../static/js/index'

export default {
  name: "KGBuilder",
  props: ['pid'],
  data() {
    return {
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
      isDeletingLink: false,
      txx: {},
      tyy: {},
      // 默认颜色
      DefaultButtonGroupColor: '#E6A23C',
      DefaultButtonGroupStrokeColor: '#fff',
      DefaultButtonGroupTextColor: '#6CB7ED',
      DefaultNodeStrokeColor: '#A4ED6C',
      DefaultNodeTextColor: '#333',
      DefaultNodeColor: '#ff8373',
      DefaultLinkColor: '#a5ca34',
      DefaultLinkActiveColor: '#ff9e9e',
      DefaultLinkTextColor: '#875034',
      theme: 0,
      // 是否正在加载
      loading: false,
      // 组件的宽
      width: 1000,
      // 组件的长
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
    this.addArrowMaker()
    this.initJQueryEvents()
    this.initGraph()
  },
  created() {
  },
  watch: {},
  methods: {
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
          .force('charge', d3.forceManyBody().strength(-1500)) // 节点之间的引力
          .force('link', d3.forceLink().distance(60).id(function (d) {
            return d.id
          })) // 节点之间的弹力
          .force('collide', d3.forceCollide().strength(-30)) // 节点碰撞力，防止节点重叠
          .force('center', d3.forceCenter(this.width / 2, this.height / 2)) // 向心力，节点围绕在某一点旁
      // 元素g是用来组合对象的容器。添加到g元素上的变换会应用到其所有的子元素上。
      // 添加到g元素的属性会被其所有的子元素继承。
      // 此外，g元素也可以用来定义复杂的对象，之后可以通过<use>元素来引用它们。
      this.qaGraphLink = this.svg.append('g').attr('class', 'line')
      this.qaGraphLinkText = this.svg.append('g').attr('class', 'linetext')
      this.qaGraphNode = this.svg.append('g').attr('class', 'node')
      this.qaGraphNodeText = this.svg.append('g').attr('class', 'nodetext')
      this.nodebuttonGroup = this.svg.append('g').attr('class', 'nodebutton')
      this.svg.on('click', function () {
        d3.selectAll('.buttongroup').classed('notshow', true)
      }, false)
    },
    // 初始化知识图谱
    // todo 传入不同的图文件，逻辑放入api
    initGraph() {
      let _this = this
      axios.get('/static/data.json', {}).then(function (response) {
        let data = response.data
        _this.graph.nodes = data.node
        _this.graph.links = data.relationship
        _this.updateGraph()
      })
    },
    // 制作箭头
    addArrowMaker() {
      let arrowMarker = this.svg
          .append('marker')
          .attr('id', 'arrow')
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', '12') //
          .attr('markerHeight', '12')
          .attr('viewBox', '0 0 12 12')
          .attr('refX', '38')
          .attr('refY', '6')
          .attr('orient', 'auto')
      let arrowPath = 'M2,2 L10,6 L2,10 L6,6 L2,2' // 定义箭头形状
      arrowMarker.append('path').attr('d', arrowPath).attr('fill', '#ccc')
    },
    // 更新知识图谱
    updateGraph() {
      let _this = this
      let data = _this.formatData()
      let nodes = data.nodes
      let links = data.links
      // 定义按钮组引用的use元素
      _this.drawToolButton()
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
      _this.simulation.nodes(nodes).alphaTarget(0).alphaDecay(0.05).on('tick', ticked)

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

      _this.simulation.force('link').links(links)
      _this.simulation.force('center', d3.forceCenter(_this.width / 2, _this.height / 2))
      _this.simulation.alpha(1).restart()
      // 鼠标滚轮缩放
      // 最小缩放到0.1，最大扩大到4倍
      _this.zoom = d3.zoom().scaleExtent([0.1, 4]).on('zoom', _this.zoomed)
      _this.svg.call(_this.zoom)
      // todo 静止双击缩放
      _this.svg.on('dblclick.zoom', null)

      // 为按钮组绑定事件
      _this.svg.selectAll(".buttongroup").on('click', function (d, i) {
        if (_this.nodebuttonAction) {
          switch (_this.nodebuttonAction) {
            case "EDIT":
              _this.isEditingNode = true;
              _this.propactiveName = 'propedit';
              _this.txx = d.x;
              _this.tyy = d.y;
              break;
            case "LINK":
              _this.isAddinglink = true;
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
        if (typeof node.fx === 'undefined' || node.fx === '') node.fx = null
        if (typeof node.fy === 'undefined' || node.fy === '') node.fy = null
        if (typeof node.fx === 'string') node.fx = parseFloat(node.fx)
        if (typeof node.fy === 'string') node.fy = parseFloat(node.fy)
      })
      let resLinks = []
      links.forEach(function (link) {
        let sourceNode = nodes.filter(function (node) {
          return node.id === link.sourceId
        })[0]
        if (!sourceNode) return
        let targetNode = nodes.filter(function (node) {
          return node.id === link.targetId
        })[0]
        if (!targetNode) return
        resLinks.push({source: sourceNode.id, target: targetNode.id, link: link})
      })
      let data = {}
      data.nodes = nodes
      data.links = resLinks
      return data
    },
    // 制作节点工具栏
    drawToolButton() {
      let _this = this
      // 删除所有为节点自定义的按钮组
      d3.selectAll('svg >defs').remove()
      let nodes = _this.graph.nodes
      // 制作饼型工具栏，这里的pie是一个函数
      let pie = d3.pie().value(function (d) {
        return d.value
      })
      let piedata = pie(_this.toolbarData)
      let nodeButtonGroup = _this.svg.append('defs')
      // 节点半径数组
      let nodeRArray = []
      nodes.forEach(function (node) {
        if (!node.r) {
          node.r = _this.defaultR
        }
        // 按半径分别定义每种按钮组的图标
        if (nodeRArray.indexOf(node.r) == -1) {
          nodeRArray.push(node.r)
          // 为每种半径定制一种按钮组和一个特有的id
          let nodebtg = nodeButtonGroup.append('g').attr('id', 'out_circle_' + node.r)
          let buttonGroupEnter = nodebtg
              .selectAll('.buttongroup')
              .data(piedata)
              .enter()
              // 这里传入的参数实际上是它本身，下同
              .append('g').attr('class', function (d) {
                return 'action_' + d.data.code
              })
          // 绘制同心圆
          let arc = d3.arc().innerRadius(node.r).outerRadius(node.r + 30)
          // 设置工具栏形状
          buttonGroupEnter
              .append('path')
              // d属性代表路径，通过描述路径绘制出svg图像
              .attr('d', function (d) {
                return arc(d)
              })
              .attr('fill', _this.DefaultButtonGroupColor) // 填充
              .style('opacity', 0.6)
              .attr('stroke', _this.DefaultButtonGroupStrokeColor) // 轮廓
              .attr('stroke-width', 1)
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
        console.log('单击节点，id：' + d.id)
        let out_buttongroup_id = '.out_buttongroup_' + d.id
        let selectBtnGroup = d3.select(out_buttongroup_id)._groups[0][0]
        // 单击节点，改变节点工具栏显示状态
        if (selectBtnGroup.classList.contains('notshow')) {
          _this.svg.selectAll('.buttongroup').classed('notshow', true)
          // classed 是为对象增加class属性而不覆盖原有class属性
          d3.select(out_buttongroup_id).classed('notshow', false)
        } else {
          d3.select(out_buttongroup_id).classed('notshow', true)
        }
        // 如果正在添加联系
        if (_this.isAddinglink) {
          _this.selecttargetnodeid = d.id
          if (_this.selectsourcenodeid === _this.selecttargetnodeid) {
            event.stopPropagation()
            return
          }
          _this.createLink()
          d.fixed = false
        }
        // 阻止事件冒泡到父元素
        event.stopPropagation()
      })
      // todo 绑定双击事件，暂时为空
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
            .style('stroke-opacity', function (node) {
              if (node.link.targetId === d.id) {
                return 1.0
              }
            })
        // 隐藏所有连线文字
        d3.selectAll('.linetext').style('fill-opacity', 0.1)
        // 显示相关连线文字
        _this.qaGraphLinkText
            .selectAll('.linetext')
            .style('fill-opacity', function (node) {
              if (node.link.targetId === d.id) {
                return 1.0
              }
            })
      })
      // 绑定拖动事件
      nodeEnter.call(
          d3.drag()
              .on('start', _this.dragStart())
              .on('drag', _this.dragging())
              .on('end', _this.dragEnd())
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
              .on('start', _this.dragStart())
              .on('drag', _this.dragging())
              .on('end', _this.dragEnd())
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
          .attr('xlink:href', function (d) {
            if (!d.r) {
              return '#out_circle_' + _this.defaultR
            }
            return '#out_circle_' + d.r
          }) //  指定 use 引用的内容
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
      let linkEnter = link
          .enter()
          .append('line')
          .attr('class', 'link')
          .attr('stroke-width', 1)
          .attr('stroke', function (d) {
            if (d.color) return d.link.color
            else return _this.DefaultLinkColor
          })
          .attr('marker-end', 'url(#arrow)') // 箭头
      linkEnter.on('mouseenter', function () {
        d3.select(this)
            .style('stroke-width', '6')
            .attr('stroke', _this.DefaultLinkActiveColor)
            .attr('marker-end', 'url(#arrow)')
      })
      linkEnter.on('mouseleave', function () {
        d3.select(this)
            .style('stroke-width', '1')
            .attr('stroke', function (d) {
              if (d.color) return d.link.color
              else return _this.DefaultLinkColor
            })
            .attr('marker-end', 'url(#arrow)')
      })
      linkEnter.on('dblclick', function (d) {
        _this.selectrelationid = d.link.id
        // todo 双击连线修改
      })
      link = linkEnter.merge(link)
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
      let linkTextEnter = linkText
          .enter()
          .append('text')
          .attr('class', 'linetext')
          .style('fill', function (d) {
            if (d.link.textColor) return d.link.textColor
            else return _this.DefaultLinkTextColor
          })
          .append('textPath')
          .attr("startOffset", "50%")
          .attr("text-anchor", "middle")
          .attr("xlink:href", function (d) {
            return "#invis_" + d.link.sourceId + "-" + d.link.name + "-" + d.link.targetId;
          })
          .style('font-family', 'Microsoft YaHei')
          .style('font-size', '14px')
          .text(function (d) {
            if (d.link.name) return d.link.name
            else return '联系'
          })
      linkText = linkTextEnter.merge(linkText).text(function (d) {
        if (d.link.name) return d.link.name
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
      let id = 0
      let existedIds = []
      this.graph.nodes.forEach(function (node) {
        existedIds.push(node.id)
      })
      existedIds.sort((num1, num2) => {
        return num2 - num1
      })
      id = existedIds[0] + 1
      return id.toString()
    },
    // 创建link的id
    linkIdBuilder() {
      let id = 0
      let existedIds = []
      this.graph.links.forEach(function (link) {
        existedIds.push(link.id)
      })
      existedIds.sort((num1, num2) => {
        return num2 - num1
      })
      id = existedIds[0] + 1
      return id.toString()
    },
    // 删除节点及相关联系
    deleteNode(out_buttongroup_id) {
      let _this = this
      _this.$confirm({
        title: '将要删除节点和所有以该节点为源或目标的关系，是否继续？',
        content: '该操作不可撤销',
        okText: '确定',
        okType: 'warning',
        cancelText: '取消',
        onOk() {
          // 移除节点旁工具栏
          _this.svg.selectAll(out_buttongroup_id).remove()
          // 移除与节点相关的关系
          for (let i = 0; i < _this.graph.links.length; i++) {
            if (_this.graph.links[i].sourceId === _this.selectnodeid ||
                _this.graph.links[i].targetId === _this.selectnodeid) {
              _this.graph.links.splice(i, 1)
              i = i - 1
            }
          }
          // 移除节点
          for (let i = 0; i < _this.graph.nodes.length; i++) {
            if (_this.graph.nodes[i].id === _this.selectnodeid) {
              _this.graph.node.splice(i, 1)
              break;
            }
          }
          _this.updateGraph()
          _this.selectnodeid = ''
          _this.$message({
            type: 'success',
            message: '删除节点成功！'
          })
        },
        onCancel() {
          _this.$message({
            type: 'success',
            message: '操作已取消'
          })
        }
      })
    },
    // 当添加节点按钮被按下，鼠标样式改变为+
    // 当鼠标再次在界面中点击，创建节点，鼠标样式恢复
    addOneNode() {
      this.isAddingNode = true
      d3.select('.grid').style("cursor", "crosshair")
    },
    // 添加节点方法
    createNode() {
      let _this = this
      let newNode = {}
      newNode.name = '名称'
      newNode.id = _this.nodeIdBuilder()
      newNode.x = _this.txx
      newNode.y = _this.tyy
      newNode.fx = _this.txx
      newNode.fy = _this.tyy
      _this.graph.nodes.push(newNode)
      _this.updateGraph()
      _this.isAddingNode = false
    },
    // 删除联系
    deleteOneLink() {
      this.isDeletingLink = true
      d3.select()
    },
    deleteLink() {
      let _this = this
      _this.$confirm({
        title: '将要删除该联系，是否继续？',
        content: '该操作不可撤销',
        okText: '确定',
        okType: 'warning',
        cancelText: '取消',
        onOk() {
          for (let i = 0; i < _this.graph.links.length; i++) {
            if (_this.graph.links[i].id === _this.selectrelationid) {
              _this.graph.links.splice(i, 1)
              break
            }
          }
          _this.updateGraph()
          _this.selectrelationid = ''
          _this.isDeletingLink = false
        },
        onCancel() {
          _this.$message({
            type: 'success',
            message: '操作已取消'
          })
        }
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
    // 更改节点名称
    updateNodeName() {
      // todo
    },
    // 更改关系名称
    updateLinkName() {
      // todo
    },
  }
}
</script>

<style scoped>
.svg-set-box {
  height: 46px;
  line-height: 46px;
  padding-left: 15px;
  color: #7f7f7f;
  /* background: #f7f7f7; */
  position: absolute;
  bottom: 0;
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

.toolbar {
  margin-left: 150px;
  margin-right: 15px;
  line-height: 18px;
}

ul,
li {
  list-style: none;
}

.toolbar li {
  float: left;
  width: 60px;
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
</style>