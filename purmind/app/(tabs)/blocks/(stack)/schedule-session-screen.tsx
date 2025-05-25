import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Modal } from 'react-native';
import WRScreenContainer from '@/components/wrappers/ScreenContainer';
import WRText from '@/components/wrappers/Text';
import UIButton from '@/components/UI/button';
import UIIcon from '@/components/UI/icon';
import { useAppTheme } from '@/context/ThemeContext';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import CustomEmojiSelector from '@/components/UI/emoji-selector';
import { styles } from './styles/schedule-session-screen-stylesheet';
import { useSession } from '@/hooks/useSession';
import { RepeatType } from '@/models/session';

// Emojis pré-definidos para seleção rápida
const EMOJI_OPTIONS = [
  '💻', '📱', '📚', '✏️', '🎯', '🧠', '🏋️', '🧘', '🎮', '🎬', '🎵', '🎨'
];

export default function ScheduleSessionScreen() {
  const { theme } = useAppTheme();
  const { createSession, formatDate, formatTime, dateToSeconds } = useSession();
  
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
  
  // State para repetição
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Opções de repetição
  const repeatOptions = [
    { label: 'Não repetir', value: 'none' },
    { label: 'Todos os dias', value: 'daily' },
    { label: 'Dias úteis', value: 'weekdays' },
    { label: 'Fins de semana', value: 'weekends' },
    { label: 'Personalizado', value: 'custom' },
  ];
  
  // Dias da semana para seleção personalizada
  const weekDays = [
    { label: 'D', value: 0, fullName: 'Domingo' },
    { label: 'S', value: 1, fullName: 'Segunda' },
    { label: 'T', value: 2, fullName: 'Terça' },
    { label: 'Q', value: 3, fullName: 'Quarta' },
    { label: 'Q', value: 4, fullName: 'Quinta' },
    { label: 'S', value: 5, fullName: 'Sexta' },
    { label: 'S', value: 6, fullName: 'Sábado' },
  ];
  
  // Manipula a seleção de emoji
  const handleEmojiSelected = (emoji: string) => {
    setSelectedEmoji(emoji);
    setIsEmojiSelectorVisible(false);
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
  const handleCreateSession = async () => {
    // Limpar erro anterior
    setFormError(null);
    
    // Converter datas para timestamps em segundos
    const startTimestamp = dateToSeconds(startDate);
    const endTimestamp = dateToSeconds(endDate);
    
    // Criar a sessão usando o serviço
    const result = await createSession({
      figure: selectedEmoji,
      title: sessionTitle,
      startSessionInSec: startTimestamp,
      endSessionInSec: endTimestamp,
      repeatType: repeatType,
      repeatDays: repeatType === 'custom' ? selectedDays : undefined
    });
    
    if (result.success) {
      // Navegar de volta para a tela anterior
      router.back();
    } else {
      // Exibir mensagem de erro
      setFormError(result.error || 'Ocorreu um erro ao criar a sessão');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <WRScreenContainer style={styles.container}>    
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
        
        {/* Seção de Repetição */}
        <View style={styles.section}>
          <WRText bold size={16} style={styles.sectionTitle}>Repetição</WRText>
          
          <TouchableOpacity 
            style={styles.repeatButton}
            onPress={() => setShowRepeatOptions(!showRepeatOptions)}
          >
            <UIIcon name="repeat-outline" size={20} color={theme.colors.primary} />
            <WRText style={{ marginLeft: 8 }}>
              {repeatOptions.find(option => option.value === repeatType)?.label || 'Não repetir'}
            </WRText>
            <View style={{ flex: 1 }} />
            <UIIcon 
              name={showRepeatOptions ? "chevron-up-outline" : "chevron-down-outline"} 
              size={20} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
          
          {showRepeatOptions && (
            <View style={styles.repeatOptionsContainer}>
              {repeatOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.repeatOption, repeatType === option.value && styles.selectedRepeatOption]}
                  onPress={() => {
                    setRepeatType(option.value as RepeatType);
                    if (option.value !== 'custom') {
                      setShowRepeatOptions(false);
                    }
                  }}
                >
                  <WRText 
                    style={repeatType === option.value ? { color: theme.colors.primary, fontWeight: 'bold' } : undefined}
                  >
                    {option.label}
                  </WRText>
                  {repeatType === option.value && (
                    <UIIcon name="checkmark" size={18} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
              
              {repeatType === 'custom' && (
                <View style={styles.customDaysContainer}>
                  <WRText style={{ marginBottom: 10 }} bold>
                    Selecione os dias da semana:
                  </WRText>
                  <View style={styles.weekDaysContainer}>
                    {weekDays.map((day) => (
                      <TouchableOpacity
                        key={day.value}
                        style={[
                          styles.dayButton,
                          selectedDays.includes(day.value) && styles.selectedDayButton
                        ]}
                        onPress={() => {
                          if (selectedDays.includes(day.value)) {
                            setSelectedDays(selectedDays.filter(d => d !== day.value));
                          } else {
                            setSelectedDays([...selectedDays, day.value]);
                          }
                        }}
                      >
                        <WRText 
                          style={[
                            styles.dayText,
                            selectedDays.includes(day.value) && styles.selectedDayText
                          ]}
                        >
                          {day.label}
                        </WRText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
        
        {formError && (
          <View style={styles.errorContainer}>
            <WRText style={styles.errorText}>{formError}</WRText>
          </View>
        )}
        
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
