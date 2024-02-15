import { fetchSpecificPostBySlug, fetchCommentsForPost } from "../database"
import { postDetails } from "../views/postDetails"
// import { comment } from "../views/comment"

const comment = async (comment) => {   
    return /*html*/`
    <div class="collapse bg-base-200">
        <input type="checkbox" /> 
        <div class="collapse-title text-xl font-medium">
            ${comment.slug}
        </div>
        <div class="collapse-content"> 
            <p>${comment.content}</p>

            <!-- Nested Comments -->
            <div class="flex flex-col gap-4">

            </div>
        </div>
    </div>
    `
}


export const buildPostDetailsPage = async (ctx) => {
    ctx.page.title = `Post Page`
    ctx.page.descr = `This is the Post - ${ctx.page.id}`

    const data = await fetchSpecificPostBySlug(ctx)
    console.log(data)
    const postDetailsData = data[0]

    const commentsData = await fetchCommentsForPost(ctx, postDetailsData.id)
    console.log(commentsData)

    let commentsMaps = {};

    // First pass: Add all comments to commentsMaps
    commentsData.forEach(comment => {
        commentsMaps[comment.id] = {...comment, children: [], depth: 0};
    });
    
    // Recursive function to calculate the depth of a comment
    function calculateDepth(id, depth) {
        commentsMaps[id].depth = depth;
        commentsMaps[id].children.forEach(childId => calculateDepth(childId, depth + 1));
    }
    
    // Second pass: Add the ids of child comments to the children array of their parent comments and calculate their depth
    commentsData.forEach(comment => {
        if (comment.post_id != comment.parent_id) {
            commentsMaps[comment.parent_id].children.push(comment.id);
        }
        calculateDepth(comment.id, comment.post_id == comment.parent_id ? 0 : commentsMaps[comment.parent_id].depth + 1);
    });
    
    console.log("MAPS: ", commentsMaps);

    const generateCommentHTML = async (commentId) => {
        const comment = commentsMaps[commentId];
        let childrenHTML = '';
    
        for (let childId of comment.children) {
            childrenHTML += await generateCommentHTML(childId);
        }
    
        return /*html*/`
        <div class="collapse bg-base-100 border-l-2 border-l-error w-full">
            <input type="checkbox" checked/> 
            <div class="collapse-title text-xl font-medium">
                ${comment.slug} | depth: ${comment.depth} | children: ${comment.children.length}
            </div>
            <div class="collapse-content pr-0" > 
            
                <p>${comment.content}</p>
    
                <!-- Nested Comments -->
                <div class="flex flex-col gap-4">
                    ${childrenHTML}
                </div>
            </div>
        </div>
        `;
    }
    
    // Generate the HTML for the root comments
    let commentsHTML = '';
    for (let commentId in commentsMaps) {
        if (commentsMaps[commentId].post_id == commentsMaps[commentId].parent_id) {
            commentsHTML += await generateCommentHTML(commentId);
        }
    }


    ctx.page.html = /*html*/ `
    <div class="flex flex-col pt-20">
        ${await postDetails(postDetailsData)}

        <div class="divider">Comments</div>
        <section name="comments" class="flex flex-col gap-4">
            ${commentsHTML}

        </section>
    </div>

    `
}