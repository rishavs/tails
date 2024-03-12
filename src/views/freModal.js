import { UserNameSchema, UserSlugSchema } from "../defs"
import { userButton } from "./userButton"

export const freModal = (ctx) => {  
    // console.log("freModal", ctx.user)

    // TODO - generate random slug for user and check if its unique
    return ctx.user ?
    /*html*/`
    <!-- Open the modal using ID.showModal() method -->
    <dialog id="freModal" class="modal modal-bottom lg:modal-middle border border-base-300" open>
        <div class="modal-box flex flex-col gap-4">
            
            <form method="dialog">
                <button class="btn btn-square absolute right-6 top-6">✕</button>
            </form>

            <form id="user_details_form" class="w-full flex flex-col gap-4" action="/api/update-user-details" method="post" enctype="multipart/form-data">
                <h3 class="font-bold text-lg text-center">Welcome to Digglu!</h3>
                <p class="">Let's set you up with your user details.</p>

                <p class="flex flex-col">
                    <span class="font-bold">Profile Home</span>
                    <span>This is the link to your profile's home.</span>
                </p>
                <span class="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>    
              
                    <a id="user_slug_link_text" href="" class="link">https://digglu.com/u/</a>
                </span>

                <div id="" class="form-control w-full">
                
                    <label class="label opacity-50">
                        <span class="label-text-alt">
                            <p>Must be unique</p>
                        </span>
                        <span class="label-text-alt">Min ${UserSlugSchema.minLength} chars</span>
                    </label>

                    <label class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error">
                        <input id="user_slug_input" name ="slug" type="text" class="grow" required minlength="${UserSlugSchema.minLength}" maxlength="${UserSlugSchema.maxLength}" value="${ctx.user.slug}" pattern="[a-zA-Z0-9\\-]+" title="Only letters, numbers, and hyphens allowed"/>

                        <span id="user_slug_loading_icon" class="hidden loading loading-dots loading-md opacity-50"></span>

                        <svg id="user_slug_invalid_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="hidden size-6 stroke-error">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>

                        <svg id="user_slug_valid_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="stroke-success size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                    </label>
                    
                    <label class="label opacity-50">
                        <span class="label-text-alt">
                            <p>Only letters, numbers, and hyphens allowed</p>
                        </span>
                        <span id="user_slug_input_char_count" class="label-text-alt">0/${UserSlugSchema.maxLength} chars</span>
                    </label>
                </div>
                
                <p class="flex flex-col">
                    <span class="font-bold">Display Picture and Name</span>
                    <span>And this is how you appear in posts and comments</span>
                </p>

                ${userButton(ctx)}
                
                <p class="text-xs opacity-50"> Note: For privacy's sake, I recommend that you do not use your real picture or name.</p>

                
                <div class="form-control w-full">
                    <label class="label opacity-50">
                        <span class="label-text-alt">
                        </span>
                        <span class="label-text-alt">
                            <p>Max 1 Mb in size</p>
                        </span>

                    </label>
                    <input id="user_thumb_input" type="file" name="thumb" class="file-input file-input-bordered w-full" accept="image/jpeg,image/png" />
                    <label class="label opacity-50">
                        <span class="label-text-alt">
                            Only jpeg, png files allowed
                        </span>
                        <span class="label-text-alt">
                        </span>

                    </label>
                </div>
                <div class="form-control w-full">
                    <label class="label opacity-50">
                        <span class="label-text-alt">
                        </span>
                        <span class="label-text-alt">
                            <p>Min ${UserNameSchema.minLength} chars. </p>
                        </span>

                    </label>

                    <input id="user_name_input" name="name" type="text" class="input input-bordered w-full" value="${ctx.user.name.substring(0, UserNameSchema.maxLength)}" required pattern="^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$" title="Only letters, numbers, and single spaces allowed" minLength="${UserNameSchema.minLength}" maxLength="${UserNameSchema.maxLength}"/>
                    <label class="label opacity-50">
                        <span class="label-text-alt">
                            <p>Only letters, numbers, and single spaces allowed</p>
                        </span>

                        <span id="user_name_input_char_count"class="label-text-alt">0/${UserNameSchema.maxLength} chars</span>
                    </label>

                </div>

                <!-- Add a hidden field which captures the current url which can then be used to redirect back to this page -->
                <input type="hidden" name="redirect" value="${ctx.req.url.pathname}" />
                
                <button class="btn btn-info self-end">Save</button>
            </form>

            <script>
            const getUserSlugCharCount = async (e) => {
                let numOfEnteredChars = user_slug_input.value.length;
                user_slug_input_char_count.innerText = numOfEnteredChars + "/" + ${UserSlugSchema.maxLength} + "chars";
            }
            
            const getUserNameCharCount = async (e) => {
                let numOfEnteredChars = user_name_input.value.length;
                user_name_input_char_count.innerText = numOfEnteredChars + "/" + ${UserSlugSchema.maxLength} + "chars";
            }
            getUserSlugCharCount();
            user_slug_input.addEventListener("input", getUserSlugCharCount)
            getUserNameCharCount();
            user_name_input.addEventListener("input", getUserNameCharCount)

            user_slug_input.addEventListener("input", async (e) => {
                user_slug_input.setCustomValidity("");
                user_slug_input.reportValidity();
                user_slug_invalid_icon.classList.add("hidden");
                user_slug_valid_icon.classList.add("hidden");
            })
            
            // when the user moves away from the input, log the value
            user_slug_input.addEventListener("blur", async (e) => {
                if (user_slug_input.value !== "${ctx.user.slug}") {
                    // call the server POST api to check if the slug is unique
                    try {
                        const options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ slug: user_slug_input.value })
                        };
                        const response = await fetch("/api/is-user-slug-dup", options);
                        if (!response.ok) {
                        throw new Error("Network response was not OK");
                        }
                        let result = await response.json();
                        console.log("response", result.data)
                        if (result.data === "dup") {
                            user_slug_input.setCustomValidity("This user id / slug is already taken. Please choose another.");
                            user_slug_input.reportValidity();
                            user_slug_invalid_icon.classList.remove("hidden");
                            user_slug_valid_icon.classList.add("hidden");
                        } else {
                            user_slug_input.setCustomValidity("");
                            user_slug_input.reportValidity();
                            user_slug_invalid_icon.classList.add("hidden");
                            user_slug_valid_icon.classList.remove("hidden");
                        }
                    } catch (error) {
                        console.error("There has been a problem with your fetch operation:", error);
                    }

                    console.log("user_slug_input", user_slug_input.value)
                }
            })

            user_thumb_input.addEventListener("change", async(e) => {
                let file = user_thumb_input.files[0];
                if (file.size > 1024 * 1024) {
                    user_thumb_input.setCustomValidity("Image file size should be less than 1 Mb");
                    user_thumb_input.reportValidity();

                    user_thumb_input.value = "";
                    return;
                }
                let reader = new FileReader();
                reader.onload = function(e) {
                    user_thumb_img.src = e.target.result;
                }
                reader.readAsDataURL(file);
            })

            const updateProfileLink = async (e) => {
                user_slug_link_text.innerText = "https://digglu.com/u/" + user_slug_input.value;
            }
            updateProfileLink()
            user_slug_input.addEventListener("input", updateProfileLink)

            const updateNameText = async (e) => {
                user_name_text.innerText = user_name_input.value;
            }
            updateNameText()
            user_name_input.addEventListener("input", updateNameText)

            user_details_form.addEventListener("submit", (event) => {

                if (!user_name_input.checkValidity()) {
                    event.preventDefault(); // Prevent the default form submission
                    user_name_input.focus(); // Set focus back to the input field for correction
                    return; // Stop further execution
                }
                if (!user_slug_input.checkValidity()) {
                    event.preventDefault(); // Prevent the default form submission
                    user_slug_input.focus(); // Set focus back to the input field for correction
                    return; // Stop further execution
                }

               
            });

            </script>
        </div>
    </dialog>
    `
    :
    ""
}
