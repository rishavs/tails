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
  if (typeof value === "number") {
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
    return quote(value.toISOString().replace("Z", ""));
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
var decoder = new TextDecoder("utf-8");
function decode(text) {
  return text ? decoder.decode(Uint8Array.from(bytes(text))) : "";
}
function bytes(text) {
  return text.split("").map((c) => c.charCodeAt(0));
}

// node_modules/@planetscale/database/dist/version.js
var Version = "1.8.0";

// node_modules/@planetscale/database/dist/index.js
var DatabaseError = class extends Error {
  constructor(message2, status, body) {
    super(message2);
    this.status = status;
    this.name = "DatabaseError";
    this.body = body;
  }
};
var defaultExecuteOptions = {
  as: "object"
};
var Tx = class {
  constructor(conn) {
    this.conn = conn;
  }
  async execute(query, args = null, options = defaultExecuteOptions) {
    return this.conn.execute(query, args, options);
  }
};
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
  async execute(query, args = null, options = defaultExecuteOptions) {
    const url = new URL("/psdb.v1alpha1.Database/Execute", `https://${this.config.host}`);
    const formatter = this.config.format || format;
    const sql = args ? formatter(query, args) : query;
    const saved = await postJSON(this.config, url, { query: sql, session: this.session });
    const { result, session, error, timing } = saved;
    if (error) {
      throw new DatabaseError(error.message, 400, error);
    }
    const rowsAffected = result?.rowsAffected ? parseInt(result.rowsAffected, 10) : 0;
    const insertId = result?.insertId ?? "0";
    this.session = session;
    const fields = result?.fields ?? [];
    for (const field of fields) {
      field.type || (field.type = "NULL");
    }
    const castFn = options.cast || this.config.cast || cast;
    const rows = result ? parse(result, castFn, options.as || "object") : [];
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
    const url = new URL("/psdb.v1alpha1.Database/CreateSession", `https://${this.config.host}`);
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
function parse(result, cast2, returnAs) {
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
      return JSON.parse(decode(value));
    default:
      return decode(value);
  }
}

// src/database.js
var connectToPlanetScale = (store) => {
  const DBConfig = {
    host: store.env.DATABASE_HOST,
    username: store.env.DATABASE_USERNAME,
    password: store.env.DATABASE_PASSWORD,
    fetch: (url, init) => {
      delete init["cache"];
      return fetch(url, init);
    }
  };
  return connect(DBConfig);
};
var fetchAllPosts = async (store) => {
  let conn = connectToPlanetScale(store);
  let result = await conn.execute("select * from posts limit 10");
  return result.rows;
};
var fetchSpecificPostById = async (store) => {
  let conn = connectToPlanetScale(store);
  console.log("ID IS: ", store.page.id);
  let result = await conn.execute("select * from posts where id=:id", { id: store.page.id });
  console.log("ID IS: ", store.page.id);
  if (result.rows.length == 0) {
    let err = new Error();
    err.message = "404";
    err.cause = "this id doesn't exists in the db";
    throw err;
  }
  return result.rows;
};
var addGoogleUser = async (store, newUser) => {
  let conn = connectToPlanetScale(store);
  let query = `INSERT IGNORE INTO users (slug, name, thumb, honorific, flair, role, level, google_id) 
        VALUES (:slug, :name, :thumb, :honorific, :flair, :role, :level, :google_id)`;
  let result = await conn.execute(query, { slug: newUser.slug, name: newUser.name, thumb: newUser.thumb, honorific: newUser.honorific, flair: newUser.flair, role: newUser.role, level: newUser.level, google_id: newUser.googleID });
  return result;
};

// src/handlers/sayHello.js
var sayHello = async (store) => {
  store.resp.status = 200;
  store.resp.content = JSON.stringify({ message: "Hello from the API" });
};

// node_modules/jose/dist/browser/runtime/webcrypto.js
var webcrypto_default = crypto;
var isCryptoKey = (key) => key instanceof CryptoKey;

// node_modules/jose/dist/browser/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder2 = new TextDecoder();
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  buffers.forEach((buffer) => {
    buf.set(buffer, i);
    i += buffer.length;
  });
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
var decode2 = (input) => {
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder2.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch (_a) {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
};

// node_modules/jose/dist/browser/util/errors.js
var JOSEError = class extends Error {
  static get code() {
    return "ERR_JOSE_GENERIC";
  }
  constructor(message2) {
    var _a;
    super(message2);
    this.code = "ERR_JOSE_GENERIC";
    this.name = this.constructor.name;
    (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);
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
    if (actual.constructor && actual.constructor.name) {
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
  for (const header of sources) {
    const parameters = Object.keys(header);
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
    case "oct": {
      switch (jwk.alg) {
        case "HS256":
        case "HS384":
        case "HS512":
          algorithm = { name: "HMAC", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = ["sign", "verify"];
          break;
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
          throw new JOSENotSupported(`${jwk.alg} keys cannot be imported as CryptoKey instances`);
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
        case "A128GCMKW":
        case "A192GCMKW":
        case "A256GCMKW":
          algorithm = { name: "AES-GCM" };
          keyUsages = ["encrypt", "decrypt"];
          break;
        case "A128KW":
        case "A192KW":
        case "A256KW":
          algorithm = { name: "AES-KW" };
          keyUsages = ["wrapKey", "unwrapKey"];
          break;
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
          algorithm = { name: "PBKDF2" };
          keyUsages = ["deriveBits"];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
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
var parse2 = async (jwk) => {
  var _a, _b;
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const rest = [
    algorithm,
    (_a = jwk.ext) !== null && _a !== void 0 ? _a : false,
    (_b = jwk.key_ops) !== null && _b !== void 0 ? _b : keyUsages
  ];
  if (algorithm.name === "PBKDF2") {
    return webcrypto_default.subtle.importKey("raw", decode2(jwk.k), ...rest);
  }
  const keyData = { ...jwk };
  delete keyData.alg;
  delete keyData.use;
  return webcrypto_default.subtle.importKey("jwk", keyData, ...rest);
};
var jwk_to_key_default = parse2;

// node_modules/jose/dist/browser/key/import.js
async function importJWK(jwk, alg, octAsKeyObject) {
  var _a;
  if (!isObject(jwk)) {
    throw new TypeError("JWK must be an object");
  }
  alg || (alg = jwk.alg);
  switch (jwk.kty) {
    case "oct":
      if (typeof jwk.k !== "string" || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value');
      }
      octAsKeyObject !== null && octAsKeyObject !== void 0 ? octAsKeyObject : octAsKeyObject = jwk.ext !== true;
      if (octAsKeyObject) {
        return jwk_to_key_default({ ...jwk, alg, ext: (_a = jwk.ext) !== null && _a !== void 0 ? _a : false });
      }
      return decode2(jwk.k);
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
    } else if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
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
  } catch (_a) {
    return false;
  }
};
var verify_default = verify;

// node_modules/jose/dist/browser/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  var _a;
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
      const protectedHeader = decode2(jws.protected);
      parsedProt = JSON.parse(decoder2.decode(protectedHeader));
    } catch (_b) {
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
  const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options === null || options === void 0 ? void 0 : options.crit, parsedProt, joseHeader);
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
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter not allowed');
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
  const data = concat(encoder.encode((_a = jws.protected) !== null && _a !== void 0 ? _a : ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
  const signature = decode2(jws.signature);
  const verified = await verify_default(alg, key, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    payload = decode2(jws.payload);
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
    jws = decoder2.decode(jws);
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
var REGEX = /^(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/i;
var secs_default = (str) => {
  const matched = REGEX.exec(str);
  if (!matched) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[1]);
  const unit = matched[2].toLowerCase();
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      return Math.round(value);
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      return Math.round(value * minute);
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      return Math.round(value * hour);
    case "day":
    case "days":
    case "d":
      return Math.round(value * day);
    case "week":
    case "weeks":
    case "w":
      return Math.round(value * week);
    default:
      return Math.round(value * year);
  }
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
    payload = JSON.parse(decoder2.decode(encodedPayload));
  } catch (_a) {
  }
  if (!isObject(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  if (maxTokenAge !== void 0)
    requiredClaims.push("iat");
  if (audience !== void 0)
    requiredClaims.push("aud");
  if (subject !== void 0)
    requiredClaims.push("sub");
  if (issuer !== void 0)
    requiredClaims.push("iss");
  for (const claim of new Set(requiredClaims.reverse())) {
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
  var _a;
  const verified = await compactVerify(jwt, key, options);
  if (((_a = verified.protectedHeader.crit) === null || _a === void 0 ? void 0 : _a.includes("b64")) && verified.protectedHeader.b64 === false) {
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
    const { alg, kid } = { ...protectedHeader, ...token === null || token === void 0 ? void 0 : token.header };
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
    } else if (length !== 1) {
      const error = new JWKSMultipleMatchingKeys();
      const { _cached } = this;
      error[Symbol.asyncIterator] = async function* () {
        for (const jwk2 of candidates) {
          try {
            yield await importWithAlgCache(_cached, jwk2, alg);
          } catch (_a) {
            continue;
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
  } catch (_a) {
    throw new JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
  }
};
var fetch_jwks_default = fetchJwks;

// node_modules/jose/dist/browser/jwks/remote.js
function isCloudflareWorkers() {
  return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
}
var RemoteJWKSet = class extends LocalJWKSet {
  constructor(url, options) {
    super({ keys: [] });
    this._jwks = void 0;
    if (!(url instanceof URL)) {
      throw new TypeError("url must be an instance of URL");
    }
    this._url = new URL(url.href);
    this._options = { agent: options === null || options === void 0 ? void 0 : options.agent, headers: options === null || options === void 0 ? void 0 : options.headers };
    this._timeoutDuration = typeof (options === null || options === void 0 ? void 0 : options.timeoutDuration) === "number" ? options === null || options === void 0 ? void 0 : options.timeoutDuration : 5e3;
    this._cooldownDuration = typeof (options === null || options === void 0 ? void 0 : options.cooldownDuration) === "number" ? options === null || options === void 0 ? void 0 : options.cooldownDuration : 3e4;
    this._cacheMaxAge = typeof (options === null || options === void 0 ? void 0 : options.cacheMaxAge) === "number" ? options === null || options === void 0 ? void 0 : options.cacheMaxAge : 6e5;
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
  return async function(protectedHeader, token) {
    return set.getKey(protectedHeader, token);
  };
}

// src/utils.js
var parseCookie = (str) => {
  return str.split(";").map((v) => v.split("=")).reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});
};

// src/handlers/signinGoogleUser.js
var signinGoogleUser = async (store) => {
  let data = await store.request.formData();
  let CSRFTokenInCookie = parseCookie(store.request.headers.get("cookie")).g_csrf_token;
  let CSRFTokenInPost = data.get("g_csrf_token");
  let IDToken = data.get("credential");
  data.forEach((value, key) => {
    console.log(`${key} ==> ${value}`);
  });
  let cookies = parseCookie(store.request.headers.get("cookie"));
  if (!CSRFTokenInCookie) {
    throw new Error(503, { cause: "No CSRF token present in the google cookie" });
  }
  if (!CSRFTokenInPost) {
    throw new Error(503, { cause: "No CSRF token present in the post body" });
  }
  if (CSRFTokenInCookie != CSRFTokenInPost) {
    throw new Error(503, { cause: "CSRF token mismatch" });
  }
  console.log(`CSRF OK as "${cookies.g_csrf_token}" == "${data.get("g_csrf_token")}"`);
  const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
  const { payload, protectedHeader } = await jwtVerify(IDToken, JWKS, {
    issuer: "https://accounts.google.com",
    audience: store.env.GOOGLE_KEY
  });
  if (!payload.nonce) {
    throw new Error(503, { cause: "No nonce present in the ID token" });
  }
  let newUser = {
    slug: crypto.randomUUID(),
    name: "Nony Mouse",
    thumb: "something",
    honorific: "none",
    flair: "none",
    role: "user",
    level: "wood",
    googleID: payload.email
  };
  let res = await addGoogleUser(store, newUser);
  console.log(`addGoogleUser: ${res[0]}`);
  const sessionID = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/gi, "").substring(0, Math.random() * (63 - 57) + 57);
  await store.env.SESSIONS.put(sessionID, newUser.slug);
  const bagID = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/gi, "").substring(0, Math.random() * (63 - 57) + 57);
  await store.env.BAG.put(bagID, sessionID);
  const redirectTo = new URL(store.request.url).searchParams.get("redirectTo");
  store.resp.status = 302;
  store.resp.headers.append("Set-Cookie", `DIGGLUSID=${sessionID}; path=/; HttpOnly; Secure; SameSite=Strict;`);
  store.resp.headers.append("Location", `${store.env.HOST}${redirectTo}?triggerFragment=userDetailsModal&referEMail=${newUser.googleID}&setUserName=${newUser.name}&setUserThumb=${newUser.thumb}&setUserHonorific=${newUser.honorific}&setUserFlair=${newUser.flair}&setUserRole=${newUser.role}&setUserLevel=${newUser.level}`);
};

// src/handlers/buildAboutPage.js
var buildAboutPage = async (store) => {
  store.page.title = "META: About Page";
  store.page.descr = "META: This is the about page";
  store.page.content = /*html*/
  `
        <article class="min-h-screen">
            <h1>ABOUT Page</h1>
        </article>
        `;
};

// src/views/header.js
var Header = async () => (
  /*html*/
  `
    <nav class="navbar bg-primary px-16">
        <div class="navbar-start">
            <button class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <a class="btn btn-ghost normal-case text-xl" href="/">Digglu</a>
            <a class="text-xl" href="/post/13">Post 13</a>
        </div>
        <div class="navbar-center">
            <div class="form-control max-w-full">
                <input type="text" placeholder="Search" class="input input-bordered" />
            </div>
        </div>
        <div class="navbar-end">
            <a class="btn modal-button bg-primary mx-1" href="https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=326093643211-dh58srqtltvqfakqta4us0il2vgnkenr.apps.googleusercontent.com&scope=openid%20email&redirect_uri=http://localhost:3000/oauth/google/callback&state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2-login-demo.example.com%2FmyHome&nonce=0394852-3190485-2490358">Google Sign in</a>
            <label for="loginModal" class="btn modal-button bg-secondary mx-1">Login</label>
            <div class="dropdown dropdown-end mx-1">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img src="/pub/bm.png" />
                    </div>
                </label>
                <ul tabindex="0" class="z-10 mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                    <li>
                        <a class="justify-between">
                            Profile
                            <span class="badge">New</span>
                        </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>


`
);

// src/views/filtersBar.js
var FiltersBar = async () => (
  /*html*/
  `
    <nav class="navbar bg-secondary px-16">
        <div class="navbar-start">
            <div class="tabs tabs-boxed bg-secondary">
                <a class="tab tab-active">All</a>
                <a class="tab">Technology</a>
                <a class="tab">Funny</a>
                <a class="tab">Worldnews</a>
                <a class="tab">Sports</a>
                <a class="tab">Science</a>
            </div>
        </div>
        <div class="navbar-end">
            <div class="dropdown dropdown-end mx-2">
                <label tabindex="0" class="btn btn-outline"> Most Recent </label>
                <ul tabindex="0" class="z-10 mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                    <li><a>Last 24 hours</a></li>
                    <li><a>Last week</a></li>
                    <li><a>Last Year</a></li>
                </ul>
            </div>
        </div>
    </nav>
`
);

// src/views/loginModal.js
var loginModal = async (store) => {
  return (
    /*html*/
    `
        <input type="checkbox" id="loginModal" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle">
            <div class="modal-box relative">
                <label for="loginModal" class="btn btn-sm btn-circle absolute right-2 top-2">\u2715</label>
                <h3 class="font-bold text-lg">Congratulations random Internet user!</h3>
                <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>

                <script src="https://accounts.google.com/gsi/client" async defer><\/script>
                <div id="g_id_onload"
                    data-client_id="326093643211-dh58srqtltvqfakqta4us0il2vgnkenr"
                    data-context="signin"
                    data-ux_mode="redirect"
                    data-login_uri="/api/signinGoogleUser?redirectTo=${encodeURIComponent(store.page.path)}"
                    data-nonce="${store.page.nonce}"
                    data-auto_select="true"
                    data-itp_support="true">
                </div>
                
                <div class="g_id_signin"
                    data-type="standard"
                    data-shape="rectangular"
                    data-theme="outline"
                    data-text="signin_with"
                    data-size="large"
                    data-logo_alignment="left">
                </div>
                
            </div>

        </div>
    `
  );
};

// src/views/userDetailsModal.js
var userDetailsModal = async (store) => {
  return (
    /*html*/
    `
        <!-- Open the modal using ID.showModal() method -->
        <dialog id="userDetailsModal" class="modal">
            <form method="dialog" class="modal-box">
                <h3 class="font-bold text-lg">Hello!</h3>
                <p class="py-4">Press ESC key or click the button below to close</p>
                <div class="modal-action">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">Close</button>
                </div>
            </form>
        </dialog>
        <script>
            if (window.location.search) {
                const params = new URL(document.location).searchParams;
                const trigger = params.get("triggerFragment");
                if (trigger == "userDetailsModal") {
                    const modal = document.getElementById('userDetailsModal');
                    modal.showModal();
                    console.log(document.cookie)
                }
            }

        <\/script>

`
  );
};

// src/views/footer.js
var Footer = async () => (
  /*html*/
  `
    <footer class="footer footer-center p-10 bg-primary text-primary-content">
        <div>
            <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
                class="inline-block fill-current"
            >
                <path
                    d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
                ></path>
            </svg>
            <p class="font-bold">ACME Industries Ltd. <br />Providing reliable tech since 1992</p>
            <p>Copyright \xA9 2022 - All right reserved</p>
        </div>
        <div>
            <div class="grid grid-flow-col gap-4">
                <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
                        <path
                            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                        ></path></svg>
                </a>
                <a
                    ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
                        <path
                            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
                        ></path></svg>
                </a>
                <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
                        <path
                            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                        ></path></svg>
                </a>
            </div>
        </div>
    </footer>
`
);

// src/handlers/generateHTML.js
var generateHTML = async (store) => {
  store.resp.status = 200;
  store.resp.content = /*html*/
  `
    <html lang="en" data-theme="emerald">
        <head>
            <meta charset="UTF-8">
            <title>${store.page.title}</title>
            <link rel="icon" type="image/x-icon" href="/pub/favicon.ico">

            <meta name="description" content="${store.page.descr}">
            <head prefix="og: http://ogp.me/ns#">
            <meta property="og:type" content="article">
            <!-- More elements slow down JSX, but not template literals. -->
            <meta property="og:title" content="${store.page.title}">

            <script src="https://cdn.tailwindcss.com"><\/script>
            <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css" rel="stylesheet" type="text/css" />
            <script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"><\/script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css">

            <script src="https://apis.google.com/js/platform.js" async defer><\/script>
        </head>
        <body class="">
            ${await Header()}
            ${await FiltersBar()}
            <div class="px-16 mt-16">
                ${store.page.content}
            </div>
            ${await loginModal(store)}
            ${await userDetailsModal(store)}
            ${await Footer()}
        </body>
    </html>
    `;
};

// src/handlers/buildHomePage.js
var buildHomePage = async (store) => {
  store.page.title = "Home Page";
  store.page.descr = "This is the Home page";
  const data = await fetchAllPosts(store);
  let postsList = "";
  for (var item of data) {
    postsList += `<li><a class="link" href="/p/${item.id}">${item.title}</a></li>
`;
  }
  store.page.content = /*html*/
  `
        <article class="min-h-screen">
            <h1> HOME PAGE</h1>
            <ol> ${postsList} </ol>
        </article>
    `;
};

// src/handlers/buildPostDetailsPage.js
var buildPostDetailsPage = async (store) => {
  store.page.title = `Post Page`;
  store.page.descr = `This is the Post - ${store.page.id}`;
  const data = await fetchSpecificPostById(store);
  console.log(data);
  store.page.content = /*html*/
  `
        <article class="min-h-screen">
            <h1>Page Id: ${store.page.id}</h1>
            <h2>${data[0].id}</h2>
            <h2>${data[0].title}</h2>
            <p>${data[0].description}</p>
        </article>
    
    `;
};

// src/handlers/generateAuthPage.js
var generateAuthPage = async (store) => {
  store.resp.status = 302;
  store.resp.content = "AUTHENTICATING...";
  const bagID = new URL(store.request.url).searchParams.get("loginID");
  const sessionID = await store.env.BAG.get(bagID);
  console.log("BAg ID: ", bagID);
  console.log(`Session ID from BAG: ${sessionID}`);
  const dest = new URL(store.request.url).searchParams.get("redirectTo");
  console.log(`Redirecting to: ${dest}`);
  const cookie = `sessionID=${sessionID}; path=/; HttpOnly; Secure; SameSite=Strict;`;
  store.resp.headers.set("Set-Cookie", cookie);
  store.resp.headers.set("Location", dest);
  await new Promise((r) => setTimeout(r, 2e3));
};

// src/handlers/buildErrorPage.js
var buildErrorPage = async (store, e) => {
  store.page.title = "ERROR Page";
  store.page.descr = "This is the error page";
  store.page.content = /*html*/
  `
        <article class="min-h-screen">
            <h1>${e.message} ERROR!</h1>
            <h2>${e.cause}</h2>
            <p>${e.stack}</p>
        </article>
        `;
};

// src/server.js
var routes = {
  // API Routes
  "GET/api/hello": [() => console.log("YOYO"), sayHello],
  "GET/api/raiseError": [() => {
    throw new Error(418, { cause: "This is TEAPOT!" });
  }],
  "POST/api/signinGoogleUser": [signinGoogleUser],
  //createSession, 
  // Static Routes
  "GET/": [buildHomePage, generateHTML],
  "GET/about": [buildAboutPage, generateHTML],
  "GET/authenticate": [generateAuthPage],
  // Dynamic Routes
  "GET/p/:id": [buildPostDetailsPage, generateHTML]
};
var server_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/pub")) {
      return env.ASSETS.fetch(request);
    }
    let handlers;
    let store = {
      conn: null,
      user: {
        slug: null,
        name: null,
        thumb: null,
        honorific: null,
        flair: null,
        role: null,
        level: null,
        sessionID: null,
        googleID: null,
        appleID: null
      },
      request,
      env,
      page: {
        path: url.pathname,
        // redirectTo  : url.searchParams.get("redirectTo"),
        redirectTo: null,
        nonce: null,
        kind: null,
        id: null,
        title: null,
        descr: null,
        content: null
      },
      resp: {
        content: "",
        status: 200,
        headers: new Headers()
      }
    };
    if (url.pathname.startsWith("/api")) {
      store.resp.headers.append("content-type", "application/json;charset=UTF-8");
      store.resp.headers.append("Powered-by", "API: Pika Pika Pika Choooo");
      handlers = routes[`${request.method}${url.pathname}`];
    } else {
      store.resp.headers.append("Powered-by", "VIEW: Pika Pika Pika Choooo");
      store.resp.headers.append("Content-Type", "text/html; charset=UTF-8");
      let urlFrag = url.pathname.split("/").filter((a) => a);
      store.page.kind = urlFrag[0];
      store.page.id = urlFrag[1];
      if (urlFrag[1]) {
        urlFrag[1] = ":id";
      }
      let cleanedURL = `${request.method}/${urlFrag.join("/")}`;
      if (cleanedURL in routes) {
        handlers = routes[cleanedURL];
      } else {
        handlers = [() => {
          throw new Error(404, { cause: "Not all who wander are lost" });
        }];
      }
    }
    try {
      for (const handler of handlers) {
        await handler(store);
      }
      if (store.page.redirectTo) {
        let destination = `${url.protocol}//${url.host}${store.page.redirectTo}`;
        console.log("REDIRECTING TO: ", destination);
        store.page.redirectTo = null;
        return Response.redirect(destination, 302);
      }
    } catch (e) {
      console.log(e);
      store.resp.content = "ERROR: \n" + e;
      if (e.message in [401, 404, 500]) {
        store.resp.status = e.message;
      } else {
        store.resp.status = 500;
      }
      if (!url.pathname.startsWith("/api")) {
        await buildErrorPage(store, e);
        await generateHTML(store);
      }
    }
    return new Response(store.resp.content, { status: store.resp.status, headers: store.resp.headers });
  }
};
export {
  server_default as default
};
