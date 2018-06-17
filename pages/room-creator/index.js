
import Role from '../../game/Role';
import Team from '../../game/Team';

const selectors = [
  { team: Team.Werewolf, basic: Role.Werewolf, roles: null },
  { team: Team.Villager, basic: Role.Villager, roles: null },
  { team: Team.Other, basic: null, roles: null },
];
for (const selector of selectors) {
  selector.roles = Role.List.filter(
    role => role.team === selector.team && role !== selector.basic
  );
}

let input = new Map;

Page({
  data: {
    selectors
  },

  onButtonClick: function (e) {
  },
});