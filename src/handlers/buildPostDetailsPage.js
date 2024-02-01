import { fetchSpecificPostById } from "../database"

export const buildPostDetailsPage = async (ctx) => {
    ctx.page.title = `Post Page`
    ctx.page.descr = `This is the Post - ${ctx.page.id}`

    const data = await fetchSpecificPostById(ctx)
    console.log(data)

    ctx.page.content = /*html*/ `
        <article class="min-h-screen">
            <h1>Page Id: ${ctx.page.id}</h1>
            <h2>${data[0].id}</h2>
            <h2>${data[0].title}</h2>
            <p>${data[0].description}</p>
        </article>
    
    `
}