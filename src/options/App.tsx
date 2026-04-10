import * as React from 'react';
import { AuthGate } from '@/components/auth-components/AuthGate';
import { OnboardingFlow } from '@/components/onboarding-components/OnboardingFlow';
import { SettingsPage } from '@/sidepanel/pages/Settings';
import { ReminderManager } from '@/components/settings-components/ReminderManager';
import { CustomFoods } from '@/components/settings-components/CustomFoods';
import { DataExport } from '@/components/settings-components/DataExport';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const { me } = useProfile();
  const needsOnboard = !!user && me && !me.user.onboarded;

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <AuthGate loading={loading} user={user}>
        {needsOnboard ? (
          <OnboardingFlow />
        ) : (
          <>
            <div className="mb-6">
              <div className="font-display text-3xl font-bold">feasty settings</div>
              <div className="text-sm text-[var(--color-muted)]">tweak the vibes 🌿</div>
            </div>
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">profile</TabsTrigger>
                <TabsTrigger value="reminders">reminders</TabsTrigger>
                <TabsTrigger value="custom">custom foods</TabsTrigger>
                <TabsTrigger value="data">data</TabsTrigger>
              </TabsList>
              <TabsContent value="profile"><SettingsPage /></TabsContent>
              <TabsContent value="reminders"><ReminderManager /></TabsContent>
              <TabsContent value="custom"><CustomFoods /></TabsContent>
              <TabsContent value="data"><DataExport /></TabsContent>
            </Tabs>
          </>
        )}
      </AuthGate>
    </div>
  );
};
