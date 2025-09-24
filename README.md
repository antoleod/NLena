https://antoleod.github.io/Lena/html/login.html

PWA / Offline
--------------

Cette app a été préparée pour fonctionner en mode PWA (offline). Fichiers ajoutés :

- `service-worker.js` : met en cache les fichiers essentiels et fournit une stratégie cache-first.
- `manifest.json` : métadonnées PWA (icônes, couleurs, start_url).
- `offline.html` : page de secours affichée en cas de navigation hors-ligne.

Tester en local :

1. Servir le dossier (`python3 -m http.server 8000` ou `npx http-server`).
2. Ouvrir `http://localhost:8000/html/login.html` dans Chrome/Edge.
3. Ouvrir DevTools → Application → Service Workers pour vérifier l'enregistrement.
4. Mettre le réseau en offline pour tester la page `offline.html` et les assets en cache.

Remarques :
- Le service worker utilise une liste explicite des assets du projet. Si tu ajoutes de nouveaux fichiers, ajoute-les à `PRECACHE_URLS` dans `service-worker.js`.
- Les fichiers SVG sont utilisés comme icônes du manifest (si tu préfères PNG, remplace les chemins dans `manifest.json`).

