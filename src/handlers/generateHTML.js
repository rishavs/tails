import { drawer } from "../views/drawer"
import { header } from "../views/header"
import { themeModal } from "../views/themeModal"

export const generateHTML = (ctx) => {
    ctx.res.content =     /*html*/`
    <!DOCTYPE html>
    <html lang="en" data-theme="wintermoon">

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
            <script src="https://accounts.google.com/gsi/client" defer></script>
            <script src="/pub/app.js" type="module" defer></script>

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
                        <header id="header_container" class="navbar sticky top-0 bg-primary opacity-90 rounded-b-box lg:rounded-box border border-base-300 shadow-lg h-8 lg:h-20 z-10">
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
            <div id = "modals_container">
                ${themeModal()}
            </div>
            <div id = "toasts_container" class="toast toast-top toast-end z-100"></div>
            <div id = "floaters_container"></div>
        </body>
    </html>
    `
}