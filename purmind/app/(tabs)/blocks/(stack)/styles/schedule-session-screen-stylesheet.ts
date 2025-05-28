import { Dimensions, StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

// Obtém o tema de forma segura para uso em um arquivo de estilos
const getTheme = () => {
  try {
    return useAppTheme().theme;
  } catch (e) {
    // Fallback para quando o hook não pode ser usado fora de um componente React
    return {
      colors: {
        primary: '#007AFF',
        text: '#000000',
        error: '#d32f2f'
      }
    };
  }
};

const theme = getTheme();
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
  repeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  repeatOptionsContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  repeatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedRepeatOption: {
    backgroundColor: '#f0f0f0',
  },
  customDaysContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  dayText: {
    fontSize: 14,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  emojiSection: {
    alignItems: 'center',
  },
  selectedEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  selectedEmojiButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  emoji: {
    fontSize: 24,
  },
  chooseEmojiButton: {
    marginTop: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    fontSize: 16,
    height: 40,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    marginRight: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: 100,
  },
  createButton: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  emojiSelector: {
    flex: 1,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  selectedDayButton: {
    backgroundColor: theme.colors.primary,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  selectedAppsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    gap: 8,
  },
  selectedAppChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAppName: {
    marginHorizontal: 8,
    fontSize: 14,
  },
  removeAppButton: {
    padding: 2,
  },
  selectAppsButton: {
    marginTop: 10,
  },
  appList: {
    flex: 1,
    marginTop: 10,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedAppItem: {
    backgroundColor: '#f5f5f5',
  },
  appIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  appName: {
    flex: 1,
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

// Exportando como default para evitar o erro do Expo Router
export default styles;
