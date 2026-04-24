# SneakerWear - Premium E-commerce Store

Bienvenue sur le projet SneakerWear, une boutique de sneakers moderne et performante.

## 🚀 Démarrage Rapide

1. **Installation des dépendances** :
   ```bash
   npm install
   ```

2. **Configuration des variables d'environnement** :
   Renommez `.env.local.example` en `.env.local` et remplissez les valeurs :
   - `NEXT_PUBLIC_SUPABASE_URL`: Votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Votre clé publique
   - `ADMIN_PASSWORD`: Le mot de passe pour accéder à `/admin`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: Le numéro pour recevoir les commandes (ex: 221770000000)

3. **Base de données** :
   Exécutez le script contenu dans `supabase_schema.sql` dans l'éditeur SQL de votre dashboard Supabase.

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

## ✨ Caractéristiques
- Next.js 14 App Router
- Tailwind CSS (Premium Design)
- Supabase (DB & Storage)
- Zustand (État global)
- Framer Motion & GSAP
- Checkout WhatsApp

## 📂 Structure du projet
- `src/app`: Routes et pages
- `src/components`: Éléments UI réutilisables
- `src/lib`: Configuration Supabase et Zustand
- `public`: Assets statiques
