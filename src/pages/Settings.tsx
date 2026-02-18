import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TNavigationScreenProps } from '../AppRoutes';
import { Theme } from '../shared/themes/Theme';
import { MaterialIcons } from '@expo/vector-icons';


export const Settings = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

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
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  15 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  25 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
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
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  3 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  5 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
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
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  10 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  15 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
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
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  Desativado
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton}>
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
    borderColor: Theme.colors.divider,
    backgroundColor: Theme.colors.divider,
    borderWidth: 2,
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