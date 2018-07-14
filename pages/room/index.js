
import Role from '../../game/Role';
import Team from '../../game/Team';
import Session from '../../util/Session';

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

  let session = new Session(room.salt);

  return {
    room,
    teams,
    session,
  };
}

Page({
  data: {
    room: {},
    session: null,
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

  onShareAppMessage: function () {
    let room = this.data.room;
    return {
      title: '狼人杀房间 ' + room.id + '号',
      desc: '查看身份牌，悍跳自爆撕警徽',
      path: '/pages/index/index?room_id=' + room.id,
    };
  },
});
