//获取应用实例
const app = getApp();

let roomId = 0;

Page({
  data: {
  },
  
  //事件处理函数
  inputRoomNumber: function (e) {
    roomId = parseInt(e.detail.value, 10);
  },

  enterRoom: function () {
    if (!roomId) {
      wx.showToast({
        title: '请输入房间号。',
        icon: 'none',
      });
      return;
    }

    wx.showLoading({
      title: '加载中……',
    });
    wx.request({
      url: 'https://werewolf.takashiro.me/api/enterroom',
      data: { id: roomId },
      method: 'POST',
      success: function (res) {
        let room = res.data;
        console.log(room);
        if (!room.id || room.id <= 0) {
          wx.showToast({
            title: '房间不存在。',
            icon: 'none',
          });
        } else {
          wx.setStorage({
            key: 'room',
            data: room,
            success: function () {
              wx.navigateTo({
                url: '../room/index?salt=' + room.salt,
              });
            },
            fail: function () {
              wx.showToast({
                title: '存储房间信息失败。',
                icon: 'none',
              });
            },
          });
        }
      }
    });
  }
});
