import { saveNewPostInDB } from "../database";
import { nanoid } from "nanoid";
import { getRandomSlug } from "./slugify";

export const saveNewPost = async (ctx) => {

    // ---------------------------------------
    // resize & save the images
    // ---------------------------------------
    // ---------------------------------------
    // Generate human readable slug
    // ---------------------------------------
    // ---------------------------------------
    // Save the post
    // ---------------------------------------
    ctx.post.id = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 32)();
    ctx.post.slug = getRandomSlug();
    let resSaveNewPost = await saveNewPostInDB(ctx)
    if (resSaveNewPost.length == 0) {
        throw new Error(500, {cause: "Failed to save the post in the db"});
    }
    console.log("Post saved in the db")

    // ---------------------------------------
    // redirect to the new post
    // ---------------------------------------
    let redirectTo = "/p/" + ctx.post.slug
    ctx.res.status = 302
    ctx.res.headers.append('Location', redirectTo)
    
    console.log(ctx.post)
    ctx.res.content = JSON.stringify( ctx.post, null, 2)
    ctx.res.headers.set('Content-Type', 'application/json')
}