
import Role from '../../game/Role';
import Team from '../../game/Team';

function parseStorageData(data) {
  const room = data;
  const roles = room.roles.map(id => Role.fromNum(id));
  const teams = [];

  for (const team of Team.List) {
    teams.push({
      team: team,
      roles: roles.filter(role => role.team === team),
    });
  }

  return {room, teams};
}

Page({
  data: {
    room: {},
    teams: [],
  },

  onLoad: function (options) {
    let salt = options.salt || 'WernB3Qp';
    let room = wx.getStorage({
      key: salt,
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
});
