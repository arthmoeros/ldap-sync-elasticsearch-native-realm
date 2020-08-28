const { authenticate } = require('ldap-authentication');
const url = process.env.KS_LDAP_URL || 'ldap://example.com';
const baseDn = process.env.KS_LDAP_BASEDN || 'dc=example,dc=com';
const groupsDn = process.env.KS_LDAP_GROUPSDN || 'dc=example,dc=com';

async function authUser(username, password) {
  let options = {
    ldapOpts: { url },
    userDn: `uid=${username},${baseDn}`,
    userPassword: password,
    userSearchBase: baseDn,
    usernameAttribute: 'uid',
    username,
    groupsSearchBase: groupsDn,
    groupClass: 'posixGroup'
  };

  console.log(options);
  
  try {
    let user = await authenticate(options);
    return user;
  } catch (error) {
    if (error && error.lde_message === 'Invalid Credentials'){
      return 'INVALIDCRED';
    }
    return error;
  }
}

module.exports.authUser = authUser;
