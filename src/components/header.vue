<template>
  <div class="header">
    <div class="label">
      <img src="@/assets/kojima-logo.png" class="logo" alt="logo" @click="jumpToHome">
      <span class="title">Kojima-Coin</span>
      <el-menu
          :default-active="current"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
        <el-menu-item index="1">
          <router-link to="/index">
            <i class="el-icon-house"></i>
            首页
          </router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/KGEditor">
            <i class="el-icon-paperclip"></i>
            知识图谱编辑器
          </router-link>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "header",
  data() {
    return {
      current: 1
    }
  },
  mounted() {
    if (this.$route.name == 'index') this.current = 1
    else if (this.$route.name == 'KGEditor') this.current = 2
  },
  methods: {
    jumpToHome() {
      this.$router.push('/index')
    }
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  line-height: 44px;
  height: 44px;
  align-items: center;
  justify-content: space-between;
  min-width: 800px;

  .label {
    height: 44px;
    line-height: 44px;
    vertical-align: middle;
    min-width: 400px;

    .logo {
      height: 44px;
      vertical-align: top;
      margin-right: 16px;
      border-style: none;
      cursor: pointer;
    }

    .title {
      font-size: 33px;
      color: rgba(0, 0, 0, .85);
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      top: 2px;
    }
  }
}

.header {
  .el-menu {
    background: none;
  }
}
</style>