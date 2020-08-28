const elasticsearch = require('./elasticsearch-cli');
const ldap = require('./ldap-cli');
const utils = require('./utils');

const fastify = require('fastify');
const app = fastify();

app.put('/_sync/user', async (req, reply) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    let checkLockout = utils.checkLockout(username);
    if (checkLockout) {
      return checkLockout;
    }
    let user = ldap.authUser(username, password);
    if (user === 'INVALIDCRED') {
      return utils.checkTries(username);
    }
    utils.removeTries(username);
    let details = utils.mapUserDetails(user);
    let groups = utils.mapUserGroups(user);
    elasticsearch.syncUser(username, password, groups, details);
    return {
      error: false,
      message: 'User synchronized'
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: 'Failed to sync, check server logs'
    };
  }
});

app.listen(3000).then(() => {
  console.log('Server running at http://localhost:3000/');
});
