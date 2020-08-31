# LDAP User synchronization against an Elasticsearch native realm

⚠️⚠️ ***THIS IS NOT AFFILIATED IN ANY WAY WITH ELASTIC*** ⚠️⚠️

⚠️⚠️ ***ALSO NOT ENDORSED BY ELASTIC*** ⚠️⚠️

⚠️⚠️ **WARNING:** this has some things to do (mostly unit testing and so) ⚠️⚠️

## Summary

Made for teams who need a somewhat workaround for LDAP authentication in Elasticsearch **(read notice below)**.

It works like this:

- A simple html page with username and password
- User puts their credentials and press "Synchronize" button
- The internal API authenticates user against an LDAP server
- If authentication is successful, then proceeds to fetch the user info and groups
- The internal API then hits the Elasticsearch API to do the following:
  - Creates the associated ldap groups as Elasticsearch roles with the `_ldapgroup_` prefix (only the non-existing ones)
  - Creates/Updates the user in the native realm, using the same credentials the user used to authenticate
  - On user creation/update, also adds the associated ldapgroups "roles"

Simple as that, it also has some security features built-in

- Configurable max tries for bad credentials
- Configurable timeout for lockout on max retries

## Setup & Run

This utility requires some environment variables to be set:

|env var | description|
|--------|------------|
|PORT|Defines the listening port|
|LDSY_ES_BASE_URL|Elasticsearch base URL to work against|
|LDSY_ES_API_KEY|Elasticsearch apiId and apiKey separated by colon, base64 encoded|
|LDSY_LDAP_URL|LDAP base url where to authenticate and fetch info|
|LDSY_LDAP_BASEDN|Base DN where to authenticate users|
|LDSY_LDAP_GROUPSDN|Base DN where to fetch groups for each user|
|LDSY_MAX_TRIES|Max tries settings for lockout|
|LDSY_MINUTES_LOCKOUT|Minutes to enforce lockout of users who failed to authenticate on max tries|

### Pure node execution example

```bash
export PORT=13001
export LDSY_ES_BASE_URL="http://172.2.0.1:9200"
export LDSY_ES_API_KEY="IT3R4GHSRTG3H254SDF="
export LDSY_LDAP_URL="ldap://example.com"
export LDSY_LDAP_BASEDN="dc=example,dc=com"
export LDSY_LDAP_GROUPSDN="dc=example,dc=com"
export LDSY_MAX_TRIES=3
export LDSY_MINUTES_LOCKOUT=15
npm start
```

### Docker execution

```bash
docker run -d --env-file env.sample -p $PORT:$PORT arthmoeros/ldap-sync-elasticsearch-native-realm:latest
```

⚠️ **Warning!**: Although this can be run on docker, take into consideration running only one replica of this if you use Docker Swarm or any other orchestration engine, because of the lockout system uses in-memory storage to count tries and enforce lockout minutes.

## Notice

Elasticsearch only provides seamless LDAP realm authentication from Gold, Platinum and Enterprise subscriptions (along with a ton of neat features).
This utility seeks only to workaround this specific feature, is not seamless because it requires for each user to synchronize their credentials against the native realm, but it should be fine for small teams on self-managed Elasticsearch clusters. If you have a really big team and may be interested on other features, I suggest you check for an [Elastic subscription](https://www.elastic.co/pricing/).

## TODO

- Add Unit testing
- Add CI
- Add parameterization to default ldapgroup role privileges
