import { connect } from '@planetscale/database'

const connectToPlanetScale = (store) => {
        // ------------------------------------------
        // Configure DB Connection
        // ------------------------------------------
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
    let result = await conn.execute('select * from posts where id=?', [store.page.id])
    if (result.rows.length == 0) {
        let err = new Error()
        err.message = "404"
        err.cause = "this id doesn't exists in the db"
        throw err
    }
    // console.log(result)
    return result.rows
}

export const doesGoogleUserExists = async (store) => {
    
// INSERT IGNORE INTO airplanes 
// (plane, manufacturer_id, engine_type, engine_count, 
//   wingspan, plane_length, max_weight, icao_code)
// VALUES ('Learjet 24',1007,'Jet',2,35.58,43.25,13000,'LJ24');


    let conn = connectToPlanetScale(store)
    let query = 'select EXISTS (select * from users where googleid=?)'
    let result = await conn.execute(query, [store.page.googleID])
    return result
}

export const addGoogleUser = async (store) => {
    let conn = connectToPlanetScale(store)
    let query = `INSERT IGNORE INTO users 
    (slug, name, thumb, honorific, flair, role, level, google_id) 
    VALUES (:slug, :name, :thumb, :honorific, :flair, :role, :level, :google_id)`
    let result = await conn.execute(query, {slug : store.page.slug, name : store.page.name, thumb : store.page.thumb, honorific : store.page.honorific, flair : store.page.flair, role : store.page.role, level : store.page.level, google_id : store.page.googleID})
    return result
}
