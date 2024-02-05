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
var CommunityLinks = {
  "faqs": "FAQs",
  "rules": "Guidelines",
  "cont": "Contact Us"
};
var LegalLinks = {
  "terms": "Terms of Use",
  "priv": "Privacy Policy",
  "cook": "Cookie Policy"
};

// src/views/drawer.js
var navBuilder = (ctx, group) => {
  let currPath = ctx.req.path.split("/")[1];
  return Object.keys(group).map((link) => {
    return (
      /*html*/
      `
        <li><a class="hover:underline${currPath == link ? " active" : ""}" href="/${link}">
            ${group[link]}
        </a></li>`
    );
  }).join("");
};
var drawer = (ctx, prefix) => {
  return (
    /*html*/
    `
    <ul class="menu menu-lg min-h-screen px-8 w-64 flex flex-col gap-2 lg:gap-4 sticky top-0 bg-base-200">
        <li>
            <details open>
                <summary class="group"> Category</summary> 
                <ul class="flex flex-col gap-1 lg:gap-2">
                    <li><a id="all_link" class="hover:underline${ctx.req.path == "/" ? " active" : ""}" href="/">All</a></li>
                    ${navBuilder(ctx, PostCategories)}
                </ul>
            </details> 
        </li>
        <li>
            <details class="border-t border-base-300">
                <summary class="group"> Community</summary> 
                <ul>
                    ${navBuilder(ctx, CommunityLinks)}
                </ul>
            </details> 
        </li>
        <li>
            <details class="border-t border-base-300">
                <summary class="group"> Legal</summary> 
                <ul>
                    ${navBuilder(ctx, LegalLinks)}
                </ul>
            </details> 
        </li>
    </ul>
`
  );
};

// src/views/header.js
var view = (ctx) => (
  /*html*/
  `
<div class="navbar-start">
    <label for="left-drawer" class="btn btn-ghost drawer-button lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
    </label>
    <a class="btn btn-ghost p-0 lg:btn-lg text-2xl lg:text-4xl drop-shadow bg-gradient-to-r from-error to-warning text-transparent bg-clip-text" href="/">
        <!--<div class="avatar hidden">
            <div class="w-12 lg:w-16">
                <img src="/pub/logo.png" alt="logo" loading="lazy" decoding=""/>
            </div>
        </div>-->
        Digglu
    </a>
    </div>

    <div class="navbar-center gap-2 items-center"></div>

    <div class="navbar-end items-center">
    <button class="btn btn-sm lg:btn-md btn-square">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 lg:w-6 lg:h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

    </button>
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-sm lg:btn-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 lg:w-6 lg:h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
            </svg>
    
        </div>
        
        <!-- Theme picker! -->
        <ul tabindex="0" class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
            <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Default" value="default"/></li>
            ${[
    "acid",
    "aqua",
    "aquafina",
    "autumn",
    "black",
    "bumblebee",
    "business",
    "cmyk",
    "coffee",
    "corporate",
    "cupcake",
    "cyberpunk",
    "dark",
    "darksun",
    "dim",
    "dracula",
    "emerald",
    "fantasy",
    "forest",
    "garden",
    "halloween",
    "lemonade",
    "light",
    "lofi",
    "lux",
    "luxury",
    "night",
    "nord",
    "pastel",
    "retro",
    "sunset",
    "synthwave",
    "valentine",
    "winter",
    "wireframe"
  ].map((theme) => (
    /*html*/
    `
                <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="${theme}" value="${theme}"/></li>
                `
  )).join("")}
        </ul>
    </div>

    <div id="loginControls" class="mx-1 flex items-center" >
    </div>
</div>
`
);
var header = (ctx) => {
  return view(ctx);
};

