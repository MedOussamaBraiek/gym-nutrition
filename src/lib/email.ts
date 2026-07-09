import nodemailer from "nodemailer";

const primary = "#dc2626";
const dark = "#111111";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const from = process.env.FROM_EMAIL || "oussemabraiek@gmail.com";
const adminEmail = "oussemabraiek@gmail.com";

const baseStyle = `
  body { margin:0; padding:0; background:#f4f4f4; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; padding:20px 10px; }
  .card { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
  .header { background:#000; padding:30px 24px; text-align:center; }
  .header h1 { color:#fff; margin:0; font-size:20px; letter-spacing:1px; }
  .header .dot { color:${primary}; }
  .body { padding:24px; }
  .body h2 { color:#111; font-size:18px; margin:0 0 16px; }
  .body p { color:#555; line-height:1.6; margin:0 0 8px; font-size:14px; }
  .label { color:#888; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; }
  .value { color:#111; font-size:14px; font-weight:600; margin-bottom:12px; }
  .divider { border:none; border-top:1px solid #eee; margin:20px 0; }
  table { width:100%; border-collapse:collapse; }
  th { text-align:left; padding:8px; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #eee; }
  td { padding:8px; font-size:14px; color:#333; border-bottom:1px solid #f4f4f4; }
  .total-row td { font-weight:700; color:#111; border-bottom:none; padding-top:12px; }
  .footer { text-align:center; padding:20px; color:#aaa; font-size:12px; }
  .footer a { color:${primary}; text-decoration:none; }
  .btn { display:inline-block; background:${primary}; color:#fff; padding:12px 28px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:600; margin-top:16px; }
  .badge { display:inline-block; background:${primary}; color:#fff; font-size:12px; padding:4px 12px; border-radius:20px; }
`;

function wrap(html: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${baseStyle}</style></head>
<body>
<div class="wrapper">
<div class="card">
<div class="header">
<h1>Tunisia <span class="dot">Nutrition</span></h1>
</div>
<div class="body">${html}</div>
</div>
<div class="footer">
<p>Tunisia Nutrition — Votre boutique de confiance en Tunisie</p>
<p><a href="https://gym-nutrition-sigma.vercel.app">gym-nutrition-sigma.vercel.app</a></p>
</div>
</div>
</body></html>`;
}

function sendMail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("SMTP not configured — skipping email");
    return;
  }
  return getTransporter()
    .sendMail({ to, from, subject, html: wrap(html) })
    .catch((err) => {
      console.error("SMTP send error:", err.message, err.code);
    });
}

export async function sendNewsletterNotification(email: string) {
  await sendMail(
    adminEmail,
    "📧 Nouvel abonné Newsletter",
    `
    <h2>Nouvel abonné</h2>
    <p class="label">Email</p>
    <p class="value">${email}</p>
    <hr class="divider">
    <p class="label">Date</p>
    <p class="value">${new Date().toLocaleString("fr-TN")}</p>
  `,
  );
}

export async function sendContactNotification(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  await sendMail(
    adminEmail,
    `📬 ${name} t'a envoyé un message`,
    `
    <h2>Nouveau message de contact</h2>
    <p class="label">Nom</p>
    <p class="value">${name}</p>
    <p class="label">Email</p>
    <p class="value">${email}</p>
    <p class="label">Sujet</p>
    <p class="value">${subject}</p>
    <hr class="divider">
    <p class="label">Message</p>
    <p style="background:#f9f9f9;padding:16px;border-radius:8px;color:#333;font-size:14px;line-height:1.6">${message.replace(/\n/g, "<br>")}</p>
  `,
  );
}

export async function sendContactConfirmation(name: string, email: string) {
  await sendMail(
    email,
    "✅ Message reçu — Tunisia Nutrition",
    `
    <h2>Merci ${name} !</h2>
    <p>On a bien reçu ton message et on te répondra dans les plus brefs délais.</p>
    <p>Notre équipe est disponible du <strong>Lun au Sam (9h-18h)</strong>.</p>
    <hr class="divider">
    <p style="font-size:13px;color:#888">En attendant, n'hésite pas à découvrir nos <a href="https://gym-nutrition-sigma.vercel.app/products" style="color:${primary}">nouveautés</a>.</p>
  `,
  );
}

