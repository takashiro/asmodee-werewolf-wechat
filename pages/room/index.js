
import Role from '../../game/Role';
import Team from '../../game/Team';

function parseStorageData(data) {
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

  return {room, teams};
}

Page({
  data: {
    room: {},
    teams: [],
    role: null,
  },

  onLoad: function (options) {
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
  },

  handleReturn: function () {
    wx.navigateBack();
  },
});
