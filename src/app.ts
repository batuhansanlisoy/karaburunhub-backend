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
import { apiKeyAuth } from "./Middleware/ApiKeyAuth";
import { requireAuth } from "./Middleware/Auth";
import { setLocals } from "./Middleware/Locals";

dotenv.config();
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true 
    }
}));

const isProd = process.env.NODE_ENV === "production";
const uploadPath = path.join(__dirname, "../upload");
app.use("/upload", express.static(uploadPath));

const viewsPath = isProd ? path.join(__dirname, "../../src/views") : path.join(__dirname, "views");
const publicPath = isProd ? path.join(__dirname, "../../public") : path.join(__dirname, "../public");
    
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.static(publicPath));
app.use(expressLayouts);
app.set("layout", "layouts/index");

// --- 3. PARSERS ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 4. CUSTOM MIDDLEWARES ---
app.use(setLocals); // Locals artık buradan geliyor


// Mobil API (API Key korumalı)
app.use("/api", apiKeyAuth, apiRoutes);

// Web Auth (Login/Logout)
app.use("/", authRoutes); 

// Web Admin Paneli (Session korumalı)
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