# SAÜ İşletme Fakültesi · İnsan Kaynakları Yönetimi Bölümü — İKY Mezun Bilgi Sistemi (prototip)

SAÜ İşletme Fakültesi İnsan Kaynakları Yönetimi Bölümü için hazırlanmış, sunucu gerektirmeyen statik bir prototiptir. Bölümün **Mezun Takip Paneli**
(`takip/sau_iky_mezun_takip.html`, ELA modeli) ve **Lisans Mezunları İzleme Anketi v2**
(`belgeler/SAU_IKY_Mezun_Izleme_Anketi_v2.docx`, ELA + HESA Graduate Outcomes) siteye entegre edilmiştir.

> **Önemli:** `assets/veri.js` boşken tüm sayılar **sentetik örnek veridir** (sayfalarda sarı
> şerit görünür). Örnek veri İKY lisans programının I. ve II. öğretim kohortlarını (2018–2026) kapsar;
> 2018–2024 kohort büyüklükleri Mezun Takip Paneli'nin demo verisiyle aynıdır, 2025–2026 tahminidir.
> Menüde **Mezun İstatistikleri** Anasayfa'nın hemen yanındadır.

## Sayfalar

| Dosya | İçerik |
|---|---|
| `index.html` |  Kahraman alanı, rakamlarla mezunlar, vitrin, köşe, duyurular, hizmetler |
| `kose.html` | | Tür sekmeleri (Yazı, Başarı Hikâyesi, Etkinlik, İş İlanı) + bölüm/yıl filtresi (`?tur=IsIlani`) |
| `kose-detay.html?id=N` |  | İçerik detayı, yazar kartı, görüntülenme |
| `vitrin.html` |  | Öne çıkan mezun hikâyeleri |
| `duyurular.html` | ` | Duyuru listesi + arama |
| `takip.html` | | Mezun Takip Paneli (ELA) — `takip/sau_iky_mezun_takip.html` portal içinde gömülü; tam ekran açılabilir |
| `istatistikler.html` | | Öğretim türü dağılımı, yıllara göre, il haritası, ilk iller, sektör, uluslararası, birim akordeonu |
| `il-dagilimi.html` |  | Türkiye kabarcık haritası (yakınlaştır/kaydır), ilk 10, 81 il tablosu |
| `birim-bazli.html` | | Program Bazlı: I./II. öğretim karşılaştırması, program seçmeli yıllık seri, CSV |
| `giris.html` || 3 adımlı giriş: numara + toplama sorusu → kimlik doğrulama (seçerek/yazarak, 3 hak) → program seçimi |
| `yonetici-giris.html` |  | Personel girişi ekranı (SSO'ya bağlanacak) |
| `panel.html` |  | İletişim, çalışma bilgileri, köşeye içerik gönderme |
| `anketler.html` |  | Lisans Mezunları İzleme Anketi v2'nin çevrim içi sürümü (S1–S52, koşullu akış, referans haftası), Word formu indirme, 5 yıllık izleme takvimi; yanıtlar Ek A kurallarıyla panel şablonuna kodlanır |
| `sonuclar.html` | | Program Sonuçları: istihdam, eğitime devam, yatay/dikey uyum, ilk işe geçiş, memnuniyet; küçük hücre gizleme, CSV |
| `yontem.html` | | Yöntem ve tanımlar, sınıflamalar, gizlilik eşiği, 5 boyutlu öz-değerlendirme |
| `kvkk.html` | | KVKK aydınlatma metni taslağı (hukuk birimince tamamlanmalı) |

Prototipte giriş denemek için: öğrenci no `B201000001` veya biçimce geçerli bir T.C. no (`10000000146`).
Formlar hiçbir sunucuya veri göndermez; kayıtlar yalnızca tarayıcı oturumunda (sessionStorage) tutulur.

## İzleme anketi → Mezun Takip Paneli veri akışı

1. Mezun çevrim içi anketi doldurur (`anketler.html`). Ön bilgiler (mezuniyet yılı, öğretim türü, cinsiyet, ikamet) kayıt ve profilden gelir.
2. `assets/anket-kodlama.js`, Word formundaki **Ek A1** kurallarıyla yanıtı panelin 22 sütunlu şablonuna, **Ek A2** ile GO ek değişkenlerine (65 sütun) dönüştürür. Kimlik yerine takma ad kodu (`mezun_id`) kullanılır; e-posta hiçbir çıktıya yazılmaz.
3. Bölüm, toplanan panel şablonu satırlarını birleştirip Mezun Takip Paneli'ndeki **Veri yükle** düğmesiyle yükler.

Not: net ücret kaba bir katsayıyla (`NET_BRUT_ORANI = 0.71`) brütleştirilir; gerçek kullanımda güncel bordro parametreleriyle değiştirin. TL dışı ücretler boş bırakılır (TCMB kuruyla araştırmacı çevirir).

## AB mezun izleme tavsiyelerine uyum

Konsey Tavsiyesi (2017/C 423/01) ve Avrupa Komisyonu uzman grubu raporu (2021, doi:10.2766/970793) doğrultusunda eklenenler:

- **Zorunlu bilgiler (A listesi):** panelde ikamet ülkesi (yurt dışı dahil), doğum ülkesi/ikinci uyruk, ISCO-08 meslek grubu, çalışma süresi ve sözleşme türü, çalışılan ülke, ebeveyn eğitim düzeyi, öğrenim sırasında hareketlilik, iş/eğitim geçmişi; kurum kaydından gelen bilgiler salt-okunur.
- **Önerilen bilgiler (B listesi):** ankette yatay/dikey uyum ve uyumsuzluk nedenleri, beceri kullanımı, iş memnuniyeti, gelir bandı, öğretim modeli, staj yararı, programı yeniden seçme, yurt dışına taşınma nedenleri.
- **Boylamsallık:** her dalgada mezuniyetten 1 ve 5 yıl sonraki kohortlar; mezuna kendi izleme takvimi gösterilir.
- **Mobil mezunlar:** kalıcı kişisel e-posta zorunlu tutulur (üniversite adresi reddedilir), ikamet ülkesi sorulur.
- **Yayma ve kullanım:** Program Sonuçları sayfası, açık CSV indirme (sonuçlar, il, program, yıllık seri), anasayfada özet bant.
- **Karşılaştırılabilirlik:** AYÇ/EQF düzeyi (doktora ayrı tür), ISCED-F 2013 dar alan kodu (prototipte addan tahmin; resmî kodla değiştirilmeli).
- **Veri koruma:** KVKK metni, ayrı ayrı izinler, verilerimi indir / hesabımı sil, yanıt sayısı < 10 olan hücrelerde gösterge yayımlanmaz (dönüştürücü bu göstergeleri veri.js'e hiç yazmaz).

## Özelleştirme

`assets/app.js` başındaki `SITE` nesnesi: kurum adı, logo yolu (`logo: "assets/logo.png"`),
diploma talep bağlantısı, sosyal medya hesapları ve alt bilgi birimi.

## Canlıya alma için eksikler

Gerçek kimlik doğrulama (SABİS SSO / e-Devlet), içerik onay ve yönetici paneli, anket yanıtlarının
kaydı ve KVKK aydınlatma metni sunucu tarafında geliştirilmelidir.

## Dosya yapısı

```
index.html … takip.html      16 sayfa
takip/sau_iky_mezun_takip.html  Mezun Takip Paneli (ELA uyarlaması, bağımsız da çalışır)
belgeler/…_v2.docx           Lisans Mezunları İzleme Anketi v2 (Word)
assets/anket-kodlama.js      Ek A kodlama kuralları (anket → panel şablonu)
assets/style.css             ortak stil
assets/app.js                üst/alt şablon, menü, yardımcılar, SITE ayarları
assets/data.js               birimler, iller, örnek veri üreteci, toplam fonksiyonları
assets/veri.js               gerçek veri (boşsa örnek veri kullanılır)
assets/harita.js             Türkiye il kabarcık haritası
assets/bilesen.js            il tablosu, birim akordeonu, grafik yardımcıları
araclar/veri_donustur.py     CSV → assets/veri.js
```
