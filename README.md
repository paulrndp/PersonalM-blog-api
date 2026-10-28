# PersonalM-blog-api

Central RESTful API and PostgreSQL data service for the **PersonalM Blog & Novel Platform**, serving both the Web application (`PersonalM-blog-web`) and Mobile applications (`PersonalM-blog-mobile` for iOS and Android).

Built with **Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL**.

---

## 🏗️ Architecture

```mermaid
flowchart LR
    WebClient["PersonalM-blog-web\n(Next.js)"] -->|REST / JSON| API["PersonalM-blog-api\n(Express + TypeScript)"]
    MobileClient["PersonalM-blog-mobile\n(React Native / Expo)"] -->|REST / JSON| API
    API -->|Prisma ORM| Postgres[("PostgreSQL Database\n(hannahm_db)")]
```

---

## 🚀 Features

- **Centralized Data Layer**: Single source of truth for stories, chapters, blog posts, visitor statistics, and author accounts.
- **Type-Safe ORM**: Powered by Prisma ORM 6.x with automated schema synchronization.
- **Stateless Authentication**: JWT tokens with Bearer token authentication and Bcrypt password encryption.
- **Dynamic Blob Media**: Built-in support for cover artwork and author avatar images with automated SVG fallback.
- **Accurate Visitor Analytics**: IP-based unique visitor counting across stories, chapters, and blog categories.
- **Cross-Origin Ready**: Pre-configured CORS support for web and native mobile clients.

---

## 📚 API Reference

Base URL: `http://localhost:5000/api/v1`

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | None | Authenticate with username & password; returns JWT token |
| `GET` | `/auth/me` | Bearer | Get current author profile information |
| `PUT` | `/auth/profile` | Bearer | Update author profile, name, password, or upload avatar photo |
| `GET` | `/auth/avatar` | None | Serve author avatar image (JPEG or fallback SVG) |

### 2. Stories & Chapters (`/api/v1/stories`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/stories` | None | Get all published stories with chapter lists and read counts |
| `GET` | `/stories/:id` | None | Get story details and table of contents |
| `GET` | `/stories/:id/cover` | None | Serve story cover image (JPEG or fallback SVG) |
| `GET` | `/stories/chapters/:id` | None | Read single chapter with built-in Prev / Next navigation |
| `POST` | `/stories` | Bearer | Create a new story (supports multipart cover upload) |
| `PUT` | `/stories/:id` | Bearer | Update story details or change cover photo |
| `DELETE` | `/stories/:id` | Bearer | Delete story (cascade deletes all chapters) |
| `POST` | `/stories/:storyId/chapters` | Bearer | Add a new chapter to a story |
| `PUT` | `/stories/chapters/:id` | Bearer | Update chapter title or content |
| `DELETE` | `/stories/chapters/:id` | Bearer | Delete chapter and update total chapter counts |

### 3. Blog & Musings (`/api/v1/posts`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts` | None | Query posts (`?category=Blog|Random|Both&status=published|draft&limit=10`) |
| `GET` | `/posts/:id` | None | Get single post with previous and next article navigation |
| `POST` | `/posts` | Bearer | Create new post (Draft or Published) |
| `PUT` | `/posts/:id` | Bearer | Update post content, category, or publication status |
| `DELETE` | `/posts/:id` | Bearer | Delete post |

### 4. Analytics & Visitor Tracking (`/api/v1/visitors`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/visitors/post/:postId` | None | Record distinct visitor IP for a blog post and increment views |
| `POST` | `/visitors/chapter/:chapterId` | None | Record distinct visitor IP for a chapter and update story views |

### 5. Admin Dashboard Metrics (`/api/v1/stats`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats/overview` | Bearer | Returns counts for stories, blog posts, random thoughts, drafts, and reads |

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node.js 24)
- **PostgreSQL**: v14+ running locally or in cloud

### 2. Install Dependencies
```bash
git clone https://github.com/paulrndp/PersonalM-blog-api.git
cd PersonalM-blog-api
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/hannahm_db?schema=public"
JWT_SECRET="your-super-secret-random-32-character-key"
CORS_ORIGIN="*"
```

### 4. Sync Database & Seed Initial Content
```bash
# Push schema to PostgreSQL
npm run db:push

# Seed admin user and sample stories
npm run db:seed
```

### 5. Run the API Server

#### Development Mode:
```bash
npm run dev
```

#### Production Build:
```bash
npm run build
npm run start
```

---

## 🔐 Default Admin Account
- **Username**: `admin`
- **Password**: `password`

---

## 📄 License
MIT License.
