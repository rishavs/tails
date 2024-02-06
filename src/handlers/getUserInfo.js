import { getUserDetails } from '../database'


// This function takes in a sessionId and returns the user info
// the user info gets added to the context
// Also add cookies for warnings and stuff
export const getUserInfo = async (ctx) => {
    // if db has user details, add to ctx
    // else return ctx without user info

    // let resGetUser = await getUserDetails(ctx, email)
    // console.log(`User Details: ${resGetUser}`)
    // if (resGetUser.length == 0) {
    //     throw new Error("503", { cause: `user not found` })
    // }

    // ctx.user = resGetUser[0]

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