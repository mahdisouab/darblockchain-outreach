# -*- coding: utf-8 -*-
"""Fixture de test pour le skill `tunisien` : un reel JAMAIS VU (sujet absent du corpus),
transcrit comme whisper `--language ar` le ferait (mots français rendus en lettres arabes,
derja respelée). Sert au test RED (sans skill) puis GREEN (avec skill).

Vérité terrain (ce que dit réellement le créateur, Franco-Tunisien, convention corpus) :

  Na3ref elli barcha menkom yeb3thou fel CV mte3hom l 50 entreprise, w 7atta wa7ed ma yjaweb.
  5ater l7a9, el CV mte3ek ma yousalch lel recruteur.
  9bal ma y9rah insan, ya9rah logiciel esmou ATS.
  El ATS ylawej 3la des mots-clés : ken el poste y9oul « gestion de projet » w enti ktebt
  « chef de projet », ynajem ya3tik zéro.
  W hné el mochkla : el CV mte3ek design 3alle5er, colonnes, icônes... ama el logiciel
  ma yefhemch fih chay.
  Donc lezem trod belek : format simple, PDF, w les mots-clés mel annonce nafs'hom.
  Ken 3andek sou2el, ekteb « CV » fel commentaires w nab3athlek el template.
"""
import json, os, sys

# (token whisper-style, durée approx en s, pause après en s)
TOKENS = [
    ("نعرف", .30, 0), ("اللي", .22, 0), ("برشا", .32, 0), ("منكم", .30, 0), ("يبعثوا", .40, 0),
    ("في", .12, 0), ("السيفي", .45, 0), ("متاعهم", .40, 0), ("لخمسين", .50, 0), ("انتربريز،", .55, .25),
    ("وحتى", .35, 0), ("واحد", .35, 0), ("ما", .12, 0), ("يجاوب", .45, .55),
    ("خاطر", .35, 0), ("الحق", .30, .10), ("السيفي", .45, 0), ("متاعك", .35, 0), ("ما", .12, 0),
    ("يوصلش", .45, 0), ("للروكروتور", .70, .55),
    ("قبل", .28, 0), ("ما", .10, 0), ("يقراه", .38, 0), ("انسان،", .45, .15), ("يقراه", .38, 0),
    ("لوجيسيال", .60, 0), ("اسمو", .30, 0), ("اي", .18, 0), ("تي", .18, 0), ("اس", .25, .55),
    ("الاي", .25, 0), ("تي", .15, 0), ("اس", .22, 0), ("يلوج", .38, 0), ("على", .22, 0),
    ("دي", .12, 0), ("موكلي", .50, .20), ("كان", .25, 0), ("البوست", .40, 0), ("يقول", .30, 0),
    ("جستيون", .45, 0), ("دو", .15, 0), ("بروجي", .45, .15), ("وانتي", .35, 0), ("كتبت", .38, 0),
    ("شاف", .30, 0), ("دو", .15, 0), ("بروجي،", .45, .15), ("ينجم", .30, 0), ("يعطيك", .40, 0),
    ("زيرو", .45, .60),
    ("وهنا", .35, 0), ("المشكلة", .55, .15), ("السيفي", .45, 0), ("متاعك", .35, 0), ("ديزاين", .50, 0),
    ("عالاخر،", .55, .10), ("كولون،", .45, .10), ("ايكون...", .50, .20), ("اما", .25, 0), ("اللوجيسيال", .65, 0),
    ("ما", .12, 0), ("يفهمش", .45, 0), ("فيه", .22, 0), ("شي", .28, .60),
    ("دونك", .35, 0), ("لازم", .35, 0), ("ترد", .28, 0), ("بالك", .35, .15), ("فورما", .40, 0),
    ("سامبل،", .50, .10), ("بي", .15, 0), ("دي", .15, 0), ("اف،", .30, .10), ("ولي", .25, 0),
    ("موكلي", .50, 0), ("مال", .22, 0), ("انونس", .45, 0), ("نفسهم", .45, .60),
    ("كان", .25, 0), ("عندك", .35, 0), ("سؤال،", .45, .10), ("اكتب", .35, 0), ("سيفي", .40, 0),
    ("في", .12, 0), ("لي", .12, 0), ("كومونتار", .60, .10), ("ونبعثلك", .55, 0), ("التومبلات", .60, .40),
]

def build():
    t = 0.40  # attaque après 0,4 s de silence
    words = []
    for tok, dur, pause in TOKENS:
        words.append({"text": tok, "start": round(t, 2), "end": round(t + dur, 2),
                      "type": "word", "speaker_id": "speaker_0"})
        t += dur
        gap = 0.06 + pause
        words.append({"text": " ", "start": round(t, 2), "end": round(t + gap, 2),
                      "type": "spacing", "speaker_id": "speaker_0"})
        t += gap
    text = " ".join(tok for tok, _, _ in TOKENS)
    return {"language_code": "ar", "text": text, "words": words,
            "audio_duration_secs": round(t + 0.5, 2)}

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "transcript.json")
    data = build()
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    sys.stdout.reconfigure(encoding="utf-8")
    print(out, len([w for w in data["words"] if w["type"] == "word"]), "mots,",
          data["audio_duration_secs"], "s")
