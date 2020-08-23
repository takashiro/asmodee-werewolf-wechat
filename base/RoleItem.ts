import { Role } from '@asmodee/werewolf-core';

const roleNames = [
	'未知', // Unknown
	'狼人', // Werewolf
	'狼王', // AlphaWolf
	'白狼王', // WhiteAlphaWolf
	'狼美人', // WolfBeauty
	'隐狼', // SecretWolf
	'恶灵骑士', // Demon
	'村民', // Villager
	'预言家', // Seer
	'驯熊师', // Tamer
	'女巫', // Witch
	'猎人', // Hunter
	'守卫', // Guard
	'魔术师', // Magician
	'白痴', // Idiot
	'长老', // Elder
	'骑士', // Knight
	'摄梦人', // DreamWeaver
	'老流氓', // Rogue
	'乌鸦', // Crow
	'丘比特', // Cupid
	'野孩子', // FeralChild
	'盗贼', // Thief
	'炸弹人', // Bombman
	'石像鬼', // Gargoyle
	'守墓人', // GraveyardKeeper
	'天狗', // Tiangou
	'月女', // Luna
	'狼外婆', // WolfGrandma
	'小红帽', // RedHat
	'影子', // Doppelganger
	'复仇者', // Revenger
	'野孩子', // Hybrid
	'血月使徒', // LunarApostle
	'猎魔人', // MaraHunter
	'梦魇', // Nightmare
	'暗恋者', // Scarlett
	'奇迹商人', // MiracleMerchant
];

export default class RoleItem {
	readonly id: number;

	readonly key: string;

	readonly name: string;

	constructor(role: Role) {
		this.id = role;
		this.key = Role[role];
		this.name = roleNames[role];
	}
}
