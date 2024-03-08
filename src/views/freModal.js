import { UserNameSchema, UserSlugSchema } from "../defs"

export const freModal = (ctx) => {  
    // console.log("freModal", ctx.user)

    // TODO - generate random slug for user and check if its unique
    return ctx.user ?
    /*html*/`
    <!-- Open the modal using ID.showModal() method -->
    <dialog id="freModal" class="modal modal-bottom lg:modal-middle border border-base-300" open>
        <div class="modal-box flex flex-col gap-4">
            
            <form method="dialog">
                <button class="btn btn-square absolute right-4 top-4">✕</button>
            </form>

            <form method="" class="w-full flex flex-col gap-4">
                <h3 class="font-bold text-lg text-center">Welcome to Digglu!</h3>
                <p class="">Let's set you up with your user details.</p>

                <p class="flex flex-col">
                    <span class="font-bold">Profile Home</span>
                    <span>Enter a Unique Id that others can use to see your profile</span>
                </p>

                <div id="" class="form-control w-full">
                    
                    <label class="input input-bordered flex items-center gap-1 has-[:invalid]:border has-[:invalid]:border-error">
                        <span class="font-bold">https://digglu.com/u/</span>
                        <input id="user_slug_input" name ="slug" type="text" class="grow" required minlength="${UserSlugSchema.minLength}" maxlength="${UserSlugSchema.maxLength}" value="purple-snapping-turtle" required pattern="[a-zA-Z0-9-]{${UserSlugSchema.maxLength}}" title="Only letters, numbers, and hyphens allowed"/>
                    </label>

                    <label class="label">
                        <span class="label-text-alt">
                            <p>Min ${UserSlugSchema.minLength} chars.</p> 
                            <p>Only letters, numbers, and hyphens allowed</p>
                        </span>
                        <span id="user_slug_input_char_count" class="label-text-alt">0/${UserSlugSchema.maxLength} chars</span>

                    </label>
                </div>
                
                <p class="flex flex-col">
                    <span class="font-bold">Display Picture and Name</span>
                    <span>Click on the profile picture or your name to change them</span>
                </p>

                <div class="form-control w-full">
                    <div class="group join flex border border-base-300">
                        <div class="dropdown dropdown-right join-item">
                            <div tabindex="0" role="button" class="avatar btn join-item btn-lg relative w-20 p-0">
                            <img class="rounded-r-full border-r border-r-base-300 shadow-lg group-hover:opacity-20" src="https://api.dicebear.com/7.x/pixel-art/svg" alt="avatar" />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="absolute size-6 opacity-0 group-hover:opacity-100">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            </div>
                            <ul tabindex="0" class="dropdown-content menu menu-lg z-10 w-52 rounded-box bg-base-100 p-2 shadow">
                            <li><a>Generate Random Avatar</a></li>
                            <li><a>More Options coming Soon...</a></li>
                            </ul>
                        </div>
                        <div class="btn join-item btn-lg relative grow has-[:invalid]:border has-[:invalid]:border-error">
                            <input id="user_name_input" name="name" type="text" class="peer input w-full bg-inherit" value="${ctx.user.name.substring(0, UserNameSchema.maxLength)}" required pattern="^\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)*\s*$" title="Only letters, numbers, and single spaces allowed" minLength="${UserNameSchema.minLength}" maxLength="${UserNameSchema.maxLength}"/>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute size-6 opacity-0 group-hover:opacity-100 peer-focus:hidden">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </div>
                    </div>

                    <label class="label">
                        <span class="label-text-alt">
                            <p>Min ${UserNameSchema.minLength} chars. </p>
                            <p>Only letters, numbers, and single spaces allowed</p>
                        </span>

                        <span id="user_name_input_char_count"class="label-text-alt">0/${UserNameSchema.maxLength} chars</span>
                    </label>
                </div>
                
                <button class="btn btn-info self-end">Save</button>
            </form>
            <script>
  const form = document.getElementById("myForm");
  const inputField = document.getElementById("myInput");

  form.addEventListener("submit", (event) => {
    if (!inputField.checkValidity()) {
      event.preventDefault(); // Prevent form submission
      inputField.focus(); // Set focus back to the input field for correction
    }
  });
</script>

        </div>
    </dialog>
    <script>
    </script>
    `
    :
    ""
}

// <form method="" class="modal-box p-8 lg:p-16">

// <h3 class="font-bold text-lg text-center">Welcome to Digglu!</h3>
// <p class="pt-4">Let's set you up with your user details</p>
// <small class="text-xs opacity-50">Note: You can always do this later in your profile section.</small>

// <div class="form-control w-full">
//     <label class="label">
//         <span class="label-text">What is your name?</span>
//         <span class="label-text-alt">Top Right label</span>
//     </label>
//     <input type="text" placeholder="Type here" class="input input-bordered w-full" />
//     <label class="label">
//         <span class="label-text-alt">Bottom Left label</span>
//         <span class="label-text-alt">Bottom Right label</span>
//     </label>
// </div>

// <div class="form-control w-full max-w-xs">
//     <label class="label">
//         <span class="label-text">What is your name?</span>
//         <span class="label-text-alt">Top Right label</span>
//     </label>
//     <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
//     <label class="label">
//         <span class="label-text-alt">Bottom Left label</span>
//         <span class="label-text-alt">Bottom Right label</span>
//     </label>
// </div>

// </form>