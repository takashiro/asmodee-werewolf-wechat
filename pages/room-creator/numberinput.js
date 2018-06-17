// pages/room-creator/numberinput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Number,
      value: 0,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput: function (e) {
      let num = parseInt(e.detail.value, 10);
      if (isNaN(num)) {
        return;
      }

      if (num <= 0) {
        num = 0;
      }

      this.setData({value: num});
    },

    handleDecrease: function () {
      let newVal = this.data.value - 1;
      if (newVal >= 0) {
        this.setData({value: newVal});
      }
    },

    handleIncrease: function () {
      let newVal = this.data.value + 1;
      this.setData({value: newVal});
    },
  }
})
