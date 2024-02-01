export const buildAboutPage = (ctx) => {
    ctx.page.title = "META: About Page"
    ctx.page.descr = "META: This is the about page"
    ctx.page.html = /*html*/ `
            <article class="min-h-screen">
                <h1>ABOUT Page</h1>
            </article>
        `
}