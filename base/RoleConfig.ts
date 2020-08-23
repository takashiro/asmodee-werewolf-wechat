import { Role } from '@asmodee/werewolf-core';

export default class RoleConfig {
	protected readonly roles: Map<Role, number> = new Map();

	set(role: Role, num: number): void {
		this.roles.set(role, num);
	}

	get(role: Role): number {
		return this.roles.get(role) || 0;
	}

	getItems(): IterableIterator<[Role, number]> {
		return this.roles.entries();
	}

	getRoles(): Role[] {
		const roles: Role[] = [];
		for (const [role, num] of this.roles) {
			if (role === Role.Unknown) {
				continue;
			}
			for (let i = 0; i < num; i++) {
				roles.push(role);
			}
		}
		return roles;
	}

	reset(): void {
		this.roles.clear();
		this.roles.set(Role.Werewolf, 4);
		this.roles.set(Role.Villager, 4);
		this.roles.set(Role.Seer, 1);
		this.roles.set(Role.Witch, 1);
		this.roles.set(Role.Hunter, 1);
		this.roles.set(Role.Guard, 1);
	}

	async read(): Promise<void> {
		const res = await wx.getStorage({ key: 'roleConfig' });
		if (!res || !res.data || !Array.isArray(res.data)) {
			this.reset();
		} else {
			for (const config of res.data) {
				this.roles.set(config.role, config.num);
			}
		}
	}

	async save(): Promise<void> {
		const config = [];
		for (const [role, num] of this.roles) {
			if (num <= 0) {
				continue;
			}
			config.push({
				role,
				num,
			});
		}
		wx.setStorage({
			key: 'roleConfig',
			data: config,
		});
	}
}
