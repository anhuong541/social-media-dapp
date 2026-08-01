export const NAV_ITEMS = [
  {
    href: "/",
    label: "Stream",
    icon: "radio",
  },
  {
    href: "/room",
    label: "Hi!",
    icon: "message-circle",
  },
  {
    href: "profile",
    label: "Feed History",
    icon: "user",
  },
] as const;

export const HASHTAG_ITEMS = [
  { title: "graduation thesis" },
  { title: "web3" },
  { title: "Nimbus" },
  { title: "vku university" },
  { title: "daihoc" },
  { title: "VKU" },
] as const;

export const FOOTER_LINKS = [
  { href: "/", label: "Privacy" },
  { href: "/", label: "About us" },
  { href: "/", label: "Feedback" },
] as const;

export const SOCIAL_LINKS = [
  {
    href: "https://github.com/anhuong541",
    label: "GitHub",
    icon: "github",
  },
  {
    href: "https://twitter.com/nguynxunnhng1",
    label: "X",
    icon: "x",
  },
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    icon: "facebook",
  },
  {
    href: "https://www.linkedin.com/in/huong-nguyen-xuan/",
    label: "LinkedIn",
    icon: "linkedin",
  },
  {
    href: "https://react.dev/",
    label: "React",
    icon: "react",
  },
] as const;

export type DirectWalletType = "unselected_wallet_@" | string;

export const UNSELECTED_WALLET = "unselected_wallet_@" as const;
