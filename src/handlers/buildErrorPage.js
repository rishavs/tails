export const buildErrorPage = async (store, e) => {
    store.page.title = "ERROR Page"
    store.page.descr = "This is the error page"
    store.page.content = /*html*/ `
        <article class="min-h-screen">
            <h1>${e.message} ERROR!</h1>
            <h2>${e.cause}</h2>
            <p>${e.stack}</p>
        </article>
        `
}