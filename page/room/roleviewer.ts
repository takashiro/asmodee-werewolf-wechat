import {
	Role,
	PlayerProfile,
} from '@asmodee/werewolf-core';

import Room from '../../base/Room';
import { client } from '../../base/Client';
import fetchSeatKey from '../../util/fetchSeatKey';
import RoleItem from '../../base/RoleItem';

const enum PageState {
	Prepare = 'prepare',
	Init = 'init',
	Loading = 'loading',
	Loaded = 'loaded',
}

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
		state: PageState.Prepare,
		seat: 0,
		role: new RoleItem(Role.Unknown),
		cards: [] as RoleItem[],
	},

	async ready() {
		const room = new Room(this.data.roomKey);
		try {
			const profile = await room.readSession();
			if (profile) {
				this.showRole(profile.seat, profile.roles);
			}
			return;
		} catch (error) {
			// Ignore
		}
		this.setData({ state: PageState.Init });
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		updateSeat(e): void {
			input.seat = parseInt(e.detail.value, 10);
		},

		showRole(seat: number, roles: Role[]): void {
			const [role] = roles;
			const cards = roles.slice(1);

			this.setData({
				state: PageState.Loaded,
				seat,
				role: new RoleItem(role),
				cards: cards.map((card) => new RoleItem(card)),
			});
		},

		async fetchRole() {
			const { roomId } = this.data;
			if (roomId <= 0 || Number.isNaN(roomId)) {
				return wx.showToast({
					title: '房间号错误。',
					icon: 'none'
				});
			}

			const { seat } = input;
			if (seat <= 0 || isNaN(seat)) {
				return wx.showToast({
					title: '请输入座位号。',
					icon: 'none'
				});
			}

			this.setData({ state: PageState.Loading });

			const seatKey = await fetchSeatKey();
			client.get({
				url: `room/${roomId}/seat/${seat}`,
				data: {
					key: seatKey
				},
				success: async res => {
					if (res.statusCode === 404) {
						this.setData({ state: PageState.Init });
						return wx.showToast({
							title: '房间已失效，请重新创建房间。',
							icon: 'none',
						});
					} else if (res.statusCode === 409) {
						this.setData({ state: PageState.Init });
						return wx.showToast({
							title: '座位已被占用，请使用其他座位。',
							icon: 'none',
						});
					} else if (res.statusCode === 403) {
						this.setData({ state: PageState.Init });
						return wx.showToast({
							title: '请刷新网页缓存，然后重试。',
							icon: 'none',
						});
					} else if (res.statusCode != 200) {
						this.setData({ state: PageState.Init });
						return wx.showToast({
							title: '查看身份失败。',
							icon: 'none',
						});
					}

					const profile = res.data as PlayerProfile;
					const room = new Room(this.data.roomKey);
					await room.saveSession(profile);
					this.showRole(profile.seat, profile.roles);
				},
				fail: () => {
					wx.showToast({
						title: '本地网络故障，查看身份失败。',
						icon: 'none'
					});
					this.setData({ state: PageState.Init });
				}
			});
		},
	}
})
