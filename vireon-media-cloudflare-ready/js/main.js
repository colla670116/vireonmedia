const CONTACT_EMAIL = "";

const platforms = {
  meta: {
    name: "Meta",
    icon: "images/meta.svg",
    eyebrow: "Facebook + Instagram",
    headline: "Full-funnel social buying with disciplined creative iteration.",
    copy: "We build around signal quality, creative velocity and controlled campaign structures for performance-driven acquisition.",
    points: ["Campaign architecture", "Creative testing loops", "Audience and signal learning", "Placement and pacing control"],
  },
  tiktok: {
    name: "TikTok",
    icon: "images/tiktok.svg",
    eyebrow: "Native-first creative",
    headline: "Fast learning for attention-led acquisition.",
    copy: "TikTok buying is shaped around creative-market fit, rapid feedback and the pace of the platform — not recycled social ads.",
    points: ["Creative-native testing", "Pixel and event signals", "Audience expansion", "Controlled scale cycles"],
  },
  google: {
    name: "Google",
    icon: "images/google.svg",
    eyebrow: "Intent + reach",
    headline: "Capture existing demand and create new performance lanes.",
    copy: "We use search intent and Google inventory to connect the right offer with users already showing meaningful signals.",
    points: ["Search", "Display", "YouTube", "Performance Max"],
  },
  native: {
    name: "Native",
    icon: "images/native.svg",
    eyebrow: "Editorial environments",
    headline: "Native acquisition built around angle, context and pre-sell quality.",
    copy: "We approach native as its own ecosystem, aligning headline, visual, pre-lander and publisher context before scaling spend.",
    points: ["Angle and advertorial testing", "Publisher-level controls", "Pre-lander optimization", "Placement quality review"],
    networks: ["Taboola", "Outbrain", "MGID", "Revcontent", "Microsoft Audience Network"],
  },
};

function renderPlatform(id) {
  const platform = platforms[id];
  if (!platform) return;

  document.querySelectorAll(".platform-tab").forEach((tab) => {
    const active = tab.dataset.platform === id;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  const panel = document.getElementById("platform-panel");
  panel.classList.remove("panel-enter");
  void panel.offsetWidth;
  panel.querySelector(".platform-detail-icon img").src = platform.icon;
  panel.querySelector(".platform-detail-icon img").alt = `${platform.name} icon`;
  panel.querySelector("[data-platform-eyebrow]").textContent = platform.eyebrow;
  panel.querySelector("[data-platform-headline]").textContent = platform.headline;
  panel.querySelector("[data-platform-copy]").textContent = platform.copy;
  panel.querySelector("[data-platform-points]").innerHTML = platform.points
    .map((point) => `<div><span aria-hidden="true">✓</span><span>${point}</span></div>`)
    .join("");

  const networks = panel.querySelector("[data-native-networks]");
  networks.hidden = !platform.networks;
  networks.querySelector("div").innerHTML = (platform.networks || [])
    .map((network, index) => `<span class="network-chip"><b>${String(index + 1).padStart(2, "0")}</b>${network}</span>`)
    .join("");
  panel.classList.add("panel-enter");
}

document.querySelectorAll(".platform-tab").forEach((tab) => {
  tab.addEventListener("click", () => renderPlatform(tab.dataset.platform));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const tabs = [...document.querySelectorAll(".platform-tab")];
    const current = tabs.indexOf(tab);
    const next = event.key === "ArrowRight" ? (current + 1) % tabs.length : (current - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    renderPlatform(tabs[next].dataset.platform);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -60px" },
);
document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));

const form = document.getElementById("contact-form");
const submit = document.getElementById("contact-submit");
const channel = document.getElementById("contact-channel");
const helper = document.getElementById("contact-helper");
const status = document.getElementById("contact-status");
const emailReady = /^\S+@\S+\.\S+$/.test(CONTACT_EMAIL);

if (emailReady) {
  channel.textContent = CONTACT_EMAIL;
  helper.textContent = "Submitting opens a prepared email in your default mail app.";
  submit.disabled = false;
  submit.innerHTML = "Prepare inquiry <span aria-hidden=\"true\">↗</span>";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!emailReady) {
    status.textContent = "The contact email has not been connected yet.";
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(`Media buying inquiry — ${data.get("company") || data.get("name")}`);
  const body = encodeURIComponent([
    `Name: ${data.get("name")}`,
    `Company: ${data.get("company")}`,
    `Email: ${data.get("email")}`,
    `Vertical: ${data.get("vertical")}`,
    `Target GEOs: ${data.get("geos")}`,
    "",
    data.get("message"),
  ].join("\n"));
  status.textContent = "Opening your email app…";
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

renderPlatform("meta");
