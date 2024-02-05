let haikus =  {
    401: [
        `Unauthorized here, Access denied, I fear, Login, to come near.`,
        `Four zero one cries, Credentials, it denies, In secrecy, it lies.`,
        `Access, it has fled, Four zero one, full of dread, "Not here," it has said.`,
        `In the web's vast sea, Four zero one, not free, Where could the key be?`,
        `A 401 blunder, Access, torn asunder, Lost in the web's thunder.`
    ],
    404: [
        `Page not found,<br> oh dear, The path is no longer clear,<br> Lost in the web's frontier.`,
        `Four zero four cries,<br> The sought page, a ghost, it lies,<br> In the web's vast skies.`, 
        `The page, it has fled,<br> Four zero four, full of dread,<br> "Not here," it has said.`,
        `In the web's vast sea,<br> Four zero four, lost, carefree,<br> Where could the page be?`,
        `A 404 blunder,<br> The page, torn asunder,<br> Lost in the web's thunder.`
    ],
    500 : [
        `Five hundred, a sigh, Server's internal outcry, A fix, we must apply.`,
        `Internal error screams, Shattering digital dreams, Not as easy as it seems.`,
        `Server's silent plea, Five hundred, a mystery, In code, the key.`,
        `A glitch in the core, Five hundred, can't ignore, Need to rectx.`,
        `A 500 plight, In the server's endless night, Seeking the light.`
    ], 
    503: [
        `Five zero three, a pause, Service unavailable, cause, Time to debug laws.`,
        `Service, it retreats, Five zero three, it repeats, Until the issue depletes.`,
        `Unavailable, it moans, Five zero three, it groans, In the server's twilight zones.`,
        `A 503 blip, Service took a trip, Need to regain grip.`,
        `Five zero three, a sign, Service, not in line, A solution, we must design.`
    ]
}

export const buildErrorPage = (ctx, e) => {
    let errCodeFromParams = ctx.req.params.get("code")
    let errMsgFromParams = ctx.req.params.get("msg")

    console.log(`Error: ${errCodeFromParams} - ${errMsgFromParams}`)

    let errorCode = e.message || 500
    let errorMsg = e.cause ||
        errorCode == 401 ? "You are not authorized to access this page" :
        errorCode == 404 ? "Page Not Found" :
        errorCode == 503 ? "Service Unavailable" :
        "Unknown Error"

    ctx.page.title = "ERROR Page"
    ctx.page.descr = "This is the error page"
    ctx.page.html = /*html*/`
        <article class="prose lg:prose-lg text-center pt-16">
            <h1>Error ${errorCode} :( </h1>
            <h3> ${ errorMsg} </h3>
            <small> <i>
                ${haikus[errorCode][Math.floor(Math.random() * haikus[errorCode].length)]}
            </i></small>
        </article>
    `
}