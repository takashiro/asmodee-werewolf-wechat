
import Role from '../../game/Role';
import Session from '../../util/Session';

const App = getApp();
const ServerUrl = App.globalData.ServerUrl;

const ERROR_MESSAGE = {
	ROOM_EXPIRED: '房间不存在，可能已过期。',
	INVALID_SEAT: '座位号错误，请重新输入。',
	INVALID_SEATKEY: '请刷新网页缓存，然后重试。',
	SEAT_TAKEN: '该座位已使用，请重新输入。',
	ROOM_FULL: '房间人数已满。'
};

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
			if (role === 0) {
				wx.showToast({
					title: '该座位已使用，请重新输入。',
					icon: 'none'
				});
				this.setData({ state: 'init' });
				return;
			}

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
				wx.showToast({
					title: '房间号错误。',
					icon: 'none'
				});
				return;
			}

			let seat = input.seat;
			if (seat <= 0 || isNaN(seat)) {
				wx.showToast({
					title: '请输入座位号。',
					icon: 'none'
				});
				return;
			}

			this.setData({ state: 'loading' });

			let session = new Session(this.data.roomKey);
			session.save();

			wx.request({
				method: 'POST',
				url: ServerUrl + '/fetchrole',
				data: {
					id: roomId,
					seat: seat,
					key: session.seatKey
				},
				success: res => {
					if (res.statusCode != 200) {
						wx.showToast({
							title: '查看身份失败。',
							icon: 'none'
						});
						return;
					}

					let result = res.data;
					if (result.error) {
						let message = ERROR_MESSAGE[result.error] ? ERROR_MESSAGE[result.error] : result.error;
						wx.showToast({
							title: message,
							icon: 'none'
						});
						this.setData({ state: 'init' });
						return;
					}

					session.seat = input.seat;
					session.role = result.role;
					session.cards = result.cards;
					session.save();

					this.showRole(session.seat, session.role, session.cards);
				},
				fail: () => {
					wx.showToast({
						title: '本地网络故障，查看身份失败。',
						icon: 'none'
					});
					this.setState({ state: 'init' });
				}
			});
		},
	}
})
