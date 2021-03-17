<template>
  <div id="layout">
    <Header v-show="showHeader"></Header>
    <transition name="fade-transform" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import Header from '@/components/header'

import Vue from 'vue'
window.Event = new Vue()

export default {
  name: "layout",
  components: {
    Header
  },
  data() {
    return {
      isFullScreen: '',
      showHeader: true
    }
  },
  //全屏隐藏header
  mounted() {
    window.Event.$on('isFullScreen', val => {
      console.log(val)
      this.isFullScreen = val
      this.showHeader = !this.isFullScreen;
    })

  },
}
</script>

<style scoped>

</style>