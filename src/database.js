import { connect } from '@planetscale/database'

// ------------------------------------------
// Configure DB Connection
// ------------------------------------------
const connectToPlanetScale = (store) => {
    const DBConfig = {
        host    : store.env.DATABASE_HOST,
        username: store.env.DATABASE_USERNAME,
        password: store.env.DATABASE_PASSWORD,
        fetch   : (url, init) => {
            delete (init)["cache"]; // Remove cache header
            return fetch(url, init);
        }
    }
    return connect(DBConfig)
}

export const fetchAllPosts = async (store) => {
    let conn = connectToPlanetScale(store)
    let result = await conn.execute('select * from posts limit 10')
    return result.rows
}

export const fetchSpecificPostById = async (store) => {
    let conn = connectToPlanetScale(store)

    let result = await conn.execute('select * from posts where id=:id', {id : store.page.id})
    if (result.rows.length == 0) {
        let err = new Error()
        err.message = "404"
        err.cause = "this id doesn't exists in the db"
        throw err
    }
    return result.rows
}

export const getUserDetails = async (store) => {
    let conn = connectToPlanetScale(store)
    let query = 'select * from users where google_id=:email or apple_id=:email limit 1'
    let result = await conn.execute(query, {email : store.user.email})
    return result.rows
}

export const addGoogleUser = async (store) => {
    let conn = connectToPlanetScale(store)
    let query = `INSERT IGNORE INTO users (slug, name, thumb, honorific, flair, role, level, google_id) 
        VALUES (:slug, :name, :thumb, :honorific, :flair, :role, :level, :google_id)`
    let result = await conn.execute(query, {slug : store.user.slug, name : store.user.name, thumb : store.user.thumb, honorific : store.user.honorific, flair : store.user.flair, role : store.user.role, level : store.user.level, google_id : store.user.google_id})
    return result
}
