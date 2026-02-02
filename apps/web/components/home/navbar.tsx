import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, UserRound, Waypoints } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export function Navbar() {
    return (
        <div className="fixed top-0 left-0 flex flex-col text-xs font-medium gap-y-4 m-6 justify-start items-center">
            <Avatar size="lg" className='mb-4'>
                <AvatarFallback className='bg-foreground'>
                    <UserRound className='text-primary-foreground'/>
                </AvatarFallback>
            </Avatar>
            <div className="text-center">
                <Button asChild variant="ghost" size="icon-lg" className="p-0">
                    <Link href="/" aria-label="Home">
                        <Home className="size-6"/>
                    </Link>
                </Button>
                <p>Home</p>
            </div>
            <div className="text-center">
                <Button variant="ghost" size="icon-lg" className="p-0">
                    <Waypoints className="size-6"/>
                </Button>
                <p>Plans</p>
            </div>
            <div className="text-center">
                <Button asChild variant="ghost" size="icon-lg" className="p-0">
                    <Link href="/dms" aria-label="DM's">
                        <MessageCircle className="size-6" />
                    </Link>
                </Button>
                <p>DMs</p>
            </div>
        </div>
    );
}