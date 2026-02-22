import notifee, { AuthorizationStatus, EventType } from '@notifee/react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { updateStateByElapsedTime } from '../helper/UpdateStateByElapsedTime';

notifee.onBackgroundEvent(async (event) => {
    console.log('BACKGROUND EVENT', event);

    if (event.type !== EventType.DISMISSED && event.type !== EventType.DELIVERED) return;

    await new Promise((resolve) => setTimeout(() => resolve({}), 1000));

    const appState = await AsyncStorage
        .getItem('APP_STATE')
        .then(value => JSON.parse(value || 'null'));

    if(!appState) return;

    const updatedAppState = updateStateByElapsedTime(appState);

    const getMaxTime = () => {
        switch (updatedAppState.currentStatus) {
            case 'focus': return updatedAppState.currentCircleTime;
            case 'shortBreak': return updatedAppState.currentShortBreakTime;
            case 'longBreak': return updatedAppState.currentLongBreakTime;
            default: return updatedAppState.currentCircleTime;  
        }
    }

    const getTitle = () => {
        switch (updatedAppState.currentStatus) {
            case 'focus': return 'Hora de se concentrar';
            case 'shortBreak': return 'Pausa curta';
            case 'longBreak': return 'Pausa longa';
            default: return 'Iniciando a notificação';  
        }
    }

    const maxTime = getMaxTime();

    await notifee.displayNotification({
        id: 'pomodoro-progress',
        title: getTitle(),
        body: `Tempo restante: ${Math.floor(updatedAppState.counterCircleTime / 60)}:${(updatedAppState.counterCircleTime % 60).toString().padStart(2, '0')}`,
        android: {
            ongoing: true,
            channelId: 'default',
            progress: {
                max: maxTime,
                current: maxTime - updatedAppState.counterCircleTime
            }
        }
    });

});

const requestPermission = async () => {
    const { authorizationStatus} = await notifee.requestPermission();
    
    if (authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
        Alert.alert(
            'Permissão negada', 
            'A permissão para notificações foi negada.'
        );
    }
};

const activateNotification = async () => {

    await notifee.createChannel({
        id: 'default',
        name: 'Pomodoro'
    });

    await notifee.displayNotification({
        id: 'pomodoro-progress',
        title: 'Pomodoro',
        body: 'Iniciando notificações',
        android: {
            ongoing: true,
            timeoutAfter: 1000,
            channelId: 'default',
            progress: {
                max: 1,
                current: 1,
                indeterminate: true
            }
        }
    });
};

const deactivateNotification = async () => {
    await notifee.cancelAllNotifications();
};

export const NotificationService = {
  requestPermission,
  activateNotification,
  deactivateNotification
};