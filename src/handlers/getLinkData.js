import { fetchURL } from "../utils";

// type BodyImage = {
// 	src: string;
// 	width?: number;
// 	height?: number;
// 	area?: number;
// };

// type OgModel = {
// 	title?: string;
// 	desc?: string;
// 	image?: string;
// 	image_alt?: string;
// 	image_width?: string;
// 	image_height?: string;
// 	body_image?: string;
// 	icon_img?: string;
// 	favicon?: string;
// };

// -- linked page data
// page_image    varchar(256),
// page_image_alt varchar(256),
// favicon       varchar(256),

// og_title      varchar(256),
// og_desc       varchar(1024),
// og_image      varchar(256),
// og_image_alt  varchar(256),
// og_type       varchar(32),
// og_url        varchar(256),

export const getLinkData = async (ctx) => {

    // TODO return error on timeout
    // TODO return error on invalid response
    // TODO handle case when totle, descr or image is missing
    const response 	= await fetchURL(ctx.post.link);

    // initialize the post object with all the link's attributes
    ctx.post.pageImage = "";
    ctx.post.pageImageAlt = "";
    ctx.post.favicon = "";
    ctx.post.ogTitle = "";
    ctx.post.ogDesc = "";
    ctx.post.ogImage = "";
    ctx.post.ogImageAlt = "";
    ctx.post.ogType = "";
    ctx.post.ogURL = "";
    ctx.post.ogIconImg = "";

    
	let bodyImagesArray = [];

	const rewriter = new HTMLRewriter()
    .on('meta[property="og:title"]', {
        element(el) {
            ctx.post.ogTitle = el.getAttribute('content');
        },
    })
    .on('meta[property="og:description"]', {
        element(el) {
            ctx.post.ogDesc = el.getAttribute('content');
        },
    })
    .on('meta[property="og:image"]', {
        element(el) {
            ctx.post.ogImage = el.getAttribute('content');
        },
    })
    .on('meta[property="og:image:alt"]', {
        element(el) {
            ctx.post.ogImageAlt = el.getAttribute('content');
        },
    })
    .on('meta[property="og:type"]', {
        element(el) {
            ctx.post.ogType = el.getAttribute('content');
        },
    })
    .on('meta[property="og:url"]', {
        element(el) {
            ctx.post.ogURL = el.getAttribute('content');
        },
    })    
    .on('link[rel="apple-touch-icon"]', {
        element: el => {
            ctx.post.ogIconImg = el.getAttribute('href');
        },
    })
    .on('link[rel="icon"]', {
        element: el => {
            ctx.post.favicon = el.getAttribute('href');
        },
    })
    .on('img', {
        element(el) {
            const src = el.getAttribute('src');
            const alt = el.getAttribute('alt');
            const width = el.getAttribute('width');
            const height = el.getAttribute('height');
            const area = width && height ? parseInt(width) * parseInt(height) : 0;
            if (src) {
                bodyImagesArray.push(
                    { 
                        src, 
                        alt,
                        width: width ? parseInt(width): undefined, 
                        height: height ? parseInt(height) : undefined, 
                        area: area || 0 
                    }
                );
            }
        },
    });

    await rewriter.transform(response).text(); 

    // Check if there are any images
    if (bodyImagesArray.length > 0) {
        // Initialize the largest image to the first one
        let largestImage = bodyImagesArray[0];

        // Iterate over the rest of the images
        for (let i = 1; i < bodyImagesArray.length; i++) {
            // If the current image is larger, update largestImage
            if (bodyImagesArray[i].area > largestImage.area) {
                largestImage = bodyImagesArray[i];
            }
        }

        // Set the body image to the source of the largest image
        ctx.post.pageImage = largestImage.src;
        ctx.post.pageImageAlt = largestImage.alt;
    }
}
