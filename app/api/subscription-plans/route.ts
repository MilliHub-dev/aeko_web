import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

const STATIC_PLANS = [
  {
    id: "aeko-basic",
    name: "Aeko Basic",
    price: 2,
    currency: "USD",
    duration: "month",
    targetAudience: "Regular users & casual creators",
    features: [
      "Edit posts after publishing",
      "Access to premium reactions & stickers",
      "Higher visibility on feeds (light boost)",
      "View profile analytics (basic insights)",
      "Bookmark unlimited posts",
      "Golden tick",
      "Early access to new features",
      "Post to NFT (sell/bid/donations)",
      "Create 3 communities",
      "Unlimited access to chat bot"
    ],
    limits: [
      "No advanced monetization",
      "No advanced analytics"
    ]
  },
  {
    id: "aeko-pro",
    name: "Aeko Pro",
    price: 3,
    currency: "USD",
    duration: "month",
    targetAudience: "Active creators, influencers, professionals",
    features: [
      "Everything in Basic",
      "Monetize posts (tips, paid posts)",
      "Subscription-only content for followers",
      "Advanced analytics (reach, engagement, growth)",
      "Higher feed ranking & discovery boost",
      "Schedule posts",
      "Upload longer videos / higher quality",
      "Create 10 communities",
      "Ad-free experience",
      "Priority support"
    ],
    limits: []
  },
  {
    id: "aeko-elite",
    name: "Aeko Elite",
    price: 5,
    currency: "USD",
    duration: "month",
    targetAudience: "High-earning creators, brands, early adopters",
    features: [
      "Everything in Pro",
      "Maximum algorithm boost & featured placement",
      "Brand collaborations & marketplace access",
      "Livestream monetization (paid live rooms)",
      "NFT / Web3 tools access (future-ready)",
      "Mining Aeko per post/engagement",
      "Creator fund eligibility",
      "API / automation access",
      "Custom profile design",
      "Dedicated account manager",
      "Early access to beta & governance features",
      "Aekai (Aeko AI) (future-ready)"
    ],
    limits: []
  }
];

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_BASE_URL}/subscription-plans`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    const data = await res.json();
    
    // If API returns success and data, use it. Otherwise fall back to static plans.
    if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
      return NextResponse.json(data);
    } else {
      // Fallback to static plans if API returns empty or fails to provide plans
      return NextResponse.json({
        success: true,
        data: STATIC_PLANS
      });
    }
  } catch (error) {
    console.error("Fetch Plans Error:", error);
    // Return static plans on error
    return NextResponse.json({
      success: true,
      data: STATIC_PLANS
    });
  }
}
