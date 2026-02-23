import path from "path";
import express from "express";
import session from 'express-session';
import dotenv from 'dotenv';
import expressLayouts from "express-ejs-layouts";
import apiRoutes from "./Routes/Api";
import authRoutes from "./Routes/Auth";
import userRoutes from "./Routes/User";
import beachRoutes from "./Routes/Beach";
import placeRoutes from "./Routes/Place";
import villageRoutes from "./Routes/Village";
import activityRoutes from "./Routes/Activity";
import organizationRoutes from "./Routes/Organization";
import organizationCategoryRoutes from "./Routes/Organization/Category";
import organizationCategoryItemRoutes from "./Routes/Organization/Category/Item";
import activityCategoryRoutes from "./Routes/Activity/Category";
import mobileRoutes from "./Routes/Mobile";

dotenv.config();
const app = express();

// --- 1. SESSION YAPILANDIRMASI (Middleware'lerden önce gelmeli) ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'karaburun-gizli-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 1 gün
    httpOnly: true 
  }
}));

// --- 2. AUTH MIDDLEWARE ---
const requireAuth = (req: any, res: any, next: any) => {
  if (req.session && req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

const isProd = process.env.NODE_ENV === "production";
const uploadPath = path.join(__dirname, "../upload");
app.use("/upload", express.static(uploadPath));

const viewsPath = isProd
    ? path.join(__dirname, "../../src/views")
    : path.join(__dirname, "views");

const publicPath = isProd
    ? path.join(__dirname, "../../public")
    : path.join(__dirname, "../public");
    
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.static(publicPath));

app.use(expressLayouts);
app.set("layout", "layouts/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.title = "KaraburunGO";
  res.locals.page = "";
  res.locals.isLoggedIn = (req.session as any).isLoggedIn || false;
  next();
});

app.use("/api", apiRoutes);

app.use("/", authRoutes); 

app.use("/users", requireAuth, userRoutes);
app.use("/beach", requireAuth, beachRoutes);
app.use("/village", requireAuth, villageRoutes);
app.use("/organization", requireAuth, organizationRoutes);
app.use("/organization/category", requireAuth, organizationCategoryRoutes);
app.use("/organization/category/item", requireAuth, organizationCategoryItemRoutes);
app.use("/place", requireAuth, placeRoutes);
app.use("/activity", requireAuth, activityRoutes);
app.use("/activity/category", requireAuth, activityCategoryRoutes);

export default app;