# Biznes məntiqi — Özel uşaq bağçası platforması (Azərbaycan)

## 1. Məhsul vizionu

**Problem:** Bağçalar WhatsApp qrupları, kağız jurnallar və Excel ilə işləyir; valideynlər gün ərzində uşağın vəziyyəti barədə məlumat ala bilmir; ödənişlər gecikir və izlənməsi çətindir.

**Həll:** Bir platformada (SaaS) hər bağça öz “müəssisəsi” kimi işləyir; **valideyn mobil app**, **müəllim mobil app**, **direktor/mühasib veb + mobil** ilə qeydiyyat, davamiyyət, gündəlik hesabat, media, mesajlaşma, ödəniş və sənədlər idarə olunur.

**Uğur meyarları (bağça üçün):** valideyn məmnuniyyəti, ödəniş gecikməsinin azalması, müəllimə gündəlik admin yükünün azalması.  
**Uğur meyarları (platforma üçün):** bağça başına aylıq ARR, churn < 5%/il, DAU/MAU valideyn tərəfində > 40%.

---

## 2. Multi-tenant SaaS qaydaları

| Anlayış | Təsvir |
|---------|--------|
| **Platforma** | Sizin şirkət — bütün bağçaları host edir |
| **Tenant (Bağça)** | Müştəri — məlumat tam izolyasiyada |
| **Filial** | Bir legal entity altında bir neçə ünvan (optional) |

**Qaydalar:**
- Tenant A heç vaxt Tenant B məlumatını görmür (DB `tenant_id`, API middleware, audit).
- Bağça deaktiv olanda: giriş yalnız oxuma rejimi + export; yeni media/mesaj bloklanır; platforma abunəsi bitmiş sayılır.
- Trial: məs. 14 gün, 1 qrup, max 15 uşaq — ödəniş inteqrasiyası açılmır.
- Plan limitləri: uşaq sayı, storage (GB), SMS kvotası — limit aşılarsa soft warning, sonra read-only və ya upsell.

**Platforma gəliri:** bağça/ay abunə + optional SMS + optional ödəniş komissiyası (fase 2).

---

## 3. İstifadəçi tipləri və hesab modeli

### 3.1 Rollar (bağça daxilində)

| Rol | Əsas məqsəd |
|-----|-------------|
| **Direktor / Sahib** | Tam idarəetmə, müqavilələr, qiymət, personal |
| **Mühasib / Maliyyə** | Faktura, ödəniş, borc, hesabat |
| **Qrup müəllimi** | Davamiyyət, gündəlik hesabat, media (öz qrupu) |
| **Köməkçi müəllim** | Eyni, məhdud redaktə (policy ilə) |
| **Tibb işçisi / Tibb bacısı** | Dərman, allergiya, xəstəlik qeydləri |
| **Qəbul / Resepsiya** | Giriş-çıxış, ziyarətçi |
| **Valideyn / Qəyyum** | Övladına aid məlumat, mesaj, ödəniş |
| **Platform admin** | Sizin komanda — tenant dəstəyi |

Bir **real şəxs** (telefon + email) bir neçə rolda ola bilər: məs. eyni adam həm müəllim (Bağça X), həm valideyn (Bağça Y).

### 3.2 Uşaq ↔ Valideyn əlaqəsi

- Uşağın **1+ qəyyum** hesabı ola bilər (ana, ata, nənə).
- Hər qəyyum üçün:
  - **Əsas əlaqə** (bir uşaqda yalnız biri) — faktura və rəsmi bildirişlər.
  - **Götürə bilər** (bəli/xeyr) + **foto ID / PIN** (optional).
  - **Media icazəsi** (foto/video paylaşımına razılıq — GDPR/ yerli qanun uyğunluğu).
  - **Mesajlaşma** — bütün qəyyumlar və ya yalnız əsas (bağça policy).

**Qayda:** Uşaq bağçaya qəbul olunmamışdan əvvəl valideyn app-də “qeydiyyat dəvəti” göndərilir; valideyn profil + razılıq formalarını imzalayır (elektron).

---

## 4. Modul 1 — Qeydiyyat və qəbul (Onboarding)

### 4.1 Bağça onboarding (platforma)

1. Bağça qeydiyyatı (VÖEN optional, ünvan, rekvizitlər).
2. Direktor hesabı.
3. Qruplar (Yaş: 2–3, 3–4, 4–5, məktəbə hazırlıq), tutum (max uşaq).
4. İş qrafiki (həftə günləri, açılış-bağlanış saatı).
5. Qiymət planı (aylıq haqq, qeydiyyat haqqı, nahar əlavəsi).

### 4.2 Uşaq qəbulu

**Statuslar:** `draft` → `invited` → `documents_pending` → `active` → `suspended` → `graduated` → `withdrawn`

