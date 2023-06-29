export const buildAboutPage = async (store) => {
    store.page.title = "META: About Page"
    store.page.descr = "META: This is the about page"
    store.page.content = /*html*/ `
        <article class="min-h-screen">
            <h1>ABOUT Page</h1>
        </article>
        `
}