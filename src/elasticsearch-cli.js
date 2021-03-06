const Api = require('./api-caller');
const loginfo = require('./utils').loginfo;
const baseRole = require('./base-role.json');

const esBaseApiUrl = process.env.LDSY_ES_BASE_URL || 'http://localhost:9200'
const esApiKey = process.env.LDSY_ES_API_KEY || 'secret'

const apiCaller = new Api(esBaseApiUrl);
const headers = {
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html
  Authorization: `ApiKey ${esApiKey}`
};

async function _upsertUser(username, password, groups, details) {
  loginfo(username, `Querying existing user`);
  let currentUserInfo = await apiCaller.call(
    'GET',
    `/_security/user/${username}`,
    null,
    headers
  )
  let currentRoles = currentUserInfo[username] !== undefined ? currentUserInfo[username].roles : [];

  let roles = [];
  groups.forEach((group) => {
    roles.push(`_ldapgroup_${group}`);
  });
  roles.push('_default_kibana');

  currentRoles.forEach((role) => {
    if(roles.indexOf(role) === -1){
      loginfo(username, `Found previously set role ${role}, keeping it`);
      roles.push(role);
    }
  });

  let body = {
    full_name: details.fullName,
    password,
    roles
  };
  loginfo(username, `Upserting user in Elasticsearch`);
  await apiCaller.call(
    'PUT',
    `/_security/user/${username}`,
    body,
    headers
  );
}

async function _isRoleCreated(role){
  let response = await apiCaller.call(
    'GET',
    `/_security/role/_ldapgroup_${role}`,
    null,
    headers
  );
  return response.statusCode !== 404;
}

async function _createRole(role) {
  let roleExists = await _isRoleCreated(role);
  if (!roleExists) {
    await apiCaller.call(
      'PUT',
      `/_security/role/_ldapgroup_${role}`,
      baseRole,
      headers
    );
  }
}

async function syncUser(username, password, groups, details) {
  loginfo(username, 'Creating non-existing roles for ldapgroups');
  groups.forEach(async group => {  
    await _createRole(group);
  });

  loginfo(username, 'Calling upsert user');
  await _upsertUser(username, password, groups, details);
}

module.exports.syncUser = syncUser;
