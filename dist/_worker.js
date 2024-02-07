// src/handlers/setHeaders.js
var setHeaders = (ctx) => {
  if (ctx.req.url.pathname.startsWith("/api")) {
    ctx.res.headers.append("content-type", "application/json;charset=UTF-8");
    ctx.res.headers.append("Powered-by", "API: Pika Pika Pika Choooo");
  } else {
    ctx.res.headers.append("Powered-by", "VIEW: Pika Pika Pika Choooo");
    ctx.res.headers.append("Content-Type", "text/html; charset=UTF-8");
  }
};

// src/handlers/sayHello.js
var sayHello = (ctx) => {
  ctx.res.status = 200;
  ctx.res.content = JSON.stringify({ message: "Hello from the API" });
};

// src/handlers/buildAboutPage.js
var buildAboutPage = (ctx) => {
  ctx.page.title = "META: About Page";
  ctx.page.descr = "META: This is the about page";
  ctx.page.html = /*html*/
  `
            <article class="min-h-screen">
                <h1>ABOUT Page</h1>
            </article>
        `;
};

// src/defs.js
var PostCategories = {
  meta: "Meta",
  tech: "Science & Tech",
  games: "Gaming",
  world: "World News",
  sport: "Sports",
  biz: "Business",
  life: "Lifestyle",
  media: "Entertainment",
  funny: "Funny",
  cute: "Cute Stuff",
  else: "Everything Else"
};
var CommunityLinks = {
  faqs: "FAQs",
  rules: "Guidelines",
  cont: "Contact Us"
};
var LegalLinks = {
  terms: "Terms of Use",
  priv: "Privacy Policy",
  cook: "Cookie Policy"
};

// src/views/drawer.js
var navBuilder = (ctx, group) => {
  let currPath = ctx.req.path.split("/")[1];
  return Object.keys(group).map((link) => {
    return (
      /*html*/
      `
        <li><a class="hover:underline${currPath == link ? " active" : ""}" href="/${link}">
            ${group[link]}
        </a></li>`
    );
  }).join("");
};
var drawer = (ctx, prefix) => {
  return (
    /*html*/
    `
    <ul class="menu menu-lg min-h-screen px-8 w-64 flex flex-col gap-2 lg:gap-4 sticky top-0 bg-base-200">
        <li>
            <details open>
                <summary class="group"> Category</summary> 
                <ul class="flex flex-col gap-1 lg:gap-2">
                    <li><a id="all_link" class="hover:underline${ctx.req.path == "/" ? " active" : ""}" href="/">All</a></li>
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
  );
};

// src/views/header.js
var header = (ctx) => {
  return (
    /*html*/
    `
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
   
        <div id="loginControls" class="mx-1 flex items-center" >
            <a href="/p/new" class="btn btn-square btn-error btn-outline mx-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

            </a>

            <div class="dropdown dropdown-end mx-1">
                <label tabindex="0" class="btn btn-square btn-error btn-outline avatar p-1">
                    <img class="rounded" src="/pub/bm.png" />
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
  );
};

// src/views/themeModal.js
var themeModal = () => {
  return (
    /*html*/
    `
    <dialog id="theme_modal" class="modal modal-bottom lg:modal-middle">
        <div class="modal-box">

            <div class="modal-action">
                <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                    <button class="btn btn-square">\u2715</button>
                </form>
            </div>
            <h3 class="font-bold text-lg text-center">Theme Picker</h3>
            <p class="py-4 text-center">Select a theme for Digglu from the collection below! </p>     
            <div class="divider"></div>   
            ${[
      "acid",
      "aqua",
      "aquafina",
      "autumn",
      "black",
      "bumblebee",
      "business",
      "cmyk",
      "coffee",
      "corporate",
      "cupcake",
      "cyberpunk",
      "dark",
      "darksun",
      "dim",
      "dracula",
      "emerald",
      "fantasy",
      "forest",
      "garden",
      "halloween",
      "lemonade",
      "light",
      "lofi",
      "lux",
      "luxury",
      "night",
      "nord",
      "pastel",
      "retro",
      "sunset",
      "synthwave",
      "valentine",
      "winter",
      "wireframe"
    ].map((theme) => (
      /*html*/
      `
                <input type="radio" name="theme-buttons" class="theme-controller mx-1 my-2 btn join-item" aria-label="${theme}" value="${theme}" />
                `
    )).join("")}
        </div>
  </dialog>
  `
  );
};

// src/handlers/generateHTML.js
var generateHTML = (ctx) => {
  ctx.res.content = /*html*/
  `
    <!DOCTYPE html>
    <html lang="en" data-theme="dracula">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <title>${ctx.page.title}</title>
            <link rel="icon" type="image/x-icon" href="/pub/favicon.ico">

            <meta name="description" content="${ctx.page.descr}">
            <head prefix="og: http://ogp.me/ns#">
            <meta property="og:type" content="article">
            <meta property="og:title" content="${ctx.page.title}">


            <link href="/pub/styles.css" rel="stylesheet" type="text/css">
            <script src="https://accounts.google.com/gsi/client" defer><\/script>
            <script src="/pub/main.js" type="module" defer><\/script>

        </head>

        <body class="min-h-screen bg-base-200">

            <div id = "alerts_container"></div>

            <!-- left drawer -->
            <div class="drawer">
            
                <!-- Left nav slider. For mobile -->
                <input id="left-drawer" type="checkbox" class="drawer-toggle">
                <div class="drawer-side z-20">
                    <label for="left-drawer" class="drawer-overlay"></label>

                    ${drawer(ctx, "navslider")}
                </div>
                
                <div class="drawer-content flex">
        
                    <!-- Left fixed Panel. For lg screens -->
                    <aside id="drawer_container" class="hidden lg:flex justify-end items-start grow min-w-80 border border-base-300 pt-48">
                        ${drawer(ctx, "navpanel")}
                    </aside>
                    
                    <!-- Central Column -->
                    <div class="grow-0 w-full lg:min-w-[128] lg:w-[50rem] lg:pt-8 lg:px-4">
        
                    <!-- Header Content -->
                        <header id="header_container" class="navbar sticky top-0 bg-base-100 opacity-90 rounded-b-box lg:rounded-box border border-base-300 shadow-lg h-8 lg:h-20 z-10">
                            ${header(ctx)}
                        </header>

                        <!-----------------------
                        Noscript Content
                        ------------------------>
                        <noscript >
                            <article class="prose lg:prose-lg text-center pt-16">
                                <h1>Error: Javascript is disabled.</h1>
                                <br>
                                <h3>Digglu needs Javascript to function properly.</h3>
                                <h3>Please enable Javascript in your browser and refresh the page. </h3>
                                <br>
                                <br>
                                <small> <i> " Without script's embrace,</i></small>
                                <small> <i> Digglu loses its grace,</i></small>
                                <small> <i> Lost in cyberspace. " </i></small>
                            </article>
                        </noscript>
                        
                        <!-- Main Page Content -->
                        <main id="main_container">
                            ${ctx.page.html}
                        </main>
                    </div>
        
                    <!-- Right Sidepanel -->
                    <aside id="sidePanel_container" class="hidden lg:flex justify-start grow min-w-80 pt-48 flex-col gap-4"> 
                        <div id="topPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="trendingPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="discussionPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="latestPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="historyPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                    </aside>
                                        
                </div>
            </div>
            <div id = "modals_container">
                ${themeModal()}
            </div>
            <div id = "toasts_container" class="toast toast-top toast-end z-100"></div>
        
        
            <div id = "floaters_container"></div>
        </body>
    </html>
    `;
};

