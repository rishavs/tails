
export const setHeaders = (ctx) => {

    // ------------------------------------------
    // Set Content Type
    // ------------------------------------------
    if (ctx.req.url.pathname.startsWith("/api")) {
        ctx.res.headers.append('content-type', 'application/json;charset=UTF-8')
        ctx.res.headers.append('Powered-by', 'API: Pika Pika Pika Choooo')
    } else {
        ctx.res.headers.append('Powered-by', 'VIEW: Pika Pika Pika Choooo')
        ctx.res.headers.append('Content-Type', 'text/html; charset=UTF-8')
    }
}