import {
	Role,
	Team,
	RoomConfig,
} from '@asmodee/werewolf-core';

import { client } from '../../base/Client';
import Room from '../../base/Room';
import TeamProfile from '../../base/TeamProfile';

const enum PageStatus {
	Loading,
	Loaded,
	Expired,
}

Page({
	data: {
		status: PageStatus.Loading,
		id: 0,
		salt: '',
		session: null,
		teams: [] as TeamProfile[],
		role: null,
	},

	onLoad(options) {
		if (options.roomId) {
			const roomId = parseInt(options.roomId, 10) || 0;
			if (roomId <= 0) {
				this.setData({ status: PageStatus.Expired });
				return;
			}

			client.get({
				url: `room/${roomId}`,
				success: (res) => {
					const room = res.data as RoomConfig;
					if (res.statusCode === 404 || !room) {
						this.setData({ status: PageStatus.Expired });
						return;
					}

					const id = room.id;
					this.setData({
						id: room.id,
						salt: room.salt,
					});
				},
			});
		} else {
			const room = Room.getConfig();
			if (room) {
				const teams = TeamProfile.fromRoles(room.roles);
				this.setData({
					status: PageStatus.Loaded,
					id: room.id,
					salt: room.salt,
					teams,
				});
			}
		}
	},

	handleReturn() {
		const pages = getCurrentPages();
		if (pages.length >= 2) {
			wx.navigateBack();
		} else {
			wx.redirectTo({
				url: '../index/index',
			});
		}
	},

	onShareAppMessage() {
		const { id } = this.data;
		return {
			title: `狼人杀房间 ${id}号`,
			desc: '查看身份牌，悍跳自爆撕警徽',
			path: `/pages/room/index?roomId=${id}`,
		};
	},
});
