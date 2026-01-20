const Slideover = {
    el: null,
    content: null,
    title: null,

    init() {
        this.el = document.getElementById("global-slideover");
        this.content = document.getElementById("slideover-content");
        this.title = document.getElementById("slideover-title");

        // Kapatma butonu
        document.getElementById("closeSlideover")?.addEventListener("click", () => this.hide());

        // Dışarı tıklayınca kapat (slideover dışı ve tetikleyici butonlar dışı)
        document.addEventListener("click", (e) => {
            if (this.el?.classList.contains("show") && 
                !this.el.contains(e.target) && 
                !e.target.closest('.so-trigger')) {
                this.hide();
            }
        });

        // ESC tuşu
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.hide();
        });
    },

    async show(url, titleText = "İşlem") {
        if (!this.el) this.init();
        
        this.title.textContent = titleText;
        this.content.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-light"></div><p class="mt-2">Yükleniyor...</p></div>`;
        this.el.classList.add("show");
        document.body.style.overflow = "hidden";

        try {
            const res = await fetch(url);
            this.content.innerHTML = await res.text();
        } catch (err) {
            this.content.innerHTML = `<div class="alert alert-danger">İçerik yüklenemedi.</div>`;
        }
    },

    hide() {
        if (this.el) {
            this.el.classList.remove("show");
            document.body.style.overflow = "auto";
        }
    }
};

document.addEventListener("DOMContentLoaded", () => Slideover.init());