// src/handlers/buildErrorPage.js
var errors = {
  "401": {
    msg: "You are not authorized to access this page",
    haikus: [
      `Unauthorized here, Access denied, I fear, Login, to come near.`,
      `Four zero one cries, Credentials, it denies, In secrecy, it lies.`,
      `Access, it has fled, Four zero one, full of dread, "Not here," it has said.`,
      `In the web's vast sea, Four zero one, not free, Where could the key be?`,
      `A 401 blunder, Access, torn asunder, Lost in the web's thunder.`
    ]
  },
  "404": {
    msg: "Page Not Found",
    haikus: [
      `Page not found,<br> oh dear, The path is no longer clear,<br> Lost in the web's frontier.`,
      `Four zero four cries,<br> The sought page, a ghost, it lies,<br> In the web's vast skies.`,
      `The page, it has fled,<br> Four zero four, full of dread,<br> "Not here," it has said.`,
      `In the web's vast sea,<br> Four zero four, lost, carefree,<br> Where could the page be?`,
      `A 404 blunder,<br> The page, torn asunder,<br> Lost in the web's thunder.`
    ]
  },
  "500": {
    msg: "Internal Server Error",
    haikus: [
      `Five hundred, a sigh, Server's internal outcry, A fix, we must apply.`,
      `Internal error screams, Shattering digital dreams, Not as easy as it seems.`,
      `Server's silent plea, Five hundred, a mystery, In code, the key.`,
      `A glitch in the core, Five hundred, can't ignore, Need to rectx.`,
      `A 500 plight, In the server's endless night, Seeking the light.`
    ]
  },
  "503": {
    msg: "Service Unavailable",
    haikus: [
      `Five zero three, a pause, Service unavailable, cause, Time to debug laws.`,
      `Service, it retreats, Five zero three, it repeats, Until the issue depletes.`,
      `Unavailable, it moans, Five zero three, it groans, In the server's twilight zones.`,
      `A 503 blip, Service took a trip, Need to regain grip.`,
      `Five zero three, a sign, Service, not in line, A solution, we must design.`
    ]
  }
};
var buildErrorPage = (ctx, e) => {
  let errCodeFromParams = ctx.req.params.get("code");
  let errMsgFromParams = ctx.req.params.get("msg");
  if (errCodeFromParams && !["400", "401", "404", "503"].includes(errCodeFromParams)) {
    errCodeFromParams = "500";
  }
  let errorCode = parseInt(errCodeFromParams) || 500;
  let errorMsg = errMsgFromParams || e.cause || errors[errorCode].msg;
  let haiku = errors[errCodeFromParams] && errors[errCodeFromParams].haikus ? errors[errCodeFromParams].haikus[Math.floor(Math.random() * errors[errCodeFromParams].haikus.length)] : "";
  console.log(`Error: ${errCodeFromParams} - ${errorMsg}`);
  ctx.page.title = "ERROR Page";
  ctx.page.descr = "This is the error page";
  ctx.page.html = /*html*/
  `
        <article class="prose lg:prose-lg text-center pt-16">
            <h1>Error ${errCodeFromParams} :( </h1>
            <h3> ${errorMsg} </h3>
            <small> <i>
                ${haiku}
            </i></small>
        </article>
    `;
};

// node_modules/jose/dist/browser/runtime/webcrypto.js
var webcrypto_default = crypto;
var isCryptoKey = (key) => key instanceof CryptoKey;

// node_modules/jose/dist/browser/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}

// node_modules/jose/dist/browser/runtime/base64url.js
var decodeBase64 = (encoded) => {
  const binary = atob(encoded);
  const bytes2 = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes2[i] = binary.charCodeAt(i);
  }
  return bytes2;
};
var decode = (input) => {
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
};

