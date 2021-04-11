<template>
  <div class="header">
    <div class="label">
      <img src="@/assets/kojima-logo.png" class="logo" alt="logo" @click="jumpToHome">
      <span class="title" @click="jumpToHome">Kojima Coin</span>
    </div>
    <el-menu
        :default-active="current"
        :key="current"
        class="menu"
        mode="horizontal"
        text-color="#606266"
        active-text-color="#303133"
        style="border-bottom: 2px #dcdfe6"
    >
      <router-link to="/Kojima-Coin/index">
        <el-menu-item index="1">
          <i class="el-icon-house"></i>
          <span>首页</span>
        </el-menu-item>
      </router-link>
      <router-link to="/Kojima-Coin/KGList">
        <el-menu-item index="2">
          <i class="el-icon-s-order"></i>
          <span>图谱列表</span>
        </el-menu-item>
      </router-link>
      <router-link to="/Kojima-Coin/KGEditor">
        <el-menu-item index="3">
          <i class="el-icon-paperclip"></i>
          <span>知识图谱编辑器</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "header",
  data() {
    return {
    }
  },
  computed:{
    ...mapGetters([
      'current'
    ])
  },
  mounted() {
    if (this.$route.name === 'index') this.set_current(1);
    else if(this.$route.name === 'KGList') this.set_current(2);
    else if (this.$route.name === 'KGEditor') this.set_current(3);
  },
  methods: {
    ...mapMutations([
      'set_current'
    ]),
    jumpToHome() {
      this.$router.push('/Kojima-Coin/index')
    }
  }
}
</script>

<style scoped lang="less">
.header {
  line-height: 60px;
  height: 60px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 800px;
  background-color: #fff;
  display: flex;
  position: fixed;
  border-bottom: 2px solid #dcdfe6;
  z-index: 2000;
  user-select: none;

  .label {
    float: left;
    height: 60px;
    line-height: 60px;
    vertical-align: middle;
    min-width: 400px;

    .logo {
      height: 56px;
      vertical-align: top;
      margin-right: 20px;
      border-style: none;
      cursor: pointer;
    }

    .title {
      font-size: 30px;
      color: #303133;
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      cursor: pointer;
      &:hover {
        color: #455355;
      }
    }
  }
}

.header {
  .el-menu {
    background: none;
    height: 60px;
    float: left;
    min-width: 400px;

    .el-menu-item {
      font-size: 15px;
      height: 60px;
      float: left;
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      &:hover {
        background: #e4e7ed;
      }
    }

    .is-active {
      background: #fff;
      border-bottom-color: #303133;
    }
  }
}
</style>