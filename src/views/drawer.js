import { PostCategories, CommunityLinks, LegalLinks } from "../defs"


let navBuilder = (ctx, group) => {
    let currPath = ctx.req.path.split("/")[1]

    return Object.keys(group).map((link) => {
        return /*html*/ `
        <li><a class="hover:underline${currPath == link ? " active" : "" }" href="/${link}">
            ${group[link]}
        </a></li>`
    }).join("")
}

export const drawer = (ctx, prefix) => {

    return /*html*/ `
    <ul class="menu menu-lg min-h-screen px-8 w-64 flex flex-col gap-2 lg:gap-4 sticky top-0 bg-base-200">
        <li>
            <details open>
                <summary class="group"> Category</summary> 
                <ul class="flex flex-col gap-1 lg:gap-2">
                    <li><a id="all_link" class="hover:underline${ctx.req.path == "/" ? " active": ""}" href="/">All</a></li>
                    ${navBuilder(ctx, PostCategories)}
                </ul>
            </details> 
        </li>
        <li>
            <details class="border-t border-base-300">
                <summary class="group"> Community</summary> 
                <ul>
                    ${navBuilder(ctx, CommunityLinks)}
                </ul>
            </details> 
        </li>
        <li>
            <details class="border-t border-base-300">
                <summary class="group"> Legal</summary> 
                <ul>
                    ${navBuilder(ctx, LegalLinks)}
                </ul>
            </details> 
        </li>
    </ul>
`
}