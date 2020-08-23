import { Team } from '@asmodee/werewolf-core';

const teamNames = [
	'未知',
	'狼人阵营',
	'神民阵营',
	'其他角色',
];

export default class TeamItem {
	readonly id: number;

	readonly key: string;

	readonly name: string;

	constructor(team: Team) {
		this.id = team;
		this.key = Team[team];
		this.name = teamNames[team];
	}
}
