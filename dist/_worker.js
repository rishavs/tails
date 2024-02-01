// src/handlers/setHeaders.js
var setHeaders = (ctx) => {
  if (ctx.req.url.pathname.startsWith("/api")) {
    ctx.res.headers.append("content-type", "application/json;charset=UTF-8");
    ctx.res.headers.append("Powered-by", "API: Pika Pika Pika Choooo");
  } else {
    ctx.res.headers.append("Powered-by", "VIEW: Pika Pika Pika Choooo");
    ctx.res.headers.append("Content-Type", "text/html; charset=UTF-8");
  }
};

// src/handlers/sayHello.js
var sayHello = (ctx) => {
  ctx.res.status = 200;
  ctx.res.content = JSON.stringify({ message: "Hello from the API" });
};

// src/handlers/buildAboutPage.js
var buildAboutPage = (ctx) => {
  ctx.page.title = "META: About Page";
  ctx.page.descr = "META: This is the about page";
  ctx.page.html = /*html*/
  `
            <article class="min-h-screen">
                <h1>ABOUT Page</h1>
            </article>
        `;
};

// src/handlers/generateHTML.js
var generateHTML = (ctx) => {
  ctx.res.status = 200;
  ctx.res.content = /*html*/
  `
    <html lang="en" data-theme="emerald">
        <head>
            <meta charset="UTF-8">
            <title>${ctx.page.title}</title>
            <link rel="icon" type="image/x-icon" href="/pub/favicon.ico">

            <meta name="description" content="${ctx.page.descr}">
            <head prefix="og: http://ogp.me/ns#">
            <meta property="og:type" content="article">
            <!-- More elements slow down JSX, but not template literals. -->
            <meta property="og:title" content="${ctx.page.title}">

        </head>
        <body class="">
            <div class="px-16 mt-16">
                ${ctx.page.html}
            </div>
        </body>
        <script>
            let clientParams = new URLSearchParams(window.location.search)

            if (clientParams.has("trigger")) {
                const action = clientParams.get("trigger")
                alert("triggered by ", action)
                clientParams.delete("trigger")
                history.replaceState(null, null, "?"+clientParams.toString());
                
                switch (action) {
                    case "fre":
                        alert("FRE")
                        document.getElementById('userDetailsModal').showModal(); 
                        break;       
                    case "session":
                        console.log("Starting new session")
                        window.location.reload(true)
                        break;
                }
                    

            }
        <\/script>
    </html>
    `;
};

// src/defs.js
var PostCategories = {
  meta: "Meta",
  tech: "Science & Tech",
  games: "Gaming",
  world: "World News",
  sport: "Sports",
  biz: "Business",
  life: "Lifestyle",
  media: "Entertainment",
  funny: "Funny",
  cute: "Cute Stuff",
  else: "Everything Else"
};

// src/server.js
var apis = {
  "GET/api/hello": [setHeaders, sayHello]
};
var pages = {
  "/": [setHeaders, buildAboutPage, generateHTML],
  "/search": [setHeaders, buildAboutPage, generateHTML],
  "/p/new": [setHeaders, buildAboutPage, generateHTML],
  "/u/me": [setHeaders, buildAboutPage, generateHTML],
  "/:cat": [setHeaders, buildAboutPage, generateHTML],
  "/p/:slug": [setHeaders, buildAboutPage, generateHTML],
  "/u/:slug": [setHeaders, buildAboutPage, generateHTML],
  "/c/:slug": [setHeaders, buildAboutPage, generateHTML]
};
var server_default = {
  async fetch(request, env) {
    let url = new URL(request.url);
    let ctx = {
      req: {
        raw: request,
        url: new URL(request.url),
        cookies: {},
        formData: {}
      },
      env,
      page: {
        title: "",
        descr: "",
        html: ""
      },
      res: {
        status: 200,
        headers: new Headers(),
        content: ""
      }
    };
    let route = "";
    switch (true) {
      case url.pathname.startsWith("/pub"):
        return env.ASSETS.fetch(request);
      case url.pathname.startsWith("/api"):
        route = request.method + url.pathname;
        if (route in apis) {
          try {
            for (const handler of apis[route]) {
              handler(ctx);
            }
          } catch (e) {
            console.log(e);
            if (["400", "401", "404", "503"].includes(e.message)) {
              ctx.res.status = parseInt(e.message);
            } else {
              ctx.res.status = 500;
            }
          }
        } else {
          ctx.res.status = 404;
        }
        break;
      default:
        if (url.pathname in pages) {
          route = url.pathname;
        } else {
          let urlFrag = ctx.req.url.pathname.toLowerCase().split("/");
          if (urlFrag[1] && Object.keys(PostCategories).includes(urlFrag[1])) {
            urlFrag[1] = ":cat";
          }
          if (urlFrag[2]) {
            urlFrag[2] = ":slug";
          }
          route = urlFrag.join("/");
          console.log("Dynamic route: ", route);
        }
        if (route in pages) {
          try {
            for (const handler of pages[route]) {
              handler(ctx);
            }
          } catch (e) {
            console.log(e);
            if (["400", "401", "404", "503"].includes(e.message)) {
              ctx.res.status = parseInt(e.message);
            } else {
              ctx.res.status = 500;
            }
            ctx.res.content = JSON.stringify({
              error: e.cause || "Internal Server Error"
            });
          }
        } else {
          ctx.res.status = 404;
        }
    }
    return new Response(ctx.res.content, { status: ctx.res.status, headers: ctx.res.headers });
  }
};
export {
  server_default as default
};
