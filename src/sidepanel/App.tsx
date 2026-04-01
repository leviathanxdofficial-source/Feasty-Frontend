import * as React from 'react';
import { AuthGate } from '@/components/auth-components/AuthGate';
import { OnboardingFlow } from '@/components/onboarding-components/OnboardingFlow';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Home, BookOpen, Dumbbell, LineChart, Settings as SettingsIcon, BookHeart, Trophy } from 'lucide-react';
import { DashboardPage } from './pages/Dashboard';
import { DiaryPage } from './pages/Diary';
import { ExercisePage } from './pages/Exercise';
import { WeightPage } from './pages/Weight';
import { RecipesPage } from './pages/Recipes';
import { SettingsPage } from './pages/Settings';
import { BadgesPage } from './pages/Badges';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const { me } = useProfile();
  const needsOnboard = !!user && me && !me.user.onboarded;

  return (
    <div className="h-full">
      <AuthGate loading={loading} user={user}>
        {needsOnboard ? (
          <OnboardingFlow />
        ) : (
          <Tabs defaultValue="home" className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <TabsContent value="home" className="p-3 pt-4">
                <DashboardPage />
              </TabsContent>
              <TabsContent value="diary" className="p-3 pt-4">
                <DiaryPage />
              </TabsContent>
              <TabsContent value="exercise" className="p-3 pt-4">
                <ExercisePage />
              </TabsContent>
              <TabsContent value="weight" className="p-3 pt-4">
                <WeightPage />
              </TabsContent>
              <TabsContent value="recipes" className="p-3 pt-4">
                <RecipesPage />
              </TabsContent>
              <TabsContent value="badges" className="p-3 pt-4">
                <BadgesPage />
              </TabsContent>
              <TabsContent value="settings" className="p-3 pt-4">
                <SettingsPage />
              </TabsContent>
            </div>
            <TabsList className="m-2 grid grid-cols-7 h-12 w-auto rounded-2xl bg-[var(--color-bg-elev)] border border-[var(--color-line)] p-1">
              <TabsTrigger value="home" aria-label="home"><Home className="size-4" /></TabsTrigger>
              <TabsTrigger value="diary" aria-label="diary"><BookOpen className="size-4" /></TabsTrigger>
              <TabsTrigger value="exercise" aria-label="exercise"><Dumbbell className="size-4" /></TabsTrigger>
              <TabsTrigger value="weight" aria-label="weight"><LineChart className="size-4" /></TabsTrigger>
              <TabsTrigger value="recipes" aria-label="recipes"><BookHeart className="size-4" /></TabsTrigger>
              <TabsTrigger value="badges" aria-label="badges"><Trophy className="size-4" /></TabsTrigger>
              <TabsTrigger value="settings" aria-label="settings"><SettingsIcon className="size-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </AuthGate>
    </div>
  );
};
