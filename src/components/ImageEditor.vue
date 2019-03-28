<template>
  <div class="container">
    <canvas id="image-editor" width="800" height="500"></canvas>
    <ul @click="changePaint">
      <li data-role="pencil" :class="{ active: imageEditor.type === 'pencil'}">点</li>
      <li data-role="line" :class="{ active: imageEditor.type === 'line'}">线</li>
      <li data-role="rect" :class="{ active: imageEditor.type === 'rect'}">矩形</li>
      <li data-role="arc" :class="{ active: imageEditor.type === 'arc'}">圆</li>
      <li data-role="revocate" @click="revocate">撤销</li>
    </ul>
    <div class="file-upload">
      <template v-if="fileList.length !== 0">
        <div class="image-preview" v-for="(item, index) in fileList" :key="item" @click="chooseImage(index)" :class="{ active: activeIndex===index}">
          <img :src="item"/>
        </div>
      </template>
      <div class="wrap">
        <input type="file" accept=".jpg,.png" @change="imageChange" :value="filePlacehodler"/>
      </div>
    </div>
  </div>
</template>

<script>
import ImageEditor from './ImageEditor';

export default {
  name: 'imageEditor',
  data() {
    return {
      imageEditor: {},
      fileList: [],
      filePlacehodler: null,
      activeIndex: -1,
    }
  },
  methods: {
    changePaint(e) {
      if(e.target.nodeName.toLowerCase() === 'li') {
        const role = e.target.dataset.role;
        if(role !== 'revocate') {
          this.imageEditor.type = role;
        }
      }
    },
    imageChange(e) {
      let file = e.target.files[0];
      let url = null;
      if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
      } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
      } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
      }
      this.filePlacehodler = null;
      this.fileList.push(url);
      this.imageEditor.images.push(url);
      if(this.fileList.length === 1) {
        this.chooseImage(0);
      }
    },
    chooseImage(index) {
      this.activeIndex = index;
      this.imageEditor.activeImage(index);
    },
    revocate() {
      this.imageEditor.revocate();
    }
  },
  mounted() {
    let canvas = document.getElementById('image-editor');
    let ctx = canvas.getContext('2d');
    this.imageEditor = new ImageEditor(canvas, ctx);
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 802px;
  margin: 0 auto;
  ul {
    list-style: none;
    padding-left: 20px;
    border:1px solid #333;
    text-align: left;
    li {
      display: inline-block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      border:1px solid #333;
      margin: 10px;
      text-align: center;
      cursor: pointer;
    }
  }
}
canvas {
  border:1px solid #333;
}
.file-upload {
  margin-top: 20px;
  border:1px solid #333;
  padding: 14px;
  display: flex;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;

  .image-preview {
    width: 150px;
    height: 80px;
    border: 1px dashed #dcdee2;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img {
      height: 80px;
    }
    margin-right: 8px;
    margin-top: 8px;
  }
  .wrap {
    background-image: url('../assets/add.png');
    background-size: 60%;
    background-position: center;
    background-repeat: no-repeat;
    border: 1px dashed #dcdee2;
    margin-top: 8px;
    &:hover {
      border-color: #2d8cf0;
    }
  }
  input {
    height: 80px;
    width: 80px;
    opacity: 0;
    z-index: 9999;
    cursor: pointer;
  }
}
.active {
  border-color: #2d8cf0 !important;
}
</style>

