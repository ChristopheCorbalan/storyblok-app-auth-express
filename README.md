# Storyblok App Auth (Express)

> A straight forward way to use express with Storyblok Apps

## Requirements

You can create a custom Storyblok app only if you are part of the [partner program](https://www.storyblok.com/partners).

## Installation

`npm install --save storyblok-app-auth-express` 

## Usage Example

Just require the package and use it as a middleware in your Express App.

```js
const express = require('express');
const storyblokAuth = require('storyblok-app-auth-express');

const app = express();
app.use(storyblokAuth({
  client_id: '',
  client_secret: '',
  redirect_uri: 'https://yourapp.com/callback'
}));

app.get('/', async (req, res) => {
  try  {
    const response = await req.storyblok.get('oauth/user_info');
    res.send(`Hello ${response.data.user.friendly_name}!`);
  } catch (e) {
    res.json({ error: e.message  });
  }
});

app.listen(3000);
```

### Using the Storyblok Client Object

As long as you provide the space ID in the query parameters or as segment item (`?space_id` or `/:space_id`) you will be able to use the `req.storyblok` object (like in the example above) which is just a wrapper for the `storyblok-js-client` object ([https://github.com/storyblok/storyblok-js-client](https://github.com/storyblok/storyblok-js-client)).

## License

[MIT License](./LICENSE)