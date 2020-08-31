const MAX_TRIES = parseInt(process.env.LDSY_MAX_TRIES) || 3
const MINUTES_LOCKOUT = parseInt(process.env.LDSY_MINUTES_LOCKOUT) || 15;
const triesMap = {};

function mapUserDetails(user){
  return {
    full_name: user.cn
  };
}

function mapUserGroups(user){
  let groups = [];
  user.groups.forEach((group) => {
    groups.push(group.cn);
  });
  return groups;
}

function checkLockout(username){
  let currentTime = new Date().getTime();
  if (triesMap[username] && currentTime < triesMap[username].lockout){
    return {
      error: true,
      message: `Locked out (for exceeded tries, ${(triesMap[username].lockout - currentTime) / 1000 / 60} minutes left)`
    };
  }
}

function checkTries(username){
  if (triesMap[username] === undefined) {
    triesMap[username] = {
      tries: 0,
      lockout: -1
    };
  }
  triesMap[username].tries++;
  if (triesMap[username].tries < MAX_TRIES) {
    return {
      error: true,
      message: `Invalid credentials (${MAX_TRIES - triesMap[username].tries} tries left)`
    };
  } else {
    triesMap[username].lockout = new Date().getTime() + (MINUTES_LOCKOUT * 60 * 1000);
    return {
      error: true,
      message: `Invalid credentials (exceeded tries, locked out for ${MINUTES_LOCKOUT} minutes)`
    };
  }
}

function removeTries(username){
  delete triesMap[username];
}

function loginfo(user, message){
  console.info(`${new Date().toISOString()} - ${user} - ${message}`);
}

module.exports.mapUserDetails = mapUserDetails;
module.exports.mapUserGroups = mapUserGroups;
module.exports.checkTries = checkTries;
module.exports.checkLockout = checkLockout;
module.exports.removeTries = removeTries;
module.exports.loginfo = loginfo;