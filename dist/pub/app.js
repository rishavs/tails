// src/defs.js
var NewPostSchema = {
  titleMinLength: 16,
  titleMaxLength: 256,
  linkMinLength: 8,
  linkMaxLength: 256,
  contentMinLength: 32,
  contentMaxLength: 4096
};
var UserSlugSchema = {
  minLength: 8,
  maxLength: 64
};

// src/utils.js
var parseCookies = (str) => {
  if (!str || str == "")
    return {};
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
var getUserSlugCharCount = async (e) => {
  let numOfEnteredChars = user_slug_input.value.length;
  user_slug_input_char_count.innerText = numOfEnteredChars + `/${UserSlugSchema.maxLength} chars`;
};
if (user_slug_input) {
  getUserSlugCharCount();
  user_slug_input.addEventListener("input", getUserSlugCharCount);
}
var getUserNameCharCount = async (e) => {
  let numOfEnteredChars = user_name_input.value.length;
  user_name_input_char_count.innerText = numOfEnteredChars + `/${UserSlugSchema.maxLength} chars`;
};
if (user_name_input) {
  getUserNameCharCount();
  user_name_input.addEventListener("input", getUserNameCharCount);
}
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
document.getElementById("collapse_comments_btn")?.addEventListener("click", async (e) => {
  document.querySelectorAll(".collapse")?.forEach((comment) => {
    comment.open = false;
  });
});
document.getElementById("expand_comments_btn")?.addEventListener("click", async (e) => {
  document.querySelectorAll(".collapse")?.forEach((comment) => {
    console.log("Expanding comment: ", comment);
    comment.open = true;
  });
});
document.querySelectorAll(".collapse")?.forEach((comment) => {
  comment.addEventListener("toggle", (e) => {
    if (comment.open) {
      comment.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  });
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
