import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet, Text, TouchableOpacity, View, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TNavigationScreenProps } from '../AppRoutes';
import { Theme } from '../shared/themes/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { updateStateByElapsedTime } from '../shared/helper/UpdateStateByElapsedTime';
import { NotificationService } from '../shared/services/NotificationService';


export const Home = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  const [appRunningState, setAppRunningState] = useState(AppState.currentState);

  useEffect(() => {
    const listener = AppState.addEventListener('change', setAppRunningState);

    return () => listener.remove();
  }, []);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [step, setStep] = useState<1|2|3|4>(1);
  const [currentStatus, setCurrentStatus] = useState<'focus'|'shortBreak'|'longBreak'>('focus');

  const [currentCircleTime, setCurrentCircleTime] = useState(25*60);
  const [currentShortBreakTime, setCurrentShortBreakTime] = useState(5*60);
  const [currentLongBreakTime, setCurrentLongBreakTime] = useState(15*60);
  const [counterCircleTime, setCounterCircleTime] = useState(currentCircleTime);
  const [notificationActivated, setNotificationActivated] = useState(false);

  useFocusEffect(
    useCallback(() => {
      Promise
        .all([
          AsyncStorage.getItem('FOCUS_PERIOD'),
          AsyncStorage.getItem('SHORT_BREAK_PERIOD'),
          AsyncStorage.getItem('LONG_BREAK_PERIOD'),
          AsyncStorage.getItem('NOTIFICATION_ACTIVATED')
        ])
        .then(([focus, short, long, notification_activated]) => {
          setCurrentCircleTime(JSON.parse(focus || '25') * 60);
          setCurrentShortBreakTime(JSON.parse(short || '5') * 60);
          setCurrentLongBreakTime(JSON.parse(long || '15') * 60);
          setNotificationActivated(JSON.parse(notification_activated || 'false'));
        })
    }, [])
  )

  useEffect(() => {
    if(isRunning && !isPaused){
      const ref = setInterval(() => {
          setCounterCircleTime(old => old <= 0 ? old : old - 1);
      }, 1000);
      return () => clearInterval(ref);
    }
  }, [isRunning, isPaused]);

  useEffect(() => {    
    switch (currentStatus) {
      case 'focus': {
          if (counterCircleTime > 0) break;

          if (step < 4) {
            setStep(old => (old + 1) as 1);
            setCurrentStatus('shortBreak');
            setCounterCircleTime(currentShortBreakTime);
          } else {
            setStep(1);
            setCurrentStatus('longBreak');
            setCounterCircleTime(currentLongBreakTime);
          }
      } 
      break;
      case 'longBreak':
      case 'shortBreak': {
        if(counterCircleTime <= 0){
          setCurrentStatus('focus');
          setCounterCircleTime(currentCircleTime);
        }
      }  
      break;


    }

  }, [counterCircleTime, isPaused, isRunning, currentStatus, step, currentShortBreakTime, currentLongBreakTime, currentCircleTime]);


  const isShouldUpdate = useRef(true);
  useEffect(() => {
    
    if(isShouldUpdate.current){
      isShouldUpdate.current = false;
      
      AsyncStorage.getItem('APP_STATE')
        .then(value => {
          const appState = JSON.parse(value || 'null');
          if(!appState) return;

          const updatedState = updateStateByElapsedTime(appState);
      
          setCounterCircleTime(updatedState.counterCircleTime);
          setCurrentStatus(updatedState.currentStatus);
          setIsRunning(updatedState.isRunning);
          setIsPaused(updatedState.isPaused);
          setStep(updatedState.step);
      })
    }

    if(appRunningState === 'background' || appRunningState === 'inactive'){
      isShouldUpdate.current = true;
    }


  }, [appRunningState]);


  useEffect(() => {
    if(!notificationActivated){
      NotificationService.deactivateNotification();
      return;
    }

    if(appRunningState !== 'active' && isRunning && !isPaused){
      NotificationService.activateNotification();
    } else {
      NotificationService.deactivateNotification();
    }
  }, [appRunningState, isRunning, isPaused, notificationActivated]);

  useEffect(() => {
    NotificationService.requestPermission();
  }, [])


  const handleStart = async () => {
    setIsRunning(true);
    setIsPaused(false);

    AsyncStorage.setItem('APP_STATE', JSON.stringify({
      step,
      isPaused: false,
      isRunning: true,
      currentStatus,
      time: Date.now(),
      counterCircleTime,
      currentCircleTime,
      currentLongBreakTime,
      currentShortBreakTime
    }));

  }

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);

    AsyncStorage.setItem('APP_STATE', JSON.stringify({
      step,
      isPaused: true,
      isRunning: false,
      currentStatus,
      time: Date.now(),
      counterCircleTime,
      currentCircleTime,
      currentLongBreakTime,
      currentShortBreakTime
    }));
  }

  const handleStop = () => {
    setStep(1);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStatus('focus');
    setCounterCircleTime(currentCircleTime);

    AsyncStorage.setItem('APP_STATE', JSON.stringify({
      step: 1,
      isPaused: false,
      isRunning: false,
      currentStatus: 'focus',
      time: Date.now(),
      counterCircleTime: currentCircleTime,
      currentCircleTime,
      currentLongBreakTime,
      currentShortBreakTime
    }));
  }

  const timeProgress = useMemo(() => {
    switch (currentStatus) {
      case 'focus': return 100-((counterCircleTime / currentCircleTime) * 100);
      case 'shortBreak': return 100-((counterCircleTime / currentShortBreakTime) * 100);
      case 'longBreak': return 100-((counterCircleTime / currentLongBreakTime) * 100);
      default: return 0;
    }
  }, [counterCircleTime, currentStatus, currentCircleTime, currentShortBreakTime, currentLongBreakTime]);

  return (
    <View style={styles.mainContainer}>

      <TouchableOpacity
        disabled={isRunning || isPaused}
        onPress={() => navigation.navigate('Settings')}
        style={{ ...styles.settingButton, opacity: isRunning || isPaused ? 0 : 1 }} 
      >
        <MaterialIcons
          name="settings"
          size={36}
          color={Theme.colors.divider}
        />
      </TouchableOpacity>

      <View style={styles.container}>

        <View style={styles.titleGroup}>
          <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                Pomodoro
              </Text>
          </View>

          <View style={styles.stateContainer}>
              
              {!isRunning && !isPaused && currentStatus === 'focus' && (
                <Text style={styles.stateText}>
                  Vamos nos concentrar?
                </Text>
              )}
              {isRunning && !isPaused && currentStatus === 'focus' && (
                <Text style={styles.stateText}>
                  Hora de se concentrar
                </Text>
              )}
              {isPaused && !isRunning && (
                <Text style={styles.stateText}>
                  Crônometro em pausa
                </Text>
              )}
              
              { currentStatus === 'shortBreak' && !isPaused && (
                <Text style={styles.stateText}>
                  Pausa curta
                </Text>
              )}
              
              { currentStatus === 'longBreak' && !isPaused && (
                <Text style={styles.stateText}>
                  Pausa longa
                </Text>
              )}
              
          </View>

          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={160}
              width={7}
              rotation={0}
              fill={timeProgress}
              tintColor={Theme.colors.divider}
              backgroundColor={Theme.colors.primary}
              children={() => (
                <Text style={styles.progressText}>
                  {Math.floor(counterCircleTime / 60)}:{(counterCircleTime % 60).toString().padStart(2, '0')}
                </Text>
              )}
            />
          </View>
        </View>
      
        {!isRunning && !isPaused && (
          <View style={styles.buttonContainer}>  
            <TouchableOpacity style={styles.primaryButton} onPress={handleStart}>
                <Text style={styles.primaryButtonText}>
                  Iniciar
                </Text>
              </TouchableOpacity>
          </View>
        )}
        
        {isRunning && !isPaused && (
          <View style={styles.buttonContainer}>    
            <TouchableOpacity style={styles.primaryButton} onPress={handlePause}>
              <Text style={styles.primaryButtonText}>
                Pausar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleStop}>
              <Text style={styles.secondaryButtonText}>
                Parar
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {isPaused && !isRunning &&(
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleStart}>
              <Text style={styles.primaryButtonText}>
                Continuar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleStop}>
              <Text style={styles.secondaryButtonText}>
                Parar
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.pomodorosContainer}>
          <Text style={styles.pomodorosText}>
            Pomodoros:
          </Text>

          <View style={step >= 2 || currentStatus === 'longBreak' ? styles.pomodorosIndicatorComplete : styles.pomodorosIndicator} />
          <View style={step >= 3 || currentStatus === 'longBreak' ? styles.pomodorosIndicatorComplete : styles.pomodorosIndicator} />
          <View style={step >= 4 || currentStatus === 'longBreak' ? styles.pomodorosIndicatorComplete : styles.pomodorosIndicator} />
          <View style={currentStatus === 'longBreak' ? styles.pomodorosIndicatorComplete : styles.pomodorosIndicator} />
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingButton: {
    alignSelf: 'flex-end'
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36
  },

  titleGroup: {
    gap: 24
  },

  primaryButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 55
  },

  primaryButtonText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body
  },

  secondaryButton: {
    borderColor: Theme.colors.primary,
    borderWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 55
  },

  secondaryButtonText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16
  },

  progressContainer: {
    alignItems: 'center'
  },

  progressText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interBold,
    fontSize: Theme.fontSizes.title
  },

  titleContainer: {
    alignItems: 'center'
  },

  titleText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interBold,
    fontSize: Theme.fontSizes.title
  },

  stateContainer: {
    alignItems: 'center'
  },

  stateText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body
  },

  pomodorosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },

  pomodorosText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body
  },

  pomodorosIndicator: {
    width: 20,
    height: 20,
    borderRadius: '100%',
    backgroundColor: Theme.colors.divider
  },

  pomodorosIndicatorComplete: {
    width: 20,
    height: 20,
    borderRadius: '100%',
    backgroundColor: Theme.colors.primary
  }

  
});