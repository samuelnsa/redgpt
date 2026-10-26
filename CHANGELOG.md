# 📝 Changelog - SuperNS

## Version 2.0 - Interface Web Moderne (26/10/2026)

### 🎨 Nouvelles fonctionnalités majeures

#### Interface Web ChatGPT-like
- ✅ **Design moderne et professionnel** inspiré de ChatGPT/Claude
- ✅ **Thème sombre** (rouge et noir) avec animations fluides
- ✅ **Interface responsive** adaptée desktop et mobile
- ✅ **Logo personnalisé** 🕷️ L'Araignée

#### Fonctionnalités avancées
- ✅ **Upload de fichiers** multiples (16 MB max)
  - Documents : TXT, PDF, DOC, DOCX
  - Code : PY, JS, HTML, CSS, JSON
  - Images : PNG, JPG, JPEG, GIF
- ✅ **Rendu Markdown** avec coloration syntaxique
- ✅ **Conversations persistantes** avec historique
- ✅ **Indicateur de saisie** (typing indicator)
- ✅ **Support multilingue** (FR/EN)

#### Améliorations techniques
- ✅ Backend Flask robuste
- ✅ API REST sécurisée
- ✅ Gestion de session
- ✅ Stockage sécurisé des clés API
- ✅ Compatible Python 3.13

### 🐛 Corrections
- ✅ Fix compatibilité Python 3.13 (watchdog issue)
- ✅ Fix erreur syntaxe dans configure_key()
- ✅ Fix modèle API déprécié (OpenRouter)

### 📦 Fichiers ajoutés
```
├── app.py                 # Serveur Flask
├── requirements.txt       # Dépendances
├── START_WEB.bat         # Lanceur rapide
├── GUIDE.md              # Guide utilisateur
├── CHANGELOG.md          # Ce fichier
├── templates/
│   └── index.html        # Interface web
└── static/
    ├── style.css         # CSS moderne
    └── script.js         # JavaScript interactif
```

---

## Version 1.0 - Rebranding SuperNS (26/10/2026)

### 🔄 Changements majeurs
- ✅ Rebranding complet : RedGPT → **SuperNS**
- ✅ Nouveau logo araignée SVG personnalisé 🕷️
- ✅ Signature "L'Araignée" sur tous les éléments
- ✅ ASCII art mis à jour pour SuperNS
- ✅ Fichier config : `.red` → `.superns`
- ✅ Variable API : `RedGPT-API` → `SuperNS-API`

### 📝 Documentation
- ✅ README.md actualisé
- ✅ Installation simplifiée
- ✅ Guide de configuration

---

## Version 0.1 - FraudGPT Fork (Initial)

### ⚠️ Version originale
- Base HacxGPT/FraudGPT
- Interface CLI uniquement
- Prompt système non censuré
- Support OpenRouter et DeepSeek

---

## 🚀 Roadmap Future

### Version 2.1 (À venir)
- [ ] Support de plus de formats de fichiers
- [ ] Export des conversations en PDF/TXT
- [ ] Thèmes personnalisables
- [ ] Mode vocal (speech-to-text)
- [ ] Raccourcis clavier avancés
- [ ] Historique de conversations sauvegardé

### Version 3.0 (Planifié)
- [ ] Multi-utilisateurs avec authentification
- [ ] Base de données pour persistance
- [ ] API publique REST
- [ ] Plugins système
- [ ] Mode collaboratif (chat partagé)
- [ ] Version desktop (Electron)

---

**Développé avec 🕷️ par L'Araignée**
