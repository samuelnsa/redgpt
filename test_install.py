#!/usr/bin/env python3
"""
SuperNS Installation Test
Vérifie que toutes les dépendances sont correctement installées
Developed by L'Araignée 🕷️
"""

import sys

def test_imports():
    """Test all required imports"""
    required_modules = {
        'flask': 'Flask',
        'flask_cors': 'flask-cors',
        'openai': 'openai',
        'dotenv': 'python-dotenv',
        'werkzeug': 'werkzeug'
    }
    
    missing = []
    
    print("🕷️  SuperNS - Test d'installation\n")
    print("=" * 50)
    
    for module, package in required_modules.items():
        try:
            __import__(module)
            print(f"✅ {package:20} installé")
        except ImportError:
            print(f"❌ {package:20} manquant")
            missing.append(package)
    
    print("=" * 50)
    
    if missing:
        print(f"\n❌ Modules manquants: {', '.join(missing)}")
        print(f"\n💡 Installez-les avec:")
        print(f"   pip install {' '.join(missing)}")
        return False
    else:
        print("\n✅ Tous les modules sont installés!")
        return True

def test_files():
    """Test if all required files exist"""
    import os
    
    required_files = [
        'app.py',
        'superNS.py',
        'requirements.txt',
        'templates/index.html',
        'static/style.css',
        'static/script.js',
        'assets/spider.svg',
        'README.md',
        'GUIDE.md',
        'CHANGELOG.md'
    ]
    
    print("\n📁 Vérification des fichiers...")
    print("=" * 50)
    
    missing = []
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file:30} présent")
        else:
            print(f"❌ {file:30} manquant")
            missing.append(file)
    
    print("=" * 50)
    
    if missing:
        print(f"\n❌ Fichiers manquants: {len(missing)}")
        return False
    else:
        print("\n✅ Tous les fichiers sont présents!")
        return True

def test_python_version():
    """Check Python version"""
    print("\n🐍 Version Python...")
    print("=" * 50)
    
    version = sys.version_info
    version_str = f"{version.major}.{version.minor}.{version.micro}"
    
    if version.major >= 3 and version.minor >= 7:
        print(f"✅ Python {version_str} (compatible)")
        return True
    else:
        print(f"❌ Python {version_str} (requis: 3.7+)")
        return False

def main():
    """Run all tests"""
    results = []
    
    results.append(test_python_version())
    results.append(test_imports())
    results.append(test_files())
    
    print("\n" + "=" * 50)
    if all(results):
        print("🎉 Installation OK! Vous pouvez lancer SuperNS:")
        print("   python app.py")
        print("   Puis ouvrez: http://localhost:5000")
    else:
        print("❌ Installation incomplète. Corrigez les erreurs ci-dessus.")
        sys.exit(1)
    print("=" * 50)

if __name__ == '__main__':
    main()
