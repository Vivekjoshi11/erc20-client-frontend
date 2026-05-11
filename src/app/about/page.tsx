/* eslint-disable @next/next/no-html-link-for-pages */
// app/about/page.tsx
'use client';

// import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            About NTT Token Portal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn about Non-Tradable Tokens (NTTs), roles, and functionalities in this decentralized token management system.
          </p>
        </div>

        <div className="space-y-8">
          {/* What is NTT */}
          <section className="bg-card p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4 text-accent">What is a Non-Tradable Token (NTT)?</h2>
            <p className="text-muted-foreground mb-4">
              A Non-Tradable Token (NTT) is a specialized ERC20 token designed for restricted or controlled environments.
              Unlike traditional cryptocurrencies, NTTs cannot be freely traded on open markets. They are typically used for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Voucher systems and redeemable credits</li>
              <li>Corporate token programs with usage restrictions</li>
              <li>Government or institutional token distributions</li>
              <li>Event tickets or access tokens</li>
              <li>Any scenario requiring controlled token circulation</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              NTTs are managed through smart contracts that enforce specific rules about who can send, receive, or hold the tokens.
            </p>
          </section>

          {/* Roles */}
          <section className="bg-card p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-accent">User Roles & Permissions</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Admin */}
              <div className="bg-muted p-4 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-3 text-red-400">Admin</h3>
                <p className="text-sm text-muted-foreground mb-3">System administrators with full control over NTT creation and management.</p>
                <h4 className="font-medium mb-2">Capabilities:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Register new NTTs</li>
                  <li>• Credit tokens to NTT wallets</li>
                  <li>• View admin wallet dashboard</li>
                  <li>• Monitor system transactions</li>
                </ul>
              </div>

              {/* User */}
              <div className="bg-muted p-4 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-3 text-green-400">User</h3>
                <p className="text-sm text-muted-foreground mb-3">Regular users who can interact with registered NTTs.</p>
                <h4 className="font-medium mb-2">Capabilities:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Send tokens to NTTs</li>
                  <li>• View transaction history</li>
                  <li>• Track balance across NTTs</li>
                  <li>• Redeem NTT services</li>
                </ul>
              </div>

              {/* NTT */}
              <div className="bg-muted p-4 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-3 text-purple-400">NTT Entity</h3>
                <p className="text-sm text-muted-foreground mb-3">The token itself, represented by a smart contract wallet.</p>
                <h4 className="font-medium mb-2">Capabilities:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Send tokens to users</li>
                  <li>• Refund tokens to admin</li>
                  <li>• View transaction history</li>
                  <li>• Maintain token balance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Workflow */}
          <section className="bg-card p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4 text-accent">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
                <div>
                  <h3 className="font-semibold">NTT Registration</h3>
                  <p className="text-muted-foreground">Admin registers a new NTT with details like name, physical address, and initial setup.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
                <div>
                  <h3 className="font-semibold">Token Crediting</h3>
                  <p className="text-muted-foreground">Admin credits tokens to the NTT&apos;s wallet for distribution to users.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
                <div>
                  <h3 className="font-semibold">User Interaction</h3>
                  <p className="text-muted-foreground">Users send tokens to NTTs to access services or redeem vouchers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
                <div>
                  <h3 className="font-semibold">NTT Distribution</h3>
                  <p className="text-muted-foreground">NTT entities can distribute tokens back to users or refund to admin as needed.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">5</div>
                <div>
                  <h3 className="font-semibold">Transaction Tracking</h3>
                  <p className="text-muted-foreground">All parties can view detailed transaction histories and balances.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section className="bg-card p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Technical Implementation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Smart Contracts</h3>
                <p className="text-sm text-muted-foreground">
                  Built on Ethereum-compatible blockchains using Solidity smart contracts that manage NTT creation, transfers, and access controls.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">
                  Uses OpenZeppelin&apos;s AccessControl for ADMIN, USER, and NTT roles, ensuring secure and controlled operations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Frontend Interface</h3>
                <p className="text-sm text-muted-foreground">
                  React-based web application using Next.js, ethers.js for blockchain interaction, and Tailwind CSS for styling.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Implements MetaMask wallet integration for secure transaction signing and user authentication.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center mt-10">
          <a href="/" className="inline-block bg-accent text-accent-foreground font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-accent/80 transition-all duration-200 hover:shadow-xl hover:scale-105">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}