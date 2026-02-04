"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Search, HelpCircle, FileText, MessageSquare, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function HelpCenterPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Ticket created successfully");
        setOpen(false);
        setFormData({
          subject: "",
          description: "",
          category: "general",
          priority: "medium",
        });
      } else {
        toast.error(data.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("An error occurred while creating ticket");
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Help Center</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Find answers to your questions and contact support</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search for help articles..." 
            className="pl-10 h-12 text-lg bg-card/50 backdrop-blur-sm"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
           <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Documentation</CardTitle>
                <CardDescription>Read our detailed guides</CardDescription>
              </div>
            </CardHeader>
           </Card>
           
           <Dialog open={open} onOpenChange={setOpen}>
             <DialogTrigger asChild>
               <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Contact Support</CardTitle>
                    <CardDescription>Get help from our team</CardDescription>
                  </div>
                </CardHeader>
               </Card>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>Create Support Ticket</DialogTitle>
                 <DialogDescription>
                   Fill out the form below to create a new support ticket. We'll get back to you as soon as possible.
                 </DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit} className="space-y-4 py-4">
                 <div className="space-y-2">
                   <Label htmlFor="subject">Subject</Label>
                   <Input 
                     id="subject" 
                     placeholder="Brief summary of the issue"
                     value={formData.subject}
                     onChange={(e) => setFormData({...formData, subject: e.target.value})}
                     required
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="category">Category</Label>
                     <Select 
                       value={formData.category} 
                       onValueChange={(value) => setFormData({...formData, category: value})}
                     >
                       <SelectTrigger id="category">
                         <SelectValue placeholder="Select category" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="general">General</SelectItem>
                         <SelectItem value="technical">Technical Issue</SelectItem>
                         <SelectItem value="billing">Billing & Payment</SelectItem>
                         <SelectItem value="account">Account Support</SelectItem>
                         <SelectItem value="feature">Feature Request</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="priority">Priority</Label>
                     <Select 
                       value={formData.priority} 
                       onValueChange={(value) => setFormData({...formData, priority: value})}
                     >
                       <SelectTrigger id="priority">
                         <SelectValue placeholder="Select priority" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="low">Low</SelectItem>
                         <SelectItem value="medium">Medium</SelectItem>
                         <SelectItem value="high">High</SelectItem>
                         <SelectItem value="urgent">Urgent</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="description">Description</Label>
                   <Textarea 
                     id="description" 
                     placeholder="Please describe your issue in detail..."
                     className="min-h-[120px]"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     required
                   />
                 </div>
                 
                 <DialogFooter>
                   <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                   <Button type="submit" disabled={loading}>
                     {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Submit Ticket
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
        </div>

        {/* FAQs */}
        <Card>
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                <HelpCircle className="w-5 h-5" />
              </div>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I change my password?</AccordionTrigger>
                <AccordionContent>
                  You can change your password in the Account & Profile settings. Go to Settings &gt; Account & Profile &gt; Change Password.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How can I make my account private?</AccordionTrigger>
                <AccordionContent>
                  To make your account private, navigate to Settings &gt; Privacy & Security and toggle the "Private Account" switch.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I delete my account?</AccordionTrigger>
                <AccordionContent>
                   We're sorry to see you go. You can find the option to delete your account at the bottom of the Privacy & Security settings page.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Where can I view my blocked users?</AccordionTrigger>
                <AccordionContent>
                  Blocked users can be managed in the Privacy & Security settings under the "Interactions" section (coming soon).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
