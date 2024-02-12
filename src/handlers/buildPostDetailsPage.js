import { fetchSpecificPostBySlug } from "../database"

export const buildPostDetailsPage = async (ctx) => {
    ctx.page.title = `Post Page`
    ctx.page.descr = `This is the Post - ${ctx.page.id}`

    const data = await fetchSpecificPostBySlug(ctx)
    console.log(data)

    ctx.page.html = /*html*/ `
        <article class="min-h-screen">
            <h1>Page Id: ${ctx.page.slug}</h1>
            <h2>${data[0].slug}</h2>
            <h2>${data[0].title}</h2>
            <p>${data[0].content}</p>
        </article>
    
    `
}