// node_modules/jose/dist/browser/util/errors.js
var JOSEError = class extends Error {
  static get code() {
    return "ERR_JOSE_GENERIC";
  }
  constructor(message2) {
    super(message2);
    this.code = "ERR_JOSE_GENERIC";
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var JWTClaimValidationFailed = class extends JOSEError {
  static get code() {
    return "ERR_JWT_CLAIM_VALIDATION_FAILED";
  }
  constructor(message2, claim = "unspecified", reason = "unspecified") {
    super(message2);
    this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    this.claim = claim;
    this.reason = reason;
  }
};
var JWTExpired = class extends JOSEError {
  static get code() {
    return "ERR_JWT_EXPIRED";
  }
  constructor(message2, claim = "unspecified", reason = "unspecified") {
    super(message2);
    this.code = "ERR_JWT_EXPIRED";
    this.claim = claim;
    this.reason = reason;
  }
};
var JOSEAlgNotAllowed = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
  static get code() {
    return "ERR_JOSE_ALG_NOT_ALLOWED";
  }
};
var JOSENotSupported = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_NOT_SUPPORTED";
  }
  static get code() {
    return "ERR_JOSE_NOT_SUPPORTED";
  }
};
var JWSInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWS_INVALID";
  }
  static get code() {
    return "ERR_JWS_INVALID";
  }
};
var JWTInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWT_INVALID";
  }
  static get code() {
    return "ERR_JWT_INVALID";
  }
};
var JWKSInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWKS_INVALID";
  }
  static get code() {
    return "ERR_JWKS_INVALID";
  }
};
var JWKSNoMatchingKey = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWKS_NO_MATCHING_KEY";
    this.message = "no applicable key found in the JSON Web Key Set";
  }
  static get code() {
    return "ERR_JWKS_NO_MATCHING_KEY";
  }
};
var JWKSMultipleMatchingKeys = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    this.message = "multiple matching keys found in the JSON Web Key Set";
  }
  static get code() {
    return "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  }
};
var JWKSTimeout = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWKS_TIMEOUT";
    this.message = "request timed out";
  }
  static get code() {
    return "ERR_JWKS_TIMEOUT";
  }
};
var JWSSignatureVerificationFailed = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    this.message = "signature verification failed";
  }
  static get code() {
    return "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  }
};

// node_modules/jose/dist/browser/runtime/random.js
var random_default = webcrypto_default.getRandomValues.bind(webcrypto_default);

// node_modules/jose/dist/browser/lib/crypto_key.js
function unusable(name, prop = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
function isAlgorithm(algorithm, name) {
  return algorithm.name === name;
}
function getHashLength(hash) {
  return parseInt(hash.name.slice(4), 10);
}
function getNamedCurve(alg) {
  switch (alg) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
function checkUsage(key, usages) {
  if (usages.length && !usages.some((expected) => key.usages.includes(expected))) {
    let msg = "CryptoKey does not support this operation, its usages must include ";
    if (usages.length > 2) {
      const last = usages.pop();
      msg += `one of ${usages.join(", ")}, or ${last}.`;
    } else if (usages.length === 2) {
      msg += `one of ${usages[0]} or ${usages[1]}.`;
    } else {
      msg += `${usages[0]}.`;
    }
    throw new TypeError(msg);
  }
}
function checkSigCryptoKey(key, alg, ...usages) {
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!isAlgorithm(key.algorithm, "HMAC"))
        throw unusable("HMAC");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
        throw unusable("RSASSA-PKCS1-v1_5");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!isAlgorithm(key.algorithm, "RSA-PSS"))
        throw unusable("RSA-PSS");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "EdDSA": {
      if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
        throw unusable("Ed25519 or Ed448");
      }
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!isAlgorithm(key.algorithm, "ECDSA"))
        throw unusable("ECDSA");
      const expected = getNamedCurve(alg);
      const actual = key.algorithm.namedCurve;
      if (actual !== expected)
        throw unusable(expected, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  checkUsage(key, usages);
}

// node_modules/jose/dist/browser/lib/invalid_key_input.js
function message(msg, actual, ...types2) {
  if (types2.length > 2) {
    const last = types2.pop();
    msg += `one of type ${types2.join(", ")}, or ${last}.`;
  } else if (types2.length === 2) {
    msg += `one of type ${types2[0]} or ${types2[1]}.`;
  } else {
    msg += `of type ${types2[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
var invalid_key_input_default = (actual, ...types2) => {
  return message("Key must be ", actual, ...types2);
};
function withAlg(alg, actual, ...types2) {
  return message(`Key for the ${alg} algorithm must be `, actual, ...types2);
}

// node_modules/jose/dist/browser/runtime/is_key_like.js
var is_key_like_default = (key) => {
  return isCryptoKey(key);
};
var types = ["CryptoKey"];

// node_modules/jose/dist/browser/lib/is_disjoint.js
var isDisjoint = (...headers) => {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header2 of sources) {
    const parameters = Object.keys(header2);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
};
var is_disjoint_default = isDisjoint;

// node_modules/jose/dist/browser/lib/is_object.js
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
function isObject(input) {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}

// node_modules/jose/dist/browser/runtime/check_key_length.js
var check_key_length_default = (alg, key) => {
  if (alg.startsWith("RS") || alg.startsWith("PS")) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
};

// node_modules/jose/dist/browser/runtime/jwk_to_key.js
function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case "RSA": {
      switch (jwk.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          algorithm = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          algorithm = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
          };
          keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (jwk.alg) {
        case "ES256":
          algorithm = { name: "ECDSA", namedCurve: "P-256" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          algorithm = { name: "ECDSA", namedCurve: "P-384" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          algorithm = { name: "ECDSA", namedCurve: "P-521" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: "ECDH", namedCurve: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (jwk.alg) {
        case "EdDSA":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm, keyUsages };
}
var parse = async (jwk) => {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const rest = [
    algorithm,
    jwk.ext ?? false,
    jwk.key_ops ?? keyUsages
  ];
  const keyData = { ...jwk };
  delete keyData.alg;
  delete keyData.use;
  return webcrypto_default.subtle.importKey("jwk", keyData, ...rest);
};
var jwk_to_key_default = parse;

// node_modules/jose/dist/browser/key/import.js
async function importJWK(jwk, alg) {
  if (!isObject(jwk)) {
    throw new TypeError("JWK must be an object");
  }
  alg || (alg = jwk.alg);
  switch (jwk.kty) {
    case "oct":
      if (typeof jwk.k !== "string" || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value');
      }
      return decode(jwk.k);
    case "RSA":
      if (jwk.oth !== void 0) {
        throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
      }
    case "EC":
    case "OKP":
      return jwk_to_key_default({ ...jwk, alg });
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
  }
}

// node_modules/jose/dist/browser/lib/check_key_type.js
var symmetricTypeCheck = (alg, key) => {
  if (key instanceof Uint8Array)
    return;
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, ...types, "Uint8Array"));
  }
  if (key.type !== "secret") {
    throw new TypeError(`${types.join(" or ")} instances for symmetric algorithms must be of type "secret"`);
  }
};
var asymmetricTypeCheck = (alg, key, usage) => {
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, ...types));
  }
  if (key.type === "secret") {
    throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithms must not be of type "secret"`);
  }
  if (usage === "sign" && key.type === "public") {
    throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithm signing must be of type "private"`);
  }
  if (usage === "decrypt" && key.type === "public") {
    throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithm decryption must be of type "private"`);
  }
  if (key.algorithm && usage === "verify" && key.type === "private") {
    throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithm verifying must be of type "public"`);
  }
  if (key.algorithm && usage === "encrypt" && key.type === "private") {
    throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithm encryption must be of type "public"`);
  }
};
var checkKeyType = (alg, key, usage) => {
  const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
  if (symmetric) {
    symmetricTypeCheck(alg, key);
  } else {
    asymmetricTypeCheck(alg, key, usage);
  }
};
var check_key_type_default = checkKeyType;

