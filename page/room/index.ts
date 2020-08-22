import {
	Role,
	Team,
} from '@asmodee/werewolf-core';
import { client } from '../../base/Client';

function parseStorageData(data) {
	/*
	const room = data;
	const roles = room.roles.map(id => Role.fromNum(id));
	const teams = [];

	for (const team of Team.List) {
		let team_roles = roles.filter(role => role.team === team);
		if (team_roles.length <= 0) {
			continue;
		}

		teams.push({
			team: team,
			roles: team_roles,
		});
	}

	let session = new Session(room.salt);

	return {
		status: 1,
		room,
		teams,
		session,
	};*/
}

Page({
	data: {
		status: 0,
		room: {},
		session: null,
		teams: [],
		role: null,
	},

	onLoad: function (options) {
		if (options.room_id) {
			let room_id = parseInt(options.room_id, 10) || 0;
			if (room_id <= 0) {
				this.setData({ status: 2 });
				return;
			}

			client.get({
				url: `room/${room_id}`,
				data: { id: room_id },
				success: res => {
					let room = res.data;
					/*
					if (res.statusCode === 404 || !room.id || room.id <= 0) {
						this.setData({ status: 2 });
						return;
					}
					*/

					this.setData(parseStorageData(room));
				}
			})
		} else {
			let room = wx.getStorage({
				key: 'room',
				success: res => {
					this.setData(parseStorageData(res.data));
				},
				fail: () => {
					wx.showToast({
						title: '读取房间信息失败。',
						icon: 'none',
					});
				},
			})
		}
	},

	handleReturn: function () {
		let pages = getCurrentPages();
		if (pages.length >= 2) {
			wx.navigateBack();
		} else {
			wx.redirectTo({
				url: '../index/index',
			});
		}
	},

	onShareAppMessage: function () {
		let room = this.data.room;
		return {
			title: '狼人杀房间 ' + room.id + '号',
			desc: '查看身份牌，悍跳自爆撕警徽',
			path: '/pages/room/index?room_id=' + room.id,
		};
	},
});
