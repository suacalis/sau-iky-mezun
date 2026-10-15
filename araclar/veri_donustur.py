#!/usr/bin/env python3
"""
Mezun listesini (ve isteğe bağlı mezun izleme anketi yanıtlarını) sitenin okuduğu
assets/veri.js biçimine dönüştürür. Çıktıda yalnızca TOPLU sayılar yer alır.

Kullanım:
    python3 araclar/veri_donustur.py mezunlar.csv > assets/veri.js
    python3 araclar/veri_donustur.py mezunlar.csv --anket anket.csv --dalga 2026 --kayitli 1834 > assets/veri.js

1) mezunlar.csv — her satır bir mezun
   Zorunlu: birim_grup, birim, program, tur (Ön Lisans | Lisans | Lisansüstü | Doktora),
            mezuniyet_yili, cinsiyet (K/E)
   İsteğe bağlı: il, uyruk, sektor,
            isced_f  (ISCED-F 2013 dar alan, 3 hane, ör. 041 — boşsa sitede addan tahmin edilir)
            eqf      (AYÇ/EQF düzeyi 5–8 — boşsa türden türetilir)

2) anket.csv — her satır bir anket yanıtı (mezun izleme anketi)
   Zorunlu: birim, program, mezuniyet_yili, kohort (1 | 5), durum
            durum: calisiyor | calisiyor_ve_egitimde | egitimde | is_ariyor | diger
   İsteğe bağlı: yatay_uyum (1–4), uygun_duzey (4–8), ilk_is_ay, is_memnuniyeti (1–5),
            program_memnuniyeti (1–5), ulke

Gizlilik: yanıt sayısı --esik (varsayılan 10) altındaki program-kohort hücrelerinde
göstergeler veri.js'e HİÇ yazılmaz (yalnızca mezun ve yanıt sayısı yazılır).
Kişisel veri (ad, T.C. no, öğrenci no) gerekmez ve çıktıya yazılmaz.
"""
import argparse, csv, json, sys, datetime
from collections import defaultdict

EQF = {"Ön Lisans": 5, "Lisans": 6, "Lisansüstü": 7, "Doktora": 8}

def cins(v):
    v = (v or "").strip().upper()
    if v in ("K", "KADIN", "F", "FEMALE", "KIZ"): return 0
    if v in ("E", "ERKEK", "M", "MALE"): return 1
    return None

def oku(yol, ayrac=None):
    with open(yol, encoding="utf-8-sig", newline="") as f:
        ornek = f.read(4096); f.seek(0)
        a = ayrac or csv.Sniffer().sniff(ornek, delimiters=",;\t").delimiter
        return list(csv.DictReader(f, delimiter=a))

def sayi(v):
    try: return float(str(v).replace(",", "."))
    except (TypeError, ValueError): return None

