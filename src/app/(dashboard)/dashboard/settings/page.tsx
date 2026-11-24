import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getSession();
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Profile form wired to the session. Connect it to your API to persist changes.</p>
      </div>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Signed in as {session?.user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={session?.user.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={session?.user.email} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" disabled title="Connect to your API to enable">
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
