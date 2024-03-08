export const userButton = (ctx) => {
    return /*html*/`
    <a class="btn btn-sm relative flex items-center overflow-hidden lg:btn-md hover:underline max-w-28 lg:max-w-48 shadow">
        <img id="user_thumb_img" class="absolute -left-2 w-10 rounded-r-full shadow lg:w-16 border border-base-300" src="${ctx.user.thumb}" />
        <div class="max-w-28 p-1 pl-10 lg:max-w-48 lg:pl-14">
            <p id="user_name_text" class="truncate">${ctx.user.name}</p>
        </div>
    </a>
    `
}