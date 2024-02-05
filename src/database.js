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

export const fetchAllPosts = async (ctx) => {
    let conn = connectToPlanetScale(ctx)
    let result = await conn.execute('select * from posts limit 10')
    return result.rows
}

export const fetchSpecificPostById = async (ctx) => {
    let conn = connectToPlanetScale(ctx)

    let result = await conn.execute('select * from posts where id=:id', {id : ctx.page.id})
    if (result.rows.length == 0) {
        let err = new Error()
        err.message = "404"
        err.cause = "this id doesn't exists in the db"
        throw err
    }
    return result.rows
}

export const getUserDetails = async (ctx) => {
    let conn = connectToPlanetScale(ctx)
    let query = 'select * from users where google_id=:email or apple_id=:email limit 1'
    let result = await conn.execute(query, {email : ctx.user.email})
    return result.rows
}

export const addGoogleUser = async (ctx) => {
    let conn = connectToPlanetScale(ctx)
    let query = `INSERT IGNORE INTO users (slug, name, thumb, honorific, flair, role, level, google_id) 
        VALUES (:slug, :name, :thumb, :honorific, :flair, :role, :level, :google_id)`
    let result = await conn.execute(query, {slug : ctx.user.slug, name : ctx.user.name, thumb : ctx.user.thumb, honorific : ctx.user.honorific, flair : ctx.user.flair, role : ctx.user.role, level : ctx.user.level, google_id : ctx.user.google_id})
    return result
}
