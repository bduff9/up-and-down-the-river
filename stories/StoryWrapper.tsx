import type React from 'react';
import '../app/styles/tailwind.css';

interface StoryWrapperProps {
	children: React.ReactNode;
}

export function StoryWrapper({ children }: StoryWrapperProps) {
	return <div className="p-4 bg-background text-foreground">{children}</div>;
}
