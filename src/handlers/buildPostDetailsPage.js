import { fetchCommentsTreeForPostSlug } from "../database"
import { postDetails } from "../views/postDetails"
import { comments } from "../views/comments"

import { getRandomSlug } from "./slugify"

export const buildPostDetailsPage = async (ctx) => {
    ctx.page.title = `Post Page`
    ctx.page.descr = `This is the Post - ${ctx.page.slug}`

    const commentsTreeData = await fetchCommentsTreeForPostSlug(ctx, ctx.page.slug)
    console.log("Comments Tree Data: ", commentsTreeData)
    let rootPost = {};
    let commentsMap = {};

    commentsTreeData.forEach(comment => {
        if (comment.parent_id === null ) {
            rootPost = comment;
        } else {
            comment.children = [];
            comment.depth = 0;
            comment.descendants = 0;
            commentsMap[comment.id] = comment;
        }
    });

    commentsTreeData.forEach(comment => {
        if (
            comment.parent_id != null 
            && comment.parent_id != comment.post_id
        ) {
            commentsMap[comment.parent_id].children.push(comment.id);
            comment.depth = commentsMap[comment.parent_id].depth + 1;

            // Increment the descendants count for the parent and all its ancestors
            let parent = commentsMap[comment.parent_id];
            while (parent) {
                parent.descendants++;
                parent = commentsMap[parent.parent_id];
            }
        }
    });

    // console.log("SLUG: ", getRandomSlug())

    ctx.page.html = /*html*/ `
    <div class="flex flex-col pt-20">
        ${await postDetails(rootPost)}

        <div class="divider">  
        ${ commentsTreeData.length - 1} Comments
        </div>
        <section name="comments" class="flex flex-col gap-4">
            ${ commentsTreeData.length > 1 ? comments(commentsMap) : ""}

        </section>
    </div>

    `
}