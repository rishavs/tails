import { checkIfUserSlugExistsinDB } from '../database'

export const isUserSlugDuplicate = async (ctx) => {
    try {
        const data = await ctx.req.raw.json();
        console.log("Parsed JSON data:", data);
        // Access data object properties

        const resExists = await checkIfUserSlugExistsinDB(ctx, data.slug);
        const exists = resExists.length > 0;
        console.log("User slug exists: ", exists);

        ctx.res.content = JSON.stringify({ data: `${exists ? "dup" : ""}` });
        ctx.res.headers.set('Content-Type', 'application/json');
    } catch (error) {
        throw new Error(400, { cause: "Invalid JSON" });
    }
}