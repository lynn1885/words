<template>
  <div id="app">
    <router-view name="main">
    </router-view>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'app',
  data () {
    return {

    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style lang="scss">
  @import './static/css/main.scss';
  #app{
    height: 100%;
  }
  #words-book-container {
    margin: 0 auto;
    height: 100%;
  }
</style>
