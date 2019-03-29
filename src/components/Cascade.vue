<template>
  <div>
    <input :value="selectedShow"/>
    <div class="select-container">
      <div class="tab" v-for="(item, index) in dataArr" :key="index" v-if="Object.prototype.toString.call(item) === '[object Array]'">
        <h3 class="tab-active" v-if="!dataIndex[index]">请选择</h3>
        <h3 class="tab-active" v-else>
          <!-- <span v-if="index===0">{{dataArr[index][dataIndex[index]]}}</span> -->
          <span>{{selectName(index)}}</span>
        </h3>
        <div class="tab-data" v-if="componentLevel === index">
          <div v-for="(item2, index2) in dataArr[index]" :key="index2" class="tab-data-item" @click="chooseDistinct(index, index2)">
            <span>{{item2.name}}</span>
          </div>
        </div>
        <div class="tab-data" v-if="componentLevel-1 === index && Object.prototype.toString.call(dataArr[componentLevel]) !== '[object Array]'">
          <div v-for="(item2, index2) in dataArr[index]" :key="index2" class="tab-data-item" @click="chooseDistinct(index, index2)">
            <span>{{item2.name}}</span>
          </div>
        </div>
      </div>
    </div>
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
    }
  },
  props: ['level'],
  computed: {
    selectedShow() {
      return this.selected.join('/');
    }
  },
  methods: {
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
      }
    },
    selectName(index) {
      let first = this.dataArr[index];
      let idx = this.dataIndex[index];
      let second = first[idx];
      const rst = second ? second.name : first.name;
      this.selected[index] = rst;
      return rst;
    }
  },
  mounted() {
    this.dataArr.push(data);
    console.log(data)
  },
}
</script>

<style lang="scss" scoped>
.select-container {
  display: flex;
  width: 800px;
  position: relative;
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
        bottom: -4px;
        left: 0;
        border: 1px solid #44b7b7;
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
