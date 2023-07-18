import { addGoogleUser } from '../database'

export const sayHello = async (store) => {
    // let newUser = {
    //     slug        : crypto.randomUUID(),
    //     name        : "Nony Mouse",
    //     thumb       : "something", 
    //     honorific   : "none", 
    //     flair       : "none",
    //     role        : "user",
    //     level       : "wood",
    //     googleID    : "mymail"
    // }

    // let res = await addGoogleUser(store, newUser);

    // for (const [key, value] of Object.entries(res)) {
    //     console.log(`${key}: ${value}`);
    // }
    // console.log(res.rows.length)
    // console.log(res.rows[0])

    
    store.resp.status = 200
    store.resp.content = JSON.stringify({ message: "Hello from the API" })
}