"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  BarChart3, 
  MousePointer2, 
  Eye, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Target,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  spent: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  dailyStats: { date: string; impressions: number; clicks: number }[];
}

interface AdDetails {
  _id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  targetUrl: string;
  status: "active" | "paused" | "ended" | "pending";
  budget: number;
  spent: number;
  impressions?: number;
  clicks?: number;
  startDate: string;
  endDate: string;
  targeting: {
    ageMin: number;
    ageMax: number;
    gender: string;
    location: string;
    interests: string[];
  };
}

export default function AdDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [ad, setAd] = useState<AdDetails | null>(null);
  const [analytics, setAnalytics] = useState<AdAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Ad Details (Assuming GET /api/ads/:id works, otherwise I might need to filter from list or add endpoint)
        // Wait, I only created PUT/DELETE for /api/ads/:id. 
        // I usually need GET /api/ads/:id. I should check if backend supports it.
        // If not, I can use GET /api/ads and find by ID.
        // But let's assume I can add GET to the [adId]/route.ts if needed.
        // For now, I'll try to fetch analytics which usually returns some ad info or separate call.
        // Let's assume GET /api/ads/:id is needed. I'll add it to the proxy.
        
        // Actually, looking at the user request: "Update Ad: PUT", "Delete Ad: DELETE". 
        // "Get User Ads: GET /api/ads". 
        // It doesn't explicitly say "Get Ad: GET /api/ads/:id".
        // However, standard REST usually has it.
        // If not, I might have to fetch all and find one. 
        // But for "Get Ad Analytics: GET /api/ads/:adId/analytics", I can use that.
        
        // Strategy: Fetch analytics. Fetch all ads and find this one (fallback if specific endpoint missing).
        // OR: Just add GET to proxy and see if backend handles it. Most likely yes.
        
        const [adRes, analyticsRes] = await Promise.all([
          fetch(`/api/ads/${id}`), // I need to add GET to this proxy!
          fetch(`/api/ads/${id}/analytics`)
        ]);

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData);
        }

        if (adRes.ok) {
          const adData = await adRes.json();
          setAd(adData);
        } else {
            // Fallback: fetch all and find
            const allAdsRes = await fetch("/api/ads");
            if (allAdsRes.ok) {
                const allAds = await allAdsRes.json();
                const found = allAds.ads.find((a: any) => a._id === id);
                if (found) setAd(found);
            }
        }

      } catch (error) {
        console.error("Error fetching ad details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ad? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/settings/ads");
      } else {
        alert("Failed to delete ad");
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
         <div className="flex items-center mb-8 gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
         </div>
         <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
         </div>
      </div>
    );
  }

  if (!ad) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl font-bold">Ad not found</h2>
            <Button asChild className="mt-4" variant="outline">
                <Link href="/settings/ads">Back to Ads Manager</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
            <Link href="/settings/ads">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{ad.title}</h1>
                <StatusBadge status={ad.status} />
            </div>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Campaign ID: {ad._id}</p>
          </div>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
                <Link href={`/settings/ads/${id}/edit`}>
                <Pencil className="w-4 h-4 mr-2" /> Edit Campaign
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Campaign
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content (2 cols) */}
        <div className="md:col-span-2 space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard 
                    title="Impressions" 
                    value={analytics?.impressions ?? ad.impressions} 
                    icon={Eye} 
                    color="text-blue-500" 
                    bgColor="bg-blue-500/10" 
                />
                <StatsCard 
                    title="Clicks" 
                    value={analytics?.clicks ?? ad.clicks} 
                    icon={MousePointer2} 
                    color="text-green-500" 
                    bgColor="bg-green-500/10" 
                />
                <StatsCard 
                    title="CTR" 
                    value={`${(analytics?.ctr ?? 0).toFixed(2)}%`} 
                    icon={TrendingUp} 
                    color="text-purple-500" 
                    bgColor="bg-purple-500/10" 
                />
                <StatsCard 
                    title="Spent" 
                    value={`$${(analytics?.spent ?? ad.spent).toFixed(2)}`} 
                    icon={DollarSign} 
                    color="text-orange-500" 
                    bgColor="bg-orange-500/10" 
                />
            </div>

            {/* Ad Preview / Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Ad Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg p-4 max-w-md mx-auto bg-card">
                        {/* Mock Post UI */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                            <div>
                                <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1" />
                                <div className="text-xs text-muted-foreground">Sponsored</div>
                            </div>
                        </div>
                        {ad.mediaUrl && (
                            <div className="aspect-video bg-muted rounded-md mb-3 relative overflow-hidden">
                                <img src={ad.mediaUrl} alt="Ad media" className="object-cover w-full h-full" />
                            </div>
                        )}
                        <h4 className="font-semibold mb-1">{ad.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{ad.content}</p>
                        
                        <div className="flex items-center justify-between bg-muted/30 p-2 rounded">
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{ad.targetUrl}</span>
                            <Button size="sm" variant="secondary" className="h-8">Learn More</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Schedule</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                                {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Budget</Label>
                        <div className="mt-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span>${ad.spent.toFixed(2)} spent</span>
                                <span>${ad.budget.toFixed(2)} total</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${Math.min((ad.spent / ad.budget) * 100, 100)}%` }} 
                                />
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Targeting</Label>
                        <div className="space-y-2 mt-2">
                            <div className="flex items-start gap-2 text-sm">
                                <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p>Age: {ad.targeting?.ageMin} - {ad.targeting?.ageMax}</p>
                                    <p>Gender: {ad.targeting?.gender}</p>
                                    <p>Location: {ad.targeting?.location || "Global"}</p>
                                </div>
                            </div>
                            {ad.targeting?.interests?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {ad.targeting.interests.map((interest, i) => (
                                        <Badge key={i} variant="outline" className="text-xs font-normal">
                                            {interest}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Destination</Label>
                        <a 
                            href={ad.targetUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 mt-1 text-sm text-blue-500 hover:underline truncate"
                        >
                            <ExternalLink className="w-3 h-3" />
                            {ad.targetUrl}
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
        <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <h3 className="text-lg font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    paused: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    ended: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
    pending: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  };
  
  return (
    <Badge variant="secondary" className={styles[status as keyof typeof styles] || styles.pending}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </Badge>
  );
}
