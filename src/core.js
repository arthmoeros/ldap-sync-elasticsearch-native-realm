const PORT = parseInt(process.env.PORT);

const fs = require('fs');
const path = require('path');

const elasticsearch = require('./elasticsearch-cli');
const ldap = require('./ldap-cli');
const utils = require('./utils');

const fastify = require('fastify');
const app = fastify();

const staticHomePage = fs.readFileSync(path.join(__dirname,'index.html')).toString();

const loginfo = utils.loginfo;

app.get('/', async(req, reply) => {
  reply.header('Content-Type','text/html');
  return staticHomePage;
});

app.put('/user', async (req, reply) => {
  let username = req.body.username;
  let password = req.body.password;
  loginfo(username, 'Recieved sync request');
  try {
    let checkLockout = utils.checkLockout(username);
    if (checkLockout) {
      loginfo(username, 'Locked out');
      return checkLockout;
    }
    loginfo(username, 'No lockout');
    let user = await ldap.authUser(username, password);
    if (user === 'INVALIDCRED') {
      loginfo(username, 'Bad credentials');
      return utils.checkTries(username);
    }
    loginfo(username, 'Good credentials');
    utils.removeTries(username);
    let details = utils.mapUserDetails(user);
    let groups = utils.mapUserGroups(user);
    loginfo(username, 'Refined LDAP info');
    await elasticsearch.syncUser(username, password, groups, details);
    loginfo(username, 'Synced user at Elasticsearch');
    return {
      error: false,
      message: 'User synchronized'
    };
  } catch (error) {
    loginfo(username, 'Thrown error');
    console.error(error);
    return {
      error: true,
      message: 'Failed to sync, check server logs'
    };
  }
});

app.listen(PORT, '0.0.0.0').then(() => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});
