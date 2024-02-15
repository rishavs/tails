import { setHeaders } from "./handlers/setHeaders";
import { sayHello } from "./handlers/sayHello";
import { buildAboutPage } from "./handlers/buildAboutPage";
import { generateHTML } from "./handlers/generateHTML";
import { PostCategories } from "./defs";
import { buildErrorPage } from "./handlers/buildErrorPage";
import { signinGoogleUser } from "./handlers/signinGoogleUser";
import { getUserInfo } from "./handlers/getUserInfo";


import { parseCookies } from "./utils";
import { signout } from "./handlers/signout";
import { buildNewPostPage } from "./handlers/buildNewPostPage";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { validateNewPost } from "./handlers/validateNewPost";
import { saveNewPost } from "./handlers/saveNewPost";
import { getLinkData } from "./handlers/getLinkData";
import { buildPostDetailsPage } from "./handlers/buildPostDetailsPage";

// pass the link directly
getLinkPreview("https://www.youtube.com/watch?v=MejbOFk7H6c").then((data) =>
  console.log(data)
);

let routes = {
    "GET/api/hello"         : [sayHello],
    "POST/api/signin/google": [signinGoogleUser],

    "GET/"             : [buildAboutPage, generateHTML],
    "GET/search"       : [buildAboutPage, generateHTML],
    "GET/p/new"        : [getUserInfo, buildNewPostPage, generateHTML],
    "GET/u/me"         : [buildAboutPage, generateHTML],

    "POST/p/new" : [getUserInfo, validateNewPost, getLinkData, saveNewPost],

    "GET/error"             : [buildErrorPage, generateHTML],
    "GET/signout"           : [signout],

    "GET/:cat"         : [buildAboutPage, generateHTML],
    "GET/p/:slug"      : [buildPostDetailsPage, generateHTML],
    "GET/u/:slug"      : [buildAboutPage, generateHTML],
    "GET/c/:slug"      : [buildAboutPage, generateHTML],
}

export default {
    async fetch(request, env) {
        let url = new URL(request.url);
        let params = new URLSearchParams(url.search);

        // ------------------------------------------
        // Handle static assets
        // ------------------------------------------
        if (url.pathname.startsWith("/pub")) {
            return env.ASSETS.fetch(request);
        }

		// ------------------------------------------
        // Create Context Store
        // ------------------------------------------
		let ctx  = {
			req: {
                raw: request,
				url: url,
                path: url.pathname.toLowerCase(),
                cookies: parseCookies(request.headers.get('cookie') || ""),
                params: params,
			},
			env: env,
            post : null,
            page: {
                title: "",
                descr: "",
                html: "",
            },
			res: {
				status: 200,
				headers: new Headers(),
				content: "",
                errRedirect: null,
                successRedirect: null,
			},
            user: null,

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
        // Handle HEAD method - TODO
        // ------------------------------------------
        // This is for faster liveness checks

        // ------------------------------------------
        // Handle Options - TODO - expand
        // ------------------------------------------
        if (request.method == "OPTIONS") {
            ctx.res.status = 200
            return new Response(null, { status: ctx.res.status, headers: ctx.res.headers})
        }

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

        // ------------------------------------------
        // Handle Requests
        // ------------------------------------------
        try {
            let route = request.method + url.pathname
            if (route in routes){
                for (const handler of routes[route]) {
                    await handler(ctx)
                }
            } else {
                // Dynamic routes
                let urlFrag = ctx.req.path.split('/')
                if (urlFrag[1] && Object.keys(PostCategories).includes(urlFrag[1])) {
                    ctx.page.category = urlFrag[1]
                    urlFrag[1] = ":cat"
                }
                if (urlFrag[2] ) {
                    ctx.page.slug = urlFrag[2]
                    urlFrag[2] = ":slug"   
                }
                route = request.method + urlFrag.join('/')

                console.log("Dynamic route: ", route)
                if (route in routes) {
                    for (const handler of routes[route]) {
                        await handler(ctx)
                    }
                } else {
                    throw new Error("404", { cause: "Not Found"})
                }
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

            if (ctx.res.errRedirect) {
                let params = new URLSearchParams({
                    'code': ctx.res.status,
                    'msg': e.cause
                });
                return Response.redirect(`${url.origin}/error?${params.toString()}`, 302)
            }

            if (!ctx.req.path.startsWith("/api")) {
                // Render Error page
                buildErrorPage(ctx, e)
                generateHTML(ctx)
            }
        }
        
        return new Response(ctx.res.content, { status: ctx.res.status, headers: ctx.res.headers})
    },
}