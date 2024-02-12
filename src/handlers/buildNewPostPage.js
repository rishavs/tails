import { NewPostSchema, PostCategories } from "../defs";

export const buildNewPostPage = (ctx) => {
    ctx.page.title = "META: New Post Page"
    ctx.page.descr = "META: This is the about page"
    ctx.page.html = /*html*/`
    <article class="pt-8 lg:pt-20">
        
        <div class="card w-full bg-base-100 border border-base-300">
            <div class="card-body">
                <h2 class="card-title font-semibold">Add a new post</h2>
                
                <form id="new_post_form" name="new_post_form" method="post" action="/p/new" class="flex flex-col gap-2">
            
                    <div class="divider"></div> 
    
                    <div class="form-control w-full">                   
                        <div class="dropdown dropdown-bottom w-full">
                            <label class="label">
                                <span class="label-text">Select a Post Category</span>
                            </label>
                            <select id="post_category_select" class="select select-bordered w-full text-lg invalid:border-error" name="category" required>
                                <option class="text-2xl lg:text-lg" value="" selected disabled hidden>Select Post Category</option>
                                ${
                                    Object.keys(PostCategories).map((category) => {
                                        return /*html*/ `
                                        <option class="" value="${category}">${PostCategories[category]}</option>
                                        
                                        `;
                                    }).join("")
                                }

                            </select>
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text"></span>
                        </label>

                        <label class="label cursor-pointer">
                            <span class="label-text">Does this Post links to any web page?</span>
                            <input id="post_type" name="is_link" type="checkbox" class="toggle toggle-success" checked />
                        </label>
                        
                        <label class="label">
                            <span class="label-text"></span>
                        </label>
                    </div>

                    <div id="post_link_controls" class="form-control w-full">
                        <label class="label">
                            <span class="label-text">Link to external article</span>
                            <div class="tooltip" data-tip="hello">
                                <span class="label-text-alt">?</span>
                            </div>
                        </label>
                        <input id="post_link_input" type="url" name="link" placeholder="Please add a valid & live url here" class="input input-bordered w-full invalid:border-error" required minlength="${NewPostSchema.linkMinLength}" maxlength="${NewPostSchema.linkMaxLength}"/>
                        <label class="label">
                            <span class="label-text-alt">Bottom Right label</span>
                            <span id="post_link_char_count" class="label-text-alt">0/${NewPostSchema.linkMaxLength} chars</span>
                        </label>
                    </div>

                    <div id="post_title_controls" class="form-control w-full">
                        <label class="label">
                            <span class="label-text">Post Title</span>
                            <div class="tooltip" data-tip="hello">
                                <span class="label-text-alt">?</span>
                            </div>
                        </label>
                        <input id="post_title_input" type="text" placeholder="Please add a title for your post" name="title"
                            class="input input-bordered w-full invalid:border-error" required minlength="${NewPostSchema.titleMinLength}" maxlength="${NewPostSchema.titleMaxLength}" />
                        <label class="label">
                            <span class="label-text-alt">min 16 chars</span>
                            <span id="post_title_char_count" class="label-text-alt">0/${NewPostSchema.titleMaxLength} chars</span>

                        </label>
                    </div>

                    <div id="post_descr_controls" class="form-control">
                        <label class="label">
                            <span class="label-text">Post Description</span>
                            <span class="label-text-alt">?</span>

                        </label>
                        <textarea id="post_descr_textarea" minlength="${NewPostSchema.contentMinLength}" maxlength="${NewPostSchema.contentMaxLength}" name="description"
                            class="textarea textarea-bordered h-24 invalid:border-error" placeholder="Please add a comment on your submission." required></textarea>
                        <label class="label">
                            <span class="label-text-alt">min 4096 chars</span>
                            <span id="descr_char_count" class="label-text-alt">0/${NewPostSchema.contentMaxLength} chars</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text"></span>
                        </label>

                        <label class="label cursor-pointer">
                            <span class="label-text">Post A-Nony-Mousely?</span>
                            <input id="post_as_nony" name="is_nony" type="checkbox" class="toggle"/>
                        </label>
                        
                        <label class="label">
                            <span class="label-text">Note: When a post is made anonymously, people cannot see who authored it. But for legal compliance, internally the post would still be linked to the author. So, do not post anything illegal!! </span>
                        </label>
                    </div>
                    
                    <div class="divider"></div> 

                    <div class="card-actions justify-end">
                        <button type="submit" class="btn btn-error">Submit</button>
                    </div>
                </form>


            </div>
        </div>
                
    </article>
    `
}