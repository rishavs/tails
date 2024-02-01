export const sayHello = (ctx) => {

    // throw new Error(401, {cause: "This is a test error"})
       
    ctx.res.status = 200
    ctx.res.content = JSON.stringify({ message: "Hello from the API" })
}