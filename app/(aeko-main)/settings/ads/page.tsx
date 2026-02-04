"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Megaphone, 
  Plus, 
  BarChart3, 
  MousePointer2, 
  Eye, 
  TrendingUp,
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils"; // Assuming this exists, otherwise I'll mock it or implement inline
import { toast } from "sonner"; // Assuming sonner is used, or use existing toast method

// Types
interface Ad {
  _id: string;
  title: string;
  status: "active" | "paused" | "ended" | "pending";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
}

interface AdStats {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpent: number;
  activeAdsCount: number;
}

export default function AdsDashboardPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [stats, setStats] = useState<AdStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adsRes, statsRes] = await Promise.all([
          fetch("/api/ads"),
          fetch("/api/ads/dashboard")
        ]);

        if (adsRes.ok && statsRes.ok) {
          const adsData = await adsRes.json();
          const statsData = await statsRes.json();
          setAds(adsData.ads || []); // Adjust based on actual API response structure
          setStats(statsData);
        }
      } catch (error) {
        console.error("Failed to fetch ads data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    
    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAds(ads.filter(ad => ad._id !== id));
        // toast.success("Ad deleted successfully");
      } else {
        // toast.error("Failed to delete ad");
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
            <Link href="/settings">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Ads Manager</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your campaigns and track performance</p>
          </div>
        </div>
        <Button asChild className="gap-2">
          <Link href="/settings/ads/create">
            <Plus className="w-4 h-4" /> Create Ad
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard 
          title="Total Impressions" 
          value={stats?.totalImpressions} 
          icon={Eye} 
          loading={loading}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <StatsCard 
          title="Total Clicks" 
          value={stats?.totalClicks} 
          icon={MousePointer2} 
          loading={loading}
          color="text-green-500"
          bgColor="bg-green-500/10"
        />
        <StatsCard 
          title="Conversions" 
          value={stats?.totalConversions} 
          icon={TrendingUp} 
          loading={loading}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
        />
        <StatsCard 
          title="Total Spent" 
          value={stats ? `$${stats.totalSpent.toFixed(2)}` : undefined} 
          icon={BarChart3} 
          loading={loading}
          color="text-orange-500"
          bgColor="bg-orange-500/10"
        />
      </div>

      {/* Ads List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Campaigns</CardTitle>
          <CardDescription>Overview of your active and past advertisements</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No ads created yet</p>
              <p className="mb-6">Start your first campaign to reach more people.</p>
              <Button asChild variant="outline">
                <Link href="/settings/ads/create">Create Ad</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{ad.title}</h3>
                      <StatusBadge status={ad.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {ad.impressions}</span>
                      <span className="flex items-center gap-1"><MousePointer2 className="w-3 h-3" /> {ad.clicks}</span>
                      <span>Spent: ${ad.spent.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/settings/ads/${ad._id}`}>View Analytics</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/settings/ads/${ad._id}/edit`}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(ad._id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, loading, color, bgColor }: any) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-20 mt-1" />
          ) : (
            <h3 className="text-2xl font-bold">{value ?? 0}</h3>
          )}
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
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
