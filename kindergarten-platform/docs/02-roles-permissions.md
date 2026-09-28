# Rollar və icazələr (RBAC + ABAC)

## Prinsip

- **RBAC:** rol → icazə dəsti.
- **ABAC:** əlavə şərtlər: `tenant_id`, `branch_id`, `group_id`, `child_id`, `is_assigned_teacher`.

Hər API sorğusu: `authenticate → resolve tenant → check permission → check scope → audit (if sensitive)`.

## İcazə formatı

`resource:action` məs. `attendance:write`, `invoice:issue`, `media:upload`.

## Rol matrisi (xülasə)

| İcazə | Direktor | Mühasib | Qrup müəllimi | Köməkçi | Tibb | Resepsiya | Valideyn |
|-------|:--------:|:-------:|:-------------:|:-------:|:----:|:---------:|:--------:|
| tenant.settings | ✓ | — | — | — | — | — | — |
| staff.manage | ✓ | — | — | — | — | — | — |
| group.read (all) | ✓ | ✓ | own | own | assigned | all | — |
| child.read | all | billing | own group | own group | assigned | all | own children |
| child.write | ✓ | — | limited | limited | medical | — | profile limited |
| attendance.write | ✓ | — | own group | own group | — | ✓ | absence request |
| pickup.checkout | ✓ | — | ✓ | ✓ | — | ✓ | — |
| pickup.override | ✓ | — | — | — | — | ✓ | — |
| daily_report.write | ✓ | — | own group | draft only | add medical | — | — |
| daily_report.publish | ✓ | ✓ | own group | — | — | — | — |
| media.upload | ✓ | — | own group | own group | — | — | — |
| media.view | all | — | own group | own group | assigned | — | own child tags |
| message.parent | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (own threads) |
| announcement.send | ✓ | ✓ | group | — | — | — | — |
| invoice.issue | ✓ | ✓ | — | — | — | — | view own |
| payment.record | ✓ | ✓ | — | — | — | — | pay (fase2) |
| audit.read | ✓ | — | — | — | — | — | — |
| document.sign | ✓ | — | — | — | — | — | ✓ (guardian) |

## Valideyn məhdudiyyətləri

- Yalnız **aktiv əlaqəsi** olan uşaqlar.
- Digər uşaqların PII-sinə giriş yoxdur.
- Mesajda yalnız bağça staff — valideyn-valideyn chat yoxdur.

## Staff təyinatı

`StaffGroupAssignment`: müəllim yalnız təyin olunduğu qruplarda write; direktor bütün qruplarda.

## Platform admin

Ayrı auth realm; tenant dəstəyində **impersonation** yalnız yazılı razılıq + audit + vaxt limiti.
