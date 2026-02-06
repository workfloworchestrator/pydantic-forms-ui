"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { items } from '@/app/items';
import Link from 'next/link';
import { Construction } from "lucide-react"

export default function ShadcnFullPage() {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className="flex items-center gap-2">
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-12 items-center justify-between px-4">
                    <SidebarTrigger />
                </header>
                <div className="p-6">
                    <Card className="w-full">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Construction className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-2xl">Work in Progress</CardTitle>
                            <CardDescription>
                                This page is currently under development
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            <p>The full shadcn example with all form components will be available soon.</p>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
