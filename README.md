# Tunisia Nutrition 🏋️

**E-commerce de compléments nutritionnels et fitness** — Tunisie.

Plateforme complète de vente en ligne avec catalogue produits, panier, système de commandes, codes promo, et dashboard administrateur pour gérer l'intégralité du contenu.

## Stack Technique

| Technologie | Rôle |
|-------------|------|
| **Next.js 16** (App Router) | Framework full-stack |
| **TypeScript** | Typage statique |
| **Tailwind CSS v4** | Styles et design |
| **Framer Motion** | Animations |
| **MongoDB + Mongoose** | Base de données |
| **bcryptjs** | Authentification admin |
| **Lucide React** | Icônes |

## Fonctionnalités

### Public
- **Page d'accueil** — Hero slider, produits mis en avant, marques, témoignages, newsletter
- **Catalogue produits** — Filtres par catégorie, marque, objectif, prix + recherche textuelle
- **Fiche produit** — Détails, quantité, bouton ajouter au panier, produits similaires
- **Panier** — Gestion des quantités, suppression, résumé, application de code promo
- **Checkout** — Formulaire de commande (nom, téléphone, adresse), paiement à la livraison
- **Contact** — Page de contact

### Admin (`/admin`)
- **Dashboard** — Statistiques (total produits, stock, valeur)
- **Produits** — CRUD complet avec upload d'image, gestion des badges (Best-seller / Nouveau / Promo), prix original et prix promo
- **Commandes** — Liste + détail, changement de statut (En attente → Confirmée → Expédiée → Livrée / Annulée), suppression
- **Codes Promo** — Création (pourcentage ou montant fixe, min. commande, utilisations max., expiration), gestion
- **Paramètres du site** — Personnalisation des textes de la page d'accueil (Hero, Featured, Newsletter), frais de livraison et seuil de gratuité, sélection des produits mis en avant

## Prise en main

### Prérequis
- Node.js 18+
- MongoDB Atlas (ou instance locale)

### 1. Cloner et installer

```bash
git clone <repo-url>
cd nutrition
npm install
```

### 2. Configurer l'environnement

Créez un fichier `.env.local` à la racine :

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/nutrition
```

### 3. Lancer le projet

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### 4. Accéder à l'admin

Aller sur [/admin/login](http://localhost:3000/admin/login).

**Identifiants par défaut :**
- Email : `oussembraiek@gmail.com`
- Mot de passe : `admin123`

*(La base de données est automatiquement seedée au premier accès)*

## Structure du projet

```
src/
├── app/
│   ├── admin/           # Dashboard admin
│   │   ├── coupons/     # Gestion des codes promo
│   │   ├── login/       # Page de connexion
│   │   ├── orders/      # Gestion des commandes
│   │   ├── products/    # Gestion des produits
│   │   ├── settings/    # Paramètres du site
│   │   └── page.tsx     # Dashboard
│   ├── api/             # Routes API
│   │   ├── auth/        # Authentification
│   │   ├── coupons/     # CRUD + vérification
│   │   ├── orders/      # CRUD commandes
│   │   ├── products/    # CRUD produits
│   │   ├── seed/        # Seed de la BDD
│   │   ├── site-settings/ # Configuration
│   │   └── upload/      # Upload d'images
│   ├── cart/            # Page panier
│   ├── contact/         # Page contact
│   └── products/        # Catalogue + fiche
├── components/
│   ├── layout/          # Header, Footer, FloatingBar
│   ├── sections/        # Hero, Featured, WhyUs, etc.
│   └── ui/              # ProductCard
└── lib/
    ├── models/          # Schémas Mongoose
    ├── cart-store.tsx   # Contexte panier
    ├── mongodb.ts       # Connexion MongoDB
    ├── products.ts      # Interface + données statiques
    ├── seed.ts          # Seed de la BDD
    ├── admin-store.tsx  # Contexte admin
    ├── use-products.ts  # Hook produits
    └── use-settings.ts  # Hook paramètres
```

## API Routes

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/products` | Liste des produits |
| POST | `/api/products` | Créer un produit |
| GET | `/api/products/[id]` | Détail d'un produit |
| PUT | `/api/products/[id]` | Modifier un produit |
| DELETE | `/api/products/[id]` | Supprimer un produit |
| POST | `/api/auth/login` | Connexion admin |
| PUT | `/api/auth/password` | Changer mot de passe |
| GET | `/api/orders` | Liste des commandes |
| POST | `/api/orders` | Créer une commande |
| GET | `/api/orders/[id]` | Détail commande |
| PUT | `/api/orders/[id]` | Modifier statut |
| DELETE | `/api/orders/[id]` | Supprimer commande |
| GET | `/api/coupons` | Liste des codes promo |
| POST | `/api/coupons` | Créer un code promo |
| DELETE | `/api/coupons/[id]` | Supprimer un code |
| GET | `/api/coupons/verify` | Vérifier un code |
| GET | `/api/site-settings` | Récupérer paramètres |
| PUT | `/api/site-settings` | Modifier paramètres |
| POST | `/api/upload` | Uploader une image |
| POST | `/api/seed` | Seeder la base |

## Fonctionnalités clés

### Gestion des prix et promotion
- **Prix actuel** : prix de vente affiché
- **Ancien prix** : prix barré + badge `-XX%` automatique
- **Badge Promo** : highlight visuel supplémentaire

### Livraison
- Frais configurable depuis l'admin (défaut : 8 TND)
- Seuil de livraison gratuite configurable (défaut : 100 TND)
- Livraison 24-48h dans toute la Tunisie

### Coupons
- Pourcentage ou montant fixe
- Minimum de commande
- Utilisations max + expiration
- Vérification en temps réel dans le panier

### Images
- Upload local via le formulaire admin (`/uploads/`)
- Ou URL distante (ex. hébergement externe)

## Build et déploiement

```bash
npm run build    # Build de production
npm start        # Lancement production
```

Le build est optimisé par Turbopack (Next.js 16).

## Licence

Projet privé.
