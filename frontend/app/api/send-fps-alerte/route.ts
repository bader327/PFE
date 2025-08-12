import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Petite fonction simple d’échappement HTML (basique)
function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return m;
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Requête reçue dans /api/send-fps-alert :", body);
    const { operateur, defaut, produit, numeroBobine, cause, actions } = body;

    if (
      !operateur ||
      !defaut ||
      !produit ||
      !numeroBobine ||
      !cause ||
      !Array.isArray(actions)
    ) {
      return NextResponse.json(
        { success: false, error: "Champs manquants ou invalides." },
        { status: 400 }
      );
    }

    const html = `
      <h2>🚨 Nouvelle alerte FPS Niveau 1</h2>
      <p><strong>👤 Opérateur :</strong> ${escapeHtml(operateur)}</p>
      <p><strong>❌ Défaut :</strong> ${escapeHtml(defaut)}</p>
      <p><strong>📦 Produit :</strong> ${escapeHtml(produit)}</p>
      <p><strong>🎯 Bobine :</strong> ${escapeHtml(numeroBobine)}</p>
      <p><strong>🔍 Cause :</strong> ${escapeHtml(cause)}</p>
      <p><strong>🛠️ Actions :</strong></p>
      <ul>
        ${actions
          .map(
            (a: { description: string; resolu: boolean }, i: number) =>
              `<li><strong>Action ${i + 1}</strong>: ${escapeHtml(
                a.description
              )} ${a.resolu ? "(✔️ Résolu)" : "(❌ Non résolu)"}</li>`
          )
          .join("")}
      </ul>
    `;

    // Envoi email via Resend
    const response = await resend.emails.send({
      from: process.env.RESEND_SENDER!,
      to: [process.env.RESEND_RECEIVER!],
      subject: `⚠️ Alerte FPS Niveau 1 - ${defaut}`,
      html,
    });

    console.log(response);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur serveur :", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
