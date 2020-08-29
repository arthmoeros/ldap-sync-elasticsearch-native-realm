const Api = require('./api-caller');
const esBaseApiUrl = process.env.LDSY_ES_BASE_URL || 'http://localhost:9200'
const esApiKey = process.env.LDSY_ES_API_KEY || 'secret'

const apiCaller = new Api(esBaseApiUrl);
const headers = {
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html
  Authorization: `ApiKey ${esApiKey}`
};

async function _upsertUser(username, password, groups, details) {
  let body = {
    full_name: details.fullName,
    password,
    roles: groups
  };
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
    let body = {
      indices: {
        names: ['*'],
        privileges: ['all']
      }
    };
    await apiCaller.call(
      'PUT',
      `/_security/role/_ldapgroup_${role}`,
      body,
      headers
    );
  }
}

async function syncUser(username, password, groups, details) {
  groups.forEach(async group => {  
    await _createRole(group);
  });

  await _upsertUser(username, password, groups, details);
}

module.exports.syncUser = syncUser;
