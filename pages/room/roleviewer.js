
import Role from '../../game/Role';
import Session from '../../util/Session';

const App = getApp();
const ServerAPI = App.globalData.ServerAPI;

const input = {
	seat: 0,
};

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		roomId: {
			type: Number,
			value: 0,
		},
		roomKey: {
			type: String,
			value: '',
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		state: 'prepare', // "prepare", "init", "loading", "loaded"
		role: 0,
		seat: 0,
		cards: [],
	},

	ready: function () {
		let session = new Session(this.data.roomKey);
		if (session.role) {
			this.showRole(session.seat, session.role, session.cards);
		} else {
			this.setData({ state: 'init' });
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		updateSeat: function (e) {
			input.seat = parseInt(e.detail.value, 10);
		},

		showRole: function (seat, role, cards) {
			role = Role.fromNum(role);

			if (cards && cards instanceof Array) {
				cards = cards.map(card => Role.fromNum(card));
			} else {
				cards = [];
			}

			this.setData({
				state: 'loaded',
				seat: seat,
				role: role,
				cards: cards
			});
		},

		fetchRole: function () {
			let roomId = this.data.roomId;
			if (roomId <= 0 || isNaN(roomId)) {
				return wx.showToast({
					title: '房间号错误。',
					icon: 'none'
				});
			}

			let seat = input.seat;
			if (seat <= 0 || isNaN(seat)) {
				return wx.showToast({
					title: '请输入座位号。',
					icon: 'none'
				});
			}

			this.setData({ state: 'loading' });

			let session = new Session(this.data.roomKey);
			session.save();

			wx.request({
				method: 'GET',
				url: ServerAPI + 'role',
				data: {
					id: roomId,
					seat: seat,
					key: session.seatKey
				},
				success: res => {
					if (res.statusCode === 404) {
						return wx.showToast({
							title: '房间已失效，请重新创建房间。',
							icon: 'none',
						});
					} else if (res.statusCode === 409) {
						return wx.showToast({
							title: '座位已被占用，请使用其他座位。',
							icon: 'none',
							complete: () => this.setData({ state: 'init' })
						});
					} else if (res.statusCode === 403) {
						return wx.showToast({
							title: '请刷新网页缓存，然后重试。',
							icon: 'none',
						});
					} else if (res.statusCode != 200) {
						return wx.showToast({
							title: '查看身份失败。',
							icon: 'none',
						});
					}

					session.seat = input.seat;
					session.role = res.data.role;
					session.cards = res.data.cards;
					session.save();

					this.showRole(session.seat, session.role, session.cards);
				},
				fail: () => {
					wx.showToast({
						title: '本地网络故障，查看身份失败。',
						icon: 'none'
					});
					this.setData({ state: 'init' });
				}
			});
		},
	}
})
