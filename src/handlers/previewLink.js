// this api takes in a url and then returns the title, 
// description and image of the page using the opengraph tags

export const previewLink = async (ctx) => {
    // (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    // TODO return error on invalid url
    // TODO return error on timeout
    // TODO return error on invalid response
    // TODO handle case when totle, descr or image is missing
    const response 	= await fetch('https://verdin.pages.dev');
    const ogData 	= await getOpenGraphData(response);

    ctx.res.content = JSON.stringify( ogData, null, 2)
    ctx. res.headers.set('Content-Type', 'application/json')
}