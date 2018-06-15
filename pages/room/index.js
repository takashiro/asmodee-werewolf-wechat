
import Role from '../../game/Role';
import Team from '../../game/Team';

Page({
  data: {
    room: {},
    teams: [
      {
        team: Team.Werewolf,
        roles: [Role.Werewolf, Role.Werewolf],
      },
      {
        team: Team.Villager,
        roles: [Role.Villager, Role.Seer],
      },
    ],
  },

  onLoad: function (options) {
    let salt = options.salt || 'WernB3Qp';
    let room = wx.getStorage({
      key: salt,
      success: res => {
        this.setData({
          room: res.data
        });
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
