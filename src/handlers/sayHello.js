import { getLinkData } from "./getLinkData";
import { fetchURL } from "../utils";

export const sayHello = async (ctx) => {

    // throw new Error(401, {cause: "This is a test error"})
       
    // ctx.res.status = 200
    // ctx.res.content = JSON.stringify({ message: "Hello from the API" })
        // (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    // TODO return error on invalid url
    // TODO return error on timeout
    // TODO return error on invalid response
    // TODO handle case when totle, descr or image is missing
    const resp 	= await fetchURL('http://verdin.pages.dev');
    const ogData 	= await getLinkData(resp);

    ctx.res.content = JSON.stringify( ogData, null, 2)
    ctx. res.headers.set('Content-Type', 'application/json')
}