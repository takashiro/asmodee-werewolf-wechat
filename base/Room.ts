import { PlayerProfile } from '@asmodee/werewolf-core';

export default class Room {
	protected salt: string;

	protected profile?: PlayerProfile;

	constructor(salt: string) {
		this.salt = salt;
	}

	getSalt(): string {
		return this.salt;
	}

	async readSession(): Promise<PlayerProfile | undefined> {
		if (this.profile) {
			return this.profile;
		}

		const res = await wx.getStorage({ key: `session-${this.salt}` });
		this.profile = res.data;
		return res.data;
	}

	async saveSession(profile: PlayerProfile): Promise<boolean> {
		this.profile = profile;
		const res = await wx.setStorage({
			key: `session-${this.salt}`,
			data: profile,
		});
		return !res.errMsg;
	}
}
