<template>
  <div>
    <div id="grid_container" style="float:left">
      <div id="grid"></div>
    </div>
  </div>
  <div class="svg-set-box clearfix">
    <div class="ctwh-dibmr">
      <span>显示范围:</span>
      <a
          :key="index"
          v-for="(m, index) in pagesizelist"
          @click="setmatchsize(m, this)"
          href="javascript:void(0)"
          :class="[m.isActive ? 'sd-active' : '', 'ss-d sd' + (index + 1)]"
      ></a>
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
  </div>
</template>

<script>
import axios from 'axios'
import * as d3 from 'd3'
import $ from 'jquery'
import '../static/js/index'

export default {
  name: "KGBuilder",
  props: ['pid'],
  data() {
    return {
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
      defaultR: 30,
      colorList: [
        '#ff8373',
        '#f9c62c',
        '#a5ca34',
        '#6fce7a',
        '#70d3bd',
        '#ea91b0',
      ],
      pagesizelist: [
        {size: 100, isActive: false},
        {size: 300, isActive: false},
        {size: 500, isActive: true},
        {size: 1000, isActive: false},
      ],
      // 节点工具栏的内容
      toolbarData: [
        {name: '编辑', value: 1, code: 'edit'},
        {name: '展开', value: 1, code: 'more'},
        {name: '追加', value: 1, code: 'append'},
        {name: '连线', value: 1, code: 'link'},
        {name: '删除', value: 1, code: 'delete'},
      ],
      // 正在选中的节点的id
      selectId: 0,
      nodeRecordList: [],
      nodebuttonAction: '',
    }
  },
  components: {},
  mounted() {
    this.initGraphContainer()
    this.addArrowMaker()
    this.initGraph()
  },
  created() {
  },
  watch: {},
  methods: {
    // 节点示例
    openNode() {
      let _this = this
      let newNodes = [
        {
          flag: '1',
          code: '27301111',
          parentCode: '273',
          grade: '2',
          name: '儒家',
          id: '4617858011',
        },
        {
          code: '273012222',
          flag: '1',
          parentCode: '273',
          grade: '3',
          name: '故事轶闻',
          id: '2636501111',
        }
      ]
      let newShips = [
        {
          sourceId: '273',
          targetId: '2636501111',
          name: '',
          id: '91804213',
        },
        {
          sourceId: '273',
          targetId: '4617858011',
          name: '',
          id: '91804389'
        }
      ]
      _this.graph.nodes = _this.graph.nodes.concat(newNodes)
      _this.graph.links = _this.graph.links.concat(newShips)
      _this.updateGraph()
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
        _this.graph.links = data.relationships
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
              _this.isedit = true;
              _this.propactiveName = 'propedit';
              _this.txx = d.x;
              _this.tyy = d.y;
              break;
            case "MORE":
              _this.getMoreNode();
              break;
            case "APPEND":
              _this.operatetype = 2;
              _this.isbatchcreate = true;
              _this.isedit = false;
              break;
            case "LINK":
              _this.isaddlink = true;
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
      _this.svg.selectAll(".action_more").on("click", function (d) {
        _this.nodebuttonAction = 'MORE';
      });
      _this.svg.selectAll(".action_append").on("click", function (d) {
        _this.nodebuttonAction = 'APPEND';
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
        // 若这个点是中心节点
        if (node.center === 1 || node.center === '1') {
          node.fx = _this.width / 2
          node.fy = _this.height / 2
        }
        if (typeof node.fx === 'undefined' || node.fx === '') node.fx = null
        if (typeof node.fy === 'undefined' || node.fy === '') node.fy = null
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
              .attr('fill', '#E6A23C') // 填充
              .style('opacity', 0.6)
              .attr('stroke', '#6CB7ED') // 轮廓
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
            return '#fff'
          })
              .attr('font-size', 10)
        }
      })
    },
    // 按钮组事件绑定
    bindEventButtonGroup() {
      let _this = this

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
        _this.selectId = d.id
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
      // todo 设置节点样式
      node.style('stroke', function (d) {
        if (d.color) return d.color
        else return '#A4ED6C'
      })
      node.style('stroke-opacity', 0.6)
      node.attr('r', function (d) {
        if (d.r) return d.r
        else return d.index === 0 ? 28 : 20
      })
      node.attr('fill', function (d, i) {
        if (d.imgsrc) {
          let img_w = 77, img_h = 80
          // SVG 允许我们定义以后需要重复使用的图形元素。
          // 建议把所有需要再次使用的引用元素定义在defs元素里面。
          // 这样做可以增加SVG内容的易读性和可访问性。
          // 在defs元素中定义的图形元素不会直接呈现。
          // 你可以在你的视口的任意地方利用 <use>元素呈现这些元素。
          let defs = d3.selectAll('svg >defs')
          // <pattern>是SVG的一个图案填充标签
          // 可以在pattern中定义好图案，然后通过id引用来对某个图形进行填充
          let cat_pattern = defs
              .append('pattern')
              .attr('id', 'catpattern' + i)
              .attr('height', 1)
              .attr('width', 1)
          cat_pattern
              .append('image')
              .attr('x', -(img_w / 2 - d.r))
              .attr('y', -(img_h / 2 - d.r))
              .attr('width', img_w)
              .attr('height', img_h)
              .attr('xlink:href', d.imgsrc)
          return 'url(#catpattern' + i + ')'
        } else {
          if (d.cur === '1') return _this.colorList[0]
          else return _this.colorList[2]
        }
      })
      // 为节点设置title属性
      node.append('title').text(function (d) {
        if (d.name) return d.name
        else return ''
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
      // todo 设置节点文字样式
      nodeText
          .style('fill', function () {
            return '#333'
          })
          .attr('class', 'nodetext')
          .attr('dy', '3.6em')
          .attr('font-family', '宋体')
          .attr('font-size', 16)
          .attr('text-anchor', 'middle')
          .text(function (d) {
            return d.name
          })
      nodeText.append('title').text(function (d) {
        if (d.name) return d.name
        else return ''
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
      // todo 设置关系样式
      let linkEnter = link
          .enter()
          .append('line')
          .attr('class', 'link')
          .attr('stroke-width', 1)
          .attr('stroke', function () {
            return _this.colorList[2]
          })
          .attr('marker-end', 'url(#arrow)') // 箭头
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
      // todo 设置关系文字样式
      let linkTextEnter = linkText
          .enter()
          .append('text')
          .attr('class', 'linetext')
          .style('fill', '#875034')
          .style('font-size', '10px')
          .text(function (d) {
            return d.link.name
          })
      linkText = linkTextEnter.merge(linkText).text(function (d) {
        return d.link.name
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
    // 以下是按钮组事件方法，需要使用到api

    // 获取更多节点事件
    getMoreNode() {
      // todo
    },
    // 删除节点及相关联系
    deleteNode() {
      // todo
    },
    // 添加节点
    createNode(){
      // todo
    },
    // 删除联系
    deleteLink(){
      // todo
    },
    // 添加联系
    createLink() {
      // todo
    },
    // 更改节点名称
    updateNodeName(){
      // todo
    },
    // 更改关系名称
    updateLinkName(){
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