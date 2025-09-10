"use client";
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

export function ProgressProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ProgressProvider
            color='red'
            height='4px'
            options={{ showSpinner: false }}
            shallowRouting
        >
            {children}
        </ProgressProvider>
    );
}