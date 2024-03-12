import { getLinkData } from "./getLinkData";
import { fetchURL } from "../utils";

export const updateUserDetails = async (ctx) => {
    // Parse the incoming request as FormData
    const formData = await ctx.req.raw.formData();

    // Print the form data
    for (let [key, value] of formData.entries()) {
        console.log("KEY = ", key, ", VALUE = ", value);
    }
    
    // Get the form fields
    const userName = formData.get('name');
    const userSlug = formData.get('slug');
    const userImage = formData.get('thumb'); 

    // TODO: Handle the form data
    // For example, you might want to store the user details in a database

    // Create a new FormData instance for the Cloudflare Images API request
    const cloudflareFormData = new FormData();
    cloudflareFormData.append('file', userImage);

    // Send the image to the Cloudflare Images API
    const cloudflareResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ctx.env.CF_ACCOUNT_ID}/images/v1`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ctx.env.CF_IMAGES_API_TOKEN}`
        },
        body: cloudflareFormData
    });

    // Check the Cloudflare Images API response
    if (!cloudflareResponse.ok) {
        throw new Error(`Cloudflare Images API error: ${cloudflareResponse.statusText}`);
    }

    // Get the response data
    const cloudflareResponseContent = await cloudflareResponse.json();

    // TODO: Handle the Cloudflare Images API response data
    // For example, you might want to store the image URL in a database

    // Respond with a success message
    ctx.res.content = JSON.stringify({ message: "User details updated successfully", details: cloudflareResponseContent });
    ctx.res.headers.set('Content-Type', 'application/json');
}