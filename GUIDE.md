# 📘 Guide d'utilisation SuperNS

## 🚀 Démarrage rapide

### 1. Installation

```bash
# Cloner le repository
git clone https://github.com/samuelnsa/redgpt.git
cd redgpt

# Installer les dépendances
pip install -r requirements.txt
```

### 2. Lancement de l'interface web

**Option A - Double-clic (Windows)**
```
Double-cliquez sur START_WEB.bat
```

**Option B - Ligne de commande**
```bash
python app.py
```

### 3. Configuration

1. Ouvrez votre navigateur sur `http://localhost:5000`
2. Cliquez sur **"Paramètres"** en bas de la sidebar
3. Entrez votre clé API DeepSeek (gratuite sur https://platform.deepseek.com/)
4. Cliquez sur **"Enregistrer"**

---

## 🎨 Fonctionnalités

### 💬 Chat avec IA
- Conversations illimitées et contextuelles
- Réponses en temps réel
- Historique de conversation
- Support Markdown avec coloration syntaxique

### 📎 Upload de fichiers
Formats supportés :
- **Documents** : TXT, PDF, DOC, DOCX
- **Code** : PY, JS, HTML, CSS, JSON
- **Images** : PNG, JPG, JPEG, GIF
- Taille max : 16 MB par fichier

### ⌨️ Raccourcis clavier
- `Enter` : Envoyer le message
- `Shift + Enter` : Nouvelle ligne
- `Échap` : Fermer les modales

### 🎨 Interface
- **Thème sombre** élégant (rouge et noir)
- **Design responsive** (desktop et mobile)
- **Animations fluides**
- **Logo personnalisé** 🕷️

---

## 🔧 Configuration avancée

### Changer de modèle AI

Éditez `app.py` ligne 36 :

```python
# Pour OpenRouter (Llama 3.1)
API_PROVIDER = "openrouter"

# Pour DeepSeek
API_PROVIDER = "deepseek"
```

### Personnaliser le système prompt

Éditez `app.py` lignes 40-46 pour modifier le comportement de l'IA.

### Changer le port

Par défaut : `5000`

Pour changer, éditez la dernière ligne de `app.py` :
```python
app.run(debug=True, host='0.0.0.0', port=8080)
```

---

## 🐛 Résolution des problèmes

### Erreur : "API key not configured"
➜ Allez dans Paramètres et ajoutez votre clé API

### Erreur : "Port already in use"
➜ Changez le port dans `app.py` ou arrêtez le processus existant

### L'upload de fichiers ne fonctionne pas
➜ Vérifiez que le dossier `uploads/` existe et est accessible

### Le serveur ne démarre pas
➜ Vérifiez que les dépendances sont installées :
```bash
pip install -r requirements.txt
```

---

## 📚 Structure du projet

```
SuperNS/
├── app.py                 # Backend Flask
├── superNS.py            # CLI version (terminal)
├── requirements.txt      # Dépendances Python
├── START_WEB.bat         # Lanceur Windows
├── templates/
│   └── index.html        # Interface web
├── static/
│   ├── style.css         # Styles CSS
│   └── script.js         # JavaScript frontend
├── assets/
│   └── spider.svg        # Logo SuperNS
└── uploads/              # Fichiers uploadés (créé auto)
```

---

## 🆘 Support

- **Issues GitHub** : https://github.com/samuelnsa/redgpt/issues
- **Documentation DeepSeek** : https://platform.deepseek.com/docs
- **Documentation OpenRouter** : https://openrouter.ai/docs

---

## 🕷️ Développé par L'Araignée

**SuperNS** - Assistant IA sans restrictions
Version Web 1.0 - 2026
