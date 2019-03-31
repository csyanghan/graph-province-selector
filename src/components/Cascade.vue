<template>
  <div class="container">
    <div class="input-wrap">
      <input :value="selectedShow" type="text" readonly autocomplete="off" placeholder="请选择" class="my-input" @click="choose"/>
      <span class="down-icon" v-show="!opened"></span>
      <span class="up-icon" v-show="opened"></span>
    </div>
    <transition name="slide-in-out">
      <div class="select-container" v-show="opened">
        <!-- eslint-disable-next-line -->
        <div class="tab" v-for="(item, index) in dataArr" :key="index" v-if="Object.prototype.toString.call(item) === '[object Array]' && index < level">
          <h3 class="tab-active" v-if="dataIndex[index] === undefined">请选择</h3>
          <h3 class="tab-active" v-else @click="slectedChange(index)">
            <span>{{selectName(index)}}</span>
          </h3>
          <div class="tab-data" v-if="componentLevel === index && (index+1)!==level">
            <div v-for="(item2, index2) in dataArr[index]" :key="index2" class="tab-data-item" @click="chooseDistinct(index, index2)">
              <span>{{item2.name}}</span>
            </div>
          </div>
          <div class="tab-data" v-if="(index+1 === level || Object.prototype.toString.call(dataArr[index+1]) === '[object Object]')">
            <!-- 为了显示最后一级 -->
            <div v-for="(item2, index2) in dataArr[index]" :key="index2" class="tab-data-item" @click="chooseLastDistinct(index, index2)">
              <span>{{item2.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import data from '../assets/pcas-code.js';
export default {
  name: 'Cascade',
  data() {
    return {
      // 存放每一级的data (二维数组)
      dataArr: [],
      // 存放每一级选择的index
      dataIndex: [],
      componentLevel: 0,
      selected: [],
      opened: false,
    }
  },
  props: ['level'],
  computed: {
    selectedShow() {
      return this.selected.join('/');
    }
  },
  methods: {
    choose() {
      this.opened = !this.opened;
    },
    chooseDistinct(index1, index2) {
      // index1 表示那一层级 index2 表示该层级下某一个项目
      if(Object.prototype.toString.call(this.dataArr[this.dataArr.length -1]) === '[object Array]') {
        this.dataIndex[index1] = index2;
        let nextLevel = null;
        if(this.dataArr[index1][index2].children) {
          nextLevel = this.dataArr[index1][index2].children.map(pro => ({
            name: pro.name,
            children: pro.children
          }));
        } else {
          nextLevel = this.dataArr[index1][index2];
        }
        this.dataArr.push(nextLevel);
        this.componentLevel ++;
        let rst = this.dataArr[index1][index2];
        this.selected.splice(index1, 1, rst.name);
      }
    },
    chooseLastDistinct(index1, index2) {
      this.dataIndex.splice(index1, 1, index2);
      this.selected.splice(index1,1 ,this.dataArr[index1][index2].name);
      this.$emit('select-done', this.selected);
    },
    slectedChange(index) {
      this.dataArr.splice(index+1);
      this.dataIndex.splice(index);
      this.selected.splice(index);
      this.componentLevel = index;
    },
    selectName(index) {
      return this.selected[index];
    }
  },
  mounted() {
    this.dataArr.push(data);
  },
}
</script>

<style lang="scss" scoped>
.slide-in-out-enter-active, .slide-in-out-leave-active {
  transition: all .4s;
}
.slide-in-out-enter, .slide-in-out-leave-active {
  transform: translate3d(0, 3rem, 0);
  opacity: 0;
}
.container {
  width: 800px;
  margin: 0 auto;
  position: relative;
}
.input-wrap {
  margin-left: 10px;
  position: relative;
  cursor: pointer;
  font-size: 14px;
  line-height: 40px;
  height: 40px;
  min-width: 222px;
  .down-icon {
    display: inline-block;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #b4bac6;
    position: absolute;
    right: 5px;
    top: 15px;
  }
  .up-icon {
    display: inline-block;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom-color: #b4bac6;
    position: absolute;
    right: 5px;
    bottom: 15px;
  }
  .my-input {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    width: 100%;
    cursor: pointer;
  }
}

.select-container {
  display: flex;
  width: 800px;
  position: absolute;
  top: 40px;
  .tab {
    .tab-active {
      color: #44b7b7;
      position: relative;
      cursor: pointer;
      padding: 0 6px;
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        bottom: -6px;
        left: 0;
        border-top: 2px solid #44b7b7;
      }
    }
    h3 {
      margin:10px;
    }
    .tab-data {
      position: absolute;
      left: 0;
      display: flex;
      flex-wrap: wrap;
      .tab-data-item {
        margin: 10px;
        cursor: pointer;
        &:hover {
          color: #44b7b7;
        }
      }
    }
  }
}
</style>
