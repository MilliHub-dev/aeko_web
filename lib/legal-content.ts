/**
 * Terms of Service and Privacy Policy copy.
 *
 * NOT LEGAL ADVICE — both documents must be reviewed by counsel before release.
 *
 * Kept in one module so the web pages and the mobile app state the same thing.
 * The mobile equivalents live in
 * aeko-mobile/app/(drawer)/(settings)/{privacy-policy,terms-of-service}.tsx —
 * when one changes, change the other.
 *
 * The substance describes what the code actually does rather than generic
 * template text: bcrypt-hashed passwords, server-verified Google ID tokens,
 * Cloudinary media hosting, Expo push tokens, CUSTODIAL wallet keys held
 * server-side, and payments via Stripe, Paystack and Flutterwave.
 */

export const OPERATOR = "MilliHub";
export const SERVICE_NAME = "Aeko";

/** Bump whenever the text below changes. */
export const POLICY_LAST_UPDATED = "3 September 2026";

export interface LegalSection {
  title: string;
  body: string[];
}

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "1. Who we are",
    body: [
      `${SERVICE_NAME} is operated by ${OPERATOR}. This policy explains what personal data we collect when you use ${SERVICE_NAME}, why we collect it, and the choices you have.`,
      `By using ${SERVICE_NAME} you agree to the handling of your information as described here.`,
    ],
  },
  {
    title: "2. Information you give us",
    body: [
      "Account details: your name, username, email address and password. Passwords are stored only as a salted hash — we never store or can recover the password itself.",
      "Profile content: your profile photo, cover photo, bio and interests.",
      "Content you create: posts, comments, statuses, messages, live streams and anything you upload with them.",
      "Support requests: the messages and any attachments you send us through Contact Support.",
    ],
  },
  {
    title: "3. Information we collect automatically",
    body: [
      "Usage data: the posts you view, like, bookmark and share, and the accounts you follow. We use this to build your feed and suggestions.",
      "Device and session data: device type, operating system, app version, IP address and sign-in times. We record sign-in events so you can review them under Settings → Login Activity and so we can detect suspicious access.",
      "Push token: if you enable notifications, we store the push token for the device you most recently signed in on so we can deliver them.",
    ],
  },
  {
    title: "4. Signing in with Google",
    body: [
      "If you sign in with Google, your device sends us a signed identity token. We verify that token with Google and read only your Google account identifier and verified email address from it. We do not receive your Google password, and we do not take profile information from the client as proof of who you are.",
    ],
  },
  {
    title: "5. Your wallet and on-chain activity",
    body: [
      `${SERVICE_NAME} wallets are custodial. Your wallet keys are derived and held on our servers on your behalf — you are not given a seed phrase, and the app never holds your private key. This means we can sign transactions for you, and it also means you rely on us to safeguard those keys.`,
      "Your wallet address, balance and transactions are recorded on a public blockchain. Anything written to that chain is public, permanent and outside our control — it cannot be edited or deleted by us or by you, including after you delete your account.",
      "When you buy, sell or transfer, we process the amounts, addresses and transaction identifiers involved.",
    ],
  },
  {
    title: "6. Payments",
    body: [
      "Payments are handled by third-party providers — Stripe, Paystack and Flutterwave depending on the method you choose. They receive the payment details you enter and process them under their own privacy policies.",
      "We do not store your full card number. We keep a record of the transaction, its amount, status and reference, so we can support you and meet our accounting obligations.",
    ],
  },
  {
    title: "7. Who we share it with",
    body: [
      "Other users: anything you post is shared according to the audience you choose. Public posts can be seen by anyone on Aeko.",
      "Service providers: Cloudinary hosts your uploaded media; Expo delivers push notifications; our payment providers process transactions; our email provider sends verification and password-reset messages. Each receives only what it needs to perform that task.",
      "Legal reasons: we may disclose information where we are legally required to, or where it is necessary to investigate fraud, abuse, or threats to anyone's safety.",
      "We do not sell your personal data.",
    ],
  },
  {
    title: "8. How long we keep it",
    body: [
      "We keep your account information for as long as your account exists. Statuses expire automatically after 24 hours. Security and sign-in records are kept for a limited period for account protection.",
      "When you delete your account we remove your profile, posts, comments and messages. Records we are legally required to retain, and anything already written to the blockchain, will remain.",
    ],
  },
  {
    title: "9. Your choices and rights",
    body: [
      "You can edit or delete your posts and profile at any time, make your account private, and control who sees each post.",
      "You can turn notifications off entirely, or by category, under Settings → Notifications.",
      "You can request a copy of your data, ask us to correct it, or delete your account from Settings → Account. Depending on where you live, you may have additional rights over your data, including the right to object to certain processing or to complain to your local data protection authority.",
    ],
  },
  {
    title: "10. Security",
    body: [
      "We hash passwords, encrypt data in transit, offer two-factor authentication, and invalidate your other sessions when you change your password. No service can promise perfect security, so please use a strong, unique password and enable two-factor authentication.",
    ],
  },
  {
    title: "11. Children",
    body: [
      `${SERVICE_NAME} is not intended for children under 13, and we do not knowingly collect their information. If you believe a child has created an account, please contact us and we will remove it.`,
    ],
  },
  {
    title: "12. Changes to this policy",
    body: [
      "We will update this page when our practices change and revise the date above. If a change materially affects your rights, we will tell you in the app before it takes effect.",
    ],
  },
  {
    title: "13. Contact us",
    body: [
      "If you have a question about this policy or about your data, use Settings → Help & Feedback → Contact Support. We respond to every request.",
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: "1. Agreement",
    body: [
      `These terms are between you and ${OPERATOR}, the operator of ${SERVICE_NAME}. By creating an account or using ${SERVICE_NAME} you accept them. If you do not agree, please do not use ${SERVICE_NAME}.`,
    ],
  },
  {
    title: "2. Who can use Aeko",
    body: [
      "You must be at least 13 years old, and old enough to enter a contract where you live. You may not use Aeko if we have previously removed your account.",
      "You agree to give accurate registration information and to keep it current.",
    ],
  },
  {
    title: "3. Your account",
    body: [
      "You are responsible for what happens under your account, so keep your password private and consider enabling two-factor authentication.",
      "Tell us promptly if you believe someone else has accessed your account. Changing your password signs out all other sessions.",
      "One person, one account. Do not share, sell or transfer your account.",
    ],
  },
  {
    title: "4. Your content",
    body: [
      "You keep ownership of everything you post.",
      `By posting, you grant ${OPERATOR} a non-exclusive, worldwide, royalty-free licence to host, store, reproduce and display that content for the purpose of operating and improving ${SERVICE_NAME}. This licence ends when you delete the content, except where it has already been shared with others who have not deleted it.`,
      "You confirm you have the rights to everything you post and that it does not infringe anyone else's rights.",
    ],
  },
  {
    title: "5. Rules of conduct",
    body: [
      "Do not post content that is unlawful, hateful, harassing, violent, sexually exploitative, or that promotes self-harm.",
      "Do not impersonate others, misrepresent your affiliation, or use Aeko to deceive.",
      "Do not spam, scrape, or use bots or automated means to access the service.",
      "Do not attempt to break, overload, reverse engineer or gain unauthorised access to any part of Aeko.",
      "Do not infringe intellectual property rights, or post someone's private information without their consent.",
    ],
  },
  {
    title: "6. Moderation and enforcement",
    body: [
      "You can block and report accounts and content from within the app. We review reports and may remove content, limit features, or suspend or terminate accounts that break these terms.",
      "Community owners and moderators can set rules, pin or remove posts, and mute, ban or remove members within their own communities. These terms still apply inside communities.",
      "We aim to act proportionately, and where we can we will tell you why we acted.",
    ],
  },
  {
    title: "7. Wallets, tokens and NFTs",
    body: [
      `${SERVICE_NAME} wallets are custodial: ${OPERATOR} holds and manages the keys on your behalf. You do not receive a seed phrase and cannot export the key.`,
      "Blockchain transactions are final. Once a transfer is confirmed it cannot be reversed, cancelled or refunded by us. Check the destination address carefully — funds sent to the wrong address cannot be recovered.",
      "Digital assets can lose value, and their value can be highly volatile. Nothing in Aeko is financial or investment advice, and you are responsible for any tax arising from your activity.",
      "Network fees may apply and are shown before you confirm.",
    ],
  },
  {
    title: "8. Subscriptions and payments",
    body: [
      "Some features require a paid subscription. Prices are shown before you buy, and payments are handled by our payment providers.",
      "Subscriptions renew for the period you selected unless cancelled beforehand. Cancelling stops future renewals; it does not refund the current period.",
      "Where the law gives you a right to a refund or to cancel, that right is unaffected by these terms.",
    ],
  },
  {
    title: "9. Live streaming",
    body: [
      "Live content must follow the same rules as everything else, and you are responsible for it as it happens. We may end a stream that breaks these terms.",
      "Recordings of streams may be retained and made available as replays where you have enabled that.",
    ],
  },
  {
    title: "10. Service availability",
    body: [
      `${SERVICE_NAME} is provided on an "as is" and "as available" basis. We do not promise it will be uninterrupted or error-free, and we may change, suspend or discontinue features.`,
      "We will give reasonable notice before discontinuing a feature you rely on, where it is practical to do so.",
    ],
  },
  {
    title: "11. Ending your use",
    body: [
      "You may stop using Aeko and delete your account at any time from Settings → Account.",
      "We may suspend or terminate your account if you materially or repeatedly break these terms, or where we are required to by law.",
      "Sections that by their nature should survive termination — including content licences already granted to other users, and limitations of liability — will do so.",
    ],
  },
  {
    title: "12. Liability",
    body: [
      "To the extent permitted by law, we are not liable for indirect or consequential loss, loss of profits, or loss of data arising from your use of Aeko.",
      "Nothing in these terms limits liability that cannot lawfully be limited, including for death or personal injury caused by negligence, or for fraud.",
    ],
  },
  {
    title: "13. Changes to these terms",
    body: [
      "We may update these terms. When we make a material change we will tell you in the app before it takes effect. Continuing to use Aeko after that means you accept the updated terms.",
    ],
  },
  {
    title: "14. Contact",
    body: [
      "Questions about these terms? Use Settings → Help & Feedback → Contact Support.",
    ],
  },
];
