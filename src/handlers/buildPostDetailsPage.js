import { fetchCommentsTreeForPostSlug } from "../database"
import { postDetails } from "../views/postDetails"
import { comments } from "../views/comments"

import { getRandomSlug } from "./slugify"

export const buildPostDetailsPage = async (ctx) => {
    ctx.page.title = `Post Page`
    ctx.page.descr = `This is the Post - ${ctx.page.slug}`

    const commentsTreeData = await fetchCommentsTreeForPostSlug(ctx, ctx.page.slug)
    // console.log("Comments Tree Data: ", commentsTreeData)
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

        <div class="divider py-4 lg:py-8 flex">  
            <button class="btn btn-sm lg:btn-md" id="collapse_comments_btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
          
            <button>
            ${ commentsTreeData.length - 1} Comments
            <button class="btn btn-sm lg:btn-md" id="expand_comments_btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
            <button>
        </div>
        <section name="comments" class="flex flex-col gap-4">
            ${ commentsTreeData.length > 1 ? comments(commentsMap) : ""}

        </section>
    </div>

    `
}