import { fetchSpecificPostBySlug, fetchCommentsForPost } from "../database"
import { postDetails } from "../views/postDetails"
import { comments } from "../views/comments"

export const buildPostDetailsPage = async (ctx) => {
    ctx.page.title = `Post Page`
    ctx.page.descr = `This is the Post - ${ctx.page.slug}`

    const data = await fetchSpecificPostBySlug(ctx)
    console.log(data)
    const postDetailsData = data[0]

    const commentsData = await fetchCommentsForPost(ctx, postDetailsData.id)
    console.log(commentsData)

    ctx.page.html = /*html*/ `
    <div class="flex flex-col pt-20">
        ${await postDetails(postDetailsData)}

        <div class="divider">Comments</div>
        <section name="comments" class="flex flex-col gap-4">
            ${ commentsData.length > 0 ? await comments(commentsData) : ""}

        </section>
    </div>

    `
}