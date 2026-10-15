/*
  Lisans Mezunları İzleme Anketi (Sürüm 2) — yanıt kodlama
  ------------------------------------------------------------
  Word formundaki "Ek A — Araştırmacı İçin Kodlama Kılavuzu" kurallarını uygular:
   • panelSatiri(): Mezun Takip Paneli'nin 22 sütunlu veri şablonu (Ek A1)
   • ekDegiskenler(): HESA Graduate Outcomes uyarlaması ek değişkenler (Ek A2)
  E-posta ve kimlik bilgisi hiçbir çıktıya yazılmaz; mezun_id takma ad kodudur.
*/
(function(){
  "use strict";
  const PANEL_SUTUNLARI = ["mezun_id","mezuniyet_yili","cinsiyet","ogretim_turu","gano","mezuniyet_oncesi_deneyim","lisansustu","durum",
    "ilk_is_suresi_ay","son_calisma_ay","issiz_kayit_ay","isveren_sayisi","isyeri","sektor","pozisyon","alanla_ilgili","sozlesme_turu",
    "isyeri_il","enlem","boylam","ikamet_il","son_ay_brut_ucret"];

  // S17 seçenekleri → paneldeki sektör adları
  const SEKTOR = ["Otomotiv","İmalat","Tekstil","Gıda","Enerji","Bankacılık / Finans","Bilişim","Perakende","Lojistik",
    "Danışmanlık / İK Hizmetleri","Kamu","Eğitim","Sağlık","Turizm"];
  // S25 aralık orta noktaları (uçlar 25.000 / 110.000 ₺ — Ek A)
  const ARALIK = {"30.000 ₺ altı":25000,"30.000 – 39.999 ₺":35000,"40.000 – 49.999 ₺":45000,"50.000 – 64.999 ₺":57500,
    "65.000 – 79.999 ₺":72500,"80.000 – 99.999 ₺":90000,"100.000 ₺ ve üzeri":110000};
  // Net → brüt kaba katsayı. Ek A "net ise brütleştirilir" der; gerçek uygulamada güncel bordro parametreleriyle hesaplanmalıdır.
  const NET_BRUT_ORANI = 0.71;
  const SOZ_GO = ["Belirsiz süreli iş sözleşmesi","Belirli süreli sözleşme – 12 ay ya da daha uzun","Belirli süreli sözleşme – 12 aydan kısa",
    "Geçici / mevsimlik iş","Çağrı üzerine çalışma","Ücretli staj / işbaşı eğitim programı","Kamu kadrosu","Bağ-Kur (4/b)","Sigortasız","Diğer / bilmiyorum"];

  const sayi = v => { if(v===""||v==null) return null; const x = parseFloat(String(v).replace(/\./g,"").replace(",",".")); return isFinite(x) ? x : null; };
  const ondalik = v => { if(v===""||v==null) return null; const x = parseFloat(String(v).replace(",",".")); return isFinite(x) ? x : null; };
  const dizi = v => Array.isArray(v) ? v.map(Number) : [];
  const evetHayir = v => v==="1" ? "Evet" : v==="2" ? "Hayır" : "";

  function takmaAd(no){ let h=2166136261; for(const c of "sau-iky-anket|"+String(no)){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); } return "A"+(h>>>0).toString(16).toUpperCase().padStart(8,"0"); }
  function aySayisi(y1,a1,y2,a2){ return (y2-y1)*12 + (a2-a1); }

  function durum(v){
    const s6 = dizi(v.s6);
    if(!s6.length) return "";
    if(s6.includes(1)) return "Ücretli çalışan";
    if(s6.some(i=>i>=2&&i<=4)) return "Kendi hesabına";
    if(s6.includes(6) && lisansustu(v)==="Evet") return "Lisansüstü öğrenci";
    if(s6.includes(11)) return "Kayıtlı işsiz";
    return "İşgücü dışı";
  }
  function lisansustu(v){ return (["1","2"].includes(v.s35) && ["1","2","3"].includes(v.s36)) ? "Evet" : "Hayır"; }
  function sozlesme(v){
    const s = +v.s23;
    if(!s) return v.s22==="2" ? "Kısmi süreli" : "";
    if(s===7) return "Kamu kadrosu";
    if(s===8) return "Bağ-Kur (4/b)";
    if(s===9) return "Kayıt dışı";
    if(s===10) return "";
    if(s===5 || v.s22==="2") return "Kısmi süreli";
    return s===1 ? "Belirsiz süreli" : "Belirli süreli";
  }
  function ucret(v){
    if(v.s25pb && v.s25pb!=="TL" && sayi(v.s25tutar)!=null) return ""; // TL dışı: TCMB kuruyla araştırmacı çevirir
    const t = sayi(v.s25tutar);
    if(t!=null && t>0) return Math.round((v.s25net ? t/NET_BRUT_ORANI : t)/50)*50;
    return ARALIK[v.s25aralik] ?? "";
  }

  function panelSatiri(v, oturum){
    const gy = +v.s1yil || +(oturum&&oturum.yil) || "", ga = +v.s1ay || 6;
    const d = durum(v), calisiyor = d==="Ücretli çalışan" || d==="Kendi hesabına", calisti = v.s9==="1";
    let ilk = "";
    if(calisti){
      if(v.s10devam) ilk = 0;
      else if(+v.s10yil){ ilk = Math.max(0, aySayisi(gy, ga, +v.s10yil, +v.s10ay || 6)); }
    }
    let son = "";
    if(calisti && !calisiyor && +v.s12yil) son = Math.max(0, aySayisi(gy, ga, +v.s12yil, +v.s12ay || 6));
    const s17 = +v.s17;
    return {
      mezun_id: takmaAd(oturum ? oturum.no : ""),
      mezuniyet_yili: gy,
      cinsiyet: v.s4==="1" ? "Kadın" : v.s4==="2" ? "Erkek" : "Belirtilmemiş",
      ogretim_turu: v.s2==="1" ? "I. Öğretim" : v.s2==="2" ? "II. Öğretim" : "",
      gano: ondalik(v.s3) ?? "",
      mezuniyet_oncesi_deneyim: evetHayir(v.s5),
      lisansustu: lisansustu(v),
      durum: d,
      ilk_is_suresi_ay: ilk,
      son_calisma_ay: son,
      issiz_kayit_ay: sayi(v.s13) ?? 0,
      isveren_sayisi: v.s9==="2" ? 0 : (+v.s11 || ""),
      isyeri: calisti ? (v.s15 || v.s31ad || "") : "",
      sektor: calisti ? (s17>=1&&s17<=14 ? SEKTOR[s17-1] : s17===15 ? (v.s17diger||"Diğer") : "") : "",
      pozisyon: calisti ? (v.s18||"") : "",
      alanla_ilgili: calisti && v.s20 ? (v.s20==="1" ? "Evet" : "Hayır") : "",
      sozlesme_turu: calisti ? sozlesme(v) : "",
      isyeri_il: calisti && !v.s24yd ? (v.s24il||"") : "",
      enlem: "", boylam: "",
      ikamet_il: v.s40ulke ? "" : (v.s40il||""),
      son_ay_brut_ucret: calisti ? ucret(v) : ""
    };
  }

  function ekDegiskenler(v, oturum){
    const s6 = dizi(v.s6), e = {mezun_id: takmaAd(oturum ? oturum.no : "")};
    for(let i=1;i<=13;i++) e["faaliyet_"+i] = s6.includes(i) ? 1 : 0;
    e.faaliyet_diger = v.s6diger || "";
    e.ana_faaliyet = v.s7 || (s6.length===1 ? s6[0] : "");
    const s8 = dizi(v.s8); e.baslayacak = s8.includes(3) ? "Yok" : [s8.includes(1)?"İş":"", s8.includes(2)?"Eğitim":""].filter(Boolean).join("+");
    e.coklu_is = v.s14==="2" ? 1 : v.s14==="1" ? 0 : "";
    e.yonetici = v.s21==="1" ? 1 : v.s21==="2" ? 0 : "";
    e.calisma_yogunlugu = v.s22==="1" ? "Tam" : v.s22==="2" ? "Yarı" : "";
    e.sozlesme_go = +v.s23 ? SOZ_GO[+v.s23-1] : "";
    e.isyeri_ilce = v.s24ilce || ""; e.isyeri_ulke = v.s24yd ? (v.s24ulke||"") : "Türkiye";
    e.ucret_para_birimi = v.s25pb || ""; e.ucret_net_beyan = v.s25net ? 1 : 0; e.ucret_aralik = v.s25aralik || "";
    const k = sayi(v.s26deger); e.kidem_ay = k==null ? "" : (v.s26tip==="yil" ? Math.round(k*12) : Math.round(k));
    e.diploma_gerekliligi = v.s27 || "";
    e.lisans_duzeyi_is = ["1","2","3","4"].includes(v.s27) ? 1 : v.s27==="5" ? 0 : "";
    e.is_nedenleri = dizi(v.s28).join(","); e.is_ana_neden = v.s29 || (dizi(v.s28).length===1 ? dizi(v.s28)[0] : "");
    e.is_bulma_kanali = dizi(v.s30).join(",");
    e.girisim_ad = v.s31ad || ""; e.girisim_faaliyet = v.s31faaliyet || "";
    e.girisim_calisan = v.s32==="1" ? 0 : v.s32==="2" ? (sayi(v.s32sayi) ?? "") : "";
    e.girisim_nedeni = dizi(v.s33).join(","); e.girisim_ana_neden = v.s33ana || ""; e.girisim_finansman = dizi(v.s34).join(",");
    e.ogrenim_durumu = v.s35 || ""; e.ogrenim_nitelik = v.s36 || ""; e.ogrenim_yogunlugu = v.s37 || "";
    e.ogrenim_kurumu = v.s38kurum || ""; e.ogrenim_ulke = v.s38kurum ? (v.s38ulke||"") : ""; e.ogrenim_alani = v.s39 || "";
    e.ikamet_ulke = v.s40ulke || "Türkiye";
    e.plana_uygunluk = v.h_1 || ""; e.anlamlilik = v.h_2 || ""; e.ogrenileni_kullanma = v.h_3 || "";   // 1 = K. katılıyorum … 5 = K. katılmıyorum
    e.yasam_doyumu = v.s41 ?? ""; e.anlam_deger = v.s42 ?? ""; e.mutluluk_dun = v.s43 ?? ""; e.kaygi_dun = v.s44 ?? "";
    e.nps = v.s45 ?? ""; e.nps_gerekce = v.s46 || "";
    for(let i=1;i<=4;i++) e["yeniden_tercih_"+i] = v["s47_"+i] || "";
    e.program_hazirlik = v.s48 || ""; e.acik_uclu = v.s49 || "";
    e.kariyer_destegi = evetHayir(v.s50); e.arastirma_daveti = evetHayir(v.s51); e.takip_izni = evetHayir(v.s52);
    e.izleme_dalgasi = v._dalga || ""; e.referans_haftasi = v._refHafta || "";
    return e;
  }

  window.ANKET_KOD = {PANEL_SUTUNLARI, panelSatiri, ekDegiskenler, takmaAd, NET_BRUT_ORANI};
})();
