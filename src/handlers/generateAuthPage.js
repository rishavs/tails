export const generateAuthPage = async (store) => {
    store.resp.status = 302
    store.resp.content = "AUTHENTICATING..." // TODO - replace with a spinner



    // get the session id from the bag
    const bagID = new URL(store.request.url).searchParams.get('loginID')
    const sessionID = await store.env.BAG.get(bagID);
    console.log('BAg ID: ', bagID)
    console.log(`Session ID from BAG: ${sessionID}`)

    const dest = new URL(store.request.url).searchParams.get('redirectTo')
    console.log(`Redirecting to: ${dest}`)

    // add the session id to the cookie
    const cookie = `sessionID=${sessionID}; path=/; HttpOnly; Secure; SameSite=Strict;`
    store.resp.headers.set('Set-Cookie', cookie) 

    store.resp.headers.set('Location', dest)
    // sleep for 5 seconds
    await new Promise(r => setTimeout(r, 2000));
    
}