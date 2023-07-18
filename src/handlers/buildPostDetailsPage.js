import { fetchSpecificPostById } from "../database"

export const buildPostDetailsPage = async (store) => {
    store.page.title = `Post Page`
    store.page.descr = `This is the Post - ${store.page.id}`

    const data = await fetchSpecificPostById(store)
    console.log(data)

    store.page.content = /*html*/ `
        <article class="min-h-screen">
            <h1>Page Id: ${store.page.id}</h1>
            <h2>${data[0].id}</h2>
            <h2>${data[0].title}</h2>
            <p>${data[0].description}</p>
        </article>
    
    `
}