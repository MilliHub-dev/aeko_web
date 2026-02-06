"use client";

import Link from "next/link";
import { ArrowLeft, Activity, FileText, MessageCircle, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ActivityItem {
  type: string;
  id: string;
  title: string;
  details: string;
  timestamp: string;
  metadata?: any;
}

interface Pagination {
  page: number;
  limit: number;
  hasMore: boolean;
}

interface ActivityResponse {
  success: boolean;
  activities: ActivityItem[];
  pagination: Pagination;
}

export default function ActivitySettingsPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, hasMore: true });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchActivities = useCallback(async (page: number, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(`/api/profile/activity?page=${page}&limit=20`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch activity log");
      }

      const data: ActivityResponse = await res.json();
      
      if (data.success) {
        setActivities(prev => isLoadMore ? [...prev, ...data.activities] : data.activities);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Fetch activity error:", error);
      toast.error("Failed to load activity log");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities(1);
  }, [fetchActivities]);

  const handleLoadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchActivities(pagination.page + 1, true);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "POST_CREATED":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "COMMENT_CREATED":
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case "SECURITY_EVENT":
        return <Shield className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header with back navigation */}
      <div className="flex items-center mb-8 gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
          <Link href="/settings">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Activity Log</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">View your recent posts, comments and security events</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                <Activity className="w-5 h-5" />
              </div>
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>A chronological log of your actions and account events</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && activities.length === 0 ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No activity found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative border-l border-border ml-3 space-y-8 pb-4">
                  {activities.map((activity, index) => (
                    <div key={`${activity.id}-${index}`} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className="absolute -left-[9px] top-1 w-[18px] h-[18px] rounded-full bg-background border-2 border-border flex items-center justify-center">
                         <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors">
                         <div className="p-2 rounded-full bg-background border border-border shrink-0">
                           {getActivityIcon(activity.type)}
                         </div>
                         <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-sm sm:text-base">{activity.title}</h3>
                                <time className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(activity.timestamp).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric'
                                  })}
                                </time>
                            </div>
                            <p className="text-sm text-muted-foreground break-all line-clamp-2">{activity.details}</p>
                            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                <div className="mt-2 text-xs bg-muted/50 p-2 rounded-md font-mono text-muted-foreground overflow-x-auto">
                                    {JSON.stringify(activity.metadata, null, 2)}
                                </div>
                            )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination.hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore} 
                      disabled={loadingMore}
                      className="min-w-[150px]"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
