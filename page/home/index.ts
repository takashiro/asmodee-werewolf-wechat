import { lobby } from '../../base/Lobby';

Page({
	roomId: 0,

	data: {
	},

	// 事件处理函数
	inputRoomNumber(e: WechatMiniprogram.InputEvent): void {
		this.roomId = parseInt(e.detail.value, 10);
	},

	createRoom(): void {
		wx.showLoading({
			title: '加载中……',
		});
		wx.navigateTo({
			url: '../room-creator/index',
			complete() {
				wx.hideLoading();
			},
		});
	},

	async enterRoom(): Promise<void> {
		if (!this.roomId) {
			wx.showToast({
				title: '请输入房间号。',
				icon: 'none',
			});
			return;
		}

		wx.showLoading({
			title: '加载中……',
		});

		let status = 100;
		try {
			status = await lobby.enterRoom(this.roomId);
		} catch (error) {
			wx.hideLoading();
			wx.showToast({
				title: '网络故障，请重试。',
				icon: 'none',
			});
		} finally {
			wx.hideLoading();
		}

		if (status === 404) {
			wx.showToast({
				title: '房间不存在。',
				icon: 'none',
			});
		} else if (status !== 200) {
			wx.showToast({
				title: '加载房间信息失败。',
				icon: 'none',
			});
		} else {
			wx.showLoading({
				title: '加载房间信息……',
			});
			wx.navigateTo({
				url: '../room/index',
				complete: () => {
					wx.hideLoading();
				},
			});
		}
	},

	onShareAppMessage() {
		return {
			title: '狼人杀上帝助手',
			desc: '支持36种特殊角色，邀请好友线下面杀吧！',
			path: '/page/home/index',
		};
	},
});