// node_modules/jose/dist/browser/lib/validate_crit.js
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== void 0 && protectedHeader.crit === void 0) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === void 0) {
    return /* @__PURE__ */ new Set();
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== void 0) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
}
var validate_crit_default = validateCrit;

// node_modules/jose/dist/browser/lib/validate_algorithms.js
var validateAlgorithms = (option, algorithms) => {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return void 0;
  }
  return new Set(algorithms);
};
var validate_algorithms_default = validateAlgorithms;

// node_modules/jose/dist/browser/jwe/flattened/encrypt.js
var unprotected = Symbol();

// node_modules/jose/dist/browser/runtime/subtle_dsa.js
function subtleDsa(alg, algorithm) {
  const hash = `SHA-${alg.slice(-3)}`;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash, name: "RSA-PSS", saltLength: alg.slice(-3) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash, name: "ECDSA", namedCurve: algorithm.namedCurve };
    case "EdDSA":
      return { name: algorithm.name };
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
}

// node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
function getCryptoKey(alg, key, usage) {
  if (isCryptoKey(key)) {
    checkSigCryptoKey(key, alg, usage);
    return key;
  }
  if (key instanceof Uint8Array) {
    if (!alg.startsWith("HS")) {
      throw new TypeError(invalid_key_input_default(key, ...types));
    }
    return webcrypto_default.subtle.importKey("raw", key, { hash: `SHA-${alg.slice(-3)}`, name: "HMAC" }, false, [usage]);
  }
  throw new TypeError(invalid_key_input_default(key, ...types, "Uint8Array"));
}

// node_modules/jose/dist/browser/runtime/verify.js
var verify = async (alg, key, signature, data) => {
  const cryptoKey = await getCryptoKey(alg, key, "verify");
  check_key_length_default(alg, cryptoKey);
  const algorithm = subtleDsa(alg, cryptoKey.algorithm);
  try {
    return await webcrypto_default.subtle.verify(algorithm, cryptoKey, signature, data);
  } catch {
    return false;
  }
};
var verify_default = verify;

// node_modules/jose/dist/browser/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  if (!isObject(jws)) {
    throw new JWSInvalid("Flattened JWS must be an object");
  }
  if (jws.protected === void 0 && jws.header === void 0) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  }
  if (jws.protected !== void 0 && typeof jws.protected !== "string") {
    throw new JWSInvalid("JWS Protected Header incorrect type");
  }
  if (jws.payload === void 0) {
    throw new JWSInvalid("JWS Payload missing");
  }
  if (typeof jws.signature !== "string") {
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  }
  if (jws.header !== void 0 && !isObject(jws.header)) {
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  }
  let parsedProt = {};
  if (jws.protected) {
    try {
      const protectedHeader = decode(jws.protected);
      parsedProt = JSON.parse(decoder.decode(protectedHeader));
    } catch {
      throw new JWSInvalid("JWS Protected Header is invalid");
    }
  }
  if (!is_disjoint_default(parsedProt, jws.header)) {
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  }
  const joseHeader = {
    ...parsedProt,
    ...jws.header
  };
  const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  const algorithms = options && validate_algorithms_default("algorithms", options.algorithms);
  if (algorithms && !algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof jws.payload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
  }
  check_key_type_default(alg, key, "verify");
  const data = concat(encoder.encode(jws.protected ?? ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
  let signature;
  try {
    signature = decode(jws.signature);
  } catch {
    throw new JWSInvalid("Failed to base64url decode the signature");
  }
  const verified = await verify_default(alg, key, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    try {
      payload = decode(jws.payload);
    } catch {
      throw new JWSInvalid("Failed to base64url decode the payload");
    }
  } else if (typeof jws.payload === "string") {
    payload = encoder.encode(jws.payload);
  } else {
    payload = jws.payload;
  }
  const result = { payload };
  if (jws.protected !== void 0) {
    result.protectedHeader = parsedProt;
  }
  if (jws.header !== void 0) {
    result.unprotectedHeader = jws.header;
  }
  if (resolvedKey) {
    return { ...result, key };
  }
  return result;
}

// node_modules/jose/dist/browser/jws/compact/verify.js
async function compactVerify(jws, key, options) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws);
  }
  if (typeof jws !== "string") {
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3) {
    throw new JWSInvalid("Invalid Compact JWS");
  }
  const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}

// node_modules/jose/dist/browser/lib/epoch.js
var epoch_default = (date) => Math.floor(date.getTime() / 1e3);

// node_modules/jose/dist/browser/lib/secs.js
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var year = day * 365.25;
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var secs_default = (str) => {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
};

