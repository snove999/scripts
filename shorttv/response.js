/* ShortTV authorized security test for Quantumult X */
const CDN = "https://cdn.shorttv.online";
const media = id => CDN + "/uploads/direct/" + id + "/video.mp4";

function walk(x) {
  if (!x || typeof x !== "object") return;
  if (!Array.isArray(x) && typeof x.id === "string") {
    const episode = Object.prototype.hasOwnProperty.call(x,"isFree") ||
      Object.prototype.hasOwnProperty.call(x,"locked") ||
      Object.prototype.hasOwnProperty.call(x,"hlsUrl");
    if (episode) {
      if ("isFree" in x) x.isFree = true;
      if ("locked" in x) x.locked = false;
      if ("hlsUrl" in x && !x.hlsUrl) x.hlsUrl = media(x.id);
    }
  }
  Object.keys(x).forEach(k => walk(x[k]));
}

function flight(body) {
  const m = body.match(/\\"episode\\":\{\\"id\\":\\"([^"\\]+)\\"/);
  body = body.replace(/\\"isFree\\":false/g,'\\"isFree\\":true')
    .replace(/\\"locked\\":true/g,'\\"locked\\":false');
  if (m) body = body.replace(/\\"hlsUrl\\":null/,
    '\\"hlsUrl\\":\\"' + media(m[1]) + '\\"');
  return body;
}

function rewrite(body) {
  if (!body) return body;
  try { const x=JSON.parse(body); walk(x); return JSON.stringify(x); }
  catch (_) { return flight(body); }
}

if (typeof $done !== "undefined") $done({body:rewrite($response.body)});
if (typeof module !== "undefined") module.exports={rewrite};
