import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_PORT || "587") === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const from = process.env.FROM_EMAIL || "oussembraiek@gmail.com";
const adminEmail = "oussembraiek@gmail.com";

function sendMail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  return getTransporter().sendMail({ to, from, subject, html });
}

export async function sendNewsletterNotification(email: string) {
  await sendMail(adminEmail, "📧 Nouvel abonné Newsletter - Tunisia Nutrition", `
    <h2>Nouvel abonné à la newsletter</h2>
    <p><strong>Email :</strong> ${email}</p>
    <p>Date : ${new Date().toLocaleString("fr-TN")}</p>
  `);
}

export async function sendContactNotification(name: string, email: string, subject: string, message: string) {
  await sendMail(adminEmail, `📬 Nouveau message de ${name} - Tunisia Nutrition`, `
    <h2>Nouveau message de contact</h2>
    <p><strong>Nom :</strong> ${name}</p>
    <p><strong>Email :</strong> ${email}</p>
    <p><strong>Sujet :</strong> ${subject}</p>
    <p><strong>Message :</strong></p>
    <blockquote style="padding:12px;background:#f5f5f5;border-radius:8px">${message.replace(/\n/g, "<br>")}</blockquote>
    <p>Date : ${new Date().toLocaleString("fr-TN")}</p>
  `);
}

export async function sendOrderNotification(order: {
  customer: { name: string; phone: string; email: string; address: string; city: string; notes: string };
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}) {
  const itemsHtml = order.items
    .map((i) => `<tr><td>${i.name}</td><td>x${i.quantity}</td><td>${i.price} TND</td><td>${i.price * i.quantity} TND</td></tr>`)
    .join("");
  await sendMail(adminEmail, `🛒 Nouvelle commande - ${order.customer.name} - ${order.total} TND`, `
    <h2>Nouvelle commande reçue</h2>
    <h3>Client</h3>
    <p><strong>Nom :</strong> ${order.customer.name}</p>
    <p><strong>Téléphone :</strong> ${order.customer.phone}</p>
    <p><strong>Email :</strong> ${order.customer.email}</p>
    <p><strong>Adresse :</strong> ${order.customer.address}${order.customer.city ? `, ${order.customer.city}` : ""}</p>
    ${order.customer.notes ? `<p><strong>Notes :</strong> ${order.customer.notes}</p>` : ""}
    <h3>Articles</h3>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">Produit</th><th style="padding:8px">Qté</th><th style="padding:8px">Prix</th><th style="padding:8px">Total</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <hr>
    <p><strong>Sous-total :</strong> ${order.subtotal} TND</p>
    <p><strong>Livraison :</strong> ${order.deliveryFee === 0 ? "Gratuite" : order.deliveryFee + " TND"}</p>
    ${order.discount > 0 ? `<p><strong>Réduction :</strong> -${order.discount} TND</p>` : ""}
    <p><strong>Total :</strong> ${order.total} TND</p>
    <p>Date : ${new Date().toLocaleString("fr-TN")}</p>
  `);
}