// node_modules/jose/dist/browser/lib/jwt_claims_set.js
var normalizeTyp = (value) => value.toLowerCase().replace(/^application\//, "");
var checkAudiencePresence = (audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
  }
  return false;
};
var jwt_claims_set_default = (protectedHeader, encodedPayload, options = {}) => {
  const { typ } = options;
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', "typ", "check_failed");
  }
  let payload;
  try {
    payload = JSON.parse(decoder.decode(encodedPayload));
  } catch {
  }
  if (!isObject(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== void 0)
    presenceCheck.push("iat");
  if (audience !== void 0)
    presenceCheck.push("aud");
  if (subject !== void 0)
    presenceCheck.push("sub");
  if (issuer !== void 0)
    presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, claim, "missing");
    }
  }
  if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', "iss", "check_failed");
  }
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', "sub", "check_failed");
  }
  if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', "aud", "check_failed");
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs_default(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate } = options;
  const now = epoch_default(currentDate || /* @__PURE__ */ new Date());
  if ((payload.iat !== void 0 || maxTokenAge) && typeof payload.iat !== "number") {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', "iat", "invalid");
  }
  if (payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', "nbf", "invalid");
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', "nbf", "check_failed");
    }
  }
  if (payload.exp !== void 0) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', "exp", "invalid");
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', "exp", "check_failed");
    }
  }
  if (maxTokenAge) {
    const age = now - payload.iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs_default(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', "iat", "check_failed");
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', "iat", "check_failed");
    }
  }
  return payload;
};

// node_modules/jose/dist/browser/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const verified = await compactVerify(jwt, key, options);
  if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = jwt_claims_set_default(verified.protectedHeader, verified.payload, options);
  const result = { payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}

// node_modules/jose/dist/browser/jwks/local.js
function getKtyFromAlg(alg) {
  switch (typeof alg === "string" && alg.slice(0, 2)) {
    case "RS":
    case "PS":
      return "RSA";
    case "ES":
      return "EC";
    case "Ed":
      return "OKP";
    default:
      throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
  }
}
function isJWKSLike(jwks) {
  return jwks && typeof jwks === "object" && Array.isArray(jwks.keys) && jwks.keys.every(isJWKLike);
}
function isJWKLike(key) {
  return isObject(key);
}
function clone(obj) {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}
var LocalJWKSet = class {
  constructor(jwks) {
    this._cached = /* @__PURE__ */ new WeakMap();
    if (!isJWKSLike(jwks)) {
      throw new JWKSInvalid("JSON Web Key Set malformed");
    }
    this._jwks = clone(jwks);
  }
  async getKey(protectedHeader, token) {
    const { alg, kid } = { ...protectedHeader, ...token?.header };
    const kty = getKtyFromAlg(alg);
    const candidates = this._jwks.keys.filter((jwk2) => {
      let candidate = kty === jwk2.kty;
      if (candidate && typeof kid === "string") {
        candidate = kid === jwk2.kid;
      }
      if (candidate && typeof jwk2.alg === "string") {
        candidate = alg === jwk2.alg;
      }
      if (candidate && typeof jwk2.use === "string") {
        candidate = jwk2.use === "sig";
      }
      if (candidate && Array.isArray(jwk2.key_ops)) {
        candidate = jwk2.key_ops.includes("verify");
      }
      if (candidate && alg === "EdDSA") {
        candidate = jwk2.crv === "Ed25519" || jwk2.crv === "Ed448";
      }
      if (candidate) {
        switch (alg) {
          case "ES256":
            candidate = jwk2.crv === "P-256";
            break;
          case "ES256K":
            candidate = jwk2.crv === "secp256k1";
            break;
          case "ES384":
            candidate = jwk2.crv === "P-384";
            break;
          case "ES512":
            candidate = jwk2.crv === "P-521";
            break;
        }
      }
      return candidate;
    });
    const { 0: jwk, length } = candidates;
    if (length === 0) {
      throw new JWKSNoMatchingKey();
    }
    if (length !== 1) {
      const error = new JWKSMultipleMatchingKeys();
      const { _cached } = this;
      error[Symbol.asyncIterator] = async function* () {
        for (const jwk2 of candidates) {
          try {
            yield await importWithAlgCache(_cached, jwk2, alg);
          } catch {
          }
        }
      };
      throw error;
    }
    return importWithAlgCache(this._cached, jwk, alg);
  }
};
async function importWithAlgCache(cache, jwk, alg) {
  const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk);
  if (cached[alg] === void 0) {
    const key = await importJWK({ ...jwk, ext: true }, alg);
    if (key instanceof Uint8Array || key.type !== "public") {
      throw new JWKSInvalid("JSON Web Key Set members must be public keys");
    }
    cached[alg] = key;
  }
  return cached[alg];
}

// node_modules/jose/dist/browser/runtime/fetch_jwks.js
var fetchJwks = async (url, timeout, options) => {
  let controller;
  let id;
  let timedOut = false;
  if (typeof AbortController === "function") {
    controller = new AbortController();
    id = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);
  }
  const response = await fetch(url.href, {
    signal: controller ? controller.signal : void 0,
    redirect: "manual",
    headers: options.headers
  }).catch((err) => {
    if (timedOut)
      throw new JWKSTimeout();
    throw err;
  });
  if (id !== void 0)
    clearTimeout(id);
  if (response.status !== 200) {
    throw new JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
  }
  try {
    return await response.json();
  } catch {
    throw new JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
  }
};
var fetch_jwks_default = fetchJwks;

