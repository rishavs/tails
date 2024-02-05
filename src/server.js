import { setHeaders } from "./handlers/setHeaders";
import { sayHello } from "./handlers/sayHello";
import { buildAboutPage } from "./handlers/buildAboutPage";
import { generateHTML } from "./handlers/generateHTML";
import { PostCategories } from "./defs";
import { buildErrorPage } from "./handlers/buildErrorPage";
import { signinGoogleUser } from "./handlers/signinGoogleUser";
import { getUserInfo } from "./handlers/getUserInfo";
import { createSession } from "./handlers/createSession";

import { parseCookies } from "./utils";

let apis = {
    "GET/api/hello"          : [setHeaders, sayHello],
    "POST/api/signin/google" : [setHeaders, signinGoogleUser, getUserInfo, createSession],
}

let pages = {
    "/"             : [setHeaders, buildAboutPage, generateHTML],
    "/search"       : [setHeaders, buildAboutPage, generateHTML],
    "/p/new"        : [setHeaders, buildAboutPage, generateHTML],
    "/u/me"         : [setHeaders, buildAboutPage, generateHTML],

    "/err/signin"  : [setHeaders, buildErrorPage, generateHTML],

    "/:cat"         : [setHeaders, buildAboutPage, generateHTML],
    "/p/:slug"      : [setHeaders, buildAboutPage, generateHTML],
    "/u/:slug"      : [setHeaders, buildAboutPage, generateHTML],
    "/c/:slug"      : [setHeaders, buildAboutPage, generateHTML],
}

export default {
    async fetch(request, env) {

        let url = new URL(request.url);
        let params = new URLSearchParams(url.search);

		// ------------------------------------------
        // Create Context Store
        // ------------------------------------------
		let ctx  = {
			req: {
                raw: request,
				url: url,
                path: url.pathname.toLowerCase(),
                cookies: parseCookies(request.headers.get('cookie')),
                params: params,
			},
			env: env,
            page: {
                title: "",
                descr: "",
                html: "",
            },
			res: {
				status: 200,
				headers: new Headers(),
				content: "",
			},
            renderOnAPIErr: false,

		} 

        // console.log("Context: ", ctx)

        // ------------------------------------------
        // Set SID
        // ------------------------------------------
        // console.log("Cookies: ", ctx.req.cookies)
        // if (!ctx.req.cookies.D_SID) {
        //     ctx.res.headers.append('Set-Cookie', `D_SID=${nanoid()}; Path=/; HttpOnly; Secure; SameSite=Strict`)
        // }        

        // ------------------------------------------
        // TODO - sanitize. delete all cookies which are not allowed
        // ------------------------------------------

        // ------------------------------------------
        // TODO - Content Security Policy
        // ------------------------------------------
        // see https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#content_security_policy

        // ------------------------------------------
        // Put on the HELMET!!! TODO
        // ------------------------------------------

        // ------------------------------------------
        // Set CORS - TODO
        // ------------------------------------------

        // ------------------------------------------
        // TODO - serve everything zipped
        // ------------------------------------------

        // ------------------------------------------
        // Enable HSTS - TODO
        // ------------------------------------------
        // ctx.res.headers.append('Strict-Transport-Security', 'max-age=3600; includeSubDomains; preload')
        // ctx.res.headers.append('Upgrade-Insecure-Requests', '1')
        // ctx.res.headers.append('Content-Security-Policy', 'upgrade-insecure-requests')

        // ------------------------------------------
        // Only APIs. Send empty HTML otherwise
        // ------------------------------------------

        let route = ""
        switch (true) {
            case url.pathname.startsWith("/pub"):
                return env.ASSETS.fetch(request);

            case url.pathname.startsWith("/api"):
                route = request.method + url.pathname
                if (route in apis) {
                    try {
                        for (const handler of apis[route]) {
                            await handler(ctx)
                        }
                    } catch (e) {
                        console.error(e)

                        // 500 Internal Server Error - All unhandled errors
                        // 501 Not Implemented
                        // 502 Bad Gateway
                        // 503 Service Unavailable - All handled errors
                        // 504 Gateway Timeout

                        if (["400", "401", "404", "503"].includes(e.message)) {
                            ctx.res.status = parseInt(e.message)
                        } else {
                            ctx.res.status = 500
                        }
                        
                        // Render Error page for special hybrid APIs like Auth
                        // if (ctx.renderOnAPIErr) {
                        //     setHeaders(ctx)
                        //     buildErrorPage(ctx, e)
                        //     generateHTML(ctx)
                        // }
                        
                        // ctx.res.content = JSON.stringify({ 
                        //     error: e.cause || "Internal Server Error"
                        // })
                    }
                } else {
                    ctx.res.status = 404
                    // ctx.res.content = JSON.stringify({ 
                    //     error: "Not Found"
                    // })
                }
                break; 
            default:
                // match static routes
                if (url.pathname in pages) {
                    route = url.pathname

                // match dynamic routes
                } else {
                    let urlFrag = ctx.req.path.split('/')
                    if (urlFrag[1] && Object.keys(PostCategories).includes(urlFrag[1])) {
                            urlFrag[1] = ":cat"
                    }
                    if (urlFrag[2] ) {
                        urlFrag[2] = ":slug"   
                    }
                    route = urlFrag.join('/')
                    console.log("Dynamic route: ", route)
                }

                try {
                    if (route in pages) {
                        for (const handler of pages[route]) {
                            await handler(ctx)
                        }
                        ctx.res.status = 200

                    } else {
                        throw new Error("404", { cause: "Not Found"})

                    }

                } catch (e) {
                    console.error(e)

                    // 500 Internal Server Error - All unhandled errors
                    // 501 Not Implemented
                    // 502 Bad Gateway
                    // 503 Service Unavailable - All handled errors
                    // 504 Gateway Timeout

                    if (["400", "401", "404", "503"].includes(e.message)) {
                        ctx.res.status = parseInt(e.message)
                    } else {
                        ctx.res.status = 500
                    }
                    
                    // Render Error page
                    setHeaders(ctx)
                    buildErrorPage(ctx, e)
                    generateHTML(ctx)
                }
                break;
        }
        return new Response(ctx.res.content, { status: ctx.res.status, headers: ctx.res.headers})
    },
}