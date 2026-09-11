# Graphies — lire et écrire le tunisien sous toutes ses formes

Quatre systèmes coexistent et ne sont **pas** interchangeables :

| Système | Exemple | Quand on le rencontre |
|---|---|---|
| Arabe standard (MSA) | يجب أن ننتبه إلى المخاطر | jamais dans la voix du créateur ; piège de sortie quand on « écrit en arabe » |
| Tunisien en lettres arabes | لازمنا نردّوا بالنا من المخاطر اللي تنجم تجي | sortie de whisper `--language ar` ; sous-titres « mode arabe » sur demande |
| Tunisien en lettres latines (Franco-Tunisien, arabizi) | lezemna nroddou belna mel risques elli ynajmou yjiw | scripts, messages du créateur, **sous-titres par défaut** d'une vidéo en tunisien |
| Oral avec code-switching FR/EN | *(la voix elle-même)* | toutes les vidéos en tunisien ; voir `code-switching.md` |

La même phrase peut arriver sous les trois graphies : whisper l'écrit en arabe, le créateur
l'a écrite en latin dans son script, et les sous-titres la réécrivent. **Un mot n'est pas un
autre mot parce qu'il est écrit autrement.**

## 1. Les chiffres du Franco-Tunisien

| Chiffre | Son arabe | Statut | Exemples (convention du corpus) |
|---|---|---|---|
| `3` | ع | **convention du créateur** | na3ref, mte3, yesta3mel, 3lech, 3alle5er, ya3tik |
| `7` | ح | **convention du créateur** | 7aja, l7a9, 7atta, 7yetna, ma7miya, ta7kem |
| `5` | خ | **convention du créateur** (variante `kh` lue, pas écrite) | 5ater, ye5dem, 5edma, a5tar, y5afou, mel a5er |
| `9` | ق | **convention du créateur** | n9oulou, 9bal, 9addech, y9ra, tal9a, t9oul — `k` reste `k` (ك : kbir, ktebt, ma7kma) |
| `2` | ء (hamza) | général, à **reconnaître**, ne pas imposer | sou2el, t2athar, ma2 |
| `6` | ط | général, à reconnaître | 6ayara (avion) — le corpus préfère `t` : tayara |
| `8` | غ ou ه selon les communautés | **non établi** : reconnaître, ne jamais créer une convention | — |

Autres lettres qui n'existent pas en français :

| Latin | Son | Exemples |
|---|---|---|
| `gh` | غ | ghadhab (colère), ghodwa (demain), ghali (cher) |
| `dh` | ذ / ظ | hedha, hedhi, yodhher (apparaît), dha3if (faible) |
| `th` | ث | thnia (route), t2athar (être influencé), thlatha |
| `ch` | ش | chay, chnowa, kifech, chkoun, ekteb chay |
| `q` | ق (variante lettrée de `9`) | qbal, nqoulou — lire, ne pas écrire |
| `g` | ڨ (le ق prononcé [g] dans certains mots ou régions) | goul (dis), gdim (vieux) — le créateur dit `9` dans n9oulou : suivre son oral, pas l'étymologie |

## 2. Reconnaître les variantes (lecture)

Le Franco-Tunisien n'a pas d'orthographe. Tous ces couples désignent le **même mot** :