// node_modules/jose/dist/browser/jwks/remote.js
function isCloudflareWorkers() {
  return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
}
var USER_AGENT;
if (typeof navigator === "undefined" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) {
  const NAME = "jose";
  const VERSION = "v5.2.1";
  USER_AGENT = `${NAME}/${VERSION}`;
}
var RemoteJWKSet = class extends LocalJWKSet {
  constructor(url, options) {
    super({ keys: [] });
    this._jwks = void 0;
    if (!(url instanceof URL)) {
      throw new TypeError("url must be an instance of URL");
    }
    this._url = new URL(url.href);
    this._options = { agent: options?.agent, headers: options?.headers };
    this._timeoutDuration = typeof options?.timeoutDuration === "number" ? options?.timeoutDuration : 5e3;
    this._cooldownDuration = typeof options?.cooldownDuration === "number" ? options?.cooldownDuration : 3e4;
    this._cacheMaxAge = typeof options?.cacheMaxAge === "number" ? options?.cacheMaxAge : 6e5;
  }
  coolingDown() {
    return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cooldownDuration : false;
  }
  fresh() {
    return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cacheMaxAge : false;
  }
  async getKey(protectedHeader, token) {
    if (!this._jwks || !this.fresh()) {
      await this.reload();
    }
    try {
      return await super.getKey(protectedHeader, token);
    } catch (err) {
      if (err instanceof JWKSNoMatchingKey) {
        if (this.coolingDown() === false) {
          await this.reload();
          return super.getKey(protectedHeader, token);
        }
      }
      throw err;
    }
  }
  async reload() {
    if (this._pendingFetch && isCloudflareWorkers()) {
      this._pendingFetch = void 0;
    }
    const headers = new Headers(this._options.headers);
    if (USER_AGENT && !headers.has("User-Agent")) {
      headers.set("User-Agent", USER_AGENT);
      this._options.headers = Object.fromEntries(headers.entries());
    }
    this._pendingFetch || (this._pendingFetch = fetch_jwks_default(this._url, this._timeoutDuration, this._options).then((json) => {
      if (!isJWKSLike(json)) {
        throw new JWKSInvalid("JSON Web Key Set malformed");
      }
      this._jwks = { keys: json.keys };
      this._jwksTimestamp = Date.now();
      this._pendingFetch = void 0;
    }).catch((err) => {
      this._pendingFetch = void 0;
      throw err;
    }));
    await this._pendingFetch;
  }
};
function createRemoteJWKSet(url, options) {
  const set = new RemoteJWKSet(url, options);
  return async (protectedHeader, token) => set.getKey(protectedHeader, token);
}

// node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// node_modules/nanoid/index.browser.js
var nanoid = (size = 21) => {
  let id = "";
  let bytes2 = crypto.getRandomValues(new Uint8Array(size));
  while (size--) {
    id += urlAlphabet[bytes2[size] & 63];
  }
  return id;
};

// node_modules/@planetscale/database/dist/sanitization.js
function format(query, values) {
  return Array.isArray(values) ? replacePosition(query, values) : replaceNamed(query, values);
}
function replacePosition(query, values) {
  let index = 0;
  return query.replace(/\?/g, (match) => {
    return index < values.length ? sanitize(values[index++]) : match;
  });
}
function replaceNamed(query, values) {
  return query.replace(/:(\w+)/g, (match, name) => {
    return hasOwn(values, name) ? sanitize(values[name]) : match;
  });
}
function hasOwn(obj, name) {
  return Object.prototype.hasOwnProperty.call(obj, name);
}
function sanitize(value) {
  if (value == null) {
    return "null";
  }
  if (["number", "bigint"].includes(typeof value)) {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "string") {
    return quote(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitize).join(", ");
  }
  if (value instanceof Date) {
    return quote(value.toISOString().slice(0, -1));
  }
  return quote(value.toString());
}
function quote(text) {
  return `'${escape(text)}'`;
}
var re = /[\0\b\n\r\t\x1a\\"']/g;
function escape(text) {
  return text.replace(re, replacement);
}
function replacement(text) {
  switch (text) {
    case '"':
      return '\\"';
    case "'":
      return "\\'";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\\":
      return "\\\\";
    case "\0":
      return "\\0";
    case "\b":
      return "\\b";
    case "":
      return "\\Z";
    default:
      return "";
  }
}

// node_modules/@planetscale/database/dist/text.js
var decoder2 = new TextDecoder("utf-8");
function decode3(text) {
  return text ? decoder2.decode(Uint8Array.from(bytes(text))) : "";
}
function bytes(text) {
  return text.split("").map((c) => c.charCodeAt(0));
}

// node_modules/@planetscale/database/dist/version.js
var Version = "1.14.0";

// node_modules/@planetscale/database/dist/index.js
var DatabaseError = class extends Error {
  constructor(message2, status, body) {
    super(message2);
    this.status = status;
    this.name = "DatabaseError";
    this.body = body;
  }
};
var Tx = class {
  constructor(conn) {
    this.conn = conn;
  }
  async execute(query, args = null, options = { as: "object" }) {
    return this.conn.execute(query, args, options);
  }
};
function protocol(protocol2) {
  return protocol2 === "http:" ? protocol2 : "https:";
}
function buildURL(url) {
  const scheme = `${protocol(url.protocol)}//`;
  return new URL(url.pathname, `${scheme}${url.host}`).toString();
}
var Connection = class _Connection {
  constructor(config) {
    var _a;
    this.session = null;
    this.config = { ...config };
    if (typeof fetch !== "undefined") {
      (_a = this.config).fetch || (_a.fetch = fetch);
    }
    if (config.url) {
      const url = new URL(config.url);
      this.config.username = url.username;
      this.config.password = url.password;
      this.config.host = url.hostname;
      this.url = buildURL(url);
    } else {
      this.url = new URL(`https://${this.config.host}`).toString();
    }
  }
  async transaction(fn) {
    const conn = new _Connection(this.config);
    const tx = new Tx(conn);
    try {
      await tx.execute("BEGIN");
      const res = await fn(tx);
      await tx.execute("COMMIT");
      return res;
    } catch (err) {
      await tx.execute("ROLLBACK");
      throw err;
    }
  }
  async refresh() {
    await this.createSession();
  }
  async execute(query, args = null, options = { as: "object" }) {
    const url = new URL("/psdb.v1alpha1.Database/Execute", this.url);
    const formatter = this.config.format || format;
    const sql = args ? formatter(query, args) : query;
    const saved = await postJSON(this.config, url, { query: sql, session: this.session });
    const { result, session, error, timing } = saved;
    if (session) {
      this.session = session;
    }
    if (error) {
      throw new DatabaseError(error.message, 400, error);
    }
    const rowsAffected = result?.rowsAffected ? parseInt(result.rowsAffected, 10) : 0;
    const insertId = result?.insertId ?? "0";
    const fields = result?.fields ?? [];
    for (const field of fields) {
      field.type || (field.type = "NULL");
    }
    const castFn = options.cast || this.config.cast || cast;
    const rows = result ? parse2(result, castFn, options.as || "object") : [];
    const headers = fields.map((f) => f.name);
    const typeByName = (acc, { name, type }) => ({ ...acc, [name]: type });
    const types2 = fields.reduce(typeByName, {});
    const timingSeconds = timing ?? 0;
    return {
      headers,
      types: types2,
      fields,
      rows,
      rowsAffected,
      insertId,
      size: rows.length,
      statement: sql,
      time: timingSeconds * 1e3
    };
  }
  async createSession() {
    const url = new URL("/psdb.v1alpha1.Database/CreateSession", this.url);
    const { session } = await postJSON(this.config, url);
    this.session = session;
    return session;
  }
};
async function postJSON(config, url, body = {}) {
  const auth = btoa(`${config.username}:${config.password}`);
  const { fetch: fetch2 } = config;
  const response = await fetch2(url.toString(), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `database-js/${Version}`,
      Authorization: `Basic ${auth}`
    },
    cache: "no-store"
  });
  if (response.ok) {
    return await response.json();
  } else {
    let error = null;
    try {
      const e = (await response.json()).error;
      error = new DatabaseError(e.message, response.status, e);
    } catch {
      error = new DatabaseError(response.statusText, response.status, {
        code: "internal",
        message: response.statusText
      });
    }
    throw error;
  }
}
function connect(config) {
  return new Connection(config);
}
function parseArrayRow(fields, rawRow, cast2) {
  const row = decodeRow(rawRow);
  return fields.map((field, ix) => {
    return cast2(field, row[ix]);
  });
}
function parseObjectRow(fields, rawRow, cast2) {
  const row = decodeRow(rawRow);
  return fields.reduce((acc, field, ix) => {
    acc[field.name] = cast2(field, row[ix]);
    return acc;
  }, {});
}
function parse2(result, cast2, returnAs) {
  const fields = result.fields;
  const rows = result.rows ?? [];
  return rows.map((row) => returnAs === "array" ? parseArrayRow(fields, row, cast2) : parseObjectRow(fields, row, cast2));
}
function decodeRow(row) {
  const values = row.values ? atob(row.values) : "";
  let offset = 0;
  return row.lengths.map((size) => {
    const width = parseInt(size, 10);
    if (width < 0)
      return null;
    const splice = values.substring(offset, offset + width);
    offset += width;
    return splice;
  });
}
function cast(field, value) {
  if (value === "" || value == null) {
    return value;
  }
  switch (field.type) {
    case "INT8":
    case "INT16":
    case "INT24":
    case "INT32":
    case "UINT8":
    case "UINT16":
    case "UINT24":
    case "UINT32":
    case "YEAR":
      return parseInt(value, 10);
    case "FLOAT32":
    case "FLOAT64":
      return parseFloat(value);
    case "DECIMAL":
    case "INT64":
    case "UINT64":
    case "DATE":
    case "TIME":
    case "DATETIME":
    case "TIMESTAMP":
    case "BLOB":
    case "BIT":
    case "VARBINARY":
    case "BINARY":
    case "GEOMETRY":
      return value;
    case "JSON":
      return JSON.parse(decode3(value));
    default:
      return decode3(value);
  }
}

