import { APIGatewayEventRequestContextV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'

/**
 * Handler Event
 * 
 * @typedef HandlerEvent
 * @augments APIGatewayProxyEventV2
 */
export interface HandlerEvent extends APIGatewayProxyEventV2 {
    body: string | any
}

/**
 * Handler Context
 * 
 * @typedef HandlerContext
 * @augments APIGatewayEventRequestContextV2
 */
export interface HandlerContext extends APIGatewayEventRequestContextV2 {}

/**
 * Handler Response
 * 
 * @typedef HandlerResponse
 * @augments APIGatewayProxyResultV2
 */
export type HandlerResponse = APIGatewayProxyResultV2

/**
 * Route Object
 * 
 * @typedef Route
 * @property {string} method HTTP request method
 * @property {string} url URL String
 * @property {RouterHandler[]} handlers Array of handler functions
 */
export interface Route {
    method: string
    url: string
    handlers: RouterHandler[]
}

/**
 * Router Context
 * 
 * @typedef RouterContext
 * @property {RouterEnv>} env Environment
 * @property {RouterRequest} req Request Object
 * @property {RouterResponse} res Response Object
 * @property {RouterNext} next Next Handler
 */
export interface RouterContext {
    env: RouterEnv
    req: RouterRequest
    res: RouterResponse
    next: RouterNext
    [key: string]: any
}

/**
 * Router Env
 * 
 * @typedef RouterEnv
 */
export interface RouterEnv {
    [key: string]: string
}

/**
 * Request Object
 * 
 * @typedef RouterRequest
 * @property {string} url URL
 * @property {string} method HTTP request method
 * @property {RouterRequestParams} params Object containing all parameters defined in the url string
 * @property {RouterRequestQuery} query Object containing all query parameters
 * @property {RouterRequestHeaders} headers Request headers object
 * @property {string | any} body Only available if method is `POST`, `PUT`, `PATCH` or `DELETE`. Contains either the received body string or a parsed object if valid JSON was sent.
 */
export interface RouterRequest {
    url: string
    method: string
    params: RouterRequestParams
    query: RouterRequestQuery
    headers: RouterRequestHeaders
    body: string | any
    [key: string]: any
}

/**
 * Request Parameters
 * 
 * @typedef RouterRequestParams
 */
export interface RouterRequestParams {
    [key: string]: string
}

/**
 * Request Query
 * 
 * @typedef RouterRequestQuery
 */
export interface RouterRequestQuery {
    [key: string]: string
}

/**
 * Request Headers
 * 
 * @typedef RouterRequestHeaders
 */
export interface RouterRequestHeaders {
    [key: string]: string
}

/**
 * Response Object
 * 
 * @typedef RouterResponse
 * @property {RouterResponseHeaders} headers Response headers object
 * @property {number} [status=204] Return status code (default: `204`)
 * @property {any} [body] Either an `object` (will be converted to JSON) or a string
 * @property {APIGatewayProxyResultV2} [raw] A response object that is to be returned, this will void all other res properties and return this as is.
 */
export interface RouterResponse {
    headers: RouterResponseHeaders
    status?: number
    body?: any
    raw?: APIGatewayProxyResultV2
}

/**
 * Response Headers
 * 
 * @typedef RouterResponseHeaders
 */
export interface RouterResponseHeaders {
    [key: string]: string
}

/**
 * Next Function
 * 
 * @callback RouterNext
 * @returns {Promise<void>}
 */
export interface RouterNext {
    (): Promise<void>
}

/**
 * Handler Function
 * 
 * @callback RouterHandler
 * @param {RouterContext} ctx
 * @returns {Promise<void> | void}
 */
export interface RouterHandler {
    (ctx: RouterContext): Promise<void> | void
}

/**
 * CORS Config
 * 
 * @typedef RouterCorsConfig
 * @property {string} [allowOrigin="*"] Access-Control-Allow-Origin (default: `*`)
 * @property {string} [allowMethods="*"] Access-Control-Allow-Methods (default: `*`)
 * @property {string} [allowHeaders="*"] Access-Control-Allow-Headers (default: `*`)
 * @property {number} [maxAge=86400] Access-Control-Max-Age (default: `86400`)
 * @property {number} [optionsSuccessStatus=204] Return status code for OPTIONS request (default: `204`)
 */
export interface RouterCorsConfig {
    allowOrigin: string
    allowMethods: string
    allowHeaders: string
    maxAge: number
    optionsSuccessStatus: number
}

/**
 * Router
 * 
 * @public
 * @class
 */
export default class Router {

    /**
     * Router Array
     * 
     * @protected
     * @type {Route[]}
     */
    protected routes: Route[] = []

    /**
     * Global Handlers
     * 
     * @proteced
     * @type {RouterHandler[]}
     */
    protected globalHandlers: RouterHandler[] = []

    /**
     * Debug Mode
     * 
     * @protected
     * @type {boolean}
     */
    protected debugMode: boolean = false

    /**
     * CORS Config
     * 
     * @protected
     * @type {RouterCorsConfig}
     */
    protected corsConfig: RouterCorsConfig = {
        allowOrigin: '*',
        allowMethods: '*',
        allowHeaders: '*',
        maxAge: 86400,
        optionsSuccessStatus: 204
    }

    /**
     * Register global handlers
     * 
     * @param {RouterHandler[]} handlers
     * @returns {Router}
     */
    public use(...handlers: RouterHandler[]): Router {
        for (let handler of handlers) {
            this.globalHandlers.push(handler)
        }
        return this
    }

    /**
     * Register CONNECT route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public connect(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('CONNECT', url, handlers)
    }

    /**
     * Register DELETE route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public delete(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('DELETE', url, handlers)
    }

    /**
     * Register GET route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public get(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('GET', url, handlers)
    }

    /**
     * Register HEAD route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public head(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('HEAD', url, handlers)
    }

    /**
     * Register OPTIONS route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public options(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('OPTIONS', url, handlers)
    }

    /**
     * Register PATCH route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public patch(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('PATCH', url, handlers)
    }

    /**
     * Register POST route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public post(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('POST', url, handlers)
    }

    /**
     * Register PUT route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public put(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('PUT', url, handlers)
    }

    /**
     * Register TRACE route
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public trace(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('TRACE', url, handlers)
    }

    /**
     * Register route, ignoring method
     * 
     * @param {string} url 
     * @param  {RouterHandler[]} handlers 
     * @returns {Router}
     */
    public any(url: string, ...handlers: RouterHandler[]): Router {
        return this.register('*', url, handlers)
    }

    /**
     * Debug Mode
     * 
     * @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
     * @returns {Router}
     */
    public debug(state: boolean = true): Router {
        this.debugMode = state
        return this
    }

    /**
     * Enable CORS support
     * 
     * @param {RouterCorsConfig} [config]
     * @returns {Router}
     */
    public cors(config?: RouterCorsConfig): Router {
        this.corsConfig = {
            allowOrigin: config?.allowOrigin || '*',
            allowMethods: config?.allowMethods || '*',
            allowHeaders: config?.allowHeaders || '*, Authorization',
            maxAge: config?.maxAge || 86400,
            optionsSuccessStatus: config?.optionsSuccessStatus || 204
        }
        return this
    }

    /**
     * Register route
     * 
     * @private
     * @param {string} method HTTP request method
     * @param {string} url URL String
     * @param {RouterHandler[]} handlers Arrar of handler functions
     * @returns {Router}
     */
    private register(method: string, url: string, handlers: RouterHandler[]): Router {
        this.routes.push({
            method,
            url,
            handlers
        })
        return this
    }

    /**
     * Get Route by request
     * 
     * @private
     * @param {Request} request
     * @returns {Route | undefined}
     */
    private getRoute(request: RouterRequest): Route | undefined {
        const url = new URL(request.url)
        const pathArr = url.pathname.split('/').filter(i => i)
        return this.routes.find(r => {
            const routeArr = r.url.split('/').filter(i => i)
            if (![request.method, '*'].includes(r.method) || routeArr.length !== pathArr.length)
                return false
            const params: RouterRequestParams = {}
            for (let i = 0; i < routeArr.length; i++) {
                if (routeArr[i] !== pathArr[i] && routeArr[i][0] !== ':')
                    return false
                if (routeArr[i][0] === ':')
                    params[routeArr[i].substring(1)] = pathArr[i]
            }
            request.params = params
            const query: any = {}
            for (const [k, v] of url.searchParams.entries()) {
                query[k] = v
            }
            request.query = query
            return true
        }) || this.routes.find(r => r.url === '*' && [request.method, '*'].includes(r.method))
    }

    /**
     * Handle requests
     * 
     * @param {APIGatewayProxyEventV2} event
     * @param {Context} context
     * @param {any} [extend={}]
     * @returns {Promise<APIGatewayProxyResultV2>}
     */
    public async handle(event: APIGatewayProxyEventV2, context: Context, extend: any = {}): Promise<APIGatewayProxyResultV2> {
        try {
            const env: RouterEnv = process.env as RouterEnv
            const req: RouterRequest = {
                method: event.requestContext.http.method,
                headers: event.headers as RouterRequestHeaders,
                url: `https://${event.requestContext.domainName}${event.rawPath}`,
                params: (event.pathParameters || {}) as RouterRequestParams,
                query: (event.queryStringParameters || {}) as RouterRequestQuery,
                body: event.body,
                aws: { event, context }
            }
            if (req.method === 'OPTIONS' && Object.keys(this.corsConfig).length) {
                return {
                    headers: {
                        'Access-Control-Allow-Origin': this.corsConfig.allowOrigin,
                        'Access-Control-Allow-Methods': this.corsConfig.allowMethods,
                        'Access-Control-Allow-Headers': this.corsConfig.allowHeaders,
                        'Access-Control-Max-Age': this.corsConfig.maxAge!.toString()
                    },
                    statusCode: this.corsConfig.optionsSuccessStatus
                }
            }
            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                if (req.headers['content-type']?.includes('json')) {
                    try {
                        req.body = JSON.parse(req.body)
                    } catch {
                        req.body = {}
                    }
                }
            }
            if (this.debugMode)
                console.log('REQUEST', req)
            const route = this.getRoute(req)
            if (!route)
                return { statusCode: 404, body: this.debugMode ? 'Route not found!' : undefined }
            const res: RouterResponse = { headers: {} }
            if (Object.keys(this.corsConfig).length) {
                res.headers['Access-Control-Allow-Origin'] = this.corsConfig.allowOrigin
                res.headers['Access-Control-Allow-Methods'] = this.corsConfig.allowMethods
                res.headers['Access-Control-Allow-Headers'] = this.corsConfig.allowHeaders
                res.headers['Access-Control-Max-Age'] = this.corsConfig.maxAge.toString()
            }
            const handlers = [...this.globalHandlers, ...route.handlers]
            let prevIndex = -1
            const runner = async (index: number) => {
                if (index === prevIndex)
                    throw new Error('next() called multiple times')
                prevIndex = index
                if (typeof handlers[index] === 'function')
                    await handlers[index]({ ...extend, env, req, res, next: async () => await runner(index + 1) })
            }
            await runner(0)
            if (typeof res.body === 'object') {
                if (!res.headers['Content-Type'])
                    res.headers['Content-Type'] = 'application/json; charset=utf-8'
                res.body = JSON.stringify(res.body)
            }
            if (res.raw)
                return res.raw
            res.status = res.status || (res.body ? 200 : 204)
            if (this.debugMode)
                console.log('RESPONSE', res)
            return {
                statusCode: res.status,
                headers: res.headers,
                body: [101, 204, 205, 304].includes(res.status) ? undefined : res.body
            }
        } catch(err) {
            if (this.debugMode)
                console.error(err)
            return {
                statusCode: 500,
                body: this.debugMode && err instanceof Error ? err.stack : undefined
            }
        }
    }
}
