"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, DollarSign, Target, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditAdPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetUrl: "",
    mediaUrl: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "active",
    targeting: {
      ageMin: "18",
      ageMax: "65",
      gender: "all",
      location: "",
      interests: ""
    }
  });

  useEffect(() => {
    const fetchAd = async () => {
        try {
            // First try to fetch from details endpoint
            let res = await fetch(`/api/ads/${id}`);
            let data;
            
            if (!res.ok) {
                // Fallback to finding in list if details endpoint fails (shouldn't happen with updated proxy)
                res = await fetch("/api/ads");
                if (res.ok) {
                    const listData = await res.json();
                    data = listData.ads.find((a: any) => a._id === id);
                }
            } else {
                data = await res.json();
            }

            if (data) {
                setFormData({
                    title: data.title || "",
                    content: data.content || "",
                    targetUrl: data.targetUrl || "",
                    mediaUrl: data.mediaUrl || "",
                    budget: data.budget?.toString() || "",
                    startDate: data.startDate?.split('T')[0] || "",
                    endDate: data.endDate?.split('T')[0] || "",
                    status: data.status || "active",
                    targeting: {
                        ageMin: data.targeting?.ageMin?.toString() || "18",
                        ageMax: data.targeting?.ageMax?.toString() || "65",
                        gender: data.targeting?.gender || "all",
                        location: data.targeting?.location || "",
                        interests: data.targeting?.interests?.join(", ") || ""
                    }
                });
            } else {
                alert("Ad not found");
                router.push("/settings/ads");
            }
        } catch (error) {
            console.error("Error fetching ad:", error);
        } finally {
            setFetching(false);
        }
    };
    if (id) fetchAd();
  }, [id, router]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTargetingChange = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      targeting: { ...prev.targeting, [field]: value } 
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format payload
      const payload = {
        ...formData,
        budget: parseFloat(formData.budget),
        targeting: {
          ...formData.targeting,
          ageMin: parseInt(formData.targeting.ageMin),
          ageMax: parseInt(formData.targeting.ageMax),
          interests: formData.targeting.interests.split(",").map(i => i.trim()).filter(Boolean)
        }
      };

      const res = await fetch(`/api/ads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // toast.success("Ad updated successfully!");
        router.push(`/settings/ads/${id}`);
      } else {
        const error = await res.json();
        alert(`Failed to update ad: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating ad:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
      return (
        <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-5xl mx-auto w-full space-y-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center mb-8 gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
          <Link href={`/settings/ads/${id}`}>
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Advertisement</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Update campaign details and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Creative Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <Upload className="w-5 h-5" />
              </div>
              <CardTitle>Ad Creative</CardTitle>
            </div>
            <CardDescription>Content that will be displayed to users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Headline</Label>
              <Input 
                id="title" 
                placeholder="e.g. Summer Sale 50% Off" 
                required 
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Ad Text / Description</Label>
              <Textarea 
                id="content" 
                placeholder="Describe your offer..." 
                required 
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediaUrl">Media URL (Image/Video)</Label>
              <Input 
                id="mediaUrl" 
                placeholder="https://..." 
                value={formData.mediaUrl}
                onChange={(e) => handleChange("mediaUrl", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUrl">Destination URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="targetUrl" 
                  className="pl-9" 
                  placeholder="https://yourwebsite.com" 
                  required 
                  value={formData.targetUrl}
                  onChange={(e) => handleChange("targetUrl", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Targeting Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Target className="w-5 h-5" />
              </div>
              <CardTitle>Audience Targeting</CardTitle>
            </div>
            <CardDescription>Define who should see your ad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age Range</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    min="13" 
                    max="100" 
                    value={formData.targeting.ageMin}
                    onChange={(e) => handleTargetingChange("ageMin", e.target.value)}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    min="13" 
                    max="100" 
                    value={formData.targeting.ageMax}
                    onChange={(e) => handleTargetingChange("ageMax", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select 
                  value={formData.targeting.gender} 
                  onValueChange={(val) => handleTargetingChange("gender", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="e.g. United States, London, Tokyo" 
                value={formData.targeting.location}
                onChange={(e) => handleTargetingChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests (comma separated)</Label>
              <Input 
                id="interests" 
                placeholder="e.g. Technology, Fashion, Sports" 
                value={formData.targeting.interests}
                onChange={(e) => handleTargetingChange("interests", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget & Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <CardTitle>Budget & Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => handleChange("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget ($)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  id="budget" 
                  type="number" 
                  className="pl-7" 
                  placeholder="100.00" 
                  required 
                  min="1" 
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  required 
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  required 
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-8">
          <Button variant="outline" type="button" asChild>
            <Link href={`/settings/ads/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
