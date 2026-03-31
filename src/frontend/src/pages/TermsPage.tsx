import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link
          to="/"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <FileText className="w-5 h-5 text-primary" />
        <span className="font-semibold text-foreground">
          Terms of Service — DantaNova
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-primary">Terms of Service</h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: March 23, 2026
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          By accessing or using DantaNova (&quot;the App&quot;,
          &quot;Service&quot;), you agree to be bound by these Terms of Service.
          If you do not agree, please discontinue use of the App immediately.
        </Section>

        <Section title="2. Description of Service">
          DantaNova is an AI-assisted dental health analysis web application. It
          uses simulated image analysis to identify potential dental conditions
          from camera captures. The Service is accessible at{" "}
          <strong>dentaai-scanner-n0h.caffeine.xyz</strong> and requires
          authentication via Internet Identity.
        </Section>

        <Section title="3. Medical Disclaimer">
          <div className="bg-card border border-primary/30 rounded-xl p-4">
            <p className="text-primary font-semibold mb-2">
              ⚠ Important — Not Medical Advice
            </p>
            <p>
              DantaNova is{" "}
              <strong>
                NOT a substitute for professional dental advice, diagnosis, or
                treatment.
              </strong>{" "}
              All analysis results are simulated and for informational and
              educational purposes only. Always seek the advice of a qualified
              dentist or other healthcare provider for any dental concerns.
              Never disregard professional dental advice or delay seeking it
              because of information provided by this App.
            </p>
          </div>
        </Section>

        <Section title="4. User Responsibilities">
          By using the App, you agree to:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Use the Service only for lawful and personal purposes.</li>
            <li>Not attempt to reverse-engineer, scrape, or misuse the App.</li>
            <li>
              Not share your account credentials or Internet Identity with
              others.
            </li>
            <li>Not submit harmful, offensive, or misleading feedback.</li>
            <li>
              Acknowledge that scan results are simulated and not clinically
              validated.
            </li>
          </ul>
        </Section>

        <Section title="5. Intellectual Property">
          All content, branding, design, and code within DantaNova is the
          intellectual property of DantaNova and its creators. ©{" "}
          {new Date().getFullYear()} DantaNova. All rights reserved.
          Unauthorized reproduction, distribution, or modification of any part
          of this Service is prohibited without prior written consent.
        </Section>

        <Section title="6. Limitation of Liability">
          To the maximum extent permitted by applicable law, DantaNova and its
          developers shall not be liable for:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Any inaccuracies in simulated dental analysis results.</li>
            <li>Any health decisions made based on App outputs.</li>
            <li>Service interruptions, data loss, or technical failures.</li>
            <li>
              Indirect, incidental, special, or consequential damages of any
              kind.
            </li>
          </ul>
          Use of this App is at your own risk.
        </Section>

        <Section title="7. Governing Law">
          These Terms shall be governed by and construed in accordance with
          applicable laws. Any disputes arising from these Terms or use of the
          App shall be resolved amicably or through appropriate legal channels
          in the jurisdiction of the App's primary operators.
        </Section>

        <Section title="8. Changes to Terms">
          We reserve the right to update these Terms of Service at any time.
          Material changes will be reflected by updating the &quot;Last
          Updated&quot; date above. Continued use of the App after changes
          constitutes acceptance of the revised Terms.
        </Section>

        <Section title="9. Contact">
          For questions about these Terms:
          <br />📧{" "}
          <a
            href="mailto:dentanova@support.com"
            className="text-primary hover:underline"
          >
            dentanova@support.com
          </a>
        </Section>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </p>
        <p className="mt-1">Developed by Swanandi Manoj Vispute</p>
        <p className="mt-1">
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-yellow-400 hover:text-yellow-300"
          >
            DANTANOVA.14@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-primary border-b border-primary/20 pb-1">
        {title}
      </h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}
