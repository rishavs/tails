import { sayHello } from "./handlers/sayHello";
import { signinGoogleUser } from "./handlers/signinGoogleUser";

import { buildAboutPage } from "./handlers/buildAboutPage";
import { generateHTML } from './handlers/generateHTML';

import { buildHomePage } from './handlers/buildHomePage';
import { buildPostDetailsPage } from './handlers/buildPostDetailsPage';
import { generateAuthPage } from './handlers/generateAuthPage';
import { buildErrorPage } from "./handlers/buildErrorPage";

let routes = {
    // API Routes
    "GET/api/hello"             : [() => console.log("YOYO"), sayHello],
    "GET/api/raiseError"        : [() => {throw new Error(418, { cause: "This is TEAPOT!" })}],
    "POST/api/signinGoogleUser" : [signinGoogleUser], //createSession, 
    
    // Static Routes
    "GET/"                      : [buildHomePage, generateHTML],
    "GET/about"                 : [buildAboutPage, generateHTML],
    "GET/authenticate"          : [generateAuthPage],

    // Dynamic Routes
    "GET/p/:id"                 : [buildPostDetailsPage, generateHTML],
}

export default {
	async fetch(request, env, ctx) {
        // let enc = new TextEncoder()
        // let payload = enc.encode(JSON.stringify({
        //     name: "Pika Pika Pika Choooo",
        //     slug: "abcd"
        // }))

        // let key = await crypto.subtle.generateKey(
        //     {
        //       name: "HMAC",
        //       hash: { name: "SHA-512" },
        //     },
        //     true,
        //     ["sign", "verify"]
        // );
        // let exportedKey = await crypto.subtle.exportKey("jwk", key)
        // let portableKey = await JSON.stringify(exportedKey)

        // console.log(portableKey)

        // // now generate a jwt with the payload using the key
        // let jwt = await crypto.subtle.sign("HMAC", key, payload)
        // console.log(jwt)

        // const sess = await env.SESSIONS.list()
        // console.log("SESSIONS: ", sess)
        // sess.keys.forEach(function(entry) {
        //     console.log(entry);
        // });
        // const bg = await env.BAG.list()
        // console.log("BAG: ", bg)
        // bg.keys.forEach(function(entry) {
        //     console.log(entry);
        // });

		const url   = new URL(request.url);

        // ------------------------------------------
        // Serve Static assets -  don't handle 404s
        // ------------------------------------------
        if (url.pathname.startsWith("/pub")) {
            return env.ASSETS.fetch(request);
        }

        // ------------------------------------------
        // Setup routes
        // ------------------------------------------
        let handlers

        let store   = {
            conn        : null,
            user        : {
                slug        : null,
                name        : null,
                thumb       : null, 
                honorific   : null, 
                flair       : null,
                role        : null,
                level       : null,

                sessionID   : null,
                googleID    : null,
                appleID     : null,
            },
            request     : request,
            env         : env,
            page            : {
                path        : url.pathname,
                // redirectTo  : url.searchParams.get("redirectTo"),
                redirectTo  : null,
                nonce       : null,
                kind        : null,
                id          : null,
                title       : null,
                descr       : null,
                content     : null,
            }, 
            resp        : {
                content     : "",
                status      : 200,
                headers     : new Headers()
            }
        }
        // ------------------------------------------
        // handle APIs
        // ------------------------------------------
        if (url.pathname.startsWith("/api")) {
            store.resp.headers.append('content-type', 'application/json;charset=UTF-8')
            store.resp.headers.append('Powered-by', 'API: Pika Pika Pika Choooo')

            handlers = routes[`${request.method}${url.pathname}`];

        // ------------------------------------------
        // handle Dynamic Routes
        // ------------------------------------------
        } else {
            // Generate nonce for authentication
            // store.page.nonce = crypto.randomUUID()
            // console.log("GENERATED NONCE: ", store.page.nonce)

            // Set headers
            store.resp.headers.append('Powered-by', 'VIEW: Pika Pika Pika Choooo')
            store.resp.headers.append('Content-Type', 'text/html; charset=UTF-8')

            let urlFrag = url.pathname.split('/').filter((a) => a)
            store.page.kind = urlFrag[0]
            store.page.id   = urlFrag[1]

            if (urlFrag[1]) {
                urlFrag[1] = ":id"
            }
    
            let cleanedURL = `${request.method}/${urlFrag.join('/')}`

            if (cleanedURL in routes) {
                handlers = routes[cleanedURL];
            } else {
                handlers = [() => { throw new Error(404, { cause: "Not all who wander are lost" })}]
            }
        }

        // ------------------------------------------
        // Serve the chosen Handler
        // ------------------------------------------

        try {
            // store.conn = connect(DBConfig);
            // const results = await conn.execute('select * from posts')
            // console.log(results)

            for (const handler of handlers) {
                await handler(store)
            }

            // redirect to path if the flag is set
            if (store.page.redirectTo) {
                // For now we only handle redirects to the our domain
                let destination = `${url.protocol}//${url.host}${store.page.redirectTo}`
                console.log("REDIRECTING TO: ", destination)
                // Reset the redirect flsg to protect from loops
                store.page.redirectTo = null
                return Response.redirect(destination, 302);
            }
        } catch (e) {
            console.log(e)
            store.resp.content = "ERROR: \n" + e;
            if (e.message in [401, 404, 500]) {
                store.resp.status = e.message
            } else {
                store.resp.status = 500
            }

            // Build the error page
            if (!url.pathname.startsWith("/api")) {
                await buildErrorPage(store, e)
                await generateHTML(store)
            }
        }
        // content = showAboutPage(request, env, ctx);
        return new Response(store.resp.content, { status: store.resp.status, headers: store.resp.headers})

	}
}
