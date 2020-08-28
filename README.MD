# Utility for LDAP User synchronization against an Elasticsearch native realm

⚠️⚠️ ***THIS IS NOT AFFILIATED IN ANY WAY WITH ELASTIC*** ⚠️⚠️

⚠️⚠️ ***ALSO NOT ENDORSED BY ELASTIC*** ⚠️⚠️


⚠️⚠️ **WARNING:** this is a work in progress ⚠️⚠️

## Summary

Made for teams who need a somewhat workaround for LDAP authentication in Elasticsearch (read notice below).

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

## Setup & Install

TODO: docs for configuration via env variables and Docker install

## Notice

Elasticsearch only provides seamless LDAP realm authentication from Gold, Platinum and Enterprise subscriptions (along with a ton of neat features).
This utility seeks only to workaround this specific feature, is not seamless because it requires for each user to synchronize their credentials against the native realm, but it should be fine for small teams on self-managed Elasticsearch clusters. If you have a really big team and may be interested on other features, I suggest you check for an [Elastic subscription](https://www.elastic.co/pricing/).

## TODO

- Build Dockerfile and publish to hub
- Complete this README
- Add Unit testing
- Add CI