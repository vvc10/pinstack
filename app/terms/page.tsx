export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P.</span>
          </div>
          <span className="font-bold text-xl">Pinstack</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Pinstack, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Permission is granted to temporarily use Pinstack for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Content Guidelines</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You are responsible for the content you post. By using our service, you agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Post content that is illegal, harmful, or violates any laws</li>
              <li>Post content that infringes on intellectual property rights</li>
              <li>Post spam, misleading, or deceptive content</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Content Moderation</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to review, edit, or remove any content at our sole discretion. All submitted content is subject to admin approval before being visible to other users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on Pinstack are provided on an 'as is' basis. Pinstack makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Pinstack or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Pinstack, even if Pinstack or a Pinstack authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pinstack may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="https://x.com/pankajstwt" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                @pankajstwt
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
