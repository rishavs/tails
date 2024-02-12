// src/defs.js
var NewPostSchema = {
  titleMinLength: 16,
  titleMaxLength: 256,
  linkMinLength: 8,
  linkMaxLength: 256,
  contentMinLength: 32,
  contentMaxLength: 4096
};

// src/utils.js
var parseCookies = (str) => {
  return str.split(";").map((v) => v.split("=")).reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});
};

// src/client.js
var url = new URL(document.URL);
var cookies = parseCookies(document.cookie);
if (cookies.D_NEW_SESSION) {
  let user = JSON.parse(cookies.D_NEW_SESSION);
  Object.keys(user).forEach((key) => {
    localStorage.setItem(key, user[key]);
  });
}
document.getElementById("signout_action")?.addEventListener("click", async (e) => {
  localStorage.clear();
  window.location.href = "/signout";
});
document.getElementById("post_type")?.addEventListener("click", async (e) => {
  if (post_type.checked) {
    post_link_controls.classList.remove("hidden");
    post_link_input.required = true;
  } else {
    post_link_controls.classList.add("hidden");
    post_link_input.required = false;
  }
});
document.getElementById("post_link_input")?.addEventListener("input", async (e) => {
  let numOfEnteredChars = post_link_input.value.length;
  post_link_char_count.innerText = numOfEnteredChars + `/${NewPostSchema.linkMaxLength} chars`;
});
document.getElementById("post_title_input")?.addEventListener("input", async (e) => {
  let numOfEnteredChars = post_title_input.value.length;
  post_title_char_count.innerText = numOfEnteredChars + `/${NewPostSchema.titleMaxLength} chars`;
});
document.getElementById("post_descr_textarea")?.addEventListener("input", async (e) => {
  let numOfEnteredChars = post_descr_textarea.value.length;
  descr_char_count.innerText = numOfEnteredChars + `/${NewPostSchema.contentMaxLength} chars`;
});
if (!localStorage.getItem("slug")) {
  let loginControlsContainer = document.getElementById("loginControls");
  if (loginControlsContainer) {
    google.accounts.id.initialize({
      client_id: "326093643211-dh58srqtltvqfakqta4us0il2vgnkenr.apps.googleusercontent.com",
      login_uri: `${url.origin}/api/signin/google?redirectTo=${encodeURIComponent(url.pathname)}`,
      context: "signin",
      ux_mode: "redirect",
      // prompt_parent_id: 'loginControls',
      auto_select: false
    });
    google.accounts.id.renderButton(
      loginControlsContainer,
      {
        type: window.innerWidth < 768 ? "icon" : "standard",
        shape: window.innerWidth < 768 ? "circle" : "rectangular",
        theme: "outline",
        size: "large",
        locale: "en_US"
      }
      // customization attributes
    );
    google.accounts.id.prompt();
  }
}
