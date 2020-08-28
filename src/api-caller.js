const request = require('request-promise-native');

class Api {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async call(method, path, body, headers) {
    let options = {
      method: method,
      uri: `${this.baseUrl}${path}`,
      headers,
      body,
      json: true
    };

    return await request(options);
  }
}

module.exports = Api;