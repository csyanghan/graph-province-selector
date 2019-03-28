class ImageEditor {

  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height; 
    this.ctx = ctx;

    this.style = {};
    this.style.strokeColor = '#000';
    this.style.fillColor = 'red';
    this.style.lineWidth = 1;

    // dataArr 二维数组, 每一维存放每一张图片的 data数组
    this.dataArr = [];
    this.data = {};
    this.drawStyle = 'stroke';
    this.type = 'pencil';

    // 存储图片url和当前图片idx
    this.images = [];
    this.activeIndex = -1;

    // 无图片时显示请上传图片
    ctx.textAlign = 'center';
    ctx.font = '2.4em "Fira Sans", sans-serif';
    ctx.strokeText("请上传图片", this.width / 2, this.height / 2);

    // init() 改变样式
    this.init();
    // draw 绑定mousedown事件
    this.draw();
  }

  init() {
    this.ctx.fillStyle = this.style.fillColor;
    this.ctx.strokeStyle = this.style.strokeColor;
    this.ctx.lineWidth = this.style.lineWidth;
  }
  
  activeImage(index) {
    if(this.activeIndex !== -1) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    if(this.dataArr[index] && this.dataArr[index].length !== 0) {
      let imageData = this.dataArr[index];
      let data = imageData[imageData.length -1];
      this.ctx.putImageData(data,0,0);
    } else {
      this.dataArr[index] = [];
      const img = new Image();
      const that = this;
      const url = this.images[index];
      img.src = url;
      img.onload = function() {
        let [ow, oh, w, h] = adjustImage(img.naturalWidth, img.naturalHeight, that.width, that.height)
        that.ctx.drawImage(img, ow, oh, w, h);
      }
    }
    this.activeIndex = index;
  }

  draw() {
    let that = this;
    this.canvas.onmousedown = function(e) {
      let startX = e.layerX;
      let startY = e.layerY;
      
      if(that.images.length === 0) return;
      if(that.type === 'pencil') {
        that[that.type](startX, startY);
        return;
      }
      that.data = that.ctx.getImageData(0,0, that.width, that.height);
      that.dataArr[that.activeIndex].push(that.data);
      that.canvas.onmousemove = function(e1) {
        that.ctx.clearRect(0,0,that.width,that.height);
        that.ctx.putImageData(that.data,0,0);
        let moveX= e1.layerX;
        let moveY= e1.layerY;
        if(!that.type){
          return;
        }
        that[that.type](startX,startY,moveX,moveY);
      }

      that.canvas.onmouseup = function() {
        if(that.images.length === 0) return;
        that.data = that.ctx.getImageData(0,0, that.width, that.height);
        that.dataArr[that.activeIndex].push(that.data);
        that.canvas.onmousemove = null;
      }
    }
  }

  pencil(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x,y);
    // 返回一个ImageData对象，用来描述canvas区域隐含的像素数据
    this.data = this.ctx.getImageData(0, 0, this.width, this.height);
    this.dataArr[this.activeIndex].push(this.data);
    const that = this;
    this.canvas.onmousemove = function(e) {
      if(that.images.length === 0) return;
      that.ctx.clearRect(0, 0, that.width, that.height);
      that.ctx.putImageData(that.data, 0,0 );
      const moveX = e.layerX;
      const moveY = e.layerY;
      that.init();
      that.ctx.lineTo(moveX, moveY);
      that.ctx.stroke();
    }
    this.canvas.onmouseup = function() {
      if(that.images.length === 0) return;
      that.data = that.ctx.getImageData(0,0, that.width, that.height);
      that.dataArr[that.activeIndex].push(that.data);
      that.canvas.onmousemove = null;
    }
  }

  line(x, y, x1, y1) {
    this.ctx.beginPath();
    this.init();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  rect(x,y,x1,y1) {
    this.init();
    this.ctx.beginPath();
    let w = x1 - x;
    let h = y1 - y;
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.closePath();
  }

  arc(x, y, x1, y1) {
    this.init();
    this.ctx.beginPath();
    const r = Math.sqrt((x1 -x) * (x1-x) + (y1-y)*(y1-y));
    this.ctx.arc(x, y, r, 0, 2*Math.PI);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  revocate() {
    let dataArr = this.dataArr[this.activeIndex];
    if (dataArr) {
      dataArr.pop();
      let data = dataArr.pop();
      if(data) {
        this.ctx.putImageData(data, 0, 0);
      }
    }
  }
}

function adjustImage(w, h, pw, ph) {
  let wRatio = pw / w, hRatio = ph / h;
  if(wRatio > hRatio) {
    let ow = (pw - w * hRatio ) / 2;
    return [ow, 0,w * hRatio, ph]
  } else {
    let oh = (ph - h*wRatio) / 2;
    return [0, oh, pw, h*wRatio];
  }
}

export default ImageEditor;
