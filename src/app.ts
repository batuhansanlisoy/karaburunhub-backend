import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import userRoutes from "./Routes/User";
import beachRoutes from "./Routes/Beach";
import villageRoutes from "./Routes/Village";
import organizationRoutes from "./Routes/Organization/Organization";
import organizationCategoryRoutes from "./Routes/Organization/Category";
import placeRoutes from "./Routes/Place";

const app = express();

const isProd = process.env.NODE_ENV === "production";

const viewsPath = isProd
    ? path.join(__dirname, "../../src/views")   // build sonrası production
    : path.join(__dirname, "views");            // ts-node dev

const publicPath = isProd
    ? path.join(__dirname, "../../public")
    : path.join(__dirname, "../public");
    
app.set("views", viewsPath);
app.set("view engine", "ejs");

app.use(express.static(publicPath));

// Express EJS Layouts
app.use(expressLayouts);
app.set("layout", "layouts/index");

app.use(express.json());
// URL-encoded body parse
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.title = "KaraburunHub";
  res.locals.page = "";
  next();
});

app.use("/users", userRoutes);
app.use("/beach", beachRoutes);
app.use("/village", villageRoutes);
app.use("/organization", organizationRoutes);
app.use("/organization/category", organizationCategoryRoutes);
app.use("/place", placeRoutes);


// Ana Sayfa
app.get("/", (req, res) => {
  res.render("index", { 
    title: "Karaburun Hub", 
    message: "Hoş geldin kanka! Ana sayfa",
    activePage: "home",
    page: "home"
  });
});


app.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    activePage: "dashboard",
    page: "dashboard"
  });
});

// Restoran Yönetimi
app.get("/restourant", (req, res) => {
  const restaurants = [
    { name: "Mavi Deniz", category: "Balık", phone: "0 (232) 123 45 67", address: "Karaburun Merkez" },
    { name: "Kumru Express", category: "Fast Food", phone: "0 (232) 111 22 33", address: "Mordoğan" },
  ];

  res.render("restourant", {
    title: "Restoran Yönetimi",
    activePage: "restourant",
    page: "restourant",
    restaurants
  });
});


export default app;
