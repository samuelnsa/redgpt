# 📝 Changelog - SuperNS

## 🎨 Version 2.0 - Claude-Style Modern UI (2026-10-26)

### ✨ Nouvelles fonctionnalités

#### Interface complètement repensée
- **Design inspiré de Claude AI** - Interface épurée et moderne
- **Thème couleurs personnalisé** - Palette beige/rouge élégante
- **Typographie premium** - Inter + Source Serif 4
- **Animations fluides** - Transitions et effets soignés

#### Composants principaux

**1. Sidebar élégante**
- Logo SuperNS avec araignée 🕷️
- Bouton "Nouvelle conversation" mis en avant
- Historique des conversations (préparé)
- Bouton paramètres accessible

**2. Écran d'accueil immersif**
- Grande araignée animée
- Message d'accueil personnalisé avec effet de soulignement
- Pills de suggestions de prompts
- Disposition centrée et aérée

**3. Zone de chat moderne**
- Messages avec avatars stylisés
- Support Markdown avec coloration syntaxique
- Indicateur de frappe animé (3 points)
- Scroll automatique fluide

**4. Input enrichi (style Claude)**
- **Upload de fichiers** avec prévisualisation
  - Images : miniatures cliquables
  - Documents : cartes avec icônes
  - Bouton de suppression au survol
  - Limite 16MB par fichier
  
- **Sélecteur de modèle** (dropdown)
  - Opus 4.5 (tâches complexes)
  - Sonnet 4.5 (quotidien) - par défaut
  - Haiku 4.5 (rapide)
  
- **Toggle "Extended Thinking"**
  - Activation/désactivation visuellement claire
  - État persistant pendant la session
  
- **Bouton d'envoi adaptatif**
  - Désactivé si vide
  - Animation au clic
  - Feedback visuel

**5. Modal paramètres**
- Design moderne avec overlay
- Champ API Key sécurisé
- Instructions claires
- Lien vers plateforme DeepSeek

### 🎨 Design System

```css
Couleurs (Light Mode):
--bg-0:    #FAF9F5   (Fond principal)
--bg-100:  #FFFFFF   (Cartes)
--bg-200:  #F0EEE6   (Hover)
--bg-300:  #DDDDDD   (Bordures)
--text-100: #1F1E1D  (Principal)
--text-400: #888888  (Placeholder)
--accent:   #D97757  (Rouge/orange)

Typographie:
- Titres: Source Serif 4 (élégant)
- Corps: Inter (moderne, lisible)

Ombres:
- Input: Douce (0 2px 8px)
- Input Focus: Accent glow
- Modal: Profonde (0 25px 50px)
```

### 🔧 Améliorations techniques

- **Auto-resize textarea** - S'adapte au contenu (max 384px)
- **Gestion d'état** - Variables globales pour files, model, thinking
- **Validation input** - Désactivation intelligente du bouton send
- **Cleanup files** - Révocation des URL.createObjectURL
- **Error handling** - Messages d'erreur clairs
- **Responsive** - Adapté mobile (sidebar overlay)

### 📦 Fichiers modifiés

```
templates/index.html    - Structure HTML complète refaite
static/style.css        - 600+ lignes de CSS moderne
static/script.js        - 400+ lignes de JS restructuré
app.py                  - Backend Flask compatible
```

### 🚀 Comment utiliser

1. **Lancer le serveur**
   ```bash
   py app.py
   ```

2. **Ouvrir le navigateur**
   ```
   http://localhost:5000
   ```

3. **Configurer la clé API**
   - Cliquer sur "Paramètres"
   - Entrer votre clé DeepSeek
   - Sauvegarder

4. **Profiter de l'interface moderne !**
   - Uploader des fichiers
   - Choisir votre modèle
   - Activer Extended Thinking si besoin
   - Discuter naturellement

### 🆚 Comparaison V1 vs V2

| Fonctionnalité | V1 (Terminal Dark) | V2 (Claude-Style) |
|----------------|-------------------|-------------------|
| Design | Sombre cyberpunk | Clair élégant |
| Upload fichiers | Basique | Preview + cards |
| Modèles | Caché | Sélecteur visible |
| Accueil | Simple liste | Immersif avec suggestions |
| Messages | Compacts | Espacés, avatars |
| Animations | Minimales | Fluides, professionnelles |
| Responsive | Limité | Full mobile |

### 🐛 Corrections

- ✅ Compatibilité Python 3.13 (watchdog désactivé)
- ✅ Erreur de syntaxe dans configure_key
- ✅ Auto-reload problématique supprimé
- ✅ Gestion des fichiers images améliorée

### � TODO / Roadmap

- [ ] Dark mode toggle
- [ ] Historique conversations persistant
- [ ] Streaming des réponses (SSE)
- [ ] Support drag & drop dans zone de message
- [ ] Export conversations (MD, PDF)
- [ ] Recherche dans l'historique
- [ ] Raccourcis clavier (Cmd+K, etc.)
- [ ] Markdown editor avancé
- [ ] Code syntax highlighting (Prism.js)
- [ ] Emojis picker
- [ ] Voice input
- [ ] Multi-langues (i18n)

---

## 🕷️ Version 1.0 - Interface Initiale (2026-10-25)

### Fonctionnalités V1
- Interface web basique avec Flask
- Chat fonctionnel avec DeepSeek/OpenRouter
- Upload de fichiers simple
- Design dark cyberpunk (rouge/noir)
- CLI terminal en parallèle (superNS.py)

---

**Développé par L'Araignée** 🕷️  
SuperNS - Assistant IA sans restrictions
