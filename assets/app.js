/* SAÜ Mezun Bilgi Sistemi — ortak şablon ve yardımcılar */
(function(){
  "use strict";
  const SITE = {
    kurum: "Sakarya Üniversitesi",
    birimAd: "İşletme Fakültesi · İnsan Kaynakları Yönetimi Bölümü",
    sistem: "İKY Mezun Bilgi Sistemi",
    anaSite: "https://www.sakarya.edu.tr",
    logo: null, // örn. "assets/logo.png" — kurumsal logoyu ekleyip yolunu yazın
    birim: "Bilgi İşlem Daire Başkanlığı",
    diplomaTalep: "https://ogrisl.sakarya.edu.tr/",
    sosyal: [
      ["Instagram","https://www.instagram.com/sakaryauni/","M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2ZM17 6a1.1 1.1 0 1 1-2.2 0A1.1 1.1 0 0 1 17 6ZM12 2c-2.7 0-3.1 0-4.1.1-3 .1-4.7 1.8-4.8 4.8C3 7.9 3 8.3 3 12s0 4.1.1 5.1c.1 3 1.8 4.7 4.8 4.8 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c3-.1 4.7-1.8 4.8-4.8.1-1 .1-1.4.1-5.1s0-4.1-.1-5.1c-.1-3-1.8-4.7-4.8-4.8C15.1 2 14.7 2 12 2Zm0 1.6c2.7 0 3 0 4 .1 2.2.1 3.2 1.1 3.3 3.3.1 1 .1 1.3.1 5s0 4-.1 5c-.1 2.2-1.1 3.2-3.3 3.3-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.2-.1-3.2-1.1-3.3-3.3-.1-1-.1-1.3-.1-5s0-4 .1-5c.1-2.2 1.1-3.2 3.3-3.3 1-.1 1.3-.1 4-.1Z"],
      ["Facebook","https://www.facebook.com/sakaryauni","M14 8h3V4h-3c-2.8 0-4 1.8-4 4.4V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z"],
      ["X","https://x.com/sakaryauni","M17.7 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.7 3Zm-1.1 16.2h1.7L7.5 4.7H5.7l10.9 14.5Z"],
      ["YouTube","https://www.youtube.com/@sakaryauni","M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z"],
      ["LinkedIn","https://www.linkedin.com/school/sakaryauni/","M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z"]
    ]
  };
  window.SITE = SITE;

  const sayfa = document.body.dataset.sayfa || "";
  const ak = s => sayfa===s ? ' class="aktif"' : "";

  const ust = `
  ${window.MEZUN && MEZUN.ornek ? '<div class="ornek-serit">Bu bir prototiptir — gösterilen sayılar ve içerikler <b>örnek (sentetik) veridir</b>. Gerçek veriyle çalıştırmak için README.md dosyasına bakın.</div>' : ''}
  <header class="ust"><div class="kap">
    <a class="marka" href="index.html" aria-label="${SITE.sistem} anasayfa">
      <span class="amblem">${SITE.logo ? `<img src="${SITE.logo}" alt="${SITE.kurum}">` : "SAÜ"}</span>
      <span><b>${SITE.sistem}</b><small>${SITE.kurum} · ${SITE.birimAd}</small></span>
    </a>
    <nav class="sosyal" aria-label="Sosyal medya">${SITE.sosyal.map(([ad,u,d])=>`<a href="${u}" target="_blank" rel="noopener" title="${ad}" aria-label="${ad}"><svg viewBox="0 0 24 24"><path d="${d}"/></svg></a>`).join("")}</nav>
  </div></header>
  <nav class="menu" id="menu" aria-label="Ana menü"><div class="kap">
    <button class="btn btn-cizgi hamburger" type="button" onclick="document.getElementById('menu').classList.toggle('acik')" aria-label="Menüyü aç">☰ Menü</button>
    <div class="ogeler">
      <a href="index.html"${ak("anasayfa")}>Anasayfa</a>
      <div class="acilir"><button type="button"${["istatistik","il","birim","sonuc","yontem","takip"].includes(sayfa)?' class="aktif" style="color:var(--mavi);background:var(--mavi-acik)"':''}>Mezun İstatistikleri ▾</button>
        <div class="liste">
          <a href="istatistikler.html"${ak("istatistik")}>Genel İstatistikler</a>
          <a href="takip.html"${ak("takip")}>Mezun Takip Paneli</a>
          <a href="sonuclar.html"${ak("sonuc")}>Mezuniyet Sonrası Sonuçlar</a>
          <a href="il-dagilimi.html"${ak("il")}>İl Dağılımı</a>
          <a href="birim-bazli.html"${ak("birim")}>Program Bazlı</a>
          <a href="yontem.html"${ak("yontem")}>Yöntem ve Tanımlar</a>
        </div>
      </div>
      <a href="kose.html"${ak("kose")}>Mezun Köşesi</a>
      <a href="vitrin.html"${ak("vitrin")}>Mezun Vitrini</a>
      <a href="duyurular.html"${ak("duyurular")}>Duyurular</a>
      <div class="acilir" style="margin-left:auto"><button type="button" class="giris-btn" style="background:var(--lacivert);color:#fff">Mezun Girişi ▾</button>
        <div class="liste" style="right:0;left:auto">
          <a href="giris.html"${ak("giris")}>Mezun Girişi</a>
          <a href="yonetici-giris.html"${ak("yonetici")}>Yönetici Girişi</a>
        </div>
      </div>
    </div>
  </div></nav>`;

  const alt = `
  <footer class="alt-bilgi"><div class="kap">
    <div><h4>${SITE.kurum}<br>${SITE.birimAd}</h4>
      <p style="margin:0">Mezunlarımızın hikâyeleri, duyurular ve mezunlara özel hizmetler bir arada.</p></div>
    <div><h4>Portal</h4><ul>
      <li><a href="kose.html">Mezun Köşesi</a></li><li><a href="vitrin.html">Mezun Vitrini</a></li><li><a href="duyurular.html">Duyurular</a></li></ul></div>
    <div><h4>İstatistikler</h4><ul>
      <li><a href="istatistikler.html">Genel İstatistikler</a></li><li><a href="il-dagilimi.html">İl Dağılımı</a></li><li><a href="takip.html">Mezun Takip Paneli</a></li><li><a href="sonuclar.html">Mezuniyet Sonrası Sonuçlar</a></li><li><a href="birim-bazli.html">Program Bazlı</a></li><li><a href="yontem.html">Yöntem ve Tanımlar</a></li></ul></div>
    <div><h4>Bağlantılar</h4><ul>
      <li><a href="${SITE.anaSite}" target="_blank" rel="noopener">sakarya.edu.tr</a></li>
      <li><a href="https://sabis.sakarya.edu.tr/" target="_blank" rel="noopener">SABİS</a></li>
      <li><a href="https://islf.sakarya.edu.tr/" target="_blank" rel="noopener">İşletme Fakültesi</a></li>
      <li><a href="belgeler/SAU_IKY_Mezun_Izleme_Anketi_v2.docx" download>İzleme anketi (Word)</a></li>
      <li><a href="giris.html">Mezun Girişi</a></li><li><a href="kvkk.html">KVKK Aydınlatma Metni</a></li></ul></div>
    <div class="telif">© ${new Date().getFullYear()} ${SITE.kurum} · ${SITE.birimAd}</div>
  </div></footer>
  <div class="ipucu-kutu" id="ipucu"></div>`;

  document.body.insertAdjacentHTML("afterbegin", ust);
  document.body.insertAdjacentHTML("beforeend", alt);

  // ---- Yardımcılar ----
  const nf = new Intl.NumberFormat("tr-TR");
  window.F = {
    n: x => nf.format(x||0),
    yuzde: (a,b,h=1) => b ? "%" + (a/b*100).toLocaleString("tr-TR",{maximumFractionDigits:h,minimumFractionDigits:0}) : "%0",
    tarih: s => { const d=new Date(s); return d.toLocaleDateString("tr-TR",{day:"2-digit",month:"2-digit",year:"numeric"}); },
    esc: s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),
    turAd: t => ({Yazi:"Yazı",BasariHikayesi:"Başarı Hikâyesi",Etkinlik:"Etkinlik",IsIlani:"İş İlanı"})[t]||t,
    turRenk: t => ({Yazi:"",BasariHikayesi:"yesil",Etkinlik:"mor",IsIlani:"amber"})[t]||"",
    bas: ad => (ad||"?").split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0]).join("").toLocaleUpperCase("tr-TR"),
    kebap: s => s.toLocaleLowerCase("tr-TR"),
    cubuk: (k,e) => { const t=k+e||1; return `<div class="cubuk" title="Kadın ${F.yuzde(k,t)} · Erkek ${F.yuzde(e,t)}"><i class="k" style="width:${k/t*100}%"></i><i class="e" style="width:${e/t*100}%"></i></div>`; },
    param: k => new URLSearchParams(location.search).get(k),
    // Satır dizisini (başlıklar + satırlar) Excel uyumlu CSV olarak indirir
    csvIndir(dosya, basliklar, satirlar){
      const q = v => { const t = v==null ? "" : String(v); return /[;"\n]/.test(t) ? '"'+t.replace(/"/g,'""')+'"' : t; };
      const metin = "\ufeff" + [basliklar, ...satirlar].map(r=>r.map(q).join(";")).join("\r\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([metin],{type:"text/csv;charset=utf-8"}));
      a.download = dosya; document.body.appendChild(a); a.click();
      setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },
    oran: (x,h=0) => x==null||isNaN(x) ? "—" : "%"+(x*100).toLocaleString("tr-TR",{maximumFractionDigits:h})
  };

  window.RENK = { kadin:"#c2477e", erkek:"#2b6cb0", mavi:"#1f6fd1", lacivert:"#0b2c5f", turkuaz:"#0e9f9a", amber:"#e3a21a",
    seri:["#1f6fd1","#0e9f9a","#e3a21a","#7a5cd6","#d1495b","#3a9d3a","#0b2c5f","#b86b25"] };

  // İpucu
  const ip = () => document.getElementById("ipucu");
  window.IPUCU = {
    goster(e,html){ const k=ip(); k.innerHTML=html; k.style.display="block"; k.style.left=(e.clientX+14)+"px"; k.style.top=(e.clientY+14)+"px"; },
    gizle(){ ip().style.display="none"; }
  };

  // Chart.js varsayılanları
  if(window.Chart){
    Chart.defaults.font.family = '"Plus Jakarta Sans",system-ui,sans-serif';
    Chart.defaults.color = "#5d6b80";
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.plugins.tooltip.callbacks.label = c => ` ${c.dataset.label||c.label}: ${F.n(typeof c.raw==="number"?c.raw:(c.raw&&c.raw.y))}`;
  }

  // Sekme grubu yardımcısı
  window.sekmeBagla = function(kok, cb){
    kok.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
      kok.querySelectorAll("button").forEach(x=>x.classList.toggle("aktif",x===b)); cb(b.dataset.d);
    }));
  };

  // Ortak kart bileşenleri
  window.KART = {
    icerik(x, gorsel=true){
      const yazar = `<b>${F.esc(x.yazar)}</b>${x.program&&x.program!=="—"?" · "+F.esc(x.program):""}${x.yil?" · "+x.yil:""}`;
      return `<article class="kart icerik-kart">
        ${gorsel?`<a class="gorsel" href="kose-detay.html?id=${x.id}" aria-hidden="true" tabindex="-1">${F.bas(x.baslik)}</a>`:""}
        <div class="ic"><span><span class="rozet ${F.turRenk(x.tur)}">${F.turAd(x.tur)}</span></span>
          <h3><a href="kose-detay.html?id=${x.id}">${F.esc(x.baslik)}</a></h3>
          <p>${F.esc(x.ozet)}</p>
          <div class="yazar">${yazar}</div></div></article>`;
    },
    duyuru(d){
      return `<article class="kart duyuru">
        <div class="tarih">${d.yeni?'<span class="rozet yesil">Yeni</span> ':""}${F.tarih(d.tarih)}</div>
        <h3>${F.esc(d.baslik)}</h3>${d.govde.map(p=>`<p>${F.esc(p)}</p>`).join("")}</article>`;
    },
    stat(etiket,sayi,alt,sinif="",renk){
      return `<div class="kart stat ${sinif}">${renk?`<div class="serit-ust" style="background:${renk}"></div>`:""}
        <span class="ust-etiket">${etiket}</span><span class="sayi">${sayi}</span><span class="alt">${alt}</span></div>`;
    }
  };

  // Oturum (prototip: sessionStorage)
  window.OTURUM = {
    al(){ try{ return JSON.parse(sessionStorage.getItem("sau_mezun_oturum")||"null"); }catch(e){ return null; } },
    kur(v){ try{ sessionStorage.setItem("sau_mezun_oturum", JSON.stringify(v)); }catch(e){} },
    sil(){ try{ sessionStorage.removeItem("sau_mezun_oturum"); }catch(e){} }
  };
})();