| Mot | Graphies rencontrées | Convention du corpus (écriture) |
|---|---|---|
| متاع (de, possession) | mte3 · mta3 · mté3 · mtaa · nta3 · te3 | **mte3** (mte3i, mte3ek, mte3ou, mte3ha, mte3na, mte3kom, mte3hom) |
| باش (futur / pour) | bech · bich · besh · bach · bash | **bech** |
| خاطر (parce que) | 5ater · khater · 5atr · 3la 5ater | **5ater** |
| حاجة (chose) | 7aja · haja · 7aaja · 7ajet (pl.) | **7aja / 7ajet** |
| ينجّم (il peut) | ynajem · ynajjem · inajem · ynajam · ynjm | **ynajem** (tnajem, nnajem, ynajmou, najmou) |
| اللي (que, qui) | elli · li · illi · eli | **elli** |
| شي (chose, dans kol chay) | chay · chey · chy · shay · شيء | **chay** |
| شنوة (quoi) | chnowa · chnoua · chneya · chniya · ech | **chnowa** (chneya accepté) |
| كيفاش (comment) | kifech · kifesh · kifach | **kifech** |
| علاش (pourquoi) | 3lech · 3lach · 3lesh · alech | **3lech** |
| برشة (beaucoup) | barcha · barsha · bar$a · برشا · برشة | **barcha** |
| توّا (maintenant) | tawa · taw · tawwa · توا | **tawa** |
| فمّا (il y a) | fama · famma · fema · fammé | **fama** (famma accepté) |
| لازم (il faut) | lezem · lazem · lezm · lazm | **lezem** (lezemna, lezmek) |
| هاذا / هاذي (ce, cette) | hedha · hadha · hetha / hedhi · hadhi · hethi | **hedha / hedhi** |
| ماهوش / ماهيش (n'est pas) | mahouch · mahoush · mahich · mahish · manich · makch | **mahouch / mahich** |
| و (et) | w · ou · wa · we | **w** |
| في الـ (dans le) | fl · fel · fil · fi el | **fl** (fel accepté devant consonne difficile : fel commentaires) |
| من الـ (du, de la) | mel · mnel · men el | **mel** |
| لـلـ (au, à la) | lel · lil · l el | **lel** |
| على الـ (sur le) | 3al · 3lel · 3la el | **3al** |
| بالـ (avec le, par le) | bel · bil | **bel** |
| الـ (article) | el · l · il · al | **el** (fusionné quand ça se prononce fusionné : l7a9, lhistorique) |
| consonnes doublées | ynajjem · 7atta · 3ommal · 9allek | doubler seulement si ça aide la lecture (7atta oui, ynajem non) |

Règle de lecture : devant une graphie inconnue, **prononcer le mot à voix haute** avec la
table des chiffres, puis chercher le mot dans `lexique.md` ou dans la phrase voisine. Ne
jamais conclure « mot inconnu » avant d'avoir essayé les variantes (kh↔5, q↔9, é↔e, doublage).

## 3. Écrire (convention du corpus)

1. **Alphabet latin de gauche à droite, chiffres 3 / 7 / 5 / 9.** Pas de mélange
   d'alphabets dans un script ou un sous-titre en Franco-Tunisien.
2. **Un mot tunisien s'écrit sans orthographe française sophistiquée** : `mte3`, pas
   `mtéâ` ; `bech`, pas `bèche`. Les accents ne servent qu'aux mots français.
3. **Un mot français ou anglais garde son orthographe exacte**, accents compris :
   `données`, `écran`, `zéro`, `recruteur`, `watermark`, `feedback`. Jamais phonétique
   (`klo-d`, `watarmark`, `dé-doné`).
4. **Marques, produits, sigles : orthographe officielle** — ChatGPT, Claude, Gemini,
   Instagram, TikTok, LinkedIn, PFE, CV, ATS, PDF, IA / AI (celui que le créateur prononce :
   « l'IA » [i-a] ou « AI » [é-aï] sont deux mots différents à l'oral, on écrit celui qu'on
   entend), CTA, DM.
5. **Les contractions s'écrivent contractées** quand elles se prononcent contractées : `fl
   Instagram`, `mel PFE`, `lel AI`, `3al internet`, `l7a9`. On ne sur-segmente pas.
6. **Une graphie par mot, par vidéo.** Choisir au premier emploi, tenir jusqu'au bout ; le
   choix se note dans le glossaire du projet (voir `captions.md`). Trois graphies de `mte3`
   dans un même reel est l'erreur la plus fréquente.
7. **Lisibilité avant linguistique.** Le test : le créateur reconnaît-il le mot au premier
   coup d'œil et peut-il le réciter sans hésiter ? `5ater` oui ; `xāṭir` non.
8. `2` pour la hamza seulement quand l'omettre rend le mot illisible (`sou2el`) ; sinon
   l'apostrophe ou rien (`ma2` / `ma`).

## 4. Le tunisien en lettres arabes (mode explicite)

Ce mode n'arrive que sur demande (« sous-titres en arabe », « version arabe »). Écrire avec
l'alphabet arabe **ne veut pas dire** écrire en arabe standard :

| On garde (tunisien) | On refuse (MSA) |
|---|---|
| باش نعملوا | سوف نقوم بـ / سنقوم |
| ما نعرفش · ما فمّاش · ماهوش | لا أعرف · لا يوجد · ليس |
| اللي (toujours, tous genres) | الذي / التي / الذين |
| متاعنا · متاعك · متاعهم | ـنا / ـك / ـهم seuls quand l'oral dit متاع |
| برشة · توّا · كيفاش · شنوة · علاش · شكون · وقتاش | كثيرا · الآن · كيف · ماذا · لماذا · من · متى |
| ينجّم · لازم · فمّا · خاطر · حتّى · أما · زادة | يستطيع · يجب أن · هناك · لأنّ · حتى (ok) · لكن · أيضا |
| ولّينا نقولوا كل شي للـAI | لقد بدأنا بإخبار الذكاء الاصطناعي بكل شيء |
| نستعمل Claude · الـwatermark · الـPFE | كلود · العلامة المائية · مشروع التخرج |

Formes fréquentes (convention : shadda et harakat seulement quand elles lèvent une
ambiguïté) : برشة · حاجة / حاجات · خاطر · متاع · باش · توّا · ينجّم · يستعمل · كيفاش ·
شكون · نعرف · اللي · شنوة · علاش · الحق · ولّينا · نقولوا · كل شي · خدمة · حياة ·
حتّى · أما · لازم · فمّا · هاذا · هاذي · هكّا · كيف · كي · كان (si) · مالـ · للـ · فالـ ·
عالآخر · مالآخر · رد بالك · خلّي · يعطيك · يبعث · يلوّج · يجاوب · يقرا · اكتب.

Les noms de produits, sigles et termes techniques **peuvent rester en latin** à l'intérieur
d'une ligne arabe (نستعمل Claude, الـATS, فايل PDF) : c'est souvent plus lisible que كلود ou
إي تي إس, et c'est ainsi que le créateur les prononce. Un mot français courant peut aller dans
les deux sens (ريكروتور / recruteur) : trancher par projet, tenir le choix, et proposer les
deux versions quand le créateur hésite.

Contraintes techniques du mode arabe : voir `captions.md` § « Mode arabe » (police avec
glyphes arabes, direction RTL, îlots latins, chiffres).