| Keçid | Şərt |
|-------|------|
| draft → invited | Direktor/mühasib uşaq + valideyn telefonu daxil edir |
| invited → documents_pending | Valideyn app quraşdırıb OTP ilə giriş etdi |
| documents_pending → active | Məcburi sənədlər təsdiqləndi + direktor təsdiqi |
| active → suspended | Borc limiti / davamlı qayda pozuntusu (policy) |
| active → withdrawn | Valideyn çıxış ərizəsi + son hesablaşma |

**Məcburi sənədlər (bağça konfiqurasiya):** tibbi arayış, allergiya anketi, foto/video razılığı, nəqliyyət razılığı (optional).

---

## 5. Modul 2 — Davamiyyət və giriş-çıxış

### 5.1 Gündəlik davamiyyət

- **Gözlənilən gələnlər:** aktiv uşaqlar − elan edilmiş icazəli qayıblar.
- **Qeyd növləri:** `present`, `absence_excused`, `absence_unexcused`, `sick`, `holiday`, `pickup_early`.

**Qaydalar:**
- Davamiyyət günü bağça timezone (Asia/Baku) ilə bağlanır; direktor 24 saat ərzində düzəliş edə bilər; sonrakı düzəliş audit log + səbəb.
- Qrup müəllimi yalnız **öz qrupu** üçün bulk check-in edə bilər (səhər rutini).
- Valideyn **qabaqcadan qayıb** bildirişi göndərə bilər (səbəb + tarix aralığı).

### 5.2 Giriş-çıxış (pickup security)

**Check-in:** staff təsdiqi (app və ya QR skan — uşaq badge). Valideynə push: “Aylin bağçaya gəldi — 08:42”.

**Check-out:** 
- Götürən şəxs **authorized pickup list**-də olmalıdır.
- Staff app: uşaq seç → götürən şəxs (ad + şəxsiyyət yoxlaması checkbox) → PIN/QR təsdiqi (optional).
- Əgər götürən listedə yoxdursa: **xəbərdarlıq workflow** — direktora zəng/mesaj, manual override yalnız direktor/resepsiya.

**Qayda:** Check-out olmadan uşaq statusu `in_premises` qalır; gün sonu avtomatik alert.

---

## 6. Modul 3 — Gündəlik qayğı hesabatı (Daily care)

Hər uşaq üçün gün ərzində **vaxt damğalı** qeydlər (müəllim app — sürətli UI):

| Blok | Sahələr |
|------|---------|
| Səhər qəbul | əhval, gec gəlmə |
| Yemək | səhər/yemək/ikinci yemək: yedi / az yedi / yemədi + qeyd |
| Yuxu | başladı, durdu, müddət |
| Tualet / bez | optional yaş qrupuna görə |
| Aktivlik | oyun, dərs, gəzinti |
| Tibb | temperatur, dərman (tibb rolü) |

**Biznes qaydaları:**
- Hesabat **nashr** olunana qədər valideyn görmür; default: gün sonu 18:00 auto-publish və ya müəllim “Göndər”.
- Redaktə: publish-dən sonra 2 saat müəllim; sonra yalnız direktor.
- AI (fase 2): müəllim checkbox seçir → valideyn dilində cümlə generasiya (insan təsdiqi).

---

## 7. Modul 4 — Media (foto/video)

- Yükləmə: müəllim app (qrup və ya fərdi uşaq tag).
- **Tag:** bir media bir neçə uşağa tag ola bilər; hər valideyn yalnız öz uşağının tag-lı media görür (+ ümumi qrup fotosu policy: blur/other children optional — default: only tagged).
- Razılıq olmayan uşaq media-ya tag edilə bilməz (hard block).
- Saxlama: tenant quota; köhnə media arxiv planı.
- Endirmə: valideyn endirə bilər (watermark optional); staff endirmə audit.

---

## 8. Modul 5 — Mesajlaşma və elanlar

| Kanal | İstifadə |
|-------|----------|
| **Elan (broadcast)** | Direktor/müəllim → bütün valideynlər / qrup / filial |
| **Thread (1:1)** | Valideyn ↔ qrup müəllimi (default) |
| **Thread (1:1 direktor)** | Şikayət, müqavilə |
| **Daxili staff chat** | Personal — valideyn görmür |

**Qaydalar:**
- Mesajlar tenant daxilində; platform admin yalnız dəstək ticket rejimində oxuya bilər (consent).
- Oxunmamış sayğac; push + optional SMS fallback (kritik: bağlanma, təcili).
- İş saatları xaricində auto-reply (bağça konfiq).

---

## 9. Modul 6 — Təqvim və menyu

- **Təqvim:** bayram bağlanması, valideyn görüşü, ekskursiya, ad günü (opt-in).
- **Həftəlik yemək menyusu:** valideyn app; allergiya xəbərdarlığı (uşaq profilində allergen → menyu sətirində highlight).

---

## 10. Modul 7 — Maliyyə və ödənişlər

### 10.1 Qiymət komponentləri

- Aylıq təhsil haqqı (qrup/yaş üzrə fərqli ola bilər).
- Nahar / nəqliyyat / digər recurring.
- Birdəfəlik: material, ekskursiya, forma.

