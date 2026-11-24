import Link from "next/link";
import { Brand } from "@/components/dashboard/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Sign in" };

/** UI only. Point the form at your auth provider (Auth.js, Clerk, Supabase, Cognito…). */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 p-4">
      <Brand />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Demo screen: authentication is not connected yet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" render={<Link href="/dashboard" />}>
            Continue to demo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
