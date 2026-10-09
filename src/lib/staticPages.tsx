import React from 'react';

export const StaticPageContent: Record<string, { title: string, content: React.ReactNode }> = {
  'how-it-works': {
    title: 'How it works',
    content: (
      <>
        <h3 className="text-off-white font-bold text-lg mb-2">1. Create your Studio Profile</h3>
        <p>Set up your default currencies, taxes, and payment instructions. Upload your brand assets so every invoice carries your visual identity seamlessly.</p>
        
        <h3 className="text-off-white font-bold text-lg mb-2 mt-6">2. Build the Invoice</h3>
        <p>Use the live editor to instantly add line items, calculate totals, and preview exactly what your client will see in real-time.</p>
        
        <h3 className="text-off-white font-bold text-lg mb-2 mt-6">3. Export & Send</h3>
        <p>Hit "Export PDF" to instantly generate a high-resolution, print-ready document. Send it securely to your clients and get paid faster.</p>
      </>
    )
  },
  'features': {
    title: 'Features',
    content: (
      <>
        <ul className="space-y-4">
          <li className="flex gap-3"><strong className="text-off-white">Live Preview:</strong> See your changes exactly as they will appear on the final document.</li>
          <li className="flex gap-3"><strong className="text-off-white">Multi-Currency:</strong> Support for USD, EUR, GBP, INR, and more.</li>
          <li className="flex gap-3"><strong className="text-off-white">Tax Automation:</strong> Instantly calculate complex GST and VAT overlays.</li>
          <li className="flex gap-3"><strong className="text-off-white">QR Payments:</strong> Embed a global QR code directly onto the invoice.</li>
          <li className="flex gap-3"><strong className="text-off-white">Privacy First:</strong> Local storage architecture means your sensitive financial data never hits our servers.</li>
        </ul>
      </>
    )
  },
  'pricing': {
    title: 'Pricing',
    content: (
      <div className="text-center space-y-4 py-4">
        <h3 className="text-3xl font-black text-off-white">$0.00</h3>
        <p className="text-soft-gray uppercase tracking-widest text-xs font-bold mb-4">Forever Free</p>
        <p>Noir Labs Studio Invoice is currently in open beta and completely free to use for independent freelancers, studios, and agencies.</p>
      </div>
    )
  },
  'testimonials': {
    title: 'Testimonials',
    content: (
      <div className="space-y-6">
        <blockquote className="border-l-2 border-graphite pl-4 italic">
          "The fastest and most beautiful invoice generator I've ever used. My clients literally compliment me on my billing."
          <footer className="mt-2 text-off-white font-semibold not-italic">— Sarah J., Design Director</footer>
        </blockquote>
        <blockquote className="border-l-2 border-graphite pl-4 italic">
          "Finally, an invoicing tool that understands dark mode and typography. Noir Labs Studio nailed it."
          <footer className="mt-2 text-off-white font-semibold not-italic">— David K., Freelance Developer</footer>
        </blockquote>
      </div>
    )
  },
  'faq': {
    title: 'FAQ',
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-off-white">Is my data secure?</h4>
          <p className="mt-1">Yes. All invoice data is stored locally in your browser's LocalStorage. We do not track or store your clients' data on our servers.</p>
        </div>
        <div>
          <h4 className="font-bold text-off-white">Can I change the currency?</h4>
          <p className="mt-1">Yes, you can set a default currency in Settings, or change it on a per-invoice basis directly from the editor.</p>
        </div>
        <div>
          <h4 className="font-bold text-off-white">Does it support custom logos?</h4>
          <p className="mt-1">Yes, you can upload any image file or use the built-in 3D model viewer for premium branding.</p>
        </div>
      </div>
    )
  },
  'blog': {
    title: 'Blog',
    content: (
      <div className="text-center py-10 space-y-4">
        <p className="text-soft-gray">We are currently writing our first articles on freelance operations, cash flow optimization, and agency management.</p>
        <p className="text-off-white font-bold">Check back soon.</p>
      </div>
    )
  },
  'about': {
    title: 'About Noir Labs Studio',
    content: (
      <div className="space-y-4">
        <p>Noir Labs Studio is a digital collective focused on building premium, high-performance tools for the modern creative workforce.</p>
        <p>We believe that business administration software shouldn't look like an Excel spreadsheet from 2004. Your invoices are an extension of your brand, and our tools are designed to reflect the quality of your work.</p>
        <p className="text-off-white font-bold mt-4">Built with precision. Designed for creatives.</p>
      </div>
    )
  },
  'terms': {
    title: 'Terms and Condition',
    content: (
      <div className="space-y-4 text-sm">
        <p><strong>1. Acceptance of Terms:</strong> By accessing and using the Noir Labs Studio Invoice Generator, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <p><strong>2. Use License:</strong> Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.</p>
        <p><strong>3. Disclaimer:</strong> The materials on Noir Labs Studio's website are provided on an 'as is' basis. Noir Labs Studio makes no warranties, expressed or implied.</p>
        <p><strong>4. Limitations:</strong> In no event shall Noir Labs Studio be liable for any damages arising out of the use or inability to use the materials on the website.</p>
      </div>
    )
  },
  'privacy': {
    title: 'Privacy Policy',
    content: (
      <div className="space-y-4 text-sm">
        <p>Your privacy is critically important to us.</p>
        <p><strong>Local Storage:</strong> Our application is designed to be "local-first". The data you enter (client names, amounts, services) is stored entirely in your browser's LocalStorage. We do not transmit this data to our servers.</p>
        <p><strong>Analytics:</strong> We may collect anonymous, aggregated usage data to improve the performance and layout of the application.</p>
        <p><strong>Third-Parties:</strong> We do not share, sell, or rent your personal information to third parties for their marketing purposes.</p>
      </div>
    )
  }
};
