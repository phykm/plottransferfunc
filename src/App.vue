<template>
  <div id="app">
    <PlotTransfer msg="Welcome to Your Vue.js App"  title= "PlotTransfer"/>
  </div>
</template>

<script>
import PlotTransfer from './components/PlotTransfer.vue'

export default {
  name: 'App',
  components: {
    PlotTransfer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
