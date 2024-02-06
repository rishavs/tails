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
