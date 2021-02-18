const mongoose = require('mongoose');
const Guild = require('../models/guild');

    module.exports = async (guild, oldMember, newMember) => {
var Changes = {
    unknown: 0,
    addedRole: 1,
    removedRole: 2,
    username: 3,
    nickname: 4,
    avatar: 5
  }
  var change = Changes.unknown

  // check if roles were removed
  var removedRole = ''
  oldMember.roles.every(function (value) {
    if (newMember.roles.find('id', value.id) == null) {
      change = Changes.removedRole
      removedRole = value.name
    }
  })

  // check if roles were added
  var addedRole = ''
  newMember.roles.every(function (value) {
    if (oldMember.roles.find('id', value.id) == null) {
      change = Changes.addedRole
      addedRole = value.name
    }
  })

  // check if username changed
  if (newMember.user.username != oldMember.user.username) {
    change = Changes.username
  }
  // check if nickname changed
  if (newMember.nickname != oldMember.nickname) {
    change = Changes.nickname
  }
  // check if avatar changed
  if (newMember.user.avatarURL != oldMember.user.avatarURL) {
    change = Changes.avatar
  }
  // post in the guild's log channel
  var log = guild.channels.find('name', CHANNEL)
  if (log != null) {
    switch (change) {
      case Changes.unknown:
        console.log('**[User Update]** ' + newMember)
        break
      case Changes.addedRole:
        console.log('**[User Role Added]** ' + newMember + ': ' + addedRole)
        break
      case Changes.removedRole:
        console.log('**[User Role Removed]** ' + newMember + ': ' + removedRole)
        break
      case Changes.username:
        console.log('**[User Username Changed]** ' + newMember + ': Username changed from ' +
          oldMember.user.username + '#' + oldMember.user.discriminator + ' to ' +
          newMember.user.username + '#' + newMember.user.discriminator)
        break
      case Changes.nickname:
        console.log('**[User Nickname Changed]** ' + newMember + ': ' +
          (oldMember.nickname != null ? 'Changed nickname from ' + oldMember.nickname +
            +newMember.nickname : 'Set nickname') + ' to ' +
          (newMember.nickname != null ? newMember.nickname + '.' : 'original username.'))
        break
      case Changes.avatar:
        console.log('**[User Avatar Changed]** ' + newMember)
        break
    }
  }
}