def ort(xs):
    xs = [x for x in xs if x is not None]
    return round(sum(xs) / len(xs), 4) if xs else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--anket", help="Mezun izleme anketi yanıtları (CSV)")
    ap.add_argument("--dalga", type=int, help="Anket dalgası yılı (varsayılan: anket kohortlarından)")
    ap.add_argument("--esik", type=int, default=10, help="Küçük hücre gizleme eşiği")
    ap.add_argument("--kayitli", type=int, default=0, help="Mezun Bilgi Sistemi'ne kayıtlı mezun sayısı")
    ap.add_argument("--guncel-yil", type=int, default=None)
    ap.add_argument("--ayrac", default=None, help="CSV ayracı (varsayılan: otomatik)")
    a = ap.parse_args()

    satirlar = oku(a.csv, a.ayrac)
    birim, iller, ulke, sektor = {}, defaultdict(lambda: [0, 0, 0, 0]), {}, defaultdict(int)
    atlanan = 0
    yillar = [int(r["mezuniyet_yili"]) for r in satirlar if (r.get("mezuniyet_yili") or "").strip().isdigit()]
    guncel = a.guncel_yil or (max(yillar) if yillar else 0)

    for r in satirlar:
        c = cins(r.get("cinsiyet")); y = (r.get("mezuniyet_yili") or "").strip()
        if c is None or not y.isdigit():
            atlanan += 1; continue
        y = int(y)
        g, b, p, t = (r.get(k, "").strip() for k in ("birim_grup", "birim", "program", "tur"))
        prog = birim.setdefault((g, b), {}).setdefault(p, {"tur": t, "yillar": {}})
        if (r.get("isced_f") or "").strip(): prog["isced"] = r["isced_f"].strip()[:3]
        if (r.get("eqf") or "").strip().isdigit(): prog["eqf"] = int(r["eqf"])
        prog["yillar"].setdefault(str(y), [0, 0])[c] += 1
        il = (r.get("il") or "").strip()
        if il:
            iller[il][c] += 1
            if y == guncel: iller[il][2 + c] += 1
        u = (r.get("uyruk") or "").strip()
        if u and u.upper() not in ("TC", "T.C.", "TÜRKİYE", "TURKIYE", "TR"):
            d = ulke.setdefault(u, {"ulke": u, "K": 0, "E": 0, "tur": {}, "buYil": [0, 0], "programlar": {}})
            d["K" if c == 0 else "E"] += 1
            d["tur"].setdefault(t, [0, 0])[c] += 1
            if y == guncel: d["buYil"][c] += 1
            pk = d["programlar"].setdefault(b + "||" + p, {"birim": b, "program": p, "tur": t, "K": 0, "E": 0})
            pk["K" if c == 0 else "E"] += 1
        s = (r.get("sektor") or "").strip()
        if s: sektor[s] += 1

    ulkeler = []
    for d in ulke.values():
        d["programlar"] = sorted(d["programlar"].values(), key=lambda x: -(x["K"] + x["E"]))
        ulkeler.append(d)
    ulkeler.sort(key=lambda d: -(d["K"] + d["E"]))

    veri = {
        "guncellenme": datetime.date.today().isoformat(), "guncelYil": guncel,
        "birimler": [{"grup": g, "ad": b, "programlar": [{"ad": p, **v} for p, v in progs.items()]} for (g, b), progs in birim.items()],
        "iller": dict(iller), "ulkeler": ulkeler,
        "sektorler": sorted(sektor.items(), key=lambda x: -x[1]), "sektorBeyan": sum(sektor.values()),
        "kayitliMezun": a.kayitli,
    }

    # ---- Mezun izleme anketi → program sonuç göstergeleri ----
    if a.anket:
        yanitlar = oku(a.anket, a.ayrac)
        kumeler = defaultdict(list)
        for r in yanitlar:
            k = (r.get("kohort") or "").strip()
            if k not in ("1", "5") or not (r.get("mezuniyet_yili") or "").strip().isdigit(): continue
            kumeler[(r.get("birim", "").strip(), r.get("program", "").strip(), int(k), int(r["mezuniyet_yili"]))].append(r)
        dalga = a.dalga or max((y + k for (_, _, k, y) in kumeler), default=guncel)
        pbilgi = {(b["ad"], p["ad"]): (b, p) for b in veri["birimler"] for p in b["programlar"]}
        sonuclar = []
        for (b, p, k, y), rs in sorted(kumeler.items()):
            if (b, p) not in pbilgi:
                print(f"UYARI: ankette olup mezun listesinde olmayan program atlandı: {b} / {p}", file=sys.stderr); continue
            bb, pp = pbilgi[(b, p)]
            N = sum(pp["yillar"].get(str(y), [0, 0])); n = len(rs)
            satir = {"birim": b, "grup": bb["grup"], "program": p, "tur": pp["tur"], "eqf": pp.get("eqf", EQF.get(pp["tur"])),
                     "isced": pp.get("isced"), "kohort": k, "mezuniyetYili": y, "mezun": N, "yanit": n,
                     "yanitOrani": round(n / N, 4) if N else None, "sektorler": []}
            if n >= a.esik:
                d = [(r.get("durum") or "").strip() for r in rs]
                cal = [r for r in rs if (r.get("durum") or "").startswith("calisiyor")]
                eqf = satir["eqf"] or 6
                satir.update({
                    "calisan": round(sum(x.startswith("calisiyor") for x in d) / n, 4),
                    "egitimde": round(sum(x == "egitimde" for x in d) / n, 4),
                    "issiz": round(sum(x == "is_ariyor" for x in d) / n, 4),
                    "alanindaCalisan": ort([1.0 if (sayi(r.get("yatay_uyum")) or 0) >= 3 else 0.0 for r in cal if sayi(r.get("yatay_uyum"))]),
                    "duzeyineUygun": ort([1.0 if (sayi(r.get("uygun_duzey")) or 0) >= eqf else 0.0 for r in cal if sayi(r.get("uygun_duzey"))]),
                    "ilkIsAy": ort([sayi(r.get("ilk_is_ay")) for r in rs]),
                    "isMemnuniyeti": ort([sayi(r.get("is_memnuniyeti")) for r in cal]),
                    "programMemnuniyeti": ort([sayi(r.get("program_memnuniyeti")) for r in rs]),
                    "yurtDisinda": round(sum((r.get("ulke") or "Türkiye").strip() not in ("", "Türkiye", "TR") for r in rs) / n, 4),
                })
            sonuclar.append(satir)
        veri["sonuclar"] = sonuclar
        veri["sonuclarMeta"] = {"dalgaYili": dalga, "esik": a.esik}
        print(f"{len(yanitlar)} anket yanıtı → {len(sonuclar)} program-kohort hücresi "
              f"({sum(s['yanit'] < a.esik for s in sonuclar)} hücre eşik altında, göstergeleri yazılmadı).", file=sys.stderr)

    print("/* veri_donustur.py ile üretildi — elle düzenlemeyin */")
    print("window.MEZUN_VERI = " + json.dumps(veri, ensure_ascii=False, separators=(",", ":")) + ";")
    print(f"{len(satirlar) - atlanan} mezun satırı işlendi, {atlanan} satır atlandı (cinsiyet/yıl eksik).", file=sys.stderr)

if __name__ == "__main__":
    main()
