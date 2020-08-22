import { Role } from '@asmodee/werewolf-core';

import RoleConfig from '../../base/RoleConfig';
import { client } from '../../base/Client';
import { selectors } from '../../base/TeamSelector';

interface RoleChangeEvent extends WechatMiniprogram.Event {
	detail: {
		role: Role;
		value: number;
	};
}

const roleConfig = new RoleConfig();

Page({
	data: {
		selectors,
	},

	async onLoad(): Promise<void> {
		await roleConfig.read();
		this.refreshSettings();
	},

	refreshSettings(): void {
		const items = roleConfig.getItems();
		for (const selector of selectors) {
			selector.update(items);
		}
		this.setData({ selectors });
	},

	handleRoleChange(e: RoleChangeEvent): void {
		roleConfig.set(e.detail.role, e.detail.value);
	},

	handleReturn(): void {
		wx.navigateBack();
	},

	async createRoom(): Promise<void> {
		await roleConfig.save();

		const roles = roleConfig.getRoles();

		if (roles.length > 50) {
			roleConfig.reset();
			await roleConfig.save();
			this.refreshSettings();
			wx.showToast({
				title: '最多仅能支持50人局，请重新选择。',
				icon: 'none',
			});
			return;
		}

		if (roles.length <= 0) {
			wx.showToast({
				title: '请选择角色。',
			});
			return;
		}

		wx.showLoading({
			title: '创建房间……',
		});
		client.post({
			url: 'room',
			data: { roles },
			success(res) {
				wx.hideLoading();

				if (res.statusCode === 500) {
					return wx.showToast({
						title: '服务器房间数已满，请稍后重试。',
						icon: 'none',
					});
				}

				if (res.statusCode !== 200) {
					return wx.showToast({
						title: '非常抱歉，服务器临时故障。',
					});
				}

				wx.setStorage({
					key: 'room',
					data: res.data,
					success() {
						wx.redirectTo({
							url: '../room/index',
						});
					},
					fail() {
						wx.showToast({
							title: '空间不足，存储房间信息失败。',
							icon: 'none',
						});
					},
				});
			},
			fail() {
				wx.hideLoading();
				wx.showToast({
					title: '网络状况不佳，请重试。',
					icon: 'none',
				});
			},
		});
	},
});
