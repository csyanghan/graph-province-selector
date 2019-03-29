<template>
  <div id="app">
    <h2>Yitu Prework</h2>
    <!-- <ImageEditor></ImageEditor> -->
    <Cascade></Cascade>
  </div>
</template>

<script>
import ImageEditor from './components/ImageEditor.vue';
import Cascade from './components/Cascade.vue';

export default {
  name: 'app',
  components: {
    ImageEditor,
    Cascade
  }
}
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
