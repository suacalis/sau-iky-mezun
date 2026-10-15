/* İstatistik sayfalarında ortak kullanılan bileşenler */
(function(){
  "use strict";
  const V = MEZUN;

  // Il tablosu: veri {il:[K,E]}, sırala: "T"|"K"|"E"
  window.ilTablosu = function(kap, veri, sirala="T", dagilim=false){
    const r = Object.entries(veri).map(([il,[k,e]])=>({il,K:k,E:e,T:k+e})).sort((a,b)=>b[sirala]-a[sirala]||b.T-a.T);
    const top = r.reduce((a,x)=>a+x.T,0);
    kap.innerHTML = `<div class="tablo-sar"><table>
      <thead><tr><th>#</th><th>İl</th><th class="sag"><span class="ke"><span class="k">K</span></span> Kadın</th><th class="sag"><span class="ke"><span class="e">E</span></span> Erkek</th><th class="sag">Toplam</th><th class="sag">Pay</th>${dagilim?"<th>Dağılım</th>":""}</tr></thead>
      <tbody>${r.map((x,i)=>`<tr><td>${i+1}</td><td>${x.il}</td><td class="sag">${F.n(x.K)}</td><td class="sag">${F.n(x.E)}</td><td class="sag"><b>${F.n(x.T)}</b></td><td class="sag">${F.yuzde(x.T,top)}</td>${dagilim?`<td>${F.cubuk(x.K,x.E)}</td>`:""}</tr>`).join("")}</tbody>
    </table></div>`;
  };

  // Birim tablosu (program satırları)
  function programTablosu(b, grupToplam){
    const sat = b.programlar.map(p=>{ let K=0,E=0; Object.values(p.yillar).forEach(([k,e])=>{K+=k;E+=e;}); return {ad:p.ad,tur:p.tur,K,E,T:K+E}; })
      .sort((a,c)=>c.T-a.T);
    const BK=sat.reduce((a,x)=>a+x.K,0), BE=sat.reduce((a,x)=>a+x.E,0), BT=BK+BE;
    return {BK,BE,BT, html:`<div class="tablo-sar" style="max-height:none"><table>
      <thead><tr><th>Bölüm/Program</th><th class="sag">Kadın</th><th class="sag">Erkek</th><th class="sag">Toplam</th><th class="sag">Pay</th><th>Cinsiyet</th></tr></thead>
      <tbody>${sat.map(x=>`<tr><td><b>${F.esc(x.ad)}</b> <span class="soluk" style="font-size:12px">${x.tur}</span></td><td class="sag">${F.n(x.K)}</td><td class="sag">${F.n(x.E)}</td><td class="sag"><b>${F.n(x.T)}</b></td><td class="sag">${F.yuzde(x.T,BT)}</td><td>${F.cubuk(x.K,x.E)}</td></tr>`).join("")}
      <tr class="toplam"><td>TOPLAM</td><td class="sag">${F.n(BK)}</td><td class="sag">${F.n(BE)}</td><td class="sag">${F.n(BT)}</td><td class="sag">${F.yuzde(BT,grupToplam)}</td><td>${F.cubuk(BK,BE)}</td></tr></tbody></table></div>`};
  }

  // Grup > birim akordeonu. secenek.yillik: "Yıllara göre" bağlantısı göster
  window.birimAkordeon = function(kap, secenek={}){
    const html = V.gruplar().map(g=>{
      const birimler = V.birimler.filter(b=>b.grup===g);
      const gt = V.toplam({grup:g});
      const kartlar = birimler.map(b=>({b, ...programTablosu(b, gt.T)})).sort((a,c)=>c.BT-a.BT);
      return `<section class="bolum" style="margin-top:22px" id="grup-${F.kebap(g).replace(/\s+/g,'-')}">
        <div class="arac-satiri"><h3>${g} <span class="soluk" style="font-weight:500;font-size:14px">· ${birimler.length} birim</span></h3>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="ke"><span class="k">K ${F.n(gt.K)}</span> · <span class="e">E ${F.n(gt.E)}</span></span> <b>${F.n(gt.T)}</b>
          <button class="btn btn-cizgi" type="button" style="padding:6px 10px;font-size:13px" onclick="this.closest('section').querySelectorAll('details').forEach(d=>d.open=!this.dataset.a);this.dataset.a=this.dataset.a?'':'1';this.textContent=this.dataset.a?'Tümünü Kapat':'Tümünü Aç'">Tümünü Aç</button></div></div>
        ${kartlar.map(k=>`<details class="birim"><summary><span class="ad">${F.esc(k.b.ad)}</span>
            <span class="ke"><span class="k">K ${F.n(k.BK)}</span> · <span class="e">E ${F.n(k.BE)}</span></span>
            <b style="min-width:70px;text-align:right">${F.n(k.BT)}</b><span class="soluk" style="min-width:52px;text-align:right">${F.yuzde(k.BT,gt.T)}</span>
            ${secenek.yillik?`<a href="#yillik" onclick="event.stopPropagation();birimSec&&birimSec('${k.b.ad.replace(/'/g,"\\'")}')" style="font-size:13px">Yıllara göre</a>`:""}</summary>
          <div class="icerik">${k.html}</div></details>`).join("")}
      </section>`;
    }).join("");
    kap.innerHTML = html;
  };

  // Grafik yeniden çizim yardımcısı
  const grafikler = {};
  window.grafik = function(id, ayar){
    if(grafikler[id]) grafikler[id].destroy();
    grafikler[id] = new Chart(document.getElementById(id), ayar);
    return grafikler[id];
  };
})();
