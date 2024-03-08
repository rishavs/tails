import { getUserFromSession } from '../database'


// This function takes in a sessionId and returns the user info
// the user info gets added to the context
// Also add cookies for warnings and stuff
export const allowOnlyUser = async (ctx) => {

    // let sessionId = ctx.req.cookies.D_SID
    // if (!sessionId) {
    //     throw new Error("401", { cause: "No session id present in the cookie" })
    // }
    // console.log("Session ID: ", sessionId)
    
    // let resUserDetails = await getUserFromSession(ctx, sessionId)
    // if (resUserDetails.length == 0) {
    //     throw new Error("401", { cause: "No user was found for this session" })
    // }

    // ctx.user = resUserDetails[0]
    if (!ctx.user) {
        throw new Error("401", { cause: "No valid session was found for this user. Please signin again." })
    }

    // ------------------------------------------
    // TODO - Tell the user about the punishment status, if any
    // ------------------------------------------
    // if (user.warned_till && user.warned_till > new Date().toISOString()) {
    //     ctx.res.headers.append('Set-Cookie', `D_TOAST_WARNING={for:${user.warned_for}, till:${user.warned_till}; path=/; SameSite=Strict;`)
    // }
    // if (user.exiled_till && user.exiled_till > new Date().toISOString()) {
    //     ctx.res.headers.append('Set-Cookie', `D_TOAST_EXILE=You are exiled till ${user.exiled_till}; path=/; SameSite=Strict;`)
    // }
    // if (user.banned_till && user.banned_till > new Date().toISOString()) {
    //     ctx.res.headers.append('Set-Cookie', `D_TOAST_BAN=You are banned till ${user.banned_till}; path=/; SameSite=Strict;`)
    // }


    console.log("Getting user info...")
    console.log("User: ", ctx.user)
}