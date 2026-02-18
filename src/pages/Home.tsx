import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TNavigationScreenProps } from '../AppRoutes';
import { Theme } from '../shared/themes/Theme';
import { MaterialIcons } from '@expo/vector-icons';


export const Home = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  return (
    <View style={styles.mainContainer}>

      <TouchableOpacity 
        style={styles.settingButton} 
        onPress={() => navigation.navigate('Settings')}
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
              <Text style={styles.stateText}>
                Vamos nos concentrar?
              </Text>
              {/* <Text style={styles.stateText}>
                Hora de se concentrar
              </Text>
              <Text style={styles.stateText}>
                Pausa curta
              </Text>
              <Text style={styles.stateText}>
                Pausa longa
              </Text>
              <Text style={styles.stateText}>
                Crônometro em pausa
              </Text> */}
          </View>

          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={160}
              width={7}
              fill={70}
              tintColor={Theme.colors.divider}
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor={Theme.colors.primary}
              rotation={0}
              children={() => (
                <Text style={styles.progressText}>
                  12:45
                </Text>
              )}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>  
          <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                Iniciar
              </Text>
            </TouchableOpacity>
        </View>
        
        {/* <View style={styles.buttonContainer}>    
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              Pausar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Parar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              Continuar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Reiniciar
            </Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.pomodorosContainer}>
          <Text style={styles.pomodorosText}>
            Pomodoros:
          </Text>

          <View style={styles.pomodorosIndicatorComplete} />
          <View style={styles.pomodorosIndicator} />
          <View style={styles.pomodorosIndicator} />
          <View style={styles.pomodorosIndicator} />
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