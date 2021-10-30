'use strict';

/**
 * `is-authenticated` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log('In is-authenticated policy.');

  await next();
};
