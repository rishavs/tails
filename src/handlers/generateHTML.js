export const generateHTML = (ctx) => {
    ctx.res.status = 200
    ctx.res.content =     /*html*/`
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
        </script>
    </html>
    `
}