export async function sendOrderNotification(order: {
  _id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    notes: string;
  };
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}) {
  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${i.price} TND</td><td>${(i.price * i.quantity).toFixed(2)} TND</td></tr>`,
    )
    .join("");

  await sendMail(
    adminEmail,
    `🛒 Nouvelle commande — ${order.customer.name}`,
    `
    <h2>Nouvelle commande reçue</h2>
    <p style="margin-bottom:16px;font-size:13px;color:#888">Commande #${order._id.toString().slice(-8).toUpperCase()}</p>
    <h3 style="font-size:15px;color:#111;margin:0 0 12px">Client</h3>
    <p class="label">Nom</p>
    <p class="value">${order.customer.name}</p>
    <p class="label">Téléphone</p>
    <p class="value">${order.customer.phone}</p>
    <p class="label">Email</p>
    <p class="value">${order.customer.email || "—"}</p>
    <p class="label">Adresse</p>
    <p class="value">${order.customer.address}${order.customer.city ? `, ${order.customer.city}` : ""}</p>
    ${order.customer.notes ? `<p class="label">Notes</p><p class="value">${order.customer.notes}</p>` : ""}
    <hr class="divider">
    <h3 style="font-size:15px;color:#111;margin:0 0 12px">Articles</h3>
    <table><thead><tr><th>Produit</th><th>Qté</th><th>Prix</th><th>Total</th></tr></thead>
    <tbody>${itemsHtml}</tbody></table>
    <hr class="divider">
    <table>
      <tr><td style="padding:4px 8px;color:#888;font-size:14px">Sous-total</td><td style="padding:4px 8px;text-align:right;color:#333;font-size:14px">${order.subtotal.toFixed(2)} TND</td></tr>
      <tr><td style="padding:4px 8px;color:#888;font-size:14px">Livraison</td><td style="padding:4px 8px;text-align:right;color:#333;font-size:14px">${order.deliveryFee === 0 ? "Gratuite" : order.deliveryFee.toFixed(2) + " TND"}</td></tr>
      ${order.discount > 0 ? `<tr><td style="padding:4px 8px;color:#888;font-size:14px">Réduction</td><td style="padding:4px 8px;text-align:right;color:#059669;font-size:14px">-${order.discount.toFixed(2)} TND</td></tr>` : ""}
      <tr><td style="padding:8px;font-weight:700;color:#111;font-size:16px">Total</td><td style="padding:8px;text-align:right;font-weight:700;color:#111;font-size:16px">${order.total.toFixed(2)} TND</td></tr>
    </table>
  `,
  );
}

export async function sendOrderConfirmation(order: {
  _id: string;
  customer: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}) {
  if (!order.customer.email) return;

  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${i.price} TND</td><td>${(i.price * i.quantity).toFixed(2)} TND</td></tr>`,
    )
    .join("");

  await sendMail(
    order.customer.email,
    "✅ Commande confirmée — Tunisia Nutrition",
    `
    <h2>Merci ${order.customer.name} !</h2>
    <p style="font-size:15px">Ta commande a bien été reçue <span style="font-size:20px">🎉</span></p>
    <p style="font-size:13px;color:#888">Commande #${order._id.toString().slice(-8).toUpperCase()}</p>
    <hr class="divider">
    <h3 style="font-size:15px;color:#111;margin:0 0 12px">Récapitulatif</h3>
    <table><thead><tr><th>Produit</th><th>Qté</th><th>Prix</th><th>Total</th></tr></thead>
    <tbody>${itemsHtml}</tbody></table>
    <hr class="divider">
    <table>
      <tr><td style="padding:4px 8px;color:#888;font-size:14px">Sous-total</td><td style="padding:4px 8px;text-align:right;color:#333;font-size:14px">${order.subtotal.toFixed(2)} TND</td></tr>
      <tr><td style="padding:4px 8px;color:#888;font-size:14px">Livraison</td><td style="padding:4px 8px;text-align:right;color:#333;font-size:14px">${order.deliveryFee === 0 ? "Gratuite" : order.deliveryFee.toFixed(2) + " TND"}</td></tr>
      ${order.discount > 0 ? `<tr><td style="padding:4px 8px;color:#888;font-size:14px">Réduction</td><td style="padding:4px 8px;text-align:right;color:#059669;font-size:14px">-${order.discount.toFixed(2)} TND</td></tr>` : ""}
      <tr><td style="padding:8px;font-weight:700;color:#111;font-size:16px">Total</td><td style="padding:8px;text-align:right;font-weight:700;color:#111;font-size:16px">${order.total.toFixed(2)} TND</td></tr>
    </table>
    <hr class="divider">
    <p style="font-size:14px;color:#555"><strong>🚚 Paiement à la livraison</strong><br>Prépare le montant en espèces. Notre livreur te contactera avant le passage.</p>
    <p style="font-size:13px;color:#888">Une question ? Réponds à cet email ou appelle-nous au +216 12 345 678.</p>
  `,
  );
}
