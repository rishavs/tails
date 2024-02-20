import { connect } from '@planetscale/database'

// ------------------------------------------
// Configure DB Connection
// ------------------------------------------
const connectToPlanetScale = (ctx) => {
    const DBConfig = {
        host    : ctx.env.DATABASE_HOST,
        username: ctx.env.DATABASE_USERNAME,
        password: ctx.env.DATABASE_PASSWORD,
        fetch   : (url, init) => {
            delete (init)["cache"]; // Remove cache header
            return fetch(url, init);
        }
    }
    return connect(DBConfig)
}

export const checkIfUserBlocked = async (ctx, id) => {
    let conn = connectToPlanetScale(ctx)
    let result =  await conn.execute(
        'select oauth_id from blocked_ids where oauth_id = :id', 
        {id : id}
    )
    console.log(`Blocked`, result)
    return result.rows
}
export const checkIfDomainBlocked = async (ctx, origin) => {
    let conn = connectToPlanetScale(ctx)
    let result =  await conn.execute(
        'select * from blocked_domains where domain = :origin', 
        {origin : origin}
    )
    console.log(`The domain ${origin} is Blocked!`, result)
    return result.rows
}

export const fetchAllPosts = async (ctx) => {
    let conn = connectToPlanetScale(ctx)
    let result = await conn.execute('select * from posts limit 10')
    return result.rows
}

export const fetchSpecificPostBySlug = async (ctx) => {
    let conn = connectToPlanetScale(ctx)

    let result = await conn.execute('select * from posts where slug=:slug', {slug : ctx.page.slug})
    if (result.rows.length == 0) {
        throw new Error(404, {cause: "this post doesn't exists in the db"})
    }
    return result.rows
}

export const fetchCommentsForPost = async (ctx, id) => {
    let conn = connectToPlanetScale(ctx)
    let result = await conn.execute(/*sql*/`
        select id, post_id, parent_id, slug, type, content from posts where post_id=:id and parent_id is not null;`, {id : id})
    return result.rows
}

export const fetchCommentsTreeForPostSlug = async (ctx, slug) => {
    let conn = connectToPlanetScale(ctx)
    let result = await conn.execute(/*sql*/`
        select id, post_id, parent_id, slug, type, content from posts where slug = :slug;`, {slug : slug})
    if (result.rows.length == 0) {
        throw new Error(404, {cause: "this post doesn't exists in the db"})
    }
    return result.rows
}

export const getUserDetails = async (ctx, email) => {
    let conn = connectToPlanetScale(ctx)
    let query = 'select * from users where google_id=:email or apple_id=:email limit 1'
    let result = await conn.execute(query, {email : email})
    return result.rows
}

export const addGoogleUser = async (ctx, user) => {
    let conn = connectToPlanetScale(ctx)
    let result = await conn.execute(`
        insert into users 
        (id, slug, name, thumb, honorific, flair, role, level, stars, creds, gil, google_id) 
        values 
        (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.id, user.slug, user.name, user.thumb, user.honorific, user.flair, user.role, user.level, user.stars, user.creds, user.gil, user.google_id]
        )
    console.log("User to be added: ", user)
    console.log("Result of ad user to db: ", result)
    return result
}

export const addNewSession = async (ctx, sessionId, userId, userAgent) => {
    let conn = connectToPlanetScale(ctx)

    let result = await conn.execute(`
        insert into sessions 
        (id, user_id, user_agent) 
        values 
        (?, ?, ?)`,
        [sessionId, userId, userAgent]
        )
    return result
}

export const getUserFromSession = async (ctx, sessionId) => {
    let conn = connectToPlanetScale(ctx)
    let query = `SELECT * FROM users WHERE id = (
        SELECT user_id FROM sessions WHERE id = :sessionId)
        limit 1`
    let result = await conn.execute(query, {sessionId : sessionId})
    return result.rows
}

export const saveNewPostInDB = async (ctx) => {
    let conn = connectToPlanetScale(ctx)
    let result = await conn.execute(`
        insert into posts 
        (id, post_id, slug, category, type, link, title, content, anonymous, author_id, image, image_alt, favicon, og_title, og_desc, og_image, og_image_alt, og_type, og_url) 
        values 
        (?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ctx.post.id, ctx.post.id, ctx.post.slug, ctx.post.category, ctx.post.type, ctx.post.link, ctx.post.title, ctx.post.content, ctx.post.anonymous, ctx.post.authorId, ctx.post.pageImage, ctx.post.pageImageAlt, ctx.post.favicon, ctx.post.ogTitle, ctx.post.ogDesc, ctx.post.ogImage, ctx.post.ogImageAlt, ctx.post.ogType, ctx.post.ogUrl]
        )
    return result
}