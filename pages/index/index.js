//获取应用实例
const app = getApp();
const ServerAPI = app.globalData.ServerAPI;

let roomId = 0;

Page({
	data: {
	},

	onLoad: function (options) {
		if (options.room_id) {
			roomId = parseInt(options.room_id, 10) || 0;
			if (roomId) {
				this.enterRoom();
			}
		}
	},

	//事件处理函数
	inputRoomNumber: function (e) {
		roomId = parseInt(e.detail.value, 10);
	},

	createRoom: function () {
		wx.showLoading({
			title: '加载中……',
		});
		wx.navigateTo({
			url: '../room-creator/index',
			complete: function () {
				wx.hideLoading();
			},
		});
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
			url: ServerAPI + '/enterroom',
			data: { id: roomId },
			method: 'POST',
			success: function (res) {
				wx.hideLoading();
				let room = res.data;
				if (!room.id || room.id <= 0) {
					wx.showToast({
						title: '房间不存在。',
						icon: 'none',
					});
				} else {
					wx.showLoading({
						'title': '加载房间信息……',
					});
					wx.setStorage({
						key: 'room',
						data: room,
						success: function () {
							wx.hideLoading();
							wx.navigateTo({
								url: '../room/index?salt=' + room.salt,
							});
						},
						fail: function () {
							wx.hideLoading();
							wx.showToast({
								title: '存储房间信息失败。',
								icon: 'none',
							});
						},
					});
				}
			},
			fail: function () {
				wx.hideLoading();
				wx.showToast({
					title: '网络故障，请重试。',
					icon: 'none'
				});
			},
		});
	},

	onShareAppMessage: function () {
		let room = this.data.room;
		return {
			title: '狼人杀上帝助手',
			desc: '支持包含盗贼在内的23种特殊角色，邀请好友线下面杀吧！',
			path: '/pages/index/index',
		};
	},
});