// src/database.js
var connectToPlanetScale = (ctx) => {
  const DBConfig = {
    host: ctx.env.DATABASE_HOST,
    username: ctx.env.DATABASE_USERNAME,
    password: ctx.env.DATABASE_PASSWORD,
    fetch: (url, init) => {
      delete init["cache"];
      return fetch(url, init);
    }
  };
  return connect(DBConfig);
};
var checkIfUserBlocked = async (ctx, id) => {
  let conn = connectToPlanetScale(ctx);
  let result = await conn.execute(
    "select oauth_id from blocked_ids where oauth_id = :id",
    { id }
  );
  console.log(`Blocked`, result);
  return result.rows;
};
var getUserDetails = async (ctx, email) => {
  let conn = connectToPlanetScale(ctx);
  let query = "select * from users where google_id=:email or apple_id=:email limit 1";
  let result = await conn.execute(query, { email });
  return result.rows;
};
var addGoogleUser = async (ctx, user) => {
  let conn = connectToPlanetScale(ctx);
  let result = await conn.execute(
    `
        insert into users 
        (id, slug, name, thumb, honorific, flair, role, level, stars, creds, gil, google_id) 
        values 
        (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.id, user.slug, user.name, user.thumb, user.honorific, user.flair, user.role, user.level, user.stars, user.creds, user.gil, user.google_id]
  );
  console.log("User to be added: ", user);
  console.log("Result of ad user to db: ", result);
  return result;
};
var addNewSession = async (ctx, sessionId, userId, userAgent) => {
  let conn = connectToPlanetScale(ctx);
  let result = await conn.execute(
    `
        insert into sessions 
        (id, user_id, user_agent) 
        values 
        (?, ?, ?)`,
    [sessionId, userId, userAgent]
  );
  return result;
};

// src/handlers/signinGoogleUser.js
var signinGoogleUser = async (ctx) => {
  ctx.res.errRedirect = true;
  let formData = await ctx.req.raw.formData();
  let CSRFTokenInCookie = ctx.req.cookies.g_csrf_token;
  let CSRFTokenInPost = formData.get("g_csrf_token");
  let IDToken = formData.get("credential");
  if (!CSRFTokenInCookie) {
    throw new Error("503", { cause: "No CSRF token present in the google cookie" });
  }
  if (!CSRFTokenInPost) {
    throw new Error("503", { cause: "No CSRF token present in the post body" });
  }
  if (CSRFTokenInCookie != CSRFTokenInPost) {
    throw new Error("503", { cause: "CSRF token mismatch" });
  }
  console.log(`CSRF OK as "${ctx.req.cookies.g_csrf_token}" == "${formData.get("g_csrf_token")}"`);
  const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
  const { payload, protectedHeader } = await jwtVerify(IDToken, JWKS, {
    issuer: "https://accounts.google.com",
    audience: ctx.env.GOOGLE_KEY_FULL
  });
  let resUserBlocked = await checkIfUserBlocked(ctx, payload.email);
  if (resUserBlocked.length != 0) {
    throw new Error("503", { cause: `This user id is blocked. 
        You can no longer create an account on Digglu` });
  }
  console.log(`User has been verified as "${payload.email}"`);
  let user = {};
  let resUserExists = await getUserDetails(ctx, payload.email);
  if (resUserExists.length == 0) {
    console.log(`user doesn't exist`);
    user.id = nanoid(32);
    user.slug = nanoid(32);
    user.name = payload.name;
    user.thumb = `https://robohash.org/${user.slug}?set=set3`;
    user.honorific = "Mx";
    user.flair = "Nony is not a Mouse";
    user.role = "user";
    user.level = "wood";
    user.stars = 0;
    user.creds = 0;
    user.gil = 0;
    user.google_id = payload.email;
    let resAddUser = await addGoogleUser(ctx, user);
    console.log("adding user to db:", resAddUser);
    if (resAddUser.rowsAffected != 1) {
      throw new Error("503", { cause: "Unable to add user to DB" });
    }
    ctx.res.headers.append("Set-Cookie", `D_FRE=true; path=/; SameSite=Strict;`);
  } else {
    console.log(`user exists`);
    user = resUserExists[0];
  }
  delete user.id;
  delete user.google_id;
  user.thumb = encodeURIComponent(user.thumb);
  let sessionId = nanoid(32);
  let userEncoded = encodeURIComponent(JSON.stringify(user));
  let _ = addNewSession(ctx, sessionId, user.id, ctx.req.raw.headers.get("User-Agent") || "");
  console.log("New User Session :", user);
  ctx.res.headers.append("Set-Cookie", `D_SID=${sessionId}; path=/; HttpOnly; Secure; SameSite=Strict;`);
  ctx.res.headers.append("Set-Cookie", `D_NEW_SESSION=${userEncoded}; path=/; SameSite=Strict;`);
  let redirectTo = ctx.req.url.origin + ctx.req.url.searchParams.get("redirectTo") || ctx.req.url.origin + "/";
  console.log(`redirectTo: ${redirectTo}`);
  ctx.res.status = 302;
  ctx.res.headers.append("Location", redirectTo);
};

