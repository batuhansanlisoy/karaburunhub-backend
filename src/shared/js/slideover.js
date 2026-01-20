export async function loadForm({
    url,
    title,
    slideoverId = "slideover",
    contentId = "slideover-content",
    titleId = "slideover-title"
}) {
    const slideover = document.getElementById(slideoverId);
    const content = document.getElementById(contentId);
    const header = document.getElementById(titleId);

    if (!slideover || !content || !header) {
        console.error("Slideover elementleri bulunamadı");
        return;
    }

    header.textContent = title;
    content.innerHTML = `<div class="text-center py-5">Yükleniyor...</div>`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch failed");

        const html = await res.text();
        content.innerHTML = html;
    } catch (err) {
        content.innerHTML = `<div class="text-danger">Form yüklenemedi</div>`;
        console.error(err);
    }

    slideover.classList.add("show");
    document.body.style.overflow = "hidden";
}

export function closeSlideover(slideoverId = "slideover") {
    const slideover = document.getElementById(slideoverId);
    if (!slideover) return;

    slideover.classList.remove("show");
    document.body.style.overflow = "auto";
}
