import TeamProfile from '../../base/TeamProfile';
import { lobby } from '../../base/Lobby';

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

	async onLoad(options): Promise<void> {
		if (options.roomId) {
			const roomId = parseInt(options.roomId, 10) || 0;
			if (roomId <= 0) {
				this.setData({ status: PageStatus.Expired });
				return;
			}

			let status = 100;
			try {
				status = await lobby.enterRoom(roomId);
			} catch (error) {
				// Ignore
			}

			if (status !== 200) {
				this.setData({ status: PageStatus.Expired });
			}
		}

		const room = lobby.getCurrentRoom();
		const config = room?.getConfig();
		if (config) {
			const teams = TeamProfile.fromRoles(config.roles);
			this.setData({
				status: PageStatus.Loaded,
				id: config.id,
				salt: config.salt,
				teams,
			});
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
			path: `/page/room/index?roomId=${id}`,
		};
	},
});
