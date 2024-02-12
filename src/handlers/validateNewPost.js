import { nanoid } from "nanoid";
import { NewPostSchema, NewPostTypes, PostCategories } from "../defs";
import { checkIfDomainBlocked } from "../database";

export const validateNewPost = async (ctx) => {

    // ---------------------------------------
    // get the form data
    // ---------------------------------------
    let formData = await ctx.req.raw.formData();

    ctx.post = {}
    ctx.post.category = formData.get('category');
    ctx.post.type = formData.get('is_link') ? "link" : "text";
    ctx.post.link = formData.get('link');

    ctx.post.title = formData.get('title');
    ctx.post.content = formData.get('description');
    ctx.post.anonymous = formData.get('is_nony') ? true : false;
    ctx.post.authorId = ctx.user.id;

    // ---------------------------------------
    // validate data
    // ---------------------------------------
    // check required fields
    if ( !ctx.post.category || !ctx.post.title || !ctx.post.content ) {
        throw new Error(400, {cause: "Invalid post Schema - missing required fields"});
    }
    // check field values
    if (!(ctx.post.category in PostCategories)) {
        throw new Error(400, {cause: "Invalid post Schema - invalid category"});
    }
    if (!(ctx.post.type in NewPostTypes)) {
        throw new Error(400, {cause: "Invalid post Schema - invalid type"});
    }
    if (ctx.post.title.length < NewPostSchema.titleMinLength || ctx.post.title.length > NewPostSchema.titleMaxLength) {
        throw new Error(400, {cause: "Invalid post Schema - invalid title length"});
    }
    if (ctx.post.content.length < NewPostSchema.contentMinLength || ctx.post.content.length > NewPostSchema.contentMaxLength) {
        throw new Error(400, {cause: "Invalid post Schema - invalid content length"});
    }
    // if ctx.post. type is link, check for link
    if (ctx.post.type === "link") {
        if ( ctx.post.link.length < NewPostSchema.linkMinLength 
            || ctx.post.link.length > NewPostSchema.linkMaxLength 
        ) {
            throw new Error(400, {cause: "Invalid post Schema - invalid link length"});
        }

        // check if url has valid format
        try {
            var linkUrl = new URL(ctx.post.link);
        } catch (error) {
            throw new Error(400, {cause: "Invalid post Schema - invalid link"});
        }
    }

    // ---------------------------------------
    // Check for banned domains
    // ---------------------------------------
    let linkOrigin = linkUrl.origin;
    let resDomainCheck = await checkIfDomainBlocked(ctx, linkOrigin);
    if (resDomainCheck.length != 0) {
        throw new Error(400, {cause: "This website is banned. You cannot post artciles from it on Digglu"});
    }

    console.log("validated Post!")
}