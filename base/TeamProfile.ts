import {
	Team,
	Role,
	Teamship,
} from '@asmodee/werewolf-core';

import TeamItem from './TeamItem';

export default class TeamProfile {
	readonly team: TeamItem;

	readonly roles: Role[];

	constructor(team: Team, roles: Role[]) {
		this.team = new TeamItem(team);
		this.roles = roles;
	}

	static fromRoles(roles: Role[]): TeamProfile[] {
		roles.sort((a, b) => a - b);
		const teams = new Map<Team, Role[]>();
		for (const role of roles) {
			const team = Teamship.get(role);
			if (!team) {
				continue;
			}
			const members = teams.get(team);
			if (members) {
				members.push(role);
			} else {
				teams.set(team, [role]);
			}
		}

		const profiles: TeamProfile[] = [];
		for (const [team, members] of teams) {
			profiles.push(new TeamProfile(team, members));
		}
		return profiles;
	}
}
