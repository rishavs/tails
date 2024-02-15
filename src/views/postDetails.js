export const postDetails = async (post) => {   
    return /*html*/`
    <section name="article" class="flex flex-col gap-2 rounded-box border border-base-300 bg-base-100 p-4 shadow-xl">
        <!-- Image Row -->
        <figure class="">
            <img src="https://picsum.photos/seed/picsum/500/300" class="w-full rounded-box object-cover" alt="Shoes" />
        </figure>

        <!-- The author row -->
        <div class="flex justify-between pt-2">
            <div class="flex gap-2 lg:gap-4">
                <a class="btn btn-sm relative flex items-center overflow-hidden shadow-lg lg:btn-md hover:underline">
                    <img class="absolute -left-2 w-10 rounded-r-full shadow-lg lg:w-16" src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80" />
                    <div class="max-w-28 pl-8 lg:max-w-48 lg:pl-12">
                        <div class="truncate">Andrew Alfred Dingus Berrius</div>
                    </div>
                </a>

            </div>
            <div class="flex items-center gap-2">
                <a href="" class="btn btn-sm lg:btn-md flex items-center hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />
                    </svg>
                    Tech
                </a>
                <button class="btn btn-sm lg:btn-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                </button>

                <button class="btn btn-sm lg:btn-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                </button>

                <button class="btn btn-ghost btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- The post header row -->
        <div class="divider m-0"></div>
        <p class="self-top line-clamp-3 font-medium text-lg lg:text-2xl">
            <span class="inline-flex items-center">
                <img src="https://picsum.photos/seed/11/100/100" alt="" class="size-4 lg:size-6 rounded mx-1" />
            </span>
            <a href="" class="hover:underline">Garlic bread with cheese: What the science tells us. because scienece knows stuff about Garlics and Breads</a>
        </p>

        <a href="/" class="border-b border-t border-base-300 py-1 lg:py-3 min-h-16 lg:min-h-24 max-h-56">
            <div class="avatar float-left">
                <div class="w-20 rounded-btn h-auto lg:w-36 mr-2 lg:mr-4">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>

            </div>
            <p class="px-2 font-medium leading-relaxed lg:text-lg hover:underline">Garlic bread with cheese: What the science tells us. because scienece knows stuff about Garlics and Breads. Garlic bread with cheese: What the science tells us. because scienece knows stuff about Garlics and Breads</p>
        </a>

        <!-- The summary row -->
        <div class="bg-base-300 rounded border-l-2 border-white p-2 lg:p-4 flex flex-col gap-2 lg:gap-4 my-2">
        <p class="opacity-70 text-xs">From the page's descritpion in [google.com]</p> 
        <p class="italic prose max-w-none">
        For years parents have espoused the health benefits of eating garlic bread with cheese to their children, with the food earning such an iconic status in our culture that kids will often dress up as warm, cheesy loaf for Halloween.
        But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases springing up around the country
        </p>
        </div>

        <!-- The post content row -->
        <article class="lg:prose-xl prose max-w-none">
        <p>For years parents have espoused the health benefits of eating garlic bread with cheese to their children, with the food earning such an iconic status in our culture that kids will often dress up as warm, cheesy loaf for Halloween.</p>
        <p>But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases springing up around the country.</p>
        </article>
        <p class="text-xs italic opacity-70 pt-2 lg:pt-4 text-end pr-2">
            <span class="">Posted </span>·
            <span class="">12 hrs ago by </span> ·
            <span class="">[OP] </span>
            <a href="" class="underline"> Lord Dingus Berrius </a>
        </p>
        
        <div class="divider m-0"></div>

        <!-- The controls Row -->
        <div class="flex justify-between">
            <div class="flex gap-2">
                <button class="btn btn-sm lg:btn-md btn-warning">                                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="5" stroke="currentColor" class="size-4 lg:size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                    </svg>
                    <span>1</span>
                <button>
                <button class="btn btn-sm lg:btn-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>
                </button>
            </div>
            <div class="flex gap-2">
                <button class="btn btn-sm  lg:btn-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>

                </button>
                <button class="btn btn-sm lg:btn-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>

                </button>
                <button class="btn btn-error btn-sm lg:btn-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4 lg:size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    Reply
                </button>
            
            </div>
        </div>
    </section>
    `
}


