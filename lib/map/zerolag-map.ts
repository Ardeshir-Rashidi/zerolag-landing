// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
/* ZeroLag globe engine (canvas + WebGL), restyled for the site.
   window.ZLBOOT() creates window.ZeroLagMap once window.ZL_GEO (public/geo.js) is loaded. */
if (!window.ZLBOOT) window.ZLBOOT = function () {
(function() {
  "use strict";
  const D2R = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* ---------- 1. countries ---------- */
  const GEO = window.ZL_GEO.d.map(g => g.map(r => {
    const o = new Array(r.length);
    let x = 0,
      y = 0;
    for (let i = 0; i < r.length; i += 2) {
      x += r[i];
      y += r[i + 1];
      o[i] = x / 100;
      o[i + 1] = y / 100
    }
    return o
  }));
  const GEOCC = window.ZL_GEO.cc;
  const countryIndex = cc => cc ? GEOCC.indexOf(cc) : -1;
  /* frame of a country: its core landmasses (≥25% of the largest piece) plus nearby pieces (Sicily, Northern Ireland, Kyushu);
     far pieces such as Alaska, Hawaii or Easter Island stay out, so the camera and the flag sit on the country itself */
  const FRAME = new Map();

  function countryFrame(gi) {
    if (FRAME.has(gi)) return FRAME.get(gi);
    const info = r => {
      let a = 0,
        k = 0,
        x0 = 1e9,
        x1 = -1e9,
        y0 = 1e9,
        y1 = -1e9;
      for (let i = 0; i < r.length; i += 2) {
        k += r[i + 1];
        x0 = Math.min(x0, r[i]);
        x1 = Math.max(x1, r[i]);
        y0 = Math.min(y0, r[i + 1]);
        y1 = Math.max(y1, r[i + 1])
      }
      for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) a += r[j] * r[i + 1] - r[i] * r[j + 1];
      return {
        a: Math.abs(a) / 2 * Math.cos(k / (r.length / 2) * D2R),
        b: [x0, x1, y0, y1]
      }
    };
    const rs = GEO[gi].map(info),
      big = Math.max(...rs.map(x => x.a));
    const U = (A, b) => [Math.min(A[0], b[0]), Math.max(A[1], b[1]), Math.min(A[2], b[2]), Math.max(A[3], b[3])];
    const core = rs.filter(x => x.a >= big * .25),
      CB = core.reduce((A, x) => U(A, x.b), [1e9, -1e9, 1e9, -1e9]);
    const ex = (CB[1] - CB[0]) * .2,
      ey = (CB[3] - CB[2]) * .2;
    let B = CB;
    rs.forEach(x => {
      if (x.a < big * .02 || core.includes(x)) return;
      const cx = (x.b[0] + x.b[1]) / 2,
        cy = (x.b[2] + x.b[3]) / 2;
      if (cx >= CB[0] - ex && cx <= CB[1] + ex && cy >= CB[2] - ey && cy <= CB[3] + ey) B = U(B, x.b)
    });
    FRAME.set(gi, B);
    return B
  }
  /* ---------- 2. sphere math ---------- */
  const vec = (lon, lat) => {
    const l = lon * D2R,
      p = lat * D2R;
    return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)]
  };
  const unvec = v => [Math.atan2(v[1], v[0]) / D2R, Math.asin(clamp(v[2], -1, 1)) / D2R];
  const angle = (a, b) => {
    const u = vec(a.lon, a.lat),
      w = vec(b.lon, b.lat);
    return Math.acos(clamp(u[0] * w[0] + u[1] * w[1] + u[2] * w[2], -1, 1))
  };
  const gcKm = (a, b) => angle(a, b) * 6371;
  /* great-circle points from a to b, lifted off the surface towards the middle */
  const ARCS = new Map();
  function arcPoints(a, b, lift) {
    const key = [a.lon, a.lat, b.lon, b.lat, lift].join('|');
    if (ARCS.has(key)) return ARCS.get(key);
    const u = vec(a.lon, a.lat),
      w = vec(b.lon, b.lat);
    const ang = Math.acos(clamp(u[0] * w[0] + u[1] * w[1] + u[2] * w[2], -1, 1));
    const n = Math.max(12, Math.ceil(ang / D2R * 1.6)),
      out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n,
        s1 = Math.sin((1 - t) * ang) / Math.sin(ang),
        s2 = Math.sin(t * ang) / Math.sin(ang);
      const [lo, la] = unvec([u[0] * s1 + w[0] * s2, u[1] * s1 + w[1] * s2, u[2] * s1 + w[2] * s2]);
      out.push([lo, la, 1 + lift * Math.sin(Math.PI * t) * Math.min(.22, ang * .32)])
    }
    if (ARCS.size >= 256) ARCS.delete(ARCS.keys().next().value);
    ARCS.set(key, out);
    return out
  }
  /* orthographic projection → [x, y, z]; z > 0 means the point faces the viewer */
  function project(v, lon, lat, alt = 1) {
    const l = (lon - v.lon) * D2R,
      p = lat * D2R,
      p0 = v.lat * D2R;
    const cl = Math.cos(l),
      cp = Math.cos(p),
      sp = Math.sin(p);
    const z = Math.sin(p0) * sp + Math.cos(p0) * cp * cl,
      x = cp * Math.sin(l),
      y = Math.cos(p0) * sp - Math.sin(p0) * cp * cl;
    return [v.cx + x * v.R * alt, v.cy - y * v.R * alt, z]
  }
  /* ---------- 3. route model (same estimate as the app) ---------- */
  const hopMs = (a, b, f) => 1.2 + gcKm(a, b) / 200 * f;
  const msr = x => Math.max(1, Math.round(x));

  function routesFor(home, city, relays) {
    const d = hopMs(home, city, 1.42),
      list = [];
    relays.forEach(r => {
      if (gcKm(r, city) < 150) return;
      const h1 = hopMs(home, r, 1.25),
        h2 = hopMs(r, city, 1);
      if (h1 + h2 < d * 1.6) list.push({
        via: r,
        h1,
        h2,
        total: h1 + h2
      })
    });
    list.push({
      via: null,
      h1: d,
      h2: 0,
      total: d
    });
    list.sort((a, b) => a.total - b.total);
    if (list.length > 4) {
      const bb = list.find(x => !x.via);
      list.splice(4);
      if (!list.includes(bb)) list[3] = bb
    }
    return list
  }
  /* ---------- 4. textures (equirectangular, drawn once and cached) ---------- */
  function canvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d");
    x.fillStyle = "#000";
    x.fillRect(0, 0, w, h);
    return [c, x]
  }

  function eqFill(ctx, w, h, color, groups) {
    ctx.fillStyle = color;
    for (const g of groups)
      for (const r of g) {
        let mx = -999,
          mn = 999;
        for (let i = 0; i < r.length; i += 2) {
          mx = Math.max(mx, r[i]);
          mn = Math.min(mn, r[i])
        }
        for (const off of mx > 180 ? [0, -360] : mn < -180 ? [0, 360] : [0]) {
          ctx.beginPath();
          for (let i = 0; i < r.length; i += 2) {
            const px = (r[i] + off + 180) / 360 * w,
              py = (90 - r[i + 1]) / 180 * h;
            i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
          }
          ctx.closePath();
          ctx.fill()
        }
      }
  }
  /* land: g = sharp mask, b = soft core (for relief strength), r = very soft halo */
  let LAND = null;

  function landTexture() {
    if (LAND) return LAND;
    const W = 2048,
      H = 1024;
    const [c, x] = canvas(W, H);
    const [s, sx] = canvas(128, 64);
    eqFill(sx, 128, 64, "#f00", GEO);
    x.imageSmoothingEnabled = true;
    x.drawImage(s, 0, 0, W, H);
    x.globalCompositeOperation = "lighter";
    const [m, mx] = canvas(512, 256);
    eqFill(mx, 512, 256, "#00f", GEO);
    x.drawImage(m, 0, 0, W, H);
    eqFill(x, W, H, "#0f0", GEO);
    x.globalCompositeOperation = "source-over";
    return LAND = c
  }
  const GLOWTX = new Map();

  function glowTexture(gi) {
    if (GLOWTX.has(gi)) return GLOWTX.get(gi);
    const W = 1024,
      H = 512;
    const [c, x] = canvas(W, H);
    if (gi >= 0) {
      const G = [GEO[gi]];
      const [s, sx] = canvas(128, 64);
      eqFill(sx, 128, 64, "#f00", G);
      x.drawImage(s, 0, 0, W, H);
      x.globalCompositeOperation = "lighter";
      const [m, mx] = canvas(512, 256);
      eqFill(mx, 512, 256, "#0f0", G);
      x.drawImage(m, 0, 0, W, H);
      x.globalCompositeOperation = "source-over"
    }
    GLOWTX.set(gi, c);
    return c
  }
  const HOMETX = new Map();

  function homeTexture(gi) {
    if (HOMETX.has(gi)) return HOMETX.get(gi);
    const W = 2048,
      H = 1024;
    const [c, x] = canvas(W, H);
    if (gi >= 0) {
      const G = [GEO[gi]];
      const [s, sx] = canvas(256, 128);
      eqFill(sx, 256, 128, "#0f0", G);
      x.drawImage(s, 0, 0, W, H);
      x.globalCompositeOperation = "lighter";
      eqFill(x, W, H, "#f00", G);
      x.globalCompositeOperation = "source-over"
    }
    HOMETX.set(gi, c);
    return c
  }
  /* flag artwork images; when one finishes loading every mounted map repaints its flag */
  const FIMG = {},
    MAPS = new Set();

  function fimg(cc) {
    if (FIMG[cc] !== undefined) return FIMG[cc];
    const src = window.ZL_FLAGS[cc];
    if (!src) return FIMG[cc] = null;
    const im = new Image();
    im.onload = () => {
      for (const k of FLAGTX.keys())
        if (k.endsWith("|" + cc)) FLAGTX.delete(k);
      MAPS.forEach(m => m._flagDirty())
    };
    im.src = src;
    return FIMG[cc] = im
  }

  function paintFlag(x, cc, X, Y, W, H) {
    const K = h => "#" + h;
    const R = (c, a, b, w, h) => {
      x.fillStyle = K(c);
      x.fillRect(X + a * W, Y + b * H, w * W, h * H)
    };
    const hz = cs => cs.forEach((c, i) => R(c, 0, i / cs.length, 1, 1 / cs.length + .002)),
      vt = cs => cs.forEach((c, i) => R(c, i / cs.length, 0, 1 / cs.length + .002, 1));
    const nordic = (bg, cr) => {
      R(bg, 0, 0, 1, 1);
      R(cr, .31, 0, .14, 1);
      R(cr, 0, .42, 1, .16)
    };
    const img = fimg(cc),
      ok = img && img.complete && img.naturalWidth;
    /* square overlay, full country height: at "c"entre, "l"eft or a vertical centre "s"lice of the source */
    const ov = (where, sx0, sx1, sy0, sy1) => {
      if (!ok) return;
      const iw = img.naturalWidth,
        ih = img.naturalHeight;
      if (where === "b") {
        const sw = iw * (sx1 - sx0),
          sh = ih * (sy1 - sy0),
          dh = H * (sy1 - sy0),
          dw = dh * sw / sh;
        x.drawImage(img, iw * sx0, ih * sy0, sw, sh, X + W / 2 - dw / 2, Y + H * sy0, dw, dh);
        return
      }
      if (where === "s") {
        const sw = iw * (sx1 - sx0),
          dw = H * (sx1 - sx0);
        x.drawImage(img, iw * sx0, 0, sw, ih, X + W / 2 - dw / 2, Y, dw, H);
        return
      }
      const sz = Math.min(H, W);
      x.drawImage(img, 0, 0, iw, ih, where === "l" ? X : X + W / 2 - sz / 2, Y + H / 2 - sz / 2, sz, sz)
    };
    const RD = "E7000B",
      B1 = "1447E6",
      B2 = "155DFC",
      GN = "00A63E",
      YL = "FDC700",
      DK = "262626",
      WH = "FFFFFF";
    const T = {
      DE: () => hz([DK, RD, YL]),
      NL: () => hz([RD, WH, B2]),
      FR: () => vt([B1, WH, RD]),
      AE: () => {
        hz([GN, WH, "171717"]);
        R(RD, 0, 0, .25, 1)
      },
      SE: () => nordic(B2, YL),
      FI: () => nordic(WH, B2),
      DK: () => nordic(RD, WH),
      NO: () => {
        nordic(RD, WH);
        R(B1, .34, 0, .08, 1);
        R(B1, 0, .46, 1, .08)
      },
      JP: () => {
        R(WH, 0, 0, 1, 1);
        x.fillStyle = K(RD);
        x.beginPath();
        x.ellipse(X + W / 2, Y + H / 2, H * .3, H * .3, 0, 0, 7);
        x.fill()
      },
      TR: () => {
        R(RD, 0, 0, 1, 1);
        x.fillStyle = K(WH);
        x.beginPath();
        x.ellipse(X + W * .38, Y + H / 2, H * .25, H * .25, 0, 0, 7);
        x.fill();
        x.fillStyle = K(RD);
        x.beginPath();
        x.ellipse(X + W * .42, Y + H / 2, H * .2, H * .2, 0, 0, 7);
        x.fill();
        x.fillStyle = K(WH);
        x.beginPath();
        x.ellipse(X + W * .56, Y + H / 2, H * .08, H * .08, 0, 0, 7);
        x.fill()
      },
      US: () => {
        for (let i = 0; i < 13; i++) R(i % 2 ? WH : RD, 0, i / 13, 1, 1 / 13 + .002);
        R(B1, 0, 0, .4, 7 / 13);
        const cw = W * .4,
          ch = H * 7 / 13,
          r = Math.min(cw / 12, ch / 10) * .42;
        x.fillStyle = K(WH);
        const star = (cx, cy) => {
          x.beginPath();
          for (let k = 0; k < 10; k++) {
            const a = -Math.PI / 2 + k * Math.PI / 5,
              rr = k % 2 ? r * .42 : r;
            x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)
          }
          x.closePath();
          x.fill()
        };
        for (let row = 0; row < 9; row++) {
          const n = row % 2 ? 5 : 6;
          for (let c = 0; c < n; c++) star(X + cw * ((row % 2 ? 2 : 1) + c * 2) / 12, Y + ch * (row + 1) / 10)
        }
      },
      GB: () => {
        R(B1, 0, 0, 1, 1);
        x.save();
        x.beginPath();
        x.rect(X, Y, W, H);
        x.clip();
        x.lineCap = "butt";
        const L = (c, w) => {
          x.strokeStyle = K(c);
          x.lineWidth = w;
          x.beginPath();
          x.moveTo(X, Y);
          x.lineTo(X + W, Y + H);
          x.moveTo(X + W, Y);
          x.lineTo(X, Y + H);
          x.stroke()
        };
        L(WH, H * .2);
        L(RD, H * .07);
        x.restore();
        R(WH, .43, 0, .14, 1);
        R(WH, 0, .36, 1, .28);
        R(RD, .46, 0, .08, 1);
        R(RD, 0, .41, 1, .18)
      },
      UA: () => hz([B2, YL]),
      RU: () => hz([WH, B2, RD]),
      PL: () => hz([WH, RD]),
      AT: () => hz([RD, WH, RD]),
      EE: () => hz(["00BCFF", DK, WH]),
      IT: () => vt([GN, WH, RD]),
      BE: () => vt([DK, YL, RD]),
      CH: () => {
        R(RD, 0, 0, 1, 1);
        const c = Math.min(W, H) * .6,
          t = c * .28;
        x.fillStyle = K(WH);
        x.fillRect(X + W / 2 - t / 2, Y + H / 2 - c / 2, t, c);
        x.fillRect(X + W / 2 - c / 2, Y + H / 2 - t / 2, c, t)
      },
      IR: () => {
        hz([GN, WH, RD]);
        ov("b", .2, .8, .36, .64)
      },
      IN: () => {
        hz([YL, WH, GN]);
        ov("b", .3, .7, .36, .64)
      },
      AR: () => {
        hz(["00BCFF", WH, "00BCFF"]);
        ov("b", .3, .7, .36, .64)
      },
      ES: () => {
        R(RD, 0, 0, 1, 1);
        R(YL, 0, .25, 1, .5);
        ov("b", .05, .65, .27, .73)
      },
      MX: () => {
        vt([GN, WH, RD]);
        ov("s", .34, .66)
      },
      CA: () => {
        R(RD, 0, 0, 1, 1);
        R(WH, .25, 0, .5, 1);
        ov("s", .26, .74)
      },
      SA: () => {
        R("006045", 0, 0, 1, 1);
        ov("c")
      },
      KR: () => {
        R(WH, 0, 0, 1, 1);
        ov("c")
      },
      CN: () => {
        R(RD, 0, 0, 1, 1);
        ov("l")
      },
      AU: () => {
        R(B1, 0, 0, 1, 1);
        ov("l")
      },
      QA: () => {
        R("8B0836", 0, 0, 1, 1);
        R(WH, 0, 0, .3, 1);
        ov("l")
      },
      CL: () => {
        hz([WH, RD]);
        R(B1, 0, 0, Math.min(.33, H / 2 / W), .5)
      },
      SG: () => hz([RD, WH])
    };
    (T[cc] || (() => R("888888", 0, 0, 1, 1)))()
  }
  /* the selected country's flag, clipped to its shape, framed on the country (bb = uv rectangle for the shader) */
  const FLAGTX = new Map();

  function flagTexture(gi, cc) {
    const k = gi + "|" + cc;
    if (FLAGTX.has(k)) return FLAGTX.get(k);
    let W = 1024,
      H = 1024;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    c.bb = [0, 0, 1, 1];
    if (gi >= 0) {
      const G = GEO[gi];
      let [a0, a1, b0, b1] = countryFrame(gi);
      const asp = (a1 - a0) * Math.cos((b0 + b1) / 2 * D2R) / (b1 - b0);
      if (asp > 1) H = Math.max(128, Math.round(1024 / asp));
      else W = Math.max(128, Math.round(1024 * asp));
      c.width = W;
      c.height = H;
      const pa = (a1 - a0) * .02 + .05,
        pb = (b1 - b0) * .02 + .05;
      a0 -= pa;
      a1 += pa;
      b0 -= pb;
      b1 += pb;
      c.bb = [(a0 + 180) / 360, (90 - b1) / 180, (a1 - a0) / 360, (b1 - b0) / 180];
      const X = lo => (lo - a0) / (a1 - a0) * W,
        Y = la => (b1 - la) / (b1 - b0) * H;
      const x = c.getContext("2d");
      x.save();
      x.beginPath();
      G.forEach(r => {
        for (let i = 0; i < r.length; i += 2) i ? x.lineTo(X(r[i]), Y(r[i + 1])) : x.moveTo(X(r[i]), Y(r[i + 1]));
        x.closePath()
      });
      x.clip();
      paintFlag(x, cc, X(a0 + pa), Y(b1 - pb), X(a1 - pa) - X(a0 + pa), Y(b0 + pb) - Y(b1 - pb));
      x.restore()
    }
    const im = cc && fimg(cc);
    if (!im || im.complete) FLAGTX.set(k, c);
    return c
  }
  /* ---------- 5. WebGL relief globe ---------- */
  const GLVS = "attribute vec2 a;uniform vec2 uS;varying vec2 vP;void main(){vP=vec2((a.x*.5+.5)*uS.x,(1.-(a.y*.5+.5))*uS.y);gl_Position=vec4(a,0.,1.);}";
  const GLFS = `precision highp float;
uniform vec2 uC;uniform float uR;uniform vec2 uRot;uniform sampler2D uLand;uniform sampler2D uAct;uniform sampler2D uFlag;uniform sampler2D uHome;uniform sampler2D uHgt;uniform vec4 uFB;uniform float uActOn;varying vec2 vP;
float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float nz(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*nz(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}
float ridge(vec3 p){float a=.55,s=0.;for(int i=0;i<5;i++){float n=1.-abs(nz(p)*2.-1.);s+=a*n*n;p=p*2.11+vec3(3.1,1.3,7.7);a*=.5;}return s;}
vec3 toW(vec3 v,out vec2 uv){float s0=sin(uRot.y),c0=cos(uRot.y);float ph=asin(clamp(v.y*c0+v.z*s0,-1.,1.));float la=uRot.x+atan(v.x,v.z*c0-v.y*s0);
 uv=vec2(fract((la+3.14159265)/6.28318531),(1.57079633-ph)/3.14159265);return vec3(cos(ph)*cos(la),cos(ph)*sin(la),sin(ph));}
float hR(vec2 q){vec3 v=vec3(q,sqrt(max(0.,1.-dot(q,q))));vec2 uv;vec3 P=toW(v,uv);vec4 L=texture2D(uLand,uv);
 float ld=smoothstep(.3,.7,L.g);float core=smoothstep(.05,.8,L.b);float reg=smoothstep(.93,.985,dot(P,vec3(.533,.308,.788)));
 vec3 w=vec3(nz(P*7.),nz(P*7.+5.2),nz(P*7.+9.7))-.5;float belt=smoothstep(.34,.66,fbm(P*3.2+w*.6));
 return ld*(.1+.1*fbm(P*6.+w)+belt*(.3+.7*core)*.5*pow(ridge(P*20.+w*1.6),1.7)+reg*(.2+.8*core)*.32*smoothstep(.35,.85,fbm(P*8.+w*1.5)));}
float hN(vec2 q){vec3 v=vec3(q,sqrt(max(0.,1.-dot(q,q))));vec2 uv;vec3 P=toW(v,uv);float ld=smoothstep(.3,.7,texture2D(uLand,uv).g);
 return ld*.035*fbm(P*95.);}
void main(){vec2 q=(vP-uC)/uR;q.y=-q.y;float d=dot(q,q);
 if(d>1.){float r=sqrt(d);float g=exp(-(r-1.)*uR/16.)*.32;gl_FragColor=vec4(vec3(.62,.66,.74)*g,g);return;}
 float z=sqrt(1.-d);vec3 n0=vec3(q,z);vec2 uv;vec3 P=toW(n0,uv);vec4 L=texture2D(uLand,uv);vec4 A=texture2D(uAct,uv);
 float E=max(1.2/uR,.0025),e=1.2/uR;float h0=hR(q);float n0v=hN(q);
 vec2 gr=vec2(hR(q+vec2(E,0.))-hR(q-vec2(E,0.)),hR(q+vec2(0.,E))-hR(q-vec2(0.,E)))/(2.*E)+vec2(hN(q+vec2(e,0.))-n0v,hN(q+vec2(0.,e))-n0v)/e;h0+=n0v;vec3 n=normalize(n0-vec3(gr*.04,0.));vec2 fu=(uv-uFB.xy)/uFB.zw;vec4 FL=texture2D(uFlag,fu);FL.a*=step(0.,fu.x)*step(fu.x,1.)*step(0.,fu.y)*step(fu.y,1.);vec4 HM=texture2D(uHome,uv);
 vec3 Ld=normalize(vec3(.62,.5,.6));float df=max(dot(n,Ld),0.);float df0=max(dot(n0,Ld),0.);
 float land=smoothstep(.35,.65,L.g);
 vec3 ocean=vec3(.0902);
 float hs=pow(df,1.2);float el=smoothstep(.15,.75,h0);vec3 lc=vec3(.46,.47,.49)*(.28+.9*hs)*(.85+.55*el);
 float act=smoothstep(.15,.6,A.g)*uActOn;float ag=A.r*uActOn;
 float lum=dot(lc,vec3(.333));lc=mix(lc,FL.rgb*(.22+1.45*lum),FL.a*uActOn*.36);float hm=smoothstep(.3,.7,HM.r);lc=mix(lc,lc*.38+vec3(.02,.03,.06),hm*.9);
 vec3 col=mix(ocean,lc,land);col+=vec3(.2,.5,1.)*ag*.12*(1.-land);col+=vec3(.2,.5,1.)*HM.g*.05*(1.-hm);
 col*=.45+.55*pow(z,.45);col+=vec3(.5,.52,.56)*pow(1.-z,2.6)*.26*(.35+.65*smoothstep(-.4,.8,q.x));
 gl_FragColor=vec4(col,1.);}`;

  function createGL(cv, homeGi) {
    let gl = null;
    try {
      gl = cv.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false
      })
    } catch (e) {}
    if (!gl) return null;
    const sh = (t, s) => {
      const o = gl.createShader(t);
      gl.shaderSource(o, s);
      gl.compileShader(o);
      return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null
    };
    const vs = sh(gl.VERTEX_SHADER, GLVS),
      fs = sh(gl.FRAGMENT_SHADER, GLFS);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    gl.useProgram(p);
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const la = gl.getAttribLocation(p, "a");
    gl.enableVertexAttribArray(la);
    gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
    /* world-wide textures are power-of-two and wrap around in longitude; the flag is any size, so it must clamp (WebGL1 rule) */
    const tex = (unit, src, wrap) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap ? gl.REPEAT : gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t
    };
    const [blank] = canvas(2, 1);
    tex(0, landTexture(), true);
    const ta = tex(1, glowTexture(-1), true),
      tf = tex(2, flagTexture(-1, ""), false),
      th = tex(3, homeTexture(homeGi), true);
    tex(4, blank, false);
    const U = n => gl.getUniformLocation(p, n);
    gl.uniform1i(U("uLand"), 0);
    gl.uniform1i(U("uAct"), 1);
    gl.uniform1i(U("uFlag"), 2);
    gl.uniform1i(U("uHome"), 3);
    gl.uniform1i(U("uHgt"), 4);
    gl.uniform4f(U("uFB"), 0, 0, 1, 1);
    return {
      gl,
      ta,
      tf,
      th,
      key: null,
      on: .7,
      u: {
        S: U("uS"),
        C: U("uC"),
        R: U("uR"),
        Rot: U("uRot"),
        FB: U("uFB"),
        On: U("uActOn")
      }
    }
  }

  function upload(gl, unit, t, src) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
  }
  /* ---------- 6. overlay helpers ---------- */
  function strokePoly(ctx, pts) {
    ctx.beginPath();
    let pen = false;
    for (const p of pts) {
      if (p[2] > -.12) {
        pen ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
        pen = true
      } else pen = false
    }
    ctx.stroke()
  }

  function ringsPath(ctx, v, rings) {
    ctx.beginPath();
    for (const r of rings) {
      let pen = false;
      for (let i = 0; i <= r.length; i += 2) {
        const k = i % r.length;
        const p = project(v, r[k], r[k + 1]);
        if (p[2] > 0) {
          pen ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
          pen = true
        } else pen = false
      }
    }
  }

  function along(pts, f) {
    const n = pts.length - 1,
      x = clamp(f * n, 0, n - 1e-6),
      i = Math.floor(x),
      k = x - i,
      a = pts[i],
      b = pts[i + 1];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
  }

  function glow(ctx, x, y, col, r) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    g.addColorStop(0, col);
    g.addColorStop(.25, col + "aa");
    g.addColorStop(1, col + "00");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 4, 0, 7);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y, r * .55, 0, 7);
    ctx.fill()
  }

  function chip(ctx, x, y, text, bg, fg, fa) {
    ctx.font = (fa ? "500 12px Geist" : "500 11.5px Geist") + ",sans-serif";
    const w = ctx.measureText(text).width + 14;
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - 11, w, 22, 8);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y + .5)
  }
  /* ---------- 7. icons and text ---------- */
  const I = {
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2 3.5 10v10.3c0 .4.3.7.7.7h5.3v-6.2h5v6.2h5.3c.4 0 .7-.3.7-.7V10z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4.8 13.1c-.3.4 0 .9.5.9H11l-1.3 8L19.2 10.9c.3-.4 0-.9-.5-.9H13z"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1m0 9h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1m2-6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6.5" cy="6.5" r="1.9"/><circle cx="12" cy="6.5" r="1.9"/><circle cx="17.5" cy="6.5" r="1.9"/><circle cx="6.5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="17.5" cy="12" r="1.9"/><circle cx="6.5" cy="17.5" r="1.9"/><circle cx="12" cy="17.5" r="1.9"/><circle cx="17.5" cy="17.5" r="1.9"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.4 2.4 3.6 5.3 3.6 8.6s-1.2 6.2-3.6 8.6c-2.4-2.4-3.6-5.3-3.6-8.6s1.2-6.2 3.6-8.6"/></svg>',
    fit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9V5.5C4 4.7 4.7 4 5.5 4H9M15 4h3.5c.8 0 1.5.7 1.5 1.5V9M20 15v3.5c0 .8-.7 1.5-1.5 1.5H15M9 20H5.5C4.7 20 4 19.3 4 18.5V15"/><rect x="8.5" y="8.5" width="7" height="7" rx="1.5"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5.5 12h13"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5.5 12h13M12 5.5v13"/></svg>'
  };
  const TEXT = {
    en: {
      you: "You",
      ms: "ms",
      backbone: "ZeroLag backbone",
      world: "Whole globe",
      fit: "Fit",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      map: "Route map"
    }
  };
  const FAD = "0123456789";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  } [c]));
  /* ---------- 8. component ---------- */
  const DEFAULT_HOME = {
    lon: 51.39,
    lat: 35.69,
    cc: "IR",
    name: {
      en: "Iran"
    }
  };

  function mount(el, options = {}) {
    const o = Object.assign({
      home: DEFAULT_HOME,
      servers: [],
      relays: [],
      selected: null,
      city: null,
      status: "off",
      lang: "en",
      controls: true,
      insets: {},
      onSelect: null,
      interactive: true,
      wheel: false,
      net: false
    }, options);
    const S = {
      sel: o.selected,
      city: o.city,
      status: o.status,
      lang: o.lang,
      raceAt: performance.now()
    };
    const byId = new Map(o.servers.map(s => [s.id, s]));
    const home = o.home,
      homeGi = countryIndex(home.cc);
    const t = k => (TEXT[S.lang] || TEXT.en)[k];
    const L = n => n && (n[S.lang] || n.en) || "";
    const N = x => S.lang === "fa" ? String(x).replace(/\d/g, d => FAD[d]) : String(x);
    /* pings per city, best city per server */
    const pingOf = c => msr(routesFor(home, c, o.relays)[0].total);
    o.servers.forEach(s => s.cities.forEach(c => {
      c.ping = c.ping || pingOf(c)
    }));
    const bestCity = s => s.cities.find(c => c.id === s.cap) || [...s.cities].sort((a, b) => a.ping - b.ping)[0];
    el.classList.add("zlmap");
    if (!o.interactive || o.net) el.classList.add("zl-static");
    el.tabIndex = o.interactive ? 0 : -1;
    el.setAttribute("role", "application");
    el.setAttribute("aria-roledescription", "map");
    el.innerHTML = '<canvas class="zl-gl" aria-hidden="true"></canvas><canvas class="zl-ov" aria-hidden="true"></canvas><div class="zl-pins"></div>' + (o.controls ? '<div class="zl-ctl"></div>' : "");
    const cvg = el.querySelector(".zl-gl"),
      cvo = el.querySelector(".zl-ov"),
      ctx = cvo.getContext("2d"),
      pinsEl = el.querySelector(".zl-pins"),
      ctlEl = el.querySelector(".zl-ctl");
    const V = {
      W: 0,
      H: 0,
      dpr: 1,
      cx: 0,
      cy: 0,
      base: 1,
      lon: 0,
      lat: 20,
      R: 1,
      anim: null,
      user: false,
      ready: false
    };
    let G = createGL(cvg, homeGi),
      raf = 0,
      alive = true,
      visible = true,
      pins = [],
      flagDirty = false,
      camKey = "",
      sceneKey = "",
      scene = null,
      inViewport = true;
    /* current model */
    function model() {
      const key = [S.sel, S.city, S.status].join('|');
      if (scene && sceneKey === key) return scene;
      sceneKey = key;
      const s = byId.get(S.sel) || o.servers[0];
      const city = s ? (s.cities.find(c => c.id === S.city) || bestCity(s)) : {
        lon: home.lon,
        lat: home.lat
      };
      return scene = {
        s,
        city,
        routes: routesFor(home, city, o.relays),
        live: S.status === "on",
        racing: S.status === "connecting"
      }
    }
    /* camera: frame the focused country together with home */
    function target() {
      const m = model(),
        mn = Math.min(V.fw, V.fh);
      let cLon = m.city.lon,
        cLat = m.city.lat,
        ca = 3 * D2R;
      const gi = m.s ? countryIndex(m.s.cc) : -1;
      if (gi >= 0) {
        const [x0, x1, y0, y1] = countryFrame(gi);
        cLon = (x0 + x1) / 2;
        cLat = (y0 + y1) / 2;
        ca = Math.max(2.5 * D2R, Math.hypot((x1 - x0) * Math.cos(cLat * D2R), y1 - y0) / 2 * D2R)
      }
      const hd = angle({
        lon: cLon,
        lat: cLat
      }, home);
      const Rroute = (mn * .42) / Math.sin(Math.min(hd / 2 + ca * .6 + 3 * D2R, 80 * D2R)),
        Rc = (mn * .2) / Math.sin(Math.min(ca, 80 * D2R));
      const R = clamp(Math.max(Rroute, Math.min(Rc, Rroute * 2.2)), V.base, V.base * 9);
      const w = R > Rroute * 1.05 ? .22 : .5,
        u = vec(cLon, cLat),
        h = vec(home.lon, home.lat),
        v = u.map((x, i) => x * (1 - w) + h[i] * w),
        len = Math.hypot(...v);
      const [lon, lat] = unvec(v.map(x => x / len));
      return {
        lon,
        lat: clamp(lat, -60, 72),
        R
      }
    }

    function animateTo(to, dur) {
      let dl = to.lon - V.lon;
      dl = ((dl + 540) % 360) - 180;
      V.anim = {
        from: {
          lon: V.lon,
          lat: V.lat,
          R: V.R
        },
        to: {
          lon: V.lon + dl,
          lat: to.lat,
          R: to.R
        },
        t0: performance.now(),
        dur
      };
      wake()
    }

    function stepAnim(now) {
      const a = V.anim,
        k = Math.min(1, (now - a.t0) / a.dur),
        e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const swing = Math.abs(a.to.lon - a.from.lon) > 50 ? Math.sin(Math.PI * k) : 0;
      V.lon = a.from.lon + (a.to.lon - a.from.lon) * e;
      V.lat = a.from.lat + (a.to.lat - a.from.lat) * e;
      V.R = (a.from.R + (a.to.R - a.from.R) * e) * (1 - .35 * swing);
      if (k >= 1) V.anim = null
    }
    /* layout */
    function resize() {
      const W = el.clientWidth,
        H = el.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1),
        gdpr = Math.min(1.5, dpr);
      if (V.W === W && V.H === H && V.dpr === dpr) return;
      camKey = '';
      cvo.width = Math.round(W * dpr);
      cvo.height = Math.round(H * dpr);
      cvg.width = Math.round(W * gdpr);
      cvg.height = Math.round(H * gdpr);
      const ins = Object.assign({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }, o.insets);
      const fw = W - ins.left - ins.right,
        fh = H - ins.top - ins.bottom;
      const base = Math.min(fw, fh) * .44,
        first = !V.ready;
      Object.assign(V, {
        W,
        H,
        dpr,
        fw,
        fh,
        cx: ins.left + fw / 2,
        cy: ins.top + fh / 2
      });
      if (first) {
        V.base = base;
        const tg = target();
        Object.assign(V, {
          lon: tg.lon - 25,
          lat: tg.lat,
          R: base,
          ready: true
        });
        setTimeout(() => {
          if (alive && !V.user) animateTo(target(), 1300)
        }, 350)
      } else {
        V.R *= base / V.base;
        V.base = base;
        if (V.anim) animateTo(target(), 500)
      }
      wake()
    }
    /* pins */
    function pinHtml(kind, p, inner, {
      act,
      label,
      lbl,
      cls,
      img
    } = {}) {
      return `<div class="zl-pin ${kind} ${cls||""}" data-lon="${p.lon}" data-lat="${p.lat}"${act?` data-act="${act}"`:""}>` +
        `<span class="bdg"${act?` role="button" tabindex="0" aria-label="${esc(label||"")}"`:""}><span class="ico"${img?` style="background-image:url('${img}')"`:""}>${inner}</span></span>` +
        `<span class="dot"></span>${lbl?`<span class="lbl">${esc(lbl)}</span>`:""}</div>`
    }

    function renderPins() {
      camKey = '';
      if (o.net) {
        pinsEl.innerHTML = "";
        pins = [];
        return
      }
      const m = model();
      let h = "";
      if (!m.s) {
        pinsEl.innerHTML = "";
        pins = [];
        return
      }
      const near = [...m.s.cities, ...m.routes.filter(r => r.via).map(r => r.via)];
      o.servers.forEach(s => {
        if (s.id === m.s.id) return;
        const c = bestCity(s);
        if (near.some(p => Math.abs(p.lon - c.lon) + Math.abs(p.lat - c.lat) < 3)) return;
        h += pinHtml("ctry", c, "", {
          act: "server:" + s.id,
          label: L(s.name),
          cls: "far",
          img: window.ZL_FLAGS[s.cc]
        })
      });
      m.s.cities.forEach(c => {
        const cur = c.id === m.city.id;
        h += pinHtml(cur ? "sel" : "city", c, cur ? I.grid : I.server, {
          act: cur ? null : "city:" + m.s.id + ":" + c.id,
          label: L(c.name),
          lbl: cur ? `${L(c.name)} · ${N(c.ping)} ${t("ms")}` : L(c.name)
        })
      });
      m.routes.forEach((r, i) => {
        if (!r.via) return;
        h += pinHtml("relay", r.via, I.bolt, {
          cls: i === 0 ? "best" : "",
          lbl: i > 0 ? "" : `${L(r.via.name)} · ${N(msr(r.total))} ${t("ms")}`
        })
      });
      h += pinHtml("home", home, I.home, {
        lbl: `${t("you")} · ${L(home.name)}`
      });
      pinsEl.innerHTML = h;
      pins = [...pinsEl.children].map(e => ({
        e,
        lon: +e.dataset.lon,
        lat: +e.dataset.lat,
        k: e.classList.contains("home") || e.classList.contains("sel") ? 3 : e.classList.contains("relay") ? 2 : 1,
        far: e.classList.contains("far")
      }))
    }

    function placePins() {
      const placed = [];
      pins.map(p => ({
        p,
        q: project(V, p.lon, p.lat)
      })).sort((a, b) => b.p.k - a.p.k).forEach(({
        p,
        q
      }) => {
        const [x, y, z] = q, vis = z > .04;
        p.e.style.transform = `translate(${x}px,${y}px)`;
        p.e.classList.toggle("is-hidden", !vis);
        let mini = p.far && V.R < V.base * 1.7;
        if ((p.k < 3 || p.e.classList.contains("home")) && placed.some(c => Math.abs(c[0] - x) < 46 && Math.abs(c[1] - y) < 52)) mini = true;
        p.e.classList.toggle("is-mini", mini);
        if (vis && !mini) placed.push([x, y])
      })
    }
    /* overlay: home border, focused border, routes */
    function drawOverlay(now, m) {
      const dpr = V.dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, V.W, V.H);
      if (!G) {
        drawFallback(m)
      }
      if (homeGi >= 0) {
        ctx.save();
        ringsPath(ctx, V, GEO[homeGi]);
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = "rgba(205,215,220,.45)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore()
      }
      const gi = m.s ? countryIndex(m.s.cc) : -1;
      if (gi >= 0) {
        ctx.save();
        ringsPath(ctx, V, GEO[gi]);
        ctx.strokeStyle = "rgba(255,255,255,.08)";
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.stroke();
        ringsPath(ctx, V, GEO[gi]);
        ctx.setLineDash([6, 5]);
        ctx.lineDashOffset = -(now / 1000) * (m.live ? 14 : 6);
        ctx.strokeStyle = m.live ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.55)";
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore()
      }
      if (m.s) drawRoutes(now, m)
    }

    function routePoly(r, city) {
      const seg = r.via ? [...arcPoints(home, r.via, 1), ...arcPoints(r.via, city, 1).slice(1)] : arcPoints(home, city, 1);
      return seg.map(([lo, la, al]) => project(V, lo, la, al))
    }

    function drawRoutes(now, m) {
      const city = m.city,
        list = m.routes,
        polys = list.map(r => routePoly(r, city)),
        T = now / 1000,
        fa = S.lang === "fa";
      /* direct ISP path for reference */
      const isp = arcPoints(home, city, 1).map(([lo, la, al]) => project(V, lo, la, 1 + (al - 1) * .35));
      ctx.setLineDash([2, 5]);
      ctx.strokeStyle = "rgba(255,255,255,.16)";
      ctx.lineWidth = 1.2;
      strokePoly(ctx, isp);
      ctx.setLineDash([]);
      if (m.racing) {
        const el2 = (now - S.raceAt) / 1000;
        list.forEach((r, i) => {
          const pts = polys[i];
          ctx.strokeStyle = i === 0 ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.14)";
          ctx.lineWidth = 1.3;
          ctx.setLineDash([4, 6]);
          ctx.lineDashOffset = -T * 30;
          strokePoly(ctx, pts);
          ctx.setLineDash([]);
          const f = Math.min(1, el2 / (r.total * .028)),
            p = along(pts, f);
          ctx.strokeStyle = i === 0 ? "rgba(255,255,255,.95)" : "rgba(150,150,150,.8)";
          ctx.lineWidth = 2.2;
          strokePoly(ctx, pts.slice(0, Math.max(2, Math.floor(f * (pts.length - 1)) + 1)));
          glow(ctx, p[0], p[1], i === 0 ? "#FFFFFF" : "#8A8A8A", 4);
          if (f >= 1) chip(ctx, V.cx, (o.insets.top || 0) + 26 + i * 26, `${r.via?L(r.via.name):t("backbone")} ${N(msr(r.total))} ${t("ms")}`, i === 0 ? "#0070F3" : "#222222", i === 0 ? "#FFFFFF" : "#EDEDED", fa)
        });
        return
      }
      list.forEach((r, i) => {
        if (m.live && i === 0) return;
        ctx.strokeStyle = i === 0 ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.2)";
        ctx.lineWidth = i === 0 ? 1.8 : 1.1;
        ctx.setLineDash(i === 0 ? [6, 6] : [3, 6]);
        ctx.lineDashOffset = -T * (i === 0 ? 24 : 10);
        strokePoly(ctx, polys[i]);
        ctx.setLineDash([])
      });
      if (m.live) {
        const r = list[0],
          pts = polys[0];
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,.45)";
        ctx.shadowBlur = 10;
        const gr = ctx.createLinearGradient(pts[0][0], pts[0][1], pts[pts.length - 1][0], pts[pts.length - 1][1]);
        gr.addColorStop(0, "rgba(255,255,255,.35)");
        gr.addColorStop(.55, "#D4D4D4");
        gr.addColorStop(1, "#FFFFFF");
        ctx.strokeStyle = gr;
        ctx.lineWidth = 2.6;
        strokePoly(ctx, pts);
        ctx.restore();
        const dur = Math.max(1.1, r.total * .06);
        for (let k = 0; k < 5; k++) {
          const p = along(pts, ((T / dur) + k / 5) % 1);
          if (p[2] > -.1) glow(ctx, p[0], p[1], "#F4F6F7", 3.2)
        }
        for (let k = 0; k < 2; k++) {
          const p = along(pts, 1 - (((T / (dur * 1.25)) + k / 2) % 1));
          if (p[2] > -.1) glow(ctx, p[0], p[1], "#3291FF", 2.4)
        }
        (r.via ? [
          [home, r.via, r.h1],
          [r.via, city, r.h2]
        ] : [
          [home, city, r.h1]
        ]).forEach(([a, b, h]) => {
          const mid = arcPoints(a, b, 1),
            q = mid[Math.floor(mid.length / 2)],
            p = project(V, q[0], q[1], q[2]);
          if (p[2] > 0) chip(ctx, p[0], p[1] - 14, `${N(msr(h))} ${t("ms")}`, "#0070F3", "#FFFFFF", fa)
        })
      }
    }
    /* without WebGL: flat shaded land on a dark sphere */
    function drawFallback(m) {
      const {
        cx,
        cy,
        R
      } = V;
      let g = ctx.createRadialGradient(cx - R * .38, cy - R * .42, R * .05, cx, cy, R);
      g.addColorStop(0, "#1F2328");
      g.addColorStop(.6, "#121417");
      g.addColorStop(1, "#0A0B0D");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 7);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 7);
      ctx.clip();
      const land = (rings) => {
        ctx.beginPath();
        for (const r of rings) {
          let vis = false;
          const pts = [];
          for (let i = 0; i < r.length; i += 2) {
            const p = project(V, r[i], r[i + 1]);
            if (p[2] > 0) vis = true;
            pts.push(p)
          }
          if (!vis) continue;
          pts.forEach((p, i) => {
            let x = p[0],
              y = p[1];
            if (p[2] <= 0) {
              const dx = x - cx,
                dy = y - cy,
                d = Math.hypot(dx, dy) || 1;
              x = cx + dx / d * R;
              y = cy + dy / d * R
            }
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
          });
          ctx.closePath()
        }
      };
      ctx.fillStyle = "#3A3D42";
      GEO.forEach(gr => {
        land(gr);
        ctx.fill()
      });
      const gi = m.s ? countryIndex(m.s.cc) : -1;
      if (gi >= 0) {
        land(GEO[gi]);
        ctx.fillStyle = "rgba(255,255,255,.18)";
        ctx.fill()
      }
      ctx.restore()
    }
    /* WebGL frame */
    function drawGL(m) {
      const gl = G.gl,
        gi = m.s ? countryIndex(m.s.cc) : -1,
        cc = m.s ? m.s.cc : "",
        key = gi + "|" + cc;
      if (G.key !== key || flagDirty) {
        G.key = key;
        flagDirty = false;
        upload(gl, 1, G.ta, glowTexture(gi));
        const fc = flagTexture(gi, cc);
        upload(gl, 2, G.tf, fc);
        gl.uniform4f(G.u.FB, ...fc.bb)
      }
      gl.viewport(0, 0, cvg.width, cvg.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(G.u.S, V.W, V.H);
      gl.uniform2f(G.u.C, V.cx, V.cy);
      gl.uniform1f(G.u.R, V.R);
      gl.uniform2f(G.u.Rot, V.lon * D2R, V.lat * D2R);
      G.on += ((m.live ? 1 : .7) - G.on) * .08;
      gl.uniform1f(G.u.On, G.on);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    /* network showcase (the app's sign-in globe): mesh between hubs, spokes to edges, featured routes */
    let NETD = null,
      NET_T0 = null;

    function netData() {
      if (NETD) return NETD;
      const cities = [];
      o.servers.forEach(s => s.cities.forEach(c => cities.push(c)));
      const seen = new Set(),
        mesh = [];
      const SVN = o.servers.filter(s => angle(home, bestCity(s)) < 80 * D2R);
      const hubs = SVN.map(bestCity);
      hubs.forEach((A, i) => {
        hubs.map((B, j) => ({
          j,
          d: i === j ? 9 : angle(A, B)
        })).sort((x, y) => x.d - y.d).slice(0, 3).forEach(({
          j,
          d
        }) => {
          if (d > .95) return;
          const k = Math.min(i, j) + "-" + Math.max(i, j);
          if (seen.has(k)) return;
          seen.add(k);
          mesh.push(arcPoints(A, hubs[j], .35))
        })
      });
      SVN.forEach(s => {
        const h = bestCity(s);
        s.cities.forEach(c => {
          if (c !== h) mesh.push(arcPoints(h, c, .3))
        })
      });
      const spokes = o.relays.map(r => arcPoints(home, r, .8));
      const routes = SVN.map(s => {
        const c = bestCity(s);
        const r = routesFor(home, c, o.relays)[0];
        const pts = r.via ? [...arcPoints(home, r.via, .6), ...arcPoints(r.via, c, .6).slice(1)] : arcPoints(home, c, .6);
        return {
          c,
          ms: c.ping || msr(r.total),
          pts
        }
      });
      const gcd = (a, b) => b ? gcd(b, a % b) : a;
      const n = routes.length;
      const k = [3, 5, 7, 2, 1].find(v => gcd(v, n) === 1) || 1;
      routes.sort((a, b) => Math.atan2(a.c.lat - home.lat, a.c.lon - home.lon) - Math.atan2(b.c.lat - home.lat, b.c.lon - home.lon));
      return NETD = {
        cities,
        mesh,
        spokes,
        routes,
        k
      }
    }
    const netPoly = p => p.map(([lo, la, al]) => project(V, lo, la, al));

    function drawNet(now) {
      const Dn = netData();
      if (NET_T0 == null) NET_T0 = now;
      const T = (now - NET_T0) / 1000,
        fa = S.lang === "fa";
      V.R = V.base * (o.netScale || 1.4);
      V.cy = o.netTop != null ? o.netTop * V.H + V.R : V.H * (o.netCy || .5);
      V.lon = (o.netLon || 32) + 20 * Math.sin(T * .1);
      V.lat = (o.netLat || 37) + 4 * Math.sin(T * .07);
      if (G) {
        const gl = G.gl;
        if (G.key !== "net") {
          G.key = "net";
          upload(gl, 1, G.ta, glowTexture(-1));
          const fc = flagTexture(-1, "");
          upload(gl, 2, G.tf, fc);
          gl.uniform4f(G.u.FB, ...fc.bb)
        }
        gl.viewport(0, 0, cvg.width, cvg.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(G.u.S, V.W, V.H);
        gl.uniform2f(G.u.C, V.cx, V.cy);
        gl.uniform1f(G.u.R, V.R);
        gl.uniform2f(G.u.Rot, V.lon * D2R, V.lat * D2R);
        gl.uniform1f(G.u.On, .7);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      const dpr = V.dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, V.W, V.H);
      if (!G) drawFallback({
        s: null
      });
      if (homeGi >= 0) {
        ctx.save();
        ringsPath(ctx, V, GEO[homeGi]);
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = "rgba(205,215,220,.45)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore()
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,.14)";
      Dn.mesh.forEach(p => strokePoly(ctx, netPoly(p)));
      ctx.strokeStyle = "rgba(255,255,255,.32)";
      ctx.setLineDash([1.5, 14]);
      ctx.lineDashOffset = -T * 14;
      Dn.mesh.forEach(p => strokePoly(ctx, netPoly(p)));
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255,255,255,.2)";
      ctx.lineWidth = 1.2;
      Dn.spokes.forEach(p => strokePoly(ctx, netPoly(p)));
      Dn.routes.forEach((r, i) => {
        const pts = netPoly(r.pts);
        const p = along(pts, ((T * .18) + i * .37) % 1);
        if (p[2] > .05) {
          ctx.fillStyle = "rgba(255,255,255,.55)";
          ctx.beginPath();
          ctx.arc(p[0], p[1], 1.4, 0, 7);
          ctx.fill()
        }
      });
      const per = 1.6,
        life = per * 3,
        n = Dn.routes.length,
        slot = Math.floor(T / per),
        chips = [];
      for (let k = 2; k >= 0; k--) {
        const sl = slot - k;
        if (sl < 0) continue;
        const r = Dn.routes[(sl * Dn.k) % n];
        const age = T - sl * per;
        if (age > life) continue;
        const a = age > life - .9 ? Math.max(0, (life - age) / .9) : 1;
        const f = Math.min(1, age / 1.1);
        const pts = netPoly(r.pts);
        const part = pts.slice(0, Math.max(2, Math.floor(f * (pts.length - 1)) + 1));
        const head = along(pts, f);
        part.push(head);
        const vis = pts.filter(p => p[2] > -.12);
        if (vis.length < 2) continue;
        const p0 = vis[0],
          p1 = vis[vis.length - 1];
        const g = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
        g.addColorStop(0, "rgba(50,145,255,.35)");
        g.addColorStop(.6, "#3291FF");
        g.addColorStop(1, "#FFFFFF");
        ctx.globalAlpha = a;
        ctx.strokeStyle = "rgba(50,145,255,.12)";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        strokePoly(ctx, part);
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        strokePoly(ctx, part);
        ctx.lineCap = "butt";
        if (f < 1 && head[2] > 0) glow(ctx, head[0], head[1], "#3291FF", 3.2);
        if (f >= 1) {
          const e = pts[pts.length - 1];
          if (e[2] > .08) {
            const pr = ((age - 1.1) % 1.4) / 1.4;
            ctx.strokeStyle = `rgba(255,255,255,${(1-pr)*.7})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(e[0], e[1], 4 + pr * 12, 0, 7);
            ctx.stroke();
            const hit = y => chips.some(c => Math.abs(c[0] - e[0]) < 96 && Math.abs(c[1] - y) < 24);
            const y = !hit(e[1] - 20) ? e[1] - 20 : !hit(e[1] + 20) ? e[1] + 20 : null;
            if (y != null) {
              chips.push([e[0], y]);
              chip(ctx, e[0], y, `${L(r.c.name)} · ${N(r.ms)} ${t("ms")}`, "#161616", "#EDEDED", fa)
            }
          }
          const q = along(pts, ((age - 1.1) * .55) % 1);
          if (q[2] > .05) {
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(q[0], q[1], 2.2, 0, 7);
            ctx.fill()
          }
        }
        ctx.globalAlpha = 1
      }
      Dn.cities.forEach(c => {
        const p = project(V, c.lon, c.lat);
        if (p[2] < .06) return;
        ctx.fillStyle = "rgba(255,255,255,.75)";
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.9, 0, 7);
        ctx.fill()
      });
      o.relays.forEach(r => {
        const p = project(V, r.lon, r.lat);
        if (p[2] < .06) return;
        ctx.fillStyle = "#111";
        ctx.strokeStyle = "rgba(255,255,255,.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3.6, 0, 7);
        ctx.fill();
        ctx.stroke()
      });
      const h = project(V, home.lon, home.lat);
      if (h[2] > .06) {
        const pr = (T % 2) / 2;
        ctx.strokeStyle = `rgba(50,145,255,${(1-pr)*.7})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(h[0], h[1], 5 + pr * 16, 0, 7);
        ctx.stroke();
        glow(ctx, h[0], h[1], "#FFFFFF", 3.4);
        chip(ctx, h[0], h[1] + 22, `${t("you")} · ${L(home.name)}`, "#161616", "#EDEDED", fa)
      }
    }

    function frame(now) {
      raf = 0;
      if (!alive || !visible || !V.ready) return;
      // Camera movement follows the display refresh rate; idle route particles can use 30 fps.
      const fi = V.anim ? 0 : (window.__zlBusy ? 31 : (o.interactive && !o.net ? 0 : 31));
      if (fi && now - (V.lf || 0) < fi) {
        raf = requestAnimationFrame(frame);
        return
      }
      V.lf = now;
      if (o.net) {
        drawNet(now)
      } else {
        if (V.anim) stepAnim(now);
        const m = model();
        const key = [V.W, V.H, V.lon, V.lat, V.R, S.sel, S.city].join('|');
        const moved = key !== camKey;
        // Terrain has no time-dependent shader uniforms. Reuse its last frame while
        // the camera is still; only the lightweight route overlay keeps animating.
        if (G && (moved || flagDirty || Math.abs(G.on - (m.live ? 1 : .7)) > .001)) drawGL(m);
        drawOverlay(now, m);
        if (moved) placePins();
        camKey = key;
      }
      raf = requestAnimationFrame(frame)
    }

    function wake() {
      if (!raf && alive && visible) raf = requestAnimationFrame(frame)
    }
    /* interaction: drag to turn, wheel or pinch to zoom, pins to choose */
    const pts = new Map();
    let drag = null,
      pinch = null;
    const zoomBy = f => {
      V.anim = null;
      V.user = true;
      V.R = clamp(V.R * f, V.base * .85, V.base * 9);
      wake()
    };
    if (o.interactive) el.addEventListener("pointerdown", e => {
      if (o.net) e.stopImmediatePropagation()
    });
    if (o.interactive) el.addEventListener("pointerdown", e => {
      if (e.button !== 0 || e.target.closest(".bdg,.zl-ctl")) return;
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 1) drag = {
        x: e.clientX,
        y: e.clientY,
        lon: V.lon,
        lat: V.lat,
        moved: false
      };
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinch = {
          d: Math.hypot(a[0] - b[0], a[1] - b[1]),
          R: V.R
        };
        drag = null
      }
    });
    if (o.interactive) el.addEventListener("pointermove", e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pinch && pts.size === 2) {
        const [a, b] = [...pts.values()];
        V.anim = null;
        V.user = true;
        V.R = clamp(pinch.R * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d, V.base * .85, V.base * 9);
        wake();
        return
      }
      if (!drag) return;
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 5) {
        drag.moved = true;
        V.anim = null;
        V.user = true;
        el.classList.add("is-dragging");
        try {
          el.setPointerCapture(e.pointerId)
        } catch (_) {}
      }
      if (drag.moved) {
        V.lon = drag.lon - dx / V.R / D2R;
        V.lat = clamp(drag.lat + dy / V.R / D2R, -75, 75);
        wake()
      }
    });
    const up = e => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (!pts.size) {
        drag = null;
        el.classList.remove("is-dragging")
      }
    };
    if (o.interactive) {
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up)
    }
    if (o.wheel) el.addEventListener("wheel", e => {
      if (o.net) return;
      const f = e.deltaY < 0 ? 1.12 : 1 / 1.12,
        n = clamp(V.R * f, V.base * .85, V.base * 9);
      if (Math.abs(n - V.R) < .5) return;
      e.preventDefault();
      zoomBy(f)
    }, {
      passive: false
    });
    const choose = act => {
      const [k, sid, cid] = act.split(":");
      api.select(sid, k === "city" ? cid : null);
      if (o.onSelect) o.onSelect(sid, model().city.id)
    };
    pinsEl.addEventListener("click", e => {
      const p = e.target.closest(".zl-pin[data-act]");
      if (p) choose(p.dataset.act)
    });
    pinsEl.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const p = e.target.closest(".zl-pin[data-act]");
      if (p) {
        e.preventDefault();
        choose(p.dataset.act)
      }
    });
    if (o.interactive) el.addEventListener("keydown", e => {
      if (o.net || e.target.closest(".bdg,.zl-ctl")) return;
      const step = 6 / (V.R / V.base);
      const k = {
        ArrowLeft: () => {
          V.lon -= step
        },
        ArrowRight: () => {
          V.lon += step
        },
        ArrowUp: () => {
          V.lat = clamp(V.lat + step, -75, 75)
        },
        ArrowDown: () => {
          V.lat = clamp(V.lat - step, -75, 75)
        },
        "+": () => zoomBy(1.25),
        "=": () => zoomBy(1.25),
        "-": () => zoomBy(.8),
        "0": () => api.fit()
      } [e.key];
      if (k) {
        e.preventDefault();
        V.anim = null;
        V.user = true;
        k();
        wake()
      }
    });

    function renderControls() {
      if (!ctlEl) return;
      ctlEl.innerHTML = `<button type="button" data-c="world" aria-label="${t("world")}" title="${t("world")}">${I.globe}</button><button type="button" data-c="fit" aria-label="${t("fit")}" title="${t("fit")}">${I.fit}</button>` +
        `<button type="button" data-c="out" aria-label="${t("zoomOut")}" title="${t("zoomOut")}">${I.minus}</button><button type="button" data-c="in" aria-label="${t("zoomIn")}" title="${t("zoomIn")}">${I.plus}</button>`
    }
    if (ctlEl) ctlEl.addEventListener("click", e => {
      const b = e.target.closest("button[data-c]");
      if (!b) return;
      ({
        world: api.world,
        fit: api.fit,
        out: () => api.zoom(-1),
        in: () => api.zoom(1)
      })[b.dataset.c]()
    });
    /* lifecycle */
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(es => {
      inViewport = es[0].isIntersecting;
      visible = inViewport && !document.hidden;
      wake()
    });
    io.observe(el);
    const onVis = () => {
      visible = inViewport && !document.hidden;
      wake()
    };
    document.addEventListener("visibilitychange", onVis);
    cvg.addEventListener("webglcontextlost", e => {
      e.preventDefault();
      G = null
    });
    cvg.addEventListener("webglcontextrestored", () => {
      G = createGL(cvg, homeGi);
      camKey = '';
      wake()
    });
    const api = {
      select(id, cityId) {
        if (!byId.has(id)) return;
        const changed = id !== S.sel || (cityId || null) !== (S.city || null);
        S.sel = id;
        S.city = cityId || null;
        if (changed) {
          renderPins();
          V.user = false;
          animateTo(target(), 900)
        }
      },
      setStatus(s) {
        if (s === S.status) return;
        S.status = s;
        if (s === "connecting") S.raceAt = performance.now();
        renderPins();
        wake()
      },
      setLang(l) {
        S.lang = l;
        el.dir = l === "fa" ? "rtl" : "ltr";
        el.setAttribute("aria-label", t("map"));
        renderPins();
        renderControls()
      },
      fit() {
        V.user = false;
        animateTo(target(), 1000)
      },
      view(k, dl) {
        V.user = true;
        const tg = target();
        const R = k === "fit" ? clamp(tg.R, V.base * 1.5, V.base * 2.05) : V.base * (k || 1);
        animateTo({
          lon: tg.lon,
          lat: clamp(tg.lat - (dl || 0), -25, 55),
          R
        }, 1400)
      },
      intro() {
        const tg = target(),
          la = clamp(tg.lat, -20, 35);
        V.user = true;
        V.anim = null;
        V.R = V.base * .55;
        V.lon = tg.lon + 70;
        V.lat = la;
        animateTo({
          lon: tg.lon,
          lat: la,
          R: V.base
        }, 1900)
      },
      setNet(v) {
        v = !!v;
        if (!!o.net === v) return;
        o.net = v;
        el.classList.toggle("zl-static", v || !o.interactive);
        V.anim = null;
        resize();
        renderPins();
        if (!v) animateTo(target(), 900);
        wake()
      },
      world() {
        V.user = true;
        const tg = target();
        animateTo({
          lon: tg.lon,
          lat: clamp(tg.lat, -20, 35),
          R: V.base
        }, 1000)
      },
      zoom(d) {
        V.user = true;
        animateTo({
          lon: V.lon,
          lat: V.lat,
          R: clamp(V.R * (d > 0 ? 1.5 : 1 / 1.5), V.base * .85, V.base * 9)
        }, 350)
      },
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        MAPS.delete(api);
        el.innerHTML = "";
        el.classList.remove("zlmap")
      },
      _flagDirty() {
        flagDirty = true;
        wake()
      }
    };
    MAPS.add(api);
    api.setLang(S.lang);
    renderPins();
    resize();
    return api
  }
  window.ZeroLagMap = {
    mount,
    countryIndex,
    routesFor,
    msr
  };
})();
};
export {};
