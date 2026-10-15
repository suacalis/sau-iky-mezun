/* Türkiye il kabarcık haritası (bağımlılıksız SVG). Taban çizim yaklaşık ana hattır. */
(function(){
  "use strict";
  const BAT=25.6, DOG=45.0, GUN=35.7, KUZ=42.25, KOS=Math.cos(39*Math.PI/180);
  const W=1000, H=Math.round(W*(KUZ-GUN)/((DOG-BAT)*KOS));
  const px = (la,lo) => [ (lo-BAT)/(DOG-BAT)*W, (KUZ-la)/(KUZ-GUN)*H ];
  const TRAKYA=[[26.03,40.62],[26.6,40.6],[27.3,40.95],[28.0,41.0],[28.98,41.02],[29.05,41.2],[28.6,41.55],[28.0,41.95],[27.5,42.05],[27.05,42.1],[26.55,41.9],[26.35,41.7],[26.6,41.35],[26.33,41.25]];
  const ANADOLU=[[29.1,41.2],[30.0,41.15],[30.8,41.1],[31.4,41.3],[32.2,41.65],[33.3,42.0],[34.5,41.95],[35.2,42.03],[35.5,41.7],[36.2,41.4],[36.6,41.3],[37.5,41.1],[38.4,40.95],[39.5,41.05],[40.3,41.0],[41.0,41.2],[41.55,41.52],[42.5,41.45],[43.2,41.2],[43.6,40.95],[43.7,40.4],[44.2,40.1],[44.8,39.7],[44.4,39.4],[44.4,38.4],[44.3,37.9],[44.8,37.2],[44.2,37.1],[43.0,37.35],[42.4,37.15],[41.5,37.1],[40.2,37.15],[39.2,36.7],[38.2,36.85],[37.0,36.65],[36.65,36.85],[36.7,36.2],[36.15,35.85],[35.8,36.3],[36.2,36.65],[35.6,36.6],[34.6,36.8],[34.0,36.3],[33.0,36.1],[32.4,36.15],[31.3,36.8],[30.6,36.85],[30.4,36.25],[29.6,36.2],[29.1,36.6],[28.3,36.8],[27.6,36.7],[27.4,37.1],[27.2,37.4],[26.85,38.0],[26.3,38.25],[26.65,38.45],[26.8,38.75],[26.75,39.3],[26.1,39.45],[26.2,39.95],[26.7,40.35],[27.4,40.4],[28.0,40.38],[29.0,40.4],[29.4,40.75]];
  const yol = p => "M"+p.map(([lo,la])=>px(la,lo).map(v=>v.toFixed(1)).join(",")).join("L")+"Z";

  /**
   * kap: kapsayıcı öğe; veri: {ilAdı:[K,E]}; secenek: {etiketSayisi}
   */
  window.HARITA = function(kap, veri, secenek={}){
    const K = MEZUN.ilKoordinat;
    const satir = Object.entries(veri).map(([il,[k,e]])=>({il,k,e,t:k+e})).filter(r=>K[r.il]).sort((a,b)=>b.t-a.t);
    const maks = Math.max(1,...satir.map(r=>r.t)), top = satir.reduce((a,r)=>a+r.t,0);
    const etiketN = secenek.etiketSayisi ?? 10;
    const renk = t => { const a = 0.25 + 0.75*Math.sqrt(t/maks); return `rgba(31,111,209,${a.toFixed(2)})`; };
    const daireler = satir.slice().reverse().map(r=>{
      const [x,y] = px(...K[r.il]); const rr = 4 + 30*Math.sqrt(r.t/maks);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${renk(r.t)}" stroke="#fff" stroke-width="1.2" data-il="${r.il}"><title>${r.il}</title></circle>`;
    }).join("");
    const etiket = satir.slice(0,etiketN).map(r=>{
      const [x,y] = px(...K[r.il]);
      return `<text x="${x.toFixed(1)}" y="${(y+3.5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#0b2c5f" pointer-events="none" style="paint-order:stroke;stroke:#fff;stroke-width:3px">${r.il}</text>`;
    }).join("");
    kap.innerHTML = `<div class="harita-sar">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Türkiye il dağılımı haritası">
        <g class="kok"><path d="${yol(ANADOLU)}" fill="#e3eaf5" stroke="#c4d1e5"/><path d="${yol(TRAKYA)}" fill="#e3eaf5" stroke="#c4d1e5"/>${daireler}${etiket}</g>
      </svg>
      <div class="harita-araclar"><button type="button" data-z="1.4" aria-label="Yakınlaştır">+</button><button type="button" data-z="0.71" aria-label="Uzaklaştır">−</button><button type="button" data-z="0" aria-label="Sıfırla">⟲</button></div>
    </div><div class="soluk" style="font-size:12.5px;margin-top:6px">Butonlarla yakınlaştırın, sürükleyerek kaydırın, illerin üzerine gelin. Kabarcık alanı mezun sayısıyla orantılıdır.</div>`;
    const svg = kap.querySelector("svg");
    let vb = {x:0,y:0,w:W,h:H};
    const uygula = () => svg.setAttribute("viewBox",`${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    kap.querySelectorAll(".harita-araclar button").forEach(b=>b.onclick=()=>{
      const z=+b.dataset.z; if(!z){vb={x:0,y:0,w:W,h:H};return uygula();}
      const cx=vb.x+vb.w/2, cy=vb.y+vb.h/2; vb.w=Math.min(W,Math.max(W/8,vb.w/z)); vb.h=vb.w*H/W; vb.x=cx-vb.w/2; vb.y=cy-vb.h/2; uygula();
    });
    let surukle=null;
    svg.addEventListener("pointerdown",e=>{surukle={x:e.clientX,y:e.clientY,vx:vb.x,vy:vb.y}; svg.setPointerCapture(e.pointerId);});
    svg.addEventListener("pointermove",e=>{
      if(surukle){ const o=vb.w/svg.clientWidth; vb.x=surukle.vx-(e.clientX-surukle.x)*o; vb.y=surukle.vy-(e.clientY-surukle.y)*o; uygula(); return; }
      const il = e.target.dataset && e.target.dataset.il;
      if(il){ const r=satir.find(s=>s.il===il); IPUCU.goster(e,`<b>${il}</b><br>Toplam: ${F.n(r.t)} (${F.yuzde(r.t,top)})<br><span style="color:#ffb3d1">Kadın ${F.n(r.k)}</span> · <span style="color:#a9cdff">Erkek ${F.n(r.e)}</span>`); }
      else IPUCU.gizle();
    });
    svg.addEventListener("pointerup",()=>surukle=null);
    svg.addEventListener("pointerleave",()=>{surukle=null;IPUCU.gizle();});
    return satir;
  };
})();
