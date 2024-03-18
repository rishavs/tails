import * as db from '../database.js';

export const updateUserDetails = async (ctx) => {
    // Parse the incoming request as FormData
    const formData = await ctx.req.raw.formData();

    // Print the form data
    for (let [key, value] of formData.entries()) {
        console.log("KEY = ", key, ", VALUE = ", value);
    }

    if (formData.has('name')) {
        ctx.user.name = formData.get('name');
    }

    if (formData.has('slug')) {
        ctx.user.slug = formData.get('slug');
    }

    // Verify the form data. If the image is not of supported type or > 1mb in size, throw error
    if (formData.has('thumb')) {
        let thumb = formData.get('thumb')
        if (thumb.size > 1024 * 1024) {
            throw new Error(400, {cause: "Image size exceeds 1MB"});
        }
        if ([ "image/jpeg", "image/png", "image/webp"].includes(thumb.type) == false) {
            throw new Error(400, {cause: "Invalid image type"});
        }

        // Upload the image to Cloudflare Images API
        const CFFormData = new FormData();
        CFFormData.append('file', thumb);

        // Send the image to the Cloudflare Images API
        const CFResp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ctx.env.CF_ACCOUNT_ID}/images/v1`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ctx.env.CF_IMAGES_API_TOKEN}`
            },
            body: CFFormData
        });

        // Check the Cloudflare Images API response
        if (!CFResp.ok) {
            throw new Error(`Cloudflare Images API error: ${CFResp.statusText}`);
        }

        // Get the response data
        const CFRespData = await CFResp.json();
        console.log("Cloudflare Images API response: ", CFRespData);

        // response if of the form
        // result: {
        //     id: '51176bb3-3844-462b-dce4-dac5e15e1d00',
        //     filename: 'logo.jpg',
        //     uploaded: '2024-03-18T09:19:19.296Z',
        //     requireSignedURLs: false,
        //     variants: [
        //       'https://imagedelivery.net/O6vL0oibFZqv9tr0qEPpxA/51176bb3-3844-462b-dce4-dac5e15e1d00/userthumb',
        //       'https://imagedelivery.net/O6vL0oibFZqv9tr0qEPpxA/51176bb3-3844-462b-dce4-dac5e15e1d00/postthumb',
        //       'https://imagedelivery.net/O6vL0oibFZqv9tr0qEPpxA/51176bb3-3844-462b-dce4-dac5e15e1d00/postfull'
        //     ]
        //   },
        //   success: true,
        //   errors: [],
        //   messages: []
        // }
        // now we need to choose the variant ending in userthumb and save it in db
        // and update the user object with the new image url
        let imgUrl = CFRespData.result.variants.find( v => v.endsWith('userthumb'));
        ctx.user.thumb = imgUrl;

    }

    // Update the user details in the database
    let resUpdateUserDetails = await db.updateUserDetailsInDB(ctx);
    
    // redirect to the redirect page
    ctx.res.status = 302;
    ctx.res.headers.append('Location', formData.get('redirect') || '/');
}