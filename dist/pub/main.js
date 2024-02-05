// ---------------------------------------
// Utilities
// ---------------------------------------

// ---------------------------------------
// Initialize context
// ---------------------------------------
let url = new URL(document.URL);

// ---------------------------------------
// Auth
// ---------------------------------------
// console.log(ctx.cookies)
// console.log(ctx.cookies.D_NEW_SESSION)
// if (ctx.cookies.D_NEW_SESSION) {

//     // parse the user object from the cookie & add each attribute into local storage
//     let user: User = JSON.parse(ctx.cookies['D_NEW_SESSION']) as User;
//     Object.keys(user).forEach((key) => {
//         localStorage.setItem(key, (user as any)[key]);
//     });
//     // document.cookie = "D_NEW_SESSION=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
// } 

// ---------------------------------------
// Attach DOM Fragments and start hydrating
// ---------------------------------------

// ---------------------------------------
// Hydrate summary Cards
// ---------------------------------------

// ---------------------------------------
// Mark the active page in the Drawer
// ---------------------------------------
// ---------------------------------------
// Update the Header
// ---------------------------------------
// ---------------------------------------
// Show the FRE
// ---------------------------------------

// ---------------------------------------
// Show toasts
// ---------------------------------------

// ---------------------------------------
// Show alerts
// ---------------------------------------

// ---------------------------------------
// Show floaters
// ---------------------------------------

// ---------------------------------------
// Setup Google sign-in
// ---------------------------------------
if (!localStorage.getItem('D_USER_SLUG')) {

    let showLoginControls = false
    let loginControlsContainer = document.getElementById("loginControls");
    if (loginControlsContainer && showLoginControls) {

        google.accounts.id.initialize({
            client_id: "326093643211-dh58srqtltvqfakqta4us0il2vgnkenr.apps.googleusercontent.com",
            login_uri: `${url.origin}/api/login/google?redirectTo=${encodeURIComponent(url.pathname)}`,
            context: "signin",
            ux_mode: "redirect",
            prompt_parent_id: 'loginControls',
            auto_select: false,
        });
        google.accounts.id.renderButton(
            loginControlsContainer,
            { 
                type: window.innerWidth < 768 ? "icon" : "standard",
                shape: window.innerWidth < 768 ? "circle" : "rectangular",
                theme: "outline", 
                size: "large",
                locale: "en_US",
            }
            // customization attributes
        );
        google.accounts.id.prompt();
    }

}


// window.triggerToast = async (type, text) => {
//     if (type =="success") {
//         document.getElementById("success_toast_text")!.innerText = text;
//         document.getElementById("success_toast")!.classList.toggle("hidden");
//     } else if (type == "error") {
//         document.getElementById("error_toast_text")!.innerText = text;
//         document.getElementById("error_toast")!.classList.toggle("hidden");
//     }

//     // now start a timer and if the toast is still visible after 5 seconds, hide it
//     setTimeout(() => {
//         if (type == "success") {
//             document.getElementById("success_toast")!.classList.toggle("hidden");
//         } else if (type == "error") {
//             document.getElementById("error_toast")!.classList.toggle("hidden");
//         }
//     }, 3000);

// }

// window.triggerAlert = async (type, text, link) => {
//     if (type == "error") {
//         document.getElementById("error_alert_text")!.innerText = text;
//         document.getElementById("error_alert")!.classList.toggle("hidden");
//     } else if (type == "sticky") {
//         let stickyAlertLink = document.getElementById("sticky_alert_link") as HTMLAnchorElement;
//         stickyAlertLink.href = link;
//         document.getElementById("sticky_alert_text")!.innerText = text;
//         document.getElementById("sticky_alert")!.classList.toggle("hidden");
//     }
// }
        
// ---------------------------------------
// Trigger Page on load actions
// ---------------------------------------