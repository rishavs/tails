export const showAuthPage = async (store) => {  
    store.resp.status = 200
    const dest = new URL(store.request.url).searchParams.get('redirectTo') || "/"
    // store.page.redirectTo = dest

    console.log("in Auth page", dest)

    store.resp.content = /*html*/ `
        <article class="min-h-screen">
            <p>Logging in....</p>
        </article>
        <script>
            window.location.replace("${store.env.HOST}${dest}")
        </script>
    `
}