// src/utils.js
var parseCookies = (str) => {
  return str.split(";").map((v) => v.split("=")).reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});
};

// src/handlers/signout.js
var signout = async (ctx) => {
  ctx.res.headers.append("Set-Cookie", `D_SID=""; HttpOnly; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
  ctx.res.headers.append("Set-Cookie", `D_FRE=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
  ctx.res.headers.append("Set-Cookie", `D_NEW_SESSION=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
  ctx.res.status = 302;
  ctx.res.headers.append("Location", `${ctx.env.HOST}`);
};

// src/server.js
var routes = {
  "GET/api/hello": [setHeaders, sayHello],
  "POST/api/signin/google": [setHeaders, signinGoogleUser],
  "GET/": [setHeaders, buildAboutPage, generateHTML],
  "GET/search": [setHeaders, buildAboutPage, generateHTML],
  "GET/p/new": [setHeaders, buildAboutPage, generateHTML],
  "GET/u/me": [setHeaders, buildAboutPage, generateHTML],
  "GET/error": [setHeaders, buildErrorPage, generateHTML],
  "GET/signout": [setHeaders, signout],
  "GET/:cat": [setHeaders, buildAboutPage, generateHTML],
  "GET/p/:slug": [setHeaders, buildAboutPage, generateHTML],
  "GET/u/:slug": [setHeaders, buildAboutPage, generateHTML],
  "GET/c/:slug": [setHeaders, buildAboutPage, generateHTML]
};
var server_default = {
  async fetch(request, env) {
    let url = new URL(request.url);
    let params = new URLSearchParams(url.search);
    let ctx = {
      req: {
        raw: request,
        url,
        path: url.pathname.toLowerCase(),
        cookies: parseCookies(request.headers.get("cookie")),
        params
      },
      env,
      page: {
        title: "",
        descr: "",
        html: ""
      },
      res: {
        status: 200,
        headers: new Headers(),
        content: "",
        errRedirect: null,
        successRedirect: null
      },
      user: null
    };
    if (request.method == "OPTIONS") {
      ctx.res.status = 200;
      return new Response(ctx.res.content, { status: ctx.res.status, headers: ctx.res.headers });
    }
    if (url.pathname.startsWith("/pub")) {
      return env.ASSETS.fetch(request);
    }
    try {
      let route = request.method + url.pathname;
      if (route in routes) {
        for (const handler of routes[route]) {
          await handler(ctx);
        }
      } else {
        let urlFrag = ctx.req.path.split("/");
        if (urlFrag[1] && Object.keys(PostCategories).includes(urlFrag[1])) {
          urlFrag[1] = ":cat";
        }
        if (urlFrag[2]) {
          urlFrag[2] = ":slug";
        }
        route = request.method + urlFrag.join("/");
        console.log("Dynamic route: ", route);
        if (route in routes) {
          for (const handler of routes[route]) {
            await handler(ctx);
          }
        } else {
          throw new Error("404", { cause: "Not Found" });
        }
      }
    } catch (e) {
      console.error(e);
      if (["400", "401", "404", "503"].includes(e.message)) {
        ctx.res.status = parseInt(e.message);
      } else {
        ctx.res.status = 500;
      }
      if (ctx.res.errRedirect) {
        let params2 = new URLSearchParams({
          "code": ctx.res.status,
          "msg": e.cause
        });
        return Response.redirect(`${url.origin}/error?${params2.toString()}`, 302);
      }
      if (!url.pathname.startsWith("/api")) {
        setHeaders(ctx);
        buildErrorPage(ctx, e);
        generateHTML(ctx);
      }
    }
    return new Response(ctx.res.content, { status: ctx.res.status, headers: ctx.res.headers });
  }
};
export {
  server_default as default
};
