const SHA256 = require('crypto-js/sha256');
const uuid = require('uuid/v4');

/**
 * Grant Config
 * @param {Object} config
 * @param {string} config.client_id - Storyblok App Client ID
 * @param {string} config.client_secret - Storyblok App Client Secret
 * @param {string} config.redirect_uri - Storyblok App Redirect URI
 * @returns {Object<any>}
 */
const getGrantConfig = ({
  client_id,
  client_secret,
  redirect_uri
}) => {
  const codeIdentifier = uuid();

  return {
    defaults: {
      protocol: 'http',
      host: `http://localhost:3000`
    },
    storyblok: {
      key: client_id,
      secret: client_secret,
      redirect_uri: redirect_uri,
      callback: '/callback',
      authorize_url: 'https://app.storyblok.com/oauth/authorize',
      access_url: 'https://app.storyblok.com/oauth/token',
      oauth: 2,
      scope: 'read_content write_content',
      custom_params: {
        code_chalenge: SHA256(codeIdentifier).toString(),
        code_chalenge_method: 'S256',
        state: codeIdentifier
      }
    }
  }
};

module.exports = getGrantConfig;