### 10.2 Faktura dövrü

- Default: hər ayın 1-də növbəti ay üçün **faktura generasiya** (pro-rata: ortaya qəbul).
- Status: `draft` → `issued` → `partially_paid` → `paid` → `overdue` → `written_off` (yalnız direktor).

### 10.3 Ödəniş kanalları (fase)

| Fase | Kanal |
|------|--------|
| 1 | Nağd/kart terminal — mühasib manual “paid” qeydi + kvitansiya foto |
| 2 | Kapital / ABB / link ödəniş |
| 3 | Avtomatik recurring |

**Borc policy (konfiq):**
- X gün gecikmə → valideyn app-də banner + SMS.
- Y gün → direktor alert; uşaq `suspended` optional (həssas — default yalnız xəbərdarlıq, uşaq gəlir amma yeni xidmət blok).

**Hesabatlar:** aylıq gəlir, borclular siyahısı, qrup üzrə doluluq, proqnoz.

---

## 11. Modul 8 — Tibb, allergiya, dərman

- Uşaq profili: allergiyalar, xroniki, həkim əlaqə, tibbi qeydlər (valideyn daxil edir, tibb işçisi təsdiqləyir).
- **Dərman planı:** doza, vaxt, valideyn yazılı razılıq sənədi; hər doza `administered` + kim verdi + vaxt.
- Xəstəlik: uşaq evdə — valideyn bildirir; qayıdışda arayış flag (optional).

---

## 12. Modul 9 — HR (personal) — sadələşdirilmiş

- İşçi profili, qrup təyinatı, iş qrafiki.
- Valideyn app-də “bu gün kim qayğı göstərir” (optional foto + ad).

---

## 13. Modul 10 — Bildirişlər

| Hadisə | Valideyn | Staff |
|--------|----------|-------|
| Check-in/out | push | — |
| Gündəlik hesabat publish | push | — |
| Yeni foto | push (digest optional) | — |
| Yeni faktura | push + email | — |
| Borc | push/SMS | mühasib email |
| Yeni mesaj | push | push |
| Pickup unauthorized attempt | — | push + səs |

**Preferens:** valideyn hansı kanalları aktiv saxlayır (push məcburi deyil, amma təhlükəsizlik hadisələri həmişə).

---

## 14. Audit, məxfilik, uyğunluq

- Bütün PII dəyişiklikləri audit log (kim, nə vaxt, köhnə/yeni).
- Uşaq məlumatına giriş: role + assignment yoxlanışı.
- Data export: bağça ayrılarkən full export (JSON/PDF pack).
- Uşaq silinməsi: soft delete + retention period (qanuni tələb).
- Valideyn razılıqları versiyalı saxlanılır.

---

## 15. Mobil tətbiq tələbləri (funksional)

### Valideyn app (iOS + Android)
- OTP login (telefon); multi-uşaq, multi-bağça (fərqli tenant).
- Ana səhifə: bugünkü status, son foto, son mesaj.
- Davamiyyət tarixçəsi, gündəlik hesabat, media lenti.
- Mesajlaşma, elanlar, təqvim, menyu.
- Faktura və ödəniş (fase 2).
- Qayıb bildirişi, profil/redaktə (məhdud), pickup authorized contacts.

### Müəllim / Staff app
- Rol əsaslı menyu.
- Sürətli davamiyyət, check-in/out.
- Gündəlik hesabat wizard (30 saniyə/uşaq hədəf).
- Media capture + tag uşaqlar.
- Mesaj inbox (qrup valideynləri).

### Direktor app (və ya genişləndirilmiş staff)
- Dashboard: doluluq, bugünkü gəlməyənlər, borc xülasəsi.
- Təsdiq növbəsi: sənədlər, manual override pickup.

**Offline:** müəllim app — davamiyyət və draft hesabat queue; sync conflict: server wins + local alert.

---

## 16. MVP vs Sonrakı mərhələlər

| MVP (3–4 ay) | v1.1 | v2 |
|--------------|------|-----|
| Tenant, qrup, uşaq, valideyn invite | Online ödəniş | AI hesabat mətni |
| Davamiyyət + check-in/out | Filial | Video stream (nursery cam) |
| Gündəlik hesabat + media | SMS paket | İngilis/rus UI |
| Elan + 1:1 mesaj | Export mühasibat | API integrator |
| Manual ödəniş + faktura | Dərman modulu tam | Franchise analytics |

---

## 17. KPI (bağçaya satış pitch)

- Ödəniş gecikməsi orta müddətinin azalması.
- Valideyn zənglərinin sayının azalması (sorğu sorğusu optional).
- Müəllim gündəlik admin vaxtı (target: < 15 dəq/qrup).

---

## 18. Açıq konfiqurasiya (hər bağça)

İş saatları, faktura günü, borc limiti, auto-publish saatı, media endirmə, pickup PIN məcburi, dillər (AZ primary), valideyn görünən sahələr.
