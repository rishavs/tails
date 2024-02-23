export const header =  (ctx) => {
    return /*html*/`
    <div class="navbar-start">
        <label for="left-drawer" class="btn btn-ghost drawer-button lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </label>
        <a class="btn btn-ghost p-0 lg:btn-lg text-2xl lg:text-4xl drop-shadow bg-gradient-to-r from-error to-warning text-transparent bg-clip-text" href="/">
            <!--<div class="avatar hidden">
                <div class="w-12 lg:w-16">
                    <img src="/pub/logo.png" alt="logo" loading="lazy" decoding=""/>
                </div>
            </div>-->
            Digglu
        </a>
        </div>
    
        <div class="navbar-center gap-2 items-center"></div>
    
        <div class="navbar-end items-center">
        <button class="btn btn-sm lg:btn-md btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 lg:w-6 lg:h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
    
        </button>
   
        <div id="loginControls" class="flex items-center" >
            <a href="/p/new" class="btn btn-sm lg:btn-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New
            </a>

            <div class="dropdown dropdown-end mx-1">
                <label tabindex="0" class="btn btn-sm lg:btn-md btn-square btn-outline avatar">
                    <img class="rounded-btn" src="/pub/bm.png" />
                </label>
                <ul tabindex="0" class="z-20 mt-3 p-2 shadow menu lg:menu-lg dropdown-content bg-base-200 rounded-box w-52">
                    <li>
                        <a class="justify-between">
                            Profile
                            <span class="badge">New</span>
                        </a>
                    </li>
                    <li>
                        <a class="justify-between" onclick="theme_modal.showModal()">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 lg:w-6 lg:h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
                            </svg>
                            Themes
                            <span class="badge">New</span>
                        </a>
                    </li>
                    <li>
                        <a id="signout_action"> Signout </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `
}
