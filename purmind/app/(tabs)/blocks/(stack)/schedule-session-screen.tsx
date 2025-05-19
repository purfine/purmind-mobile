import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, KeyboardAvoidingView, Modal, Dimensions } from 'react-native';
import WRScreenContainer from '@/components/wrappers/ScreenContainer';
import WRText from '@/components/wrappers/Text';
import UIButton from '@/components/UI/button';
import UIIcon from '@/components/UI/icon';
import { useAppTheme } from '@/context/ThemeContext';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { addSession } from '@/mock/sessions';
import { TextInput } from 'react-native-gesture-handler';
import CustomEmojiSelector from '@/components/UI/emoji-selector';

// Emojis pré-definidos para seleção rápida
const EMOJI_OPTIONS = [
  '💻', '📱', '📚', '✏️', '🎯', '🧠', '🏋️', '🧘', '🎮', '🎬', '🎵', '🎨'
];

export default function ScheduleSessionScreen() {
  const { theme } = useAppTheme();
  
  // State para inputs do formulário
  const [sessionTitle, setSessionTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💻');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2); // Default 2 horas depois
    return date;
  });
  
  // State para date/time pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  // State para o seletor de emojis
  const [isEmojiSelectorVisible, setIsEmojiSelectorVisible] = useState(false);
  
  // Manipula a seleção de emoji
  const handleEmojiSelected = (emoji: string) => {
    setSelectedEmoji(emoji);
    setIsEmojiSelectorVisible(false);
  };
  
  // Formata data para exibição
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Formata hora para exibição
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Manipula mudanças na data/hora de início
  const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };
  
  const onStartTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      const currentDate = new Date(startDate);
      currentDate.setHours(selectedDate.getHours());
      currentDate.setMinutes(selectedDate.getMinutes());
      setShowStartTimePicker(Platform.OS === 'ios');
      setStartDate(currentDate);
    }
  };
  
  // Manipula mudanças na data/hora de término
  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };
  
  const onEndTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      const currentDate = new Date(endDate);
      currentDate.setHours(selectedDate.getHours());
      currentDate.setMinutes(selectedDate.getMinutes());
      setShowEndTimePicker(Platform.OS === 'ios');
      setEndDate(currentDate);
    }
  };
  
  // Valida o formulário e cria a sessão
  const handleCreateSession = () => {
    // Validação básica
    if (!sessionTitle.trim()) {
      // Em um app real, mostrar uma mensagem de erro
      return;
    }
    
    // Garante que a data de término é depois da data de início
    if (endDate <= startDate) {
      // Em um app real, mostrar uma mensagem de erro
      return;
    }
    
    // Cria a sessão
    addSession({
      title: sessionTitle,
      figure: selectedEmoji,
      startSessionInSec: Math.floor(startDate.getTime() / 1000),
      endSessionInSec: Math.floor(endDate.getTime() / 1000),
    });
    
    // Navega de volta para a tela anterior
    router.back();
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <WRScreenContainer style={styles.container}>
        <View style={styles.header}>
          <WRText bold size={18}>Agendar sessão</WRText>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.section}>
          <WRText bold size={16} style={styles.sectionTitle}>Emoji da sessão</WRText>
          <View style={styles.emojiSection}>
            <View style={styles.selectedEmojiContainer}>
              <WRText size={32}>{selectedEmoji}</WRText>
            </View>
            
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.selectedEmojiButton
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <WRText style={styles.emoji}>{emoji}</WRText>
                </TouchableOpacity>
              ))}
            </View>
            
            <UIButton
              text="Escolher outro emoji"
              icon="happy-outline"
              size="small"
              style={styles.chooseEmojiButton}
              onPress={() => setIsEmojiSelectorVisible(true)}
            />
          </View>
        </View>
        
        {/* Modal do seletor de emojis */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEmojiSelectorVisible}
          onRequestClose={() => setIsEmojiSelectorVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
              <View style={styles.modalHeader}>
                <WRText bold size={20}>Selecionar Emoji</WRText>
                <TouchableOpacity 
                  onPress={() => setIsEmojiSelectorVisible(false)}
                  style={styles.closeButton}
                >
                  <UIIcon name="close-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <CustomEmojiSelector
                onEmojiSelected={handleEmojiSelected}
                showSearchBar={true}
                showTabs={true}
                theme={theme.type === 'dark' ? 'dark' : 'light'}
              />
            </View>
          </View>
        </Modal>
        
        <View style={styles.section}>
          <WRText bold size={16} style={styles.sectionTitle}>Título da sessão</WRText>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={sessionTitle}
              onChangeText={setSessionTitle}
              placeholder="Ex: Tempo de estudo"
              placeholderTextColor={theme.colors.muted}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <WRText bold size={16} style={styles.sectionTitle}>Horário de início</WRText>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <UIIcon name="calendar-outline" size={20} color={theme.colors.primary} />
              <WRText style={{ marginLeft: 8 }}>{formatDate(startDate)}</WRText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <UIIcon name="time-outline" size={20} color={theme.colors.primary} />
              <WRText style={{ marginLeft: 8 }}>{formatTime(startDate)}</WRText>
            </TouchableOpacity>
          </View>
          
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onStartDateChange}
            />
          )}
          
          {showStartTimePicker && (
            <DateTimePicker
              value={startDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onStartTimeChange}
            />
          )}
        </View>
        
        <View style={styles.section}>
          <WRText bold size={16} style={styles.sectionTitle}>Horário de término</WRText>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <UIIcon name="calendar-outline" size={20} color={theme.colors.primary} />
              <WRText style={{ marginLeft: 8 }}>{formatDate(endDate)}</WRText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <UIIcon name="time-outline" size={20} color={theme.colors.primary} />
              <WRText style={{ marginLeft: 8 }}>{formatTime(endDate)}</WRText>
            </TouchableOpacity>
          </View>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onEndDateChange}
            />
          )}
          
          {showEndTimePicker && (
            <DateTimePicker
              value={endDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onEndTimeChange}
            />
          )}
        </View>
        
        <UIButton
          text="Agendar sessão"
          icon="calendar-outline"
          size="large"
          style={styles.createButton}
          onPress={handleCreateSession}
        />
      </WRScreenContainer>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
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
});
