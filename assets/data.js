/*
  SAÜ İKY Mezun Bilgi Sistemi — veri katmanı
  ------------------------------------------------------------
  • window.MEZUN_VERI (assets/veri.js) doluysa onu kullanır.
  • Boşsa aşağıdaki ÖRNEK veri üreteciyle (sabit tohumlu, her açılışta aynı)
    İKY Bölümü lisans programları (I./II. öğretim) için SENTETİK sayılar üretir.
  Örnek sayılar gerçek değildir; yalnızca arayüzü göstermek içindir.
*/
(function(){
  "use strict";

  // ---- 81 il: [ad, enlem, boylam, nüfus(bin)] ----
  const ILLER = [
    ["Adana",37.00,35.32,2270],["Adıyaman",37.76,38.28,610],["Afyonkarahisar",38.76,30.54,750],["Ağrı",39.72,43.05,510],
    ["Amasya",40.65,35.83,340],["Ankara",39.93,32.86,5800],["Antalya",36.90,30.70,2700],["Artvin",41.18,41.82,170],
    ["Aydın",37.85,27.85,1160],["Balıkesir",39.65,27.88,1270],["Bilecik",40.14,29.98,230],["Bingöl",38.88,40.50,280],
    ["Bitlis",38.40,42.11,360],["Bolu",40.73,31.61,320],["Burdur",37.72,30.29,275],["Bursa",40.19,29.06,3200],
    ["Çanakkale",40.15,26.41,560],["Çankırı",40.60,33.61,200],["Çorum",40.55,34.95,525],["Denizli",37.78,29.09,1060],
    ["Diyarbakır",37.91,40.23,1820],["Edirne",41.68,26.56,415],["Elazığ",38.68,39.22,600],["Erzincan",39.75,39.49,240],
    ["Erzurum",39.90,41.27,750],["Eskişehir",39.78,30.52,920],["Gaziantep",37.07,37.38,2160],["Giresun",40.91,38.39,450],
    ["Gümüşhane",40.46,39.48,145],["Hakkari",37.58,43.74,290],["Hatay",36.40,36.35,1550],["Isparta",37.76,30.55,450],
    ["Mersin",36.80,34.64,1930],["İstanbul",41.01,28.98,15700],["İzmir",38.42,27.14,4480],["Kars",40.60,43.10,275],
    ["Kastamonu",41.38,33.78,380],["Kayseri",38.73,35.48,1450],["Kırklareli",41.73,27.22,370],["Kırşehir",39.15,34.16,245],
    ["Kocaeli",40.77,29.94,2100],["Konya",37.87,32.48,2320],["Kütahya",39.42,29.98,580],["Malatya",38.35,38.31,740],
    ["Manisa",38.61,27.43,1470],["Kahramanmaraş",37.58,36.94,1120],["Mardin",37.31,40.74,870],["Muğla",37.22,28.36,1050],
    ["Muş",38.75,41.50,400],["Nevşehir",38.62,34.71,310],["Niğde",37.97,34.68,370],["Ordu",40.98,37.88,770],
    ["Rize",41.02,40.52,350],["Sakarya",40.78,30.40,1110],["Samsun",41.29,36.33,1380],["Siirt",37.93,41.94,330],
    ["Sinop",42.03,35.15,225],["Sivas",39.75,37.02,640],["Tekirdağ",40.98,27.51,1170],["Tokat",40.31,36.55,600],
    ["Trabzon",41.00,39.72,820],["Tunceli",39.11,39.55,85],["Şanlıurfa",37.16,38.79,2200],["Uşak",38.68,29.41,375],
    ["Van",38.49,43.38,1130],["Yozgat",39.82,34.81,420],["Zonguldak",41.45,31.79,590],["Aksaray",38.37,34.03,440],
    ["Bayburt",40.26,40.23,85],["Karaman",37.18,33.22,260],["Kırıkkale",39.85,33.51,280],["Batman",37.88,41.13,640],
    ["Şırnak",37.52,42.46,560],["Bartın",41.63,32.34,205],["Ardahan",41.11,42.70,92],["Iğdır",39.92,44.04,205],
    ["Yalova",40.65,29.27,300],["Karabük",41.20,32.62,250],["Kilis",36.72,37.12,155],["Osmaniye",37.07,36.25,560],
    ["Düzce",40.84,31.16,410]
  ];

  // ---- Bölüm ve programlar ----
  // SAÜ İşletme Fakültesi · İnsan Kaynakları Yönetimi Bölümü (lisans; I. ve II. öğretim)
  // program: [ad, tür, başlangıç yılı, kadın oranı, (kullanılmıyor), kohort içindeki pay]
  const L="Lisans", OL="Ön Lisans", LU="Lisansüstü";
  const BIRIMLER = [
    {grup:"Lisans", ad:"İnsan Kaynakları Yönetimi Bölümü", p:[
      ["İnsan Kaynakları Yönetimi (I. Öğretim)",L,2014,.62,0,.55],
      ["İnsan Kaynakları Yönetimi (II. Öğretim)",L,2014,.60,0,.45]]}
  ];
  // Kohort (mezuniyet yılı) büyüklükleri — Mezun Takip Paneli demo verisiyle uyumlu; 2025-2026 tahmini
  const KOHORT_BOYUT = {2018:138,2019:146,2020:152,2021:160,2022:171,2023:165,2024:174,2025:170,2026:166};

  const ULKELER = [["Azerbaycan",9],["Türkmenistan",4],["Kazakistan",3],["Suriye",3],["Afganistan",2],["Kırgızistan",2],["Somali",1],["Bosna-Hersek",1]];

  // Sektörler — Mezun Takip Paneli ve izleme anketi (S17) ile aynı liste
  const SEKTORLER = [["Danışmanlık / İK Hizmetleri",15],["Otomotiv",13],["İmalat",12],["Bankacılık / Finans",10],["Perakende",9],["Lojistik",8],
    ["Kamu",7],["Bilişim",6],["Tekstil",5],["Gıda",5],["Sağlık",4],["Eğitim",3],["Enerji",2],["Turizm",1]];

  // ---- deterministik rastgele ----
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  const rnd = mulberry32(20261015);
  const gauss = () => (rnd()+rnd()+rnd()-1.5)/1.5;

  function orneKUret(){
    const GUNCEL = 2026;
    const birimler = BIRIMLER.map(b => ({grup:b.grup, ad:b.ad, programlar: b.p.map(([ad,tur,bas,kOran,olcek,pay]) => {
      const yillar = {};
            for(const y of Object.keys(KOHORT_BOYUT).map(Number)){
        let n = Math.round(KOHORT_BOYUT[y] * pay * (1 + gauss()*0.05));
        n = Math.max(0,n);
        const kp = Math.min(1,Math.max(0,kOran + gauss()*0.05));
        const k = Math.round(n*kp);
        yillar[y] = [k, n-k];
      }
      return {ad, tur: /Doktora/.test(ad) ? "Doktora" : tur, yillar};
    })}));

    // toplamlar
    let T=[0,0], G=[0,0];
    birimler.forEach(b=>b.programlar.forEach(p=>Object.entries(p.yillar).forEach(([y,[k,e]])=>{T[0]+=k;T[1]+=e; if(+y===GUNCEL){G[0]+=k;G[1]+=e;}})));

    // il dağılımı: nüfus ve Sakarya'ya uzaklık ağırlıklı (yalnızca örnek)
    const [_, sLat, sLon] = ILLER.find(i=>i[0]==="Sakarya");
    const agirlik = ILLER.map(([ad,la,lo,nf])=>{
      const d = Math.hypot((la-sLat)*111,(lo-sLon)*85);
      let w = Math.pow(nf,0.85)*Math.exp(-d/380);
      if(ad==="Sakarya") w*=7; if(ad==="Kocaeli"||ad==="Düzce"||ad==="Bilecik"||ad==="Bolu") w*=1.4;
      return w*(0.85+rnd()*0.3);
    });
    const ws = agirlik.reduce((a,b)=>a+b,0);
    const ilKapsam = 0.965; // ili kayıtlı mezun oranı
    const iller = {};
    ILLER.forEach(([ad],i)=>{
      const p = agirlik[i]/ws, kp = 0.5 + gauss()*0.04;
      const top = Math.round((T[0]+T[1])*ilKapsam*p), g = Math.round((G[0]+G[1])*ilKapsam*p);
      iller[ad] = [Math.round(top*kp), top-Math.round(top*kp), Math.round(g*kp), g-Math.round(g*kp)];
    });

    // uluslararası
    const tumProg = []; birimler.forEach(b=>b.programlar.forEach(p=>tumProg.push([b.ad,p.ad,p.tur,b.grup])));
    const uluslararasiToplam = Math.round((T[0]+T[1])*0.02);
    const uws = ULKELER.reduce((a,u)=>a+u[1],0);
    const ulkeler = ULKELER.map(([ulke,w])=>{
      const n = Math.max(1,Math.round(uluslararasiToplam*w/uws*(0.85+rnd()*0.3)));
      const kayit = {}; let K=0,E=0, tur={}; const buYil=[0,0];
      for(let i=0;i<n;i++){
        const pr = tumProg[Math.floor(Math.pow(rnd(),1.6)*tumProg.length)];
        const kad = rnd()<0.32;
        const key = pr[0]+"||"+pr[1];
        kayit[key] = kayit[key] || {birim:pr[0], program:pr[1], tur:pr[2], K:0, E:0};
        kad ? (kayit[key].K++,K++) : (kayit[key].E++,E++);
        tur[pr[2]] = tur[pr[2]]||[0,0]; tur[pr[2]][kad?0:1]++;
        if(rnd()<0.07) buYil[kad?0:1]++;
      }
      return {ulke, K, E, tur, buYil, programlar:Object.values(kayit).sort((a,b)=>(b.K+b.E)-(a.K+a.E))};
    }).sort((a,b)=>(b.K+b.E)-(a.K+a.E));

    const sektorBeyan = 418;
    const sws = SEKTORLER.reduce((a,s)=>a+s[1],0);
    const sektorler = SEKTORLER.map(([ad,w])=>[ad,Math.round(sektorBeyan*w/sws)]);

    return {ornek:true, guncellenme:"2026-10-15", guncelYil:GUNCEL, birimler, iller, ulkeler,
            sektorler, sektorBeyan: sektorler.reduce((a,s)=>a+s[1],0), kayitliMezun: 486};
  }

  const V = window.MEZUN_VERI || orneKUret();
  V.ornek = !window.MEZUN_VERI;
  V.ilKoordinat = Object.fromEntries(ILLER.map(([ad,la,lo])=>[ad,[la,lo]]));

  // ---- Türetilmiş yardımcılar ----
  V.toplam = function(filtre){ // filtre: {grup, birim, program, yil}
    let K=0,E=0;
    V.birimler.forEach(b=>{
      if(filtre&&filtre.grup&&b.grup!==filtre.grup) return;
      if(filtre&&filtre.birim&&b.ad!==filtre.birim) return;
      b.programlar.forEach(p=>{
        if(filtre&&filtre.program&&p.ad!==filtre.program) return;
        if(filtre&&filtre.tur&&p.tur!==filtre.tur) return;
        Object.entries(p.yillar).forEach(([y,[k,e]])=>{ if(filtre&&filtre.yil&&+y!==filtre.yil) return; K+=k;E+=e; });
      });
    });
    return {K,E,T:K+E};
  };
  V.yilSerisi = function(filtre){
    const m = {};
    V.birimler.forEach(b=>{
      if(filtre&&filtre.birim&&b.ad!==filtre.birim) return;
      b.programlar.forEach(p=>{
        if(filtre&&filtre.program&&p.ad!==filtre.program) return;
        Object.entries(p.yillar).forEach(([y,[k,e]])=>{ m[y]=m[y]||[0,0]; m[y][0]+=k; m[y][1]+=e; });
      });
    });
    return Object.keys(m).sort().map(y=>({yil:+y,K:m[y][0],E:m[y][1],T:m[y][0]+m[y][1]}));
  };
  V.gruplar = function(){ return [...new Set(V.birimler.map(b=>b.grup))]; };

  // ---- Avrupa karşılaştırılabilirliği: AYÇ/EQF düzeyi ve ISCED-F 2013 dar alan ----
  V.TURLER = ["Ön Lisans","Lisans","Lisansüstü","Doktora"];
  V.EQF = {"Ön Lisans":5, "Lisans":6, "Lisansüstü":7, "Doktora":8};
  V.ISCED = {
    "011":"Eğitim","021":"Sanat","022":"Beşerî bilimler","023":"Diller","031":"Sosyal ve davranış bilimleri",
    "032":"Gazetecilik ve enformasyon","041":"İşletme ve yönetim","042":"Hukuk","051":"Biyoloji ve ilgili bilimler",
    "053":"Fiziksel bilimler","054":"Matematik ve istatistik","061":"Bilişim ve iletişim teknolojileri",
    "071":"Mühendislik ve mühendislik meslekleri","072":"İmalat ve işleme","073":"Mimarlık ve inşaat",
    "091":"Sağlık","092":"Sosyal hizmetler","101":"Kişisel hizmetler (turizm vb.)","104":"Ulaştırma hizmetleri"
  };
  // Program adından ISCED-F 2013 dar alan kodu (yaklaşık eşleme — kurum kayıtlarındaki resmî kodla değiştirilmeli)
  const KURAL = [
    [/Öğretmenliği|Eğitimi$|Eğitim Yönetimi|Rehberlik|İlköğretim|Eğitimi \(/,"011"],
    [/Gıda/,"072"],[/İnşaat|Mimarlık|Yapı/,"073"],
    [/Bilgisayar|Yazılım|Bilişim|Programcılığı/,"061"],
    [/Mühendisliği|Elektrik|Makine|Metalurji/,"071"],
    [/Biyoloji/,"051"],[/Fizik$|Kimya|Fizik \(/,"053"],[/Matematik|Ekonometri/,"054"],
    [/Tıp|Diş|Hemşirelik|Ebelik|Fizyoterapi|Beslenme|Anestezi|Tıbbi|İlk ve Acil|Ağız|Anatomi|Fizyoloji/,"091"],
    [/Sosyal Hizmet/,"092"],[/Hukuk|Adalet/,"042"],
    [/Turizm/,"101"],[/Lojistik/,"104"],
    [/İşletme|Ticaret|Muhasebe|Maliye|İnsan Kaynakları|Yönetim Bilişim|Pazarlama|Finansman/,"041"],
    [/Gazetecilik|Halkla İlişkiler|Radyo/,"032"],
    [/Grafik|Resim|Seramik|Müzi|Halk Oyunları/,"021"],
    [/Türk Dili|Edebiyat/,"023"],[/İlahiyat|Tarih|Felsefe/,"022"],
    [/Çalışma Ekonomisi|İktisat|Siyaset|Kamu Yönetimi|Uluslararası İlişkiler|Sosyoloji|Psikoloji|Coğrafya|Orta Doğu/,"031"]
  ];
  V.isced = function(programAd){ const k = KURAL.find(([r])=>r.test(programAd)); return k ? k[1] : "031"; };
  V.birimler.forEach(b=>b.programlar.forEach(p=>{ p.isced = p.isced || V.isced(p.ad); p.eqf = p.eqf || V.EQF[p.tur]; }));

  // ---- Form listeleri ----
  V.ULKE_LISTESI = ["Türkiye","Almanya","Hollanda","Birleşik Krallık","Fransa","Belçika","Avusturya","İsviçre","İsveç","Norveç","Danimarka",
    "Finlandiya","İrlanda","İtalya","İspanya","Portekiz","Polonya","Çekya","Macaristan","Romanya","Bulgaristan","Yunanistan","KKTC",
    "Azerbaycan","Gürcistan","Kazakistan","Özbekistan","Türkmenistan","Kırgızistan","Rusya Federasyonu","Ukrayna","Bosna-Hersek","Kosova",
    "Kuzey Makedonya","Arnavutluk","ABD","Kanada","Avustralya","Japonya","Güney Kore","Çin","Katar","Birleşik Arap Emirlikleri",
    "Suudi Arabistan","Irak","İran","Suriye","Mısır","Libya","Somali","Sudan","Afganistan","Pakistan","Endonezya","Malezya","Diğer"];
  V.ISCO = [["1","Yöneticiler"],["2","Profesyonel meslek mensupları"],["3","Teknisyenler, teknikerler ve yardımcı profesyoneller"],
    ["4","Büro hizmetlerinde çalışanlar"],["5","Hizmet ve satış elemanları"],["6","Nitelikli tarım, ormancılık ve su ürünleri çalışanları"],
    ["7","Sanatkârlar ve ilgili işlerde çalışanlar"],["8","Tesis ve makine operatörleri ve montajcılar"],["9","Nitelik gerektirmeyen işlerde çalışanlar"],
    ["0","Silahlı kuvvetler mensupları"]];
  V.EGITIM_DUZEYI = ["Okuma yazma bilmiyor / okul bitirmedi","İlkokul","Ortaokul / ilköğretim","Lise","Ön lisans","Lisans","Yüksek lisans / doktora","Bilmiyorum / belirtmek istemiyorum"];

  // ---- Mezun izleme sonuçları (1. ve 5. yıl kohortları) ----
  // Gerçek veride: window.MEZUN_VERI.sonuclar (araclar/veri_donustur.py --anket ile üretilir)
  V.KUCUK_HUCRE = (V.sonuclarMeta && V.sonuclarMeta.esik) || 10; // bu sayının altındaki yanıtlar yayımlanmaz
  V.KOHORTLAR = [{kod:1, ad:"1. yıl", aciklama:"Mezuniyetten yaklaşık 1 yıl sonra"},{kod:5, ad:"5. yıl", aciklama:"Mezuniyetten yaklaşık 5 yıl sonra"}];
  V.dalgaYili = (V.sonuclarMeta && V.sonuclarMeta.dalgaYili) || V.guncelYil;
  if(!V.ornek) V.sonuclar = (V.sonuclar||[]).map(x=>({...x, isced: x.isced || V.isced(x.program), sektorler: x.sektorler||[]}));
  if(!V.sonuclar){
    const r2 = mulberry32(3017), g2 = () => (r2()+r2()+r2()-1.5)/1.5;
    const TABAN = {"091":[.88,.90,3],"042":[.70,.80,8],"071":[.80,.74,5],"061":[.86,.80,4],"073":[.76,.72,6],"072":[.70,.62,7],
      "011":[.55,.60,10],"041":[.74,.55,6],"031":[.62,.45,9],"032":[.60,.48,9],"021":[.52,.50,10],"022":[.54,.48,10],
      "023":[.56,.50,10],"051":[.55,.48,10],"053":[.58,.50,9],"054":[.62,.52,8],"092":[.78,.80,5],"101":[.72,.55,6],"104":[.80,.60,5]};
    const SEKTOR_ALAN = {"091":["Sağlık","Kamu / Devlet","Eğitim"],"042":["Hukuk","Kamu / Devlet","Finans / Bankacılık"],
      "071":["Sanayi / Üretim","Otomotiv","Mühendislik / Teknik"],"061":["Bilişim / Yazılım","Finans / Bankacılık","Sanayi / Üretim"],
      "011":["Eğitim","Kamu / Devlet","Serbest Meslek"],"041":["Finans / Bankacılık","Ticaret / Satış","Sanayi / Üretim"]};
    V.sonuclar = [];
    V.birimler.forEach(b=>b.programlar.forEach(p=>{
      const t = TABAN[p.isced] || [.62,.52,8];
      V.KOHORTLAR.forEach(({kod})=>{
        const y = V.dalgaYili - kod, mez = p.yillar[y]; if(!mez) return;
        const N = mez[0]+mez[1]; if(!N) return;
        const yanitOrani = Math.min(.7, Math.max(.12, .34 + g2()*.12 + (kod===5?-.06:0)));
        const n = Math.round(N*yanitOrani);
        const ust = (p.tur==="Lisansüstü"||p.tur==="Doktora") ? .06 : 0;
        const ist = Math.min(.97, Math.max(.2, t[0] + ust + (kod===5?.08:0) + g2()*.07));
        const devam = p.tur==="Ön Lisans" ? .22 : p.tur==="Lisans" ? .12 : .05;
        const egitim = Math.max(0, devam*(kod===5?.5:1) + g2()*.03);
        const yatay = Math.min(.98, Math.max(.15, t[1] + (kod===5?.04:0) + g2()*.08));
        const dikey = Math.min(.98, Math.max(.15, yatay - .05 + g2()*.06 - (p.tur==="Ön Lisans"?-.05:0)));
        V.sonuclar.push({
          birim:b.ad, grup:b.grup, program:p.ad, tur:p.tur, eqf:p.eqf, isced:p.isced, kohort:kod, mezuniyetYili:y,
          mezun:N, yanit:n, yanitOrani:n/N,
          calisan: ist, egitimde: Math.min(egitim, 1-ist), issiz: Math.max(0, 1-ist-Math.min(egitim,1-ist)-.04),
          alanindaCalisan: yatay, duzeyineUygun: dikey,
          ilkIsAy: Math.max(1, Math.round(t[2] + g2()*2.5)),
          isMemnuniyeti: Math.min(5, Math.max(1, 3.6 + g2()*.35 + (kod===5?.1:0))),
          programMemnuniyeti: Math.min(5, Math.max(1, 3.7 + g2()*.4)),
          yurtDisinda: Math.max(0, .03 + g2()*.025 + (p.isced==="061"||p.isced==="091"?.03:0)),
          sektorler: (SEKTOR_ALAN[p.isced] || ["Kamu / Devlet","Eğitim","Ticaret / Satış"])
        });
      });
    }));
  }
  // Ağırlıklı (yanıt sayısıyla) özet
  V.sonucOzet = function(satirlar){
    const g = satirlar.filter(s=>s.yanit>=V.KUCUK_HUCRE); const W = g.reduce((a,s)=>a+s.yanit,0)||1;
    const ort = k => g.reduce((a,s)=>a+s[k]*s.yanit,0)/W;
    return {programSayisi:g.length, yanit:satirlar.reduce((a,s)=>a+s.yanit,0), mezun:satirlar.reduce((a,s)=>a+s.mezun,0),
      calisan:ort("calisan"), egitimde:ort("egitimde"), alanindaCalisan:ort("alanindaCalisan"), duzeyineUygun:ort("duzeyineUygun"),
      ilkIsAy:ort("ilkIsAy"), isMemnuniyeti:ort("isMemnuniyeti"), programMemnuniyeti:ort("programMemnuniyeti"), yurtDisinda:ort("yurtDisinda")};
  };

  // ---- Örnek içerikler (Mezun Köşesi ve Duyurular) ----
  V.kose = window.MEZUN_KOSE || [
    {id:1, tur:"BasariHikayesi", baslik:"Otomotiv Yan Sanayiinde İşe Alım Uzmanlığı", ozet:"Stajımı yaptığım otomotiv yan sanayi firmasında mezuniyetten hemen sonra işe alım uzmanı olarak çalışmaya başladım.",
     yazar:"Örnek Mezun A", program:"İnsan Kaynakları Yönetimi (I. Öğretim)", yil:2021, tarih:"2026-10-06", goruntulenme:214, vitrin:true,
     govde:["Bu içerik, Mezun Köşesi detay sayfasının nasıl görüneceğini göstermek için yazılmış ÖRNEK bir metindir.","Gerçek sistemde mezunlar giriş yaptıktan sonra kendi hikâyelerini gönderir; içerikler bölüm tarafından değerlendirildikten sonra yayımlanır.","Metin; öğrencilik yılları, staj deneyimi, mezuniyet sonrası kariyer yolu ve öğrencilere öneriler gibi bölümlerden oluşabilir."]},
    {id:2, tur:"BasariHikayesi", baslik:"Bordro Uzmanlığından İK İş Ortaklığına", ozet:"Bordro ve özlük işleriyle başladığım kariyerimde bugün bir perakende zincirinde HRBP olarak çalışıyorum.",
     yazar:"Örnek Mezun B", program:"İnsan Kaynakları Yönetimi (II. Öğretim)", yil:2019, tarih:"2026-09-28", goruntulenme:187, vitrin:true,
     govde:["ÖRNEK içerik. Mezunun lisans döneminde edindiği bilgi ve becerilerin kariyerine nasıl yansıdığını anlatan bir başarı hikâyesi burada yer alır.","II. öğretimde okurken çalışmanın getirdiği deneyim ve zaman yönetimi gibi konular da paylaşılabilir."]},
    {id:3, tur:"BasariHikayesi", baslik:"Kendi İK Danışmanlık Firmamı Kurdum", ozet:"Birkaç yıllık kurumsal deneyimin ardından KOBİ'lere işe alım ve performans yönetimi danışmanlığı veren bir girişim kurdum.",
     yazar:"Örnek Mezun C", program:"İnsan Kaynakları Yönetimi (I. Öğretim)", yil:2018, tarih:"2026-09-20", goruntulenme:301, vitrin:true,
     govde:["ÖRNEK içerik. Girişimcilik yolculuğunu anlatan mezun hikâyeleri, öğrencilere rol model sunar.","Mezun Vitrini'nde öne çıkarılan içerikler bu sayfadan seçilir."]},
    {id:4, tur:"Yazi", baslik:"İK Analitiği Öğrenmeye Erken Başlayın", ozet:"Excel ve temel istatistik bilgisinin işe alım ve ücret analizlerinde ne kadar işe yaradığını mezun olunca anladım.",
     yazar:"Örnek Mezun D", program:"İnsan Kaynakları Yönetimi (I. Öğretim)", yil:2023, tarih:"2026-09-12", goruntulenme:96,
     govde:["ÖRNEK içerik. 'Yazı' türündeki içerikler mezunların görüş, deneyim ve öğrencilere önerilerini paylaştığı kısa yazılardır."]},
    {id:5, tur:"Etkinlik", baslik:"İKY Mezunlar Buluşması — Esentepe Kampüsü", ozet:"Farklı dönemlerden mezunlarımızı öğrencilerimizle bir araya getiren kariyer buluşması (örnek etkinlik).",
     yazar:"İKY Bölümü", program:"—", yil:null, tarih:"2026-09-05", goruntulenme:142,
     govde:["ÖRNEK etkinlik duyurusu. Tarih, yer ve kayıt bilgileri burada yer alır."]},
    {id:6, tur:"IsIlani", baslik:"Mezunumuzdan İlan: İK Uzman Yardımcısı", ozet:"Mezunlarımızın kurumlarındaki açık pozisyonları buradan paylaşabilirsiniz (örnek ilan).",
     yazar:"Örnek Mezun B", program:"İnsan Kaynakları Yönetimi (II. Öğretim)", yil:2019, tarih:"2026-08-30", goruntulenme:233,
     govde:["ÖRNEK iş ilanı. Pozisyon, nitelikler ve başvuru yöntemi burada yer alır."]}
  ];
  V.duyurular = window.MEZUN_DUYURU || [
    {baslik:"Lisans Mezunları İzleme Anketi (Sürüm 2) yayında", tarih:"2026-10-12", yeni:true,
     govde:["Değerli mezunlarımız,","Mezuniyet sonrasında çalışma, öğrenim, girişimcilik ya da iş arama gibi farklı yollarınızı ve deneyimlerinizi anlamak için hazırlanan izleme anketimizin ikinci sürümü yayındadır. Çekirdek bölümler yaklaşık 10 dakika sürer.","Anketi Mezun Girişi'nden sonra çevrim içi doldurabilir ya da Word formunu indirebilirsiniz. (Örnek duyuru)"]},
    {baslik:"Mezun Takip Paneli kullanıma açıldı", tarih:"2026-10-05", yeni:true,
     govde:["Bölümümüz mezunlarının iş bulma süresi, işsizlik riski, ücret ve işyeri dağılımını kohortlara göre izleyen Mezun Takip Paneli, Mezun İstatistikleri menüsünden erişilebilir. Panelde yalnızca toplu ve takma adlandırılmış veriler gösterilir. (Örnek duyuru)"]},
    {baslik:"İKY Mezun Bilgi Sistemi yayında", tarih:"2026-10-01", yeni:false,
     govde:["Değerli mezunlarımız,","SAÜ İşletme Fakültesi İnsan Kaynakları Yönetimi Bölümü Mezun Bilgi Sistemi, mezunlarımızla iletişimin sürekliliğini sağlamak ve mezunlara sunulan hizmetleri tek adreste toplamak amacıyla kullanıma açılmıştır.","Giriş yaptığınızda iletişim ve çalışma bilgilerinizi güncelleyebilir, Mezun Vitrini'nde yer alabilir, izleme anketine katılabilir ve Mezun Köşesi'ne içerik gönderebilirsiniz. (Örnek duyuru)"]}
  ];

  window.MEZUN = V;
})();
