import { Header } from "../views/header.js";
import { FiltersBar } from "../views/filtersBar.js";
import { loginModal } from "../views/loginModal.js";
import { userDetailsModal } from "../views/userDetailsModal.js";
import { Footer } from "../views/footer.js";
import { parseCookie } from "../utils.js";


export const generateHTML = async (store) => {
    store.resp.status = 200
    store.resp.content =     /*html*/`
    <html lang="en" data-theme="emerald">
        <head>
            <meta charset="UTF-8">
            <title>${store.page.title}</title>
            <link rel="icon" type="image/x-icon" href="/pub/favicon.ico">

            <meta name="description" content="${store.page.descr}">
            <head prefix="og: http://ogp.me/ns#">
            <meta property="og:type" content="article">
            <!-- More elements slow down JSX, but not template literals. -->
            <meta property="og:title" content="${store.page.title}">

            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css" rel="stylesheet" type="text/css" />
            <script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"></script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css">

            <script src="https://apis.google.com/js/platform.js" async defer></script>
        </head>
        <body class="">
            ${await Header(store)}
            ${await FiltersBar()}
            <div class="px-16 mt-16">
                ${store.page.content}
            </div>
            ${await loginModal(store)}
            ${await userDetailsModal(store)}
            ${await Footer()}
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
        </script>
    </html>
    `
}