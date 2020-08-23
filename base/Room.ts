import {
	PlayerProfile,
	RoomConfig,
} from '@asmodee/werewolf-core';

let curConfig: RoomConfig;

export default class Room {
	protected salt: string;

	protected profile?: PlayerProfile;

	constructor(salt: string) {
		this.salt = salt;
	}

	getSalt(): string {
		return this.salt;
	}

	readSession(): Promise<PlayerProfile | undefined> {
		if (this.profile) {
			return Promise.resolve(this.profile);
		}

		return new Promise((resolve, reject) => {
			wx.getStorage({
				key: `session-${this.salt}`,
				success: (res) => {
					this.profile = res.data;
					resolve(this.profile);
				},
				fail: reject,
			});
		});
	}

	saveSession(profile: PlayerProfile): Promise<void> {
		this.profile = profile;
		return new Promise((resolve, reject) => {
			wx.setStorage({
				key: `session-${this.salt}`,
				data: profile,
				success: () => resolve(),
				fail: reject,
			});
		});
	}

	static setConfig(config: RoomConfig): void {
		curConfig = config;
	}

	static getConfig(): RoomConfig | undefined {
		return curConfig;
	}
}
