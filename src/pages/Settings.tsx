import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TNavigationScreenProps } from '../AppRoutes';
import { Theme } from '../shared/themes/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { use, useEffect, useState } from 'react';


export const Settings = () => {
  
  const navigation = useNavigation<TNavigationScreenProps>();

  const [loaded, setLoaded] = useState(false);

  const [focusPeriod, setFocusPeriod] = useState(25);
  const [shortBreakPeriod, setShortBreakPeriod] = useState(5);
  const [longBreakPeriod, setLongBreakPeriod] = useState(15);
  const [notificationsActivated, setNotificationsActivated] = useState(true);

  useEffect(() => {

    Promise
      .all([
        AsyncStorage.getItem('FOCUS_PERIOD'),
        AsyncStorage.getItem('SHORT_BREAK_PERIOD'),
        AsyncStorage.getItem('LONG_BREAK_PERIOD'),
        AsyncStorage.getItem('NOTIFICATION_ACTIVATED')  
      ])
      .then(([focus, short, long, notification]) => {
        setFocusPeriod(JSON.parse(focus || '25'));
        setShortBreakPeriod(JSON.parse(short || '5'));
        setLongBreakPeriod(JSON.parse(long || '15'));
        setNotificationsActivated(JSON.parse(notification || 'true'));
      })
      .catch(err => console.log(err))
      .finally(() => setLoaded(true));

  }, []);

  useEffect(() => {

    if(loaded){
      AsyncStorage.setItem('FOCUS_PERIOD', JSON.stringify(focusPeriod));
      AsyncStorage.setItem('SHORT_BREAK_PERIOD', JSON.stringify(shortBreakPeriod));
      AsyncStorage.setItem('LONG_BREAK_PERIOD', JSON.stringify(longBreakPeriod));
      AsyncStorage.setItem('NOTIFICATION_ACTIVATED', JSON.stringify(notificationsActivated));
    }
    
  }, [focusPeriod, shortBreakPeriod, longBreakPeriod, notificationsActivated, loaded]);

  return (
    <View style={styles.mainContainer}>

      <TouchableOpacity 
        style={styles.settingButton} 
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons
          name="close"
          size={36}
          color={Theme.colors.divider}
        />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            Configurações
          </Text>
        </View>

        <View style={styles.formContainer}>

          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldLabel}>
              Período de foco
            </Text>
            
            <View style={styles.formFieldButtons}>
              <TouchableOpacity 
                style={focusPeriod === 15 ? styles.primaryButton : styles.secondaryButton} 
                onPress={() => setFocusPeriod(15)}
              >
                <Text style={styles.secondaryButtonText}>
                  15 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={focusPeriod === 25 ? styles.primaryButton : styles.secondaryButton} 
                onPress={() => setFocusPeriod(25)}
              >
                <Text style={styles.primaryButtonText}>
                  25 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={focusPeriod === 35 ? styles.primaryButton : styles.secondaryButton} 
                onPress={() => setFocusPeriod(35)}
              >
                <Text style={styles.secondaryButtonText}>
                  35 min
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>

        <View style={styles.formContainer}>

          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldLabel}>
              Pausa curta
            </Text>
            
            <View style={styles.formFieldButtons}>
              <TouchableOpacity 
                style={shortBreakPeriod === 3 ? styles.primaryButton : styles.secondaryButton}
                onPress={() => setShortBreakPeriod(3)}
              >
                <Text style={styles.secondaryButtonText}>
                  3 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={shortBreakPeriod === 5 ? styles.primaryButton : styles.secondaryButton} 
                onPress={() => setShortBreakPeriod(5)}
              >
                <Text style={styles.primaryButtonText}>
                  5 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={shortBreakPeriod === 7 ? styles.primaryButton : styles.secondaryButton} 
                onPress={() => setShortBreakPeriod(7)}
              >
                <Text style={styles.secondaryButtonText}>
                  7 min
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>

        <View style={styles.formContainer}>

          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldLabel}>
              Pausa longa
            </Text>
            
            <View style={styles.formFieldButtons}>
              <TouchableOpacity 
                style={longBreakPeriod === 10 ? styles.primaryButton : styles.secondaryButton}
                onPress={() => setLongBreakPeriod(10)}
              >
                <Text style={styles.secondaryButtonText}>
                  10 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={longBreakPeriod === 15 ? styles.primaryButton : styles.secondaryButton}
                onPress={() => setLongBreakPeriod(15)}
              >
                <Text style={styles.primaryButtonText}>
                  15 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={longBreakPeriod === 20 ? styles.primaryButton : styles.secondaryButton}
                onPress={() => setLongBreakPeriod(20)}
              >
                <Text style={styles.secondaryButtonText}>
                  20 min
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>

        <View style={styles.formContainer}>

          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldLabel}>
              Notificações
            </Text>
            
            <View style={styles.formFieldButtons}>
              <TouchableOpacity 
                style={!notificationsActivated ? styles.primaryButton : styles.secondaryButton}
                onPress={() => setNotificationsActivated(false)}
              >
                <Text style={styles.secondaryButtonText}>
                  Desativado
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={notificationsActivated ? styles.primaryButton : styles.secondaryButton}
                onPress={() => setNotificationsActivated(true)}
              >
                <Text style={styles.primaryButtonText}>
                  Ativado
                </Text>
              </TouchableOpacity>
            </View>

          </View>

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

  primaryButton: {
    backgroundColor: Theme.colors.primary,
    minWidth: 95,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 55
  },

  primaryButtonText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body
  },

  secondaryButton: {
    backgroundColor: Theme.colors.divider,
    minWidth: 95,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 55

  },

  secondaryButtonText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body
  },

  formContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 300
  },

  titleContainer: {
    alignItems: 'center'
  },

  titleText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interBold,
    fontSize: Theme.fontSizes.title
  },

  formFieldContainer: {
    // flexDirection: 'column',
    // justifyContent: 'center',
    width: '100%',
    gap: 8
  },

  formFieldLabel: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.label
  },

  formFieldButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    // gap: 16
  }

  
});