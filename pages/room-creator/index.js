
import Role from '../../game/Role';
import Team from '../../game/Team';
import Session from '../../util/Session';

const App = getApp();
const ServerUrl = App.globalData.ServerUrl;

const selectors = [
  { team: Team.Werewolf, basic: {role: Role.Werewolf, num: 0}, roles: null },
  { team: Team.Villager, basic: {role: Role.Villager, num: 0}, roles: null },
  { team: Team.Other, basic: null, roles: null },
];
for (const selector of selectors) {
  selector.roles = Role.List.filter(
    role => role.team === selector.team && (!selector.basic || role !== selector.basic.role)
  ).map(
    role => ({role: role, num: 0})
  );
}

let roleConfig = new Map;

function restoreRoleConfig() {
  let configs = wx.getStorageSync('roleConfig');
  if (!configs || !(configs instanceof Array)) {
    roleConfig.set(Role.Werewolf, 4);
    roleConfig.set(Role.Villager, 4);
    roleConfig.set(Role.Seer, 4);
    roleConfig.set(Role.Witch, 1);
    roleConfig.set(Role.Hunter, 1);
  } else {
    for (let config of configs) {
      roleConfig.set(config.role, config.num);
    }
  }
}

function saveRoleConfig() {
  let config = [];
  for (let [role, num] of roleConfig) {
    if (num <= 0) {
      continue;
    }
    config.push({
      role: role,
      num: num,
    });
  }
  wx.setStorage({
    key: 'roleConfig',
    data: config,
  });
}

Page({
  data: {
    selectors
  },

  onLoad: function (options) {
    restoreRoleConfig();
    let selectors = [];
    for (let selector of this.data.selectors) {
      if (selector.basic) {
        let num = roleConfig.get(selector.basic.role.value);
        selector.basic.num = num;
      }

      if (selector.roles) {
        for (let role of selector.roles) {
          let num = roleConfig.get(role.role.value);
          role.num = isNaN(num) ? 0 : num;
        }
      }

      selectors.push(selector);
    }
    this.setData({selectors: selectors});
  },

  handleRoleChange: function (e) {
    roleConfig.set(e.detail.role, e.detail.value);
  },

  handleReturn: function () {
    wx.navigateBack();
  },

  createRoom: function () {
    saveRoleConfig();

    let roles = [];
    for (let [role, num] of roleConfig) {
      for (let i = 0; i < num; i++) {
        roles.push(role);
      }
    }

    wx.showLoading({
      title: '创建房间……',
    });
    wx.request({
      method: 'POST',
      url: ServerUrl + '/createroom',
      data: {roles},
      success: function (res) {
        wx.hideLoading();
        let room = res.data;

        if (room.salt && room.ownerKey) {
          let session = new Session(room.salt);
          session.ownerKey = room.ownerKey;
          delete room.ownerKey;
          session.save();
        }

        wx.setStorage({
          key: 'room',
          data: room,
          success: function () {
            wx.redirectTo({
              url: '../room/index',
            });
          },
          fail: function () {
            wx.showToast({
              title: '空间不足，存储房间信息失败。',
              icon: 'none',
            });
          },
        });
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '网络状况不佳，请重试。',
          icon: 'none',
        });
      }
    });
  }
});
