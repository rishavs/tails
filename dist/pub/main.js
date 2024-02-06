// ---------------------------------------
// Utilities
// ---------------------------------------
const parseCookies = (str) => {
    return str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {})
}

// ---------------------------------------
// Initialize context
// ---------------------------------------
let url = new URL(document.URL);

// ---------------------------------------
// Auth
// ---------------------------------------
let cookies = parseCookies(document.cookie);
if (cookies.D_NEW_SESSION) {

    // parse the user object from the cookie & add each attribute into local storage
    let user = JSON.parse(cookies.D_NEW_SESSION);
    Object.keys(user).forEach((key) => {
        localStorage.setItem(key, user[key]);
    });
    // document.cookie = "D_NEW_SESSION=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
} 

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
// Hydrate summary Cards
// ---------------------------------------
// ---------------------------------------
// Set page event handlers
// ---------------------------------------
document.getElementById("signout_action").addEventListener("click", async (e) => {
    localStorage.clear();
    window.location.href = "/signout";
})

// ---------------------------------------
// Setup Google sign-in
// ---------------------------------------
if (!localStorage.getItem('slug')) {

    let loginControlsContainer = document.getElementById("loginControls");
    if (loginControlsContainer) {

        google.accounts.id.initialize({
            client_id: "326093643211-dh58srqtltvqfakqta4us0il2vgnkenr.apps.googleusercontent.com",
            login_uri: `${url.origin}/api/signin/google?redirectTo=${encodeURIComponent(url.pathname)}`,
            context: "signin",
            ux_mode: "redirect",
            // prompt_parent_id: 'loginControls',
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