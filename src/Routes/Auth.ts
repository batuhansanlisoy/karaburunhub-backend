import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  if ((req.session as any).isLoggedIn) return res.redirect("/beach");
  
  res.render("login", {
    title: "Giriş Yap",
    activePage: "login",
    page: "login",
    layout: false,
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    (req.session as any).isLoggedIn = true;
    res.redirect("/beach");
  } else {
    res.render("login", {
        title: "Giriş Yap",
        activePage: "login",
        page: "login",
        layout: false,
        error: "Yetkisiz Giriş!" 
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;