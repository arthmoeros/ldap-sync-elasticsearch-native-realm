const request = require('request-promise-native');
const HTTP_TIMEOUT = process.env.LDSY_API_HTTP_TIMEOUT || 5000

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
      json: true,
      timeout: HTTP_TIMEOUT
    };

    try {
      let response = await request(options); 
      return response;
    } catch (error) {
      // Only throw cause, because original error contains request body
      // and we don't want to log passwords, don't we?
      throw error.cause;
    }
  }
}

module.exports = Api;