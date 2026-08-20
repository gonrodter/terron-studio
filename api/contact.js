const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const body = request.body || {};
  if (body.website) return response.status(200).json({ ok: true });

  const name = clean(body.name, 100);
  const replyTo = clean(body.replyTo, 254).toLowerCase();
  const subject = clean(body.subject, 160);
  const message = clean(body.message, 5000);
  const context = clean(body.context, 80) || "general";

  if (!name || !EMAIL_PATTERN.test(replyTo) || !subject || !message) {
    return response.status(400).json({ error: "Please complete all fields with a valid email." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@terron-studio.com";
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Missing RESEND_API_KEY or CONTACT_FROM_EMAIL");
    return response.status(503).json({ error: "Email delivery is not configured yet." });
  }

  const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject: `[Terron Studio] ${subject}`,
      text: `${message}\n\n—\nFrom: ${name} <${replyTo}>\nContext: ${context}`,
      html: `<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#202124">${safeMessage}<hr style="border:0;border-top:1px solid #e0e0e0;margin:24px 0"><p style="color:#5f6368;font-size:13px">From: ${escapeHtml(name)} &lt;${escapeHtml(replyTo)}&gt;<br>Context: ${escapeHtml(context)}</p></div>`,
    }),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    console.error("Resend delivery failed", resendResponse.status, details);
    return response.status(502).json({ error: "The email service couldn't deliver the message." });
  }

  return response.status(200).json({ ok: true });
}
