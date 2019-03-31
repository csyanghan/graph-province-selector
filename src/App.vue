<template>
  <div id="app">
    <h1>Yitu Prework</h1>
    <button @click="choose('1')">图片操作</button>
    <button @click="choose('2')">省市县选择器组件</button>
    <keep-alive>
      <component v-bind:is="currentTabComponent.name" v-bind="currentTabComponent.props"></component>
    </keep-alive>
  </div>
</template>

<script>
import ImageEditor from './components/ImageEditor.vue';
import Cascade from './components/Cascade.vue';

export default {
  name: 'app',
  data() {
    return {
      currentTabComponent: {
        name: 'ImageEditor'
      }
    }
  },
  components: {
    ImageEditor,
    Cascade
  },
  methods: {
    choose(type) {
      switch(type)
      {
        case '1':
          this.currentTabComponent = {
            name: 'ImageEditor'
          };
          break;
        case '2':
          this.currentTabComponent = {
            name: 'Cascade',
            props: {
              level: 4
            }
          };
          break;
      }
    }
  }
}
</script>

<style lang="scss">
button {
  margin: 10px;
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  transition: .1s;
  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}
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
  padding-top: 30px;
  padding-bottom: 30px;
  h1 {
    margin: 20px;
  }
}
</style>
