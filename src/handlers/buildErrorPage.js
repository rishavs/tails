let errors =  {
    '401': {
        msg: "You are not authorized to access this page",
        haikus: [
            `Unauthorized here, Access denied, I fear, Login, to come near.`,
            `Four zero one cries, Credentials, it denies, In secrecy, it lies.`,
            `Access, it has fled, Four zero one, full of dread, "Not here," it has said.`,
            `In the web's vast sea, Four zero one, not free, Where could the key be?`,
            `A 401 blunder, Access, torn asunder, Lost in the web's thunder.`
        ]
    },
    '404': {
        msg: "Page Not Found",
        haikus: [
            `Page not found,<br> oh dear, The path is no longer clear,<br> Lost in the web's frontier.`,
            `Four zero four cries,<br> The sought page, a ghost, it lies,<br> In the web's vast skies.`,
            `The page, it has fled,<br> Four zero four, full of dread,<br> "Not here," it has said.`,
            `In the web's vast sea,<br> Four zero four, lost, carefree,<br> Where could the page be?`,
            `A 404 blunder,<br> The page, torn asunder,<br> Lost in the web's thunder.`
        ]
    },
    '500' : {
        msg: "Internal Server Error",
        haikus: [
            `Five hundred, a sigh, Server's internal outcry, A fix, we must apply.`,
            `Internal error screams, Shattering digital dreams, Not as easy as it seems.`,
            `Server's silent plea, Five hundred, a mystery, In code, the key.`,
            `A glitch in the core, Five hundred, can't ignore, Need to rectx.`,
            `A 500 plight, In the server's endless night, Seeking the light.`
        ]
    },
    '503': {
        msg: "Service Unavailable",
        haikus: [
            `Five zero three, a pause, Service unavailable, cause, Time to debug laws.`,
            `Service, it retreats, Five zero three, it repeats, Until the issue depletes.`,
            `Unavailable, it moans, Five zero three, it groans, In the server's twilight zones.`,
            `A 503 blip, Service took a trip, Need to regain grip.`,
            `Five zero three, a sign, Service, not in line, A solution, we must design.`
        ]
    }
}

export const buildErrorPage = (ctx, e) => {
    let errCodeFromParams = ctx.req.params.get("code")
    let errMsgFromParams = ctx.req.params.get("msg")

    if (errCodeFromParams && !["400", "401", "404", "503"].includes(errCodeFromParams)) {
        errCodeFromParams = "500"
    }

    let errorCode = parseInt(errCodeFromParams) || 500
    let errorMsg = errMsgFromParams || e.cause || errors[errorCode].msg

    let haiku = errors[errCodeFromParams] && errors[errCodeFromParams].haikus ?
        errors[errCodeFromParams].haikus[Math.floor(Math.random() * errors[errCodeFromParams].haikus.length)] : '';
    
    console.log(`Error: ${errCodeFromParams} - ${errorMsg}`)
    
    ctx.page.title = "ERROR Page"
    ctx.page.descr = "This is the error page"
    ctx.page.html = /*html*/`
        <article class="prose lg:prose-lg text-center pt-16">
            <h1>Error ${errCodeFromParams} :( </h1>
            <h3> ${ errorMsg} </h3>
            <small> <i>
                ${haiku}
            </i></small>
        </article>
    `
}