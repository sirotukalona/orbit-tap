import React, {useCallback, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import {C} from './src/constants/theme';
import {SessionResult} from './src/game/scoring';
import {profile} from './src/game/store';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';

const BLANK: SessionResult = {outcome: 'failed', score: 0, bestCombo: 0, round: 1};

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [startRound, setStartRound] = useState(0);
  const [result, setResult] = useState<SessionResult>(BLANK);
  const [best, setBest] = useState(0);

  const goMenu = useCallback(() => setScreen('menu'), []);

  const goGame = useCallback((round: number) => {
    setStartRound(round);
    setScreen('game');
  }, []);

  const replay = useCallback(() => setScreen('game'), []);

  const goGameOver = useCallback((session: SessionResult) => {
    setResult(session);
    setBest(profile.commit(session.score));
    setScreen('gameover');
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {screen === 'loader' ? <LoaderScreen onReady={goMenu} /> : null}
      {screen === 'menu' ? <MenuScreen onLaunch={goGame} /> : null}
      {screen === 'game' ? (
        <GameScreen
          startRound={startRound}
          onGameOver={goGameOver}
          onExit={goMenu}
        />
      ) : null}
      {screen === 'gameover' ? (
        <GameOverScreen
          result={result}
          best={best}
          onPlayAgain={replay}
          onMenu={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.bg},
});
