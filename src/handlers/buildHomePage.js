import { fetchAllPosts } from "../database"

export const buildHomePage = async (store) => {
    store.page.title = "Home Page"
    store.page.descr = "This is the Home page"

    const data = await fetchAllPosts(store)
    // console.log(data)

    let postsList = ""
    for (var item of data) {
        postsList += `<li><a class="link" href="/p/${item.id}">${item.title}</a></li>\n`
    }
    store.page.content = /*html*/`
        <article class="min-h-screen">
            <h1> HOME PAGE</h1>
            <ol> ${postsList} </ol>
        </article>
    `
}