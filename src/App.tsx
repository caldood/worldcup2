import { useState } from 'react';
import { GameProvider } from './state/GameContext';
import { MainMenu } from './components/screens/MainMenu';
import { BracketScreen } from './components/screens/BracketScreen';
import { MatchScreen } from './components/screens/MatchScreen';
import { LockerScreen } from './components/screens/LockerScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';

type Screen = 'menu' | 'bracket' | 'match' | 'locker' | 'achievements';

function GameApp() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [activeRound, setActiveRound] = useState(0);

  return (
    <div className="mx-auto h-[100dvh] max-w-md overflow-hidden bg-emerald-950 shadow-2xl">
      {screen === 'menu' && <MainMenu onPlay={() => setScreen('bracket')} />}
      {screen === 'bracket' && (
        <BracketScreen
          onPlayRound={(index) => {
            setActiveRound(index);
            setScreen('match');
          }}
          onNavigate={setScreen}
        />
      )}
      {screen === 'match' && <MatchScreen roundIndex={activeRound} onExit={() => setScreen('bracket')} />}
      {screen === 'locker' && <LockerScreen onBack={() => setScreen('bracket')} />}
      {screen === 'achievements' && <AchievementsScreen onBack={() => setScreen('bracket')} />}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

export default App;
