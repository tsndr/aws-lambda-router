# AWS Lambda Router

AWS Lambda Router is a super lightweight router (2.30 KiB) with middleware support and **ZERO dependencies** for [AWS Lambda](https://aws.amazon.com/lambda/).

I worked a lot with [Express.js](https://expressjs.com/) in the past and really enjoyed their middleware approach.

This is a port of [@tsndr/cloudflare-worker-router](/tsndr/cloudflare-worker-router).

## Contents

- [Usage](#usage)
- [Reference](#reference)
- [Setup](#setup)


## Usage

### Simple Example

```javascript
import Router from '@tsndr/aws-lambda-router'

// Initialize router
const router = new Router()

// Enabling buildin CORS support
router.cors()

// Register global middleware
router.use(({ req, res, next }) => {
  res.headers.set('X-Global-Middlewares', 'true')
  next()
})

// Simple get
router.get('/user', ({ req, res }) => {
  res.body = {
    data: {
      id: 1,
      name: 'John Doe'
    }
  }
})

// Post route with url parameter
router.post('/user/:id', ({ req, res }) => {

  const userId = req.params.id
  
  // Do stuff...
  
  if (errorDoingStuff) {
    res.status = 400
    res.body = {
      error: 'User did stupid stuff!'
    }
    return
  }
  
  res.status = 204
})

// Delete route using a middleware
router.delete('/user/:id', ({ req, res, next }) => {

  if (!apiTokenIsCorrect) {
    res.status = 401
    return
  }
  
  await next()
}, ({ req, res }) => {

  const userId = req.params.id
  
  // Do stuff...
})

// Listen AWS API Gateway Event
export const handler = (event, context) => {
  return router.handle(event, context)
}
```


## Reference

### `router.debug([state = true])`

Enable or disable debug mode. Which will return the `error.stack` in case of an exception instead of and empty `500` response. Debug mode is disabled by default.


#### `state`
State is a `boolean` which determines if debug mode should be enabled or not (default: `true`)


### `router.use([...handlers])`

Register a global middleware handler.


#### `handler(ctx)`

Handler is a `function` which will be called for every request.

#### `ctx`
Object containing `env`, [`req`](#req-object), [`res`](#res-object), `next`


### `router.cors([config])`

If enabled will overwrite other `OPTIONS` requests.


#### `config` (object, optional)

Key                    | Type      | Default Value
---------------------- | --------- | -------------
`allowOrigin`          | `string`  | `*`
`allowMethods`         | `string`  | `*`
`allowHeaders`         | `string`  | `*`
`maxAge`               | `integer` | `86400`
`optionsSuccessStatus` | `integer` | `204`


### `router.any(url, [...handlers])`
### `router.connect(url, [...handlers])`
### `router.delete(url, [...handlers])`
### `router.get(url, [...handlers])`
### `router.head(url, [...handlers])`
### `router.options(url, [...handlers])`
### `router.patch(url, [...handlers])`
### `router.post(url, [...handlers])`
### `router.put(url, [...handlers])`
### `router.trace(url, [...handlers])`

#### `url` (string)

The URL starting with a `/`.
Supports the use of dynamic parameters, prefixed with a `:` (i.e. `/user/:userId/edit`) which will be available through the [`req`-Object](#req-object) (i.e. `req.params.userId`).


#### `handlers` (function, optional)

An unlimited number of functions getting [`req`](#req-object) and [`res`](#res-object) passed into them.


### `ctx`-Object
Key       | Type                | Description
--------- | ------------------- | -----------
`env`     | `object`            | Environment
`req`     | `req`-Object        | Request Object
`res`     | `res`-Object        | Response Object
`next`    | `next`-Handler      | Next Handler


### `req`-Object

Key       | Type                | Description
--------- | ------------------- | -----------
`body`    | `object` / `string` | Only available if method is `POST`, `PUT`, `PATCH` or `DELETE`. Contains either the received body string or a parsed object if valid JSON was sent.
`headers` | `object`            | Request Headers Object
`method`  | `string`            | HTTP request method
`params`  | `object`            | Object containing all parameters defined in the url string
`query`   | `object`            | Object containing all query parameters


### `res`-Object

Key         | Type                | Description
----------- | ------------------- | -----------
`body`      | `object` / `string` | Either set an `object` (will be converted to JSON) or a string
`headers`   | `object`            | Response Headers Object
`status`    | `integer`           | Return status code (default: `204`)
`webSocket` | `WebSocket`         | Upgraded websocket connection


## Setup

```bash
npm i -D @tsndr/aws-lambda-router
```

and replace your `index.ts` / `index.js` with one of the following scripts

<details>
<summary>TypeScript (<code>src/index.ts</code>)</summary>

```typescript
import Router from '@tsndr/aws-lambda-router'

const router = new Router()

// TODO: add your routes here

export const handler: APIGatewayProxyHandlerV2<APIGatewayProxyEventV2> = (event, context) => {
    return router.handle(event, context)
}
```
</details>

<details>
<summary>JavaScript (<code>src/index.js</code>)</summary>

```javascript
import Router from '@tsndr/aws-lambda-router'

const router = new Router()

// TODO: add your routes here

export const handler = (event, context) => {
  return router.handle(event, context)
}
```
</details>