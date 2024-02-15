const buildCommentsMap = (commentsList) => {
    let commentsMap = {};
    commentsList.forEach(comment => {
        commentsMap[comment.id] = {...comment, children: [], depth: 0};
    })

    // Recursive function to calculate the depth of a comment
    function calculateDepth(id, depth) {
        commentsMap[id].depth = depth;
        commentsMap[id].children.forEach(childId => calculateDepth(childId, depth + 1));
    }
    
    // Second pass: Add the ids of child comments to the children array of their parent comments and calculate their depth
    commentsList.forEach(comment => {
        if (comment.post_id != comment.parent_id) {
            commentsMap[comment.parent_id].children.push(comment.id);
        }
        calculateDepth(comment.id, comment.post_id == comment.parent_id ? 0 : commentsMap[comment.parent_id].depth + 1);
    });
    
    console.log("MAPS: ", commentsMap);

    return commentsMap;
}

const buildCommentsTree = (commentsList) => {

}

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

export const comments = async (commentsList) => {   
    
    // Generate the HTML for the root comments
    let commentsHTML = '';
    for (let commentId in commentsMaps) {
        if (commentsMaps[commentId].post_id == commentsMaps[commentId].parent_id) {
            commentsHTML += await generateCommentHTML(commentId);
        }
    }
    
    return /*html*/`
    <div class="collapse bg-base-200">
        <input type="checkbox" /> 
        <div class="collapse-title text-xl font-medium">
            Click me to show/hide content
        </div>
        <div class="collapse-content"> 
            <p>hello</p>
        </div>
    </div>
    `
}


