const PORT = parseInt(process.env.PORT);

const fs = require('fs');
const path = require('path');

const elasticsearch = require('./elasticsearch-cli');
const ldap = require('./ldap-cli');
const utils = require('./utils');

const fastify = require('fastify');
const app = fastify();

const staticHomePage = fs.readFileSync(path.join(__dirname,'index.html')).toString();

app.get('/', async(req, reply) => {
  reply.header('Content-Type','text/html');
  return staticHomePage;
});

app.put('/user', async (req, reply) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    let checkLockout = utils.checkLockout(username);
    if (checkLockout) {
      return checkLockout;
    }
    let user = await ldap.authUser(username, password);
    if (user === 'INVALIDCRED') {
      return utils.checkTries(username);
    }
    utils.removeTries(username);
    let details = utils.mapUserDetails(user);
    let groups = utils.mapUserGroups(user);
    await elasticsearch.syncUser(username, password, groups, details);
    return {
      error: false,
      message: 'User synchronized'
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: 'Failed to sync, check server logs'
    };
  }
});

app.listen(PORT).then(() => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
