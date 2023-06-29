export const sayHello = async (store) => {
    store.resp.status = 200
    store.resp.content = JSON.stringify({ message: "Hello from the API" })
}