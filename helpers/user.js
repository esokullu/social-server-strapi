const profileHelper = (sanitizedProfile) => {
  const findRole = async (id) => {
    const role = await strapi
    .query("role", "users-permissions")
    .findOne({ type: "editor" });
    const idRole = role && role.id == id ? 1 : 0
    return idRole
  }

  return {
    username: sanitizedProfile.user.username,
    email: sanitizedProfile.user.email,
    jointime: sanitizedProfile.user.createdAt,
    avatar: sanitizedProfile.avatar,
    birthday: sanitizedProfile.birthday,
    about: sanitizedProfile.about,
    iseditor: findRole(sanitizedProfile.user.role),
    customfield1: sanitizedProfile.customfield1,
    customfield2: sanitizedProfile.customfield2,
    customfield3: sanitizedProfile.customfield3,
    pending: false,
    pendingverification: 0,
    follower_count: sanitizedProfile.user.user_followers ? sanitizedProfile.user.user_followers.length : 0,
    following_count: sanitizedProfile.user.user_followings ? sanitizedProfile.user.user_followings.length : 0,
    membership_count: 0
  }
}



module.exports = {
  profileHelper
}