// src/handlers/generateHTML.js
var generateHTML = (ctx) => {
  ctx.res.content = /*html*/
  `
    <!DOCTYPE html>
    <html lang="en" data-theme="dracula">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <title>${ctx.page.title}</title>
            <link rel="icon" type="image/x-icon" href="/pub/favicon.ico">

            <meta name="description" content="${ctx.page.descr}">
            <head prefix="og: http://ogp.me/ns#">
            <meta property="og:type" content="article">
            <meta property="og:title" content="${ctx.page.title}">

            <link href="/pub/styles.css" rel="stylesheet" type="text/css">
            <script src="/pub/main.js" type="module" ><\/script>

        </head>

        <body class="min-h-screen bg-base-200">

            <div id = "alerts_container"></div>

            <!-- left drawer -->
            <div class="drawer">
            
                <!-- Left nav slider. For mobile -->
                <input id="left-drawer" type="checkbox" class="drawer-toggle">
                <div class="drawer-side z-20">
                    <label for="left-drawer" class="drawer-overlay"></label>

                    ${drawer(ctx, "navslider")}
                </div>
                
                <div class="drawer-content flex">
        
                    <!-- Left fixed Panel. For lg screens -->
                    <aside id="drawer_container" class="hidden lg:flex justify-end items-start grow min-w-80 border border-base-300 pt-48">
                        ${drawer(ctx, "navpanel")}
                    </aside>
                    
                    <!-- Central Column -->
                    <div class="grow-0 w-full lg:min-w-[128] lg:w-[50rem] lg:pt-8 lg:px-4">
        
                    <!-- Header Content -->
                        <header id="header_container" class="navbar sticky top-0 bg-base-100 opacity-90 rounded-b-box lg:rounded-box border border-base-300 shadow-lg h-8 lg:h-20 z-10">
                            ${header(ctx)}
                        </header>

                        <!-----------------------
                        Noscript Content
                        ------------------------>
                        <noscript >
                            <article class="prose lg:prose-lg text-center pt-16">
                                <h1>Error: Javascript is disabled.</h1>
                                <br>
                                <h3>Digglu needs Javascript to function properly.</h3>
                                <h3>Please enable Javascript in your browser and refresh the page. </h3>
                                <br>
                                <br>
                                <small> <i> " Without script's embrace,</i></small>
                                <small> <i> Digglu loses its grace,</i></small>
                                <small> <i> Lost in cyberspace. " </i></small>
                            </article>
                        </noscript>
                        
                        <!-- Main Page Content -->
                        <main id="main_container">
                            ${ctx.page.html}
                        </main>
                    </div>
        
                    <!-- Right Sidepanel -->
                    <aside id="sidePanel_container" class="hidden lg:flex justify-start grow min-w-80 pt-48 flex-col gap-4"> 
                        <div id="topPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="trendingPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="discussionPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="latestPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="historyPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                    </aside>
                                        
                </div>
            </div>
            <div id = "toasts_container" class="toast toast-top toast-end z-100"></div>
        
        
            <div id = "floaters_container"></div>
        </body>
    </html>
    `;
};

// src/handlers/buildErrorPage.js
var haikus = {
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
  500: [
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
};
var buildErrorPage = (ctx, e) => {
  let errorCode = e.message || 500;
  let errorMsg = e.cause || "Internal Server Error";
  ctx.page.title = "ERROR Page";
  ctx.page.descr = "This is the error page";
  ctx.page.html = /*html*/
  `
        <article class="prose lg:prose-lg text-center pt-16">
            <h1>Error ${errorCode} :( </h1>
            <h3> 
                ${errorCode == 401 ? "You are not authorized to access this page" : errorCode == 404 ? "Page Not Found" : errorCode == 503 ? "Service Unavailable" : "Unknown Error"}
            </h3>
            <small> <i>
                ${haikus[errorCode][Math.floor(Math.random() * haikus[errorCode].length)]}
            </i></small>
        </article>
    `;
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
        path: url.pathname.toLowerCase(),
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
          let urlFrag = ctx.req.path.split("/");
          if (urlFrag[1] && Object.keys(PostCategories).includes(urlFrag[1])) {
            urlFrag[1] = ":cat";
          }
          if (urlFrag[2]) {
            urlFrag[2] = ":slug";
          }
          route = urlFrag.join("/");
          console.log("Dynamic route: ", route);
        }
        try {
          if (route in pages) {
            for (const handler of pages[route]) {
              handler(ctx);
            }
            ctx.res.status = 200;
          } else {
            throw new Error("404", { cause: "Not Found" });
          }
        } catch (e) {
          console.log(e);
          if (["400", "401", "404", "503"].includes(e.message)) {
            ctx.res.status = parseInt(e.message);
          } else {
            ctx.res.status = 500;
          }
          setHeaders(ctx);
          buildErrorPage(ctx, e);
          generateHTML(ctx);
        }
        break;
    }
    return new Response(ctx.res.content, { status: ctx.res.status, headers: ctx.res.headers });
  }
};
export {
  server_default as default
};
