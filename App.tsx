import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';

import {DEFAULT_DIFFICULTY, type DifficultyId} from './src/constants/config';
import theme from './src/constants/theme';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import {commitRun, type RunResult} from './src/game/stats';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';

const EMPTY_RESULT: RunResult = {
  score: 0,
  round: 1,
  perfects: 0,
  bestStreak: 0,
};

/** State machine only — no gameplay lives here. */
function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [difficulty, setDifficulty] = useState<DifficultyId>(DEFAULT_DIFFICULTY);
  const [result, setResult] = useState<RunResult>(EMPTY_RESULT);
  const [isBest, setIsBest] = useState(false);
  const [runId, setRunId] = useState(0);

  // Hardware back must never fall through to Android, or the launcher ends
  // up in the capture set. The screen check only decides where to go.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setScreen(prev => (prev === 'loader' || prev === 'menu' ? prev : 'menu'));
      return true;
    });
    return () => sub.remove();
  }, []);

  const handleLoaderDone = useCallback(() => setScreen('menu'), []);

  const handleLaunch = useCallback(() => {
    setRunId(n => n + 1);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback((run: RunResult) => {
    setIsBest(commitRun(run));
    setResult(run);
    setScreen('gameover');
  }, []);

  const handleAgain = useCallback(() => {
    setRunId(n => n + 1);
    setScreen('game');
  }, []);

  const handleMenu = useCallback(() => setScreen('menu'), []);

  let body: React.ReactNode = null;
  if (screen === 'loader') {
    body = <LoaderScreen onDone={handleLoaderDone} />;
  } else if (screen === 'menu') {
    body = (
      <MenuScreen
        difficulty={difficulty}
        onDifficulty={setDifficulty}
        onLaunch={handleLaunch}
      />
    );
  } else if (screen === 'game') {
    body = (
      <GameScreen
        key={'run' + String(runId)}
        difficulty={difficulty}
        onGameOver={handleGameOver}
        onQuit={handleMenu}
      />
    );
  } else {
    body = (
      <GameOverScreen
        result={result}
        isBest={isBest}
        onAgain={handleAgain}
        onMenu={handleMenu}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});

export default App;
