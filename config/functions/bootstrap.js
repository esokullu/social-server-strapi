'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

// module.exports = () => {};



/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#bootstrap
 */


// https://forum.strapi.io/t/set-permissions-programmatically-6294/1774/2

const findAuthenticatedRole = async () => {
  const result = await strapi
    .query("role", "users-permissions")
    .findOne({ type: "authenticated" }); 
  return result;
};

const findPublicRole = async () => {
    const result = await strapi
      .query("role", "users-permissions")
      .findOne({ type: "public" }); 
    return result;
  };

const setDefaultPermissions = async () => {
    const open_to_public = [
        "getblogposts",
        "getblogpost", 
        "getcomments", 
        "getfollowing", 
        "getfollowers", 
        "getmembers", 
        "getcustomfields", 
        "getprofile", 
        "isstarred",

        "createnetwork",

        "login",
        "forgotpassword",
        "register"

        
    ];
    var inArray = (needle, haystack) => {// https://stackoverflow.com/questions/784012/javascript-equivalent-of-phps-in-array
        let _length = haystack.length;
        for(var i = 0; i < _length; i++) {
            if(haystack[i] == needle) return true;
        }
        return false;
    };
  const public_role = await findPublicRole();
  const authenticated_role = await findAuthenticatedRole();
  const authenticated_permissions = await strapi
    .query("permission", "users-permissions")
    .find({ /*type: "application", */role: authenticated_role.id, _limit: -1 });
  const public_permissions = await strapi
    .query("permission", "users-permissions")
    .find({ /*type: "application", */role: public_role.id, _limit: -1  });
  /*const public_permissions_auth = await strapi
    .query("permission", "users-permissions")
    .find({ type: "users-permissions", role: public_role.id, _limit: -1  });
    */
  await Promise.all(
    authenticated_permissions.map(p =>
      strapi
        .query("permission", "users-permissions")
        .update({ id: p.id }, { enabled: true })
    )
  );
  await Promise.all(
    public_permissions.map(p => {
            if(inArray(p.action, open_to_public)) {
                strapi
                    .query("permission", "users-permissions")
                    .update({ id: p.id }, { enabled: true })
            }
        } 
    )
  );
  /*
  await Promise.all(
    public_permissions_auth.map(p => {
        if(inArray(p.action, open_to_public)) {
          strapi
              .query("permission", "users-permissions")
              .update({ id: p.id }, { enabled: true })
      }
    })
  );*/
};

const isFirstRun = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup"
  });
  const initHasRun = await pluginStore.get({ key: "initHasRun" });
  await pluginStore.set({ key: "initHasRun", value: true });
  return !initHasRun;
};

module.exports = async () => {
  const shouldSetDefaultPermissions = true;  // await isFirstRun();
  if (shouldSetDefaultPermissions) {
    await setDefaultPermissions();
  }
};
