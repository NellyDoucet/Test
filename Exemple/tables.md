Voici un guide complet sous la forme d'un fichier `.md` (Markdown). Tu peux copier-coller ce contenu directement dans un fichier nommé `guide-markdown.md` et l'ouvrir dans un éditeur comme Obsidian, VS Code, GitHub ou Notion.

Ce document est lui-même écrit en Markdown. Il te montre donc à la fois **le code source** (ce que tu dois taper) et **le résultat visuel** (ce que tu obtiens).

***

# 📘 Guide d'utilisation du Markdown

## Introduction
Le Markdown est un langage de balisage léger. Il permet de formater du texte brut (fichiers `.md`) de manière lisible et structurée.

---

## 1. Hiérarchie (Titres et Listes)

### Comment l'utiliser ?
Utilise le symbole `#` suivi d'un espace pour les titres. Plus il y a de `#`, plus le titre est petit.

```markdown
# Titre de niveau 1 (H1) - Le plus grand
## Titre de niveau 2 (H2)
### Titre de niveau 3 (H3)
```

### Quand l'utiliser ?
*   **H1** : Une seule fois par document (le titre principal).
*   **H2** : Pour les grandes sections (comme ce guide).
*   **H3** : Pour les sous-sections.

### Les Listes
```markdown
*   Élément de liste à puces
*   Deuxième élément
    *   Sous-élément (indenté avec 2 ou 4 espaces)

1.  Élément numéroté
2.  Deuxième élément
```

**Quand l'utiliser ?** Pour énumérer des étapes (numérotées) ou des caractéristiques (puces).

> **Astuce :** Utilise `>` pour les citations ou les notes importantes.
> Cela crée un bloc visuellement distinct.

---

## 2. Mise en forme du texte

| Style | Code Markdown | Résultat |
| :--- | :--- | :--- |
| Gras | `**Texte en gras**` | **Texte en gras** |
| Italique | `*Texte en italique*` | *Texte en italique* |
| Barré | `~~Texte barré~~` | ~~Texte barré~~ |
| Lien | `[Texte du lien](https://url.com)` | [Texte du lien](https://url.com) |

**Quand l'utiliser ?**
*   **Gras** : Pour mettre en évidence un mot-clé important.
*   **Italique** : Pour les termes techniques, les mots étrangers ou une emphase légère.
*   **Barré** : Pour indiquer qu'une information n'est plus valide (ex: `~~Prix: 50€~~ Prix: 40€`).

---

## 3. Les Tableaux

### Comment l'utiliser ?
Utilise des barres verticales `|` pour séparer les colonnes et des tirets `-` pour séparer l'en-tête du contenu. Les deux-points `:` gèrent l'alignement.

```markdown
| Fonctionnalité | Statut | Priorité |
| :--- | :---: | ---: |
| Authentification | Terminé | Haute |
| Base de données | En cours | Moyenne |
| Interface UI | À faire | Basse |
```

### Rendu :
| Fonctionnalité | Statut | Priorité |
| :--- | :---: | ---: |
| Authentification | Terminé | Haute |
| Base de données | En cours | Moyenne |
| Interface UI | À faire | Basse |

*(Note : `:---` aligne à gauche, `:---:` centre, et `---:` aligne à droite).*

**Quand l'utiliser ?** Pour comparer des données, lister des spécifications techniques ou suivre l'avancement d'un projet. **Attention** : Évite les tableaux trop larges, ils sont difficiles à lire sur mobile.

---

## 4. Le Code

### Code en ligne (Inline)
Utilise des accents graves simples (backticks) pour entourer un mot.
*   **Code :** `` `npm install` ``
*   **Rendu :** `npm install`

**Quand l'utiliser ?** Pour les noms de variables, les commandes terminales courtes, ou les noms de fichiers.

### Bloc de code (Code Block)
Utilise trois accents graves (```). Ajoute le nom du langage juste après pour activer la coloration syntaxique.

```markdown
```javascript
function salutation(nom) {
  console.log("Bonjour " + nom);
}
```
```

**Rendu :**
```javascript
function salutation(nom) {
  console.log("Bonjour " + nom);
}
```

**Quand l'utiliser ?** Pour partager des scripts complets, des extraits de configuration (JSON, YAML) ou des commandes longues. **Toujours indiquer le langage** (ex: `python`, `html`, `bash`) pour que le code soit coloré et lisible.

---

## 5. Les Statuts (Task Lists & Badges)

### Les cases à cocher (Task Lists)
C'est la méthode native pour gérer des statuts dans un fichier `.md`.

```markdown
- [x] Tâche terminée
- [ ] Tâche à faire
- [ ] Tâche en attente
```

**Rendu :**
- [x] Tâche terminée
- [ ] Tâche à faire
- [ ] Tâche en attente

**Quand l'utiliser ?** Dans les fichiers `README.md` de projets, les tickets (issues) GitHub/GitLab, ou pour tes listes de tâches personnelles.

### Les Badges de statut (Shields.io)
Le Markdown seul ne peut pas créer de "badges" de couleur dynamiques. On utilise donc des images externes (généralement via [Shields.io](https://shields.io/)).

```markdown
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
```

**Rendu :**
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

**Quand l'utiliser ?** En haut des fichiers `README.md` pour indiquer instantanément la santé du projet (tests qui passent, version actuelle, licence).

### Les Emojis comme statuts
Tu peux utiliser des emojis pour un suivi visuel rapide.
*   🟢 **Terminé**
*   🟡 **En cours**
*   🔴 **Bloqué**

**Quand l'utiliser ?** Dans les tableaux de suivi de projet ou les listes de fonctionnalités.

---

## 6. Séparateurs et Images

### Ligne horizontale
```markdown
---
```
**Rendu :**

---
**Quand l'utiliser ?** Pour séparer visuellement deux grandes sections de texte.

### Images
```markdown
![Texte alternatif](https://exemple.com/image.png "Titre optionnel")
```
**Quand l'utiliser ?** Pour illustrer un propos, ajouter un logo ou des captures d'écran.
*Note : Le texte alternatif (`![...]`) est crucial pour l'accessibilité et s'affiche si l'image ne charge pas.*

---

## 🎯 Bonnes pratiques (Résumé)

1.  **Sois cohérent** : Si tu utilises `#` pour un titre, ne saute pas directement à `###`.
2.  **Aère ton texte** : Laisse une ligne vide entre chaque paragraphe, titre ou bloc de code. Le Markdown interprète mal les retours à la ligne simples.
3.  **Utilise les tableaux avec parcimonie** : Si tu as plus de 4 colonnes, envisage un autre format (comme une liste de définitions).
4.  **Toujours spécifier le langage** dans les blocs de code. Cela rend le document beaucoup plus professionnel.