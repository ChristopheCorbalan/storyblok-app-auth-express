// Express
const session = require('express-session')
const grant = require('grant-express')

// Utils
const {
  getGrantConfig,
  getTokenFromCode,
  getStoryblokClient
} = require('./utils')

/**
 * Storyblok Express Auth Middleware
 * @param {Object} options - Module Settings
 * @param {string} options.client_id - Storyblok App Client ID
 * @param {string} options.client_secret - Storyblok App Client Secret
 * @param {string} options.redirect_uri - Storyblok App Redirect URI
 * @returns {Array<Function>}
 */
const storyblokAuth = ({
  client_id,
  client_secret,
  redirect_uri
}) => {
  if (!client_id || !client_secret || !redirect_uri) {
    throw new Error('client_id, client_secret or redirect_uri parameters might be missing.')
  }

  const options = getGrantConfig({
    client_id,
    client_secret,
    redirect_uri
  })

  /**
   * Storyblok app callback handler
   * @param {Object<any>} req
   * @param {Object<any>} res
   * @param {Function} next
   * @returns {void}
   */
  const handler = async (req, res, next) => {
    const segments = redirect_uri.split('/')
    const callbackRoute = `/${segments.pop() || segments.pop()}`

    if (req.path === callbackRoute) {
      const { space_id, code } = req.query

      try {
        const config = {
          grant_type: 'authorization_code',
          code,
          client_id,
          client_secret,
          redirect_uri
        }
        const { access_token, refresh_token } = await getTokenFromCode(
          options.storyblok.access_url,
          config
        )

        if (!req.session.spaces) req.session.spaces = {}
        if (!req.session.spaces[space_id]) req.session.spaces[space_id] = {}
        req.session.spaces[space_id].application_code = code
        req.session.spaces[space_id].access_token = access_token
        req.session.spaces[space_id].refresh_token = refresh_token

        res.redirect(`/?space_id=${space_id}`)
      } catch (e) {
        res.status(500).json({ error: e.message })
      }
    }

    if (req.query.space_id || req.params.space_id) {
      const space_id = req.query.space_id || req.params.space_id
      req.storyblok = getStoryblokClient(req.session, space_id, options)
    }

    next()
  }

  return [
    session({
      secret: 'grant',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: true, sameSite: 'none' }
    }),
    grant(options),
    handler
  ]
}

module.exports = storyblokAuth
