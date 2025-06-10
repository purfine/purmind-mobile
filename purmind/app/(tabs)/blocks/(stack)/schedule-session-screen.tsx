/*
 * @(#)schedule-session-screen.tsx
 *
 * Copyright 2025, Purmind - Purfine Group
 * https://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Modal, Alert, Image, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import WRScreenContainer from '@/components/wrappers/ScreenContainer';
import WRText from '@/components/wrappers/Text';
import UIButton from '@/components/UI/button';
import UIIcon from '@/components/UI/icon';
import { useAppTheme } from '@/context/ThemeContext';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import CustomEmojiSelector from '@/components/UI/emoji-selector';
import { styles as baseStyles } from './styles/schedule-session-screen-stylesheet';
import { useSession } from '@/hooks/useSession';
import { RepeatType } from '@/models/session';
import { useDeviceApps } from '@/hooks/useDeviceApps'; 
import { BlockedApp } from '@/models/session';
import { useToast } from '@/context/ToastContext';

// Estender os estilos para incluir os novos estilos necessários
const styles = {
  ...baseStyles,
  disabledButton: {
    opacity: 0.6,
  },
};

// Emojis pré-definidos para seleção rápida
const EMOJI_OPTIONS = [
  '💻', '📱', '📚', '✏️', '🎯', '🧠', '🏋️', '🧘', '🎮', '🎬', '🎵', '🎨'
];

export default function ScheduleSessionScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { createSession, formatDate, formatTime, dateToSeconds } = useSession();
  const { installedApps, loading: loadingApps } = useDeviceApps();
  const { showToast } = useToast();
  
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
  
  // State para controlar se as datas podem ser editadas baseado no tipo de repetição
  const [datePickersDisabled, setDatePickersDisabled] = useState(false);
  const [showRepeatDaysSection, setShowRepeatDaysSection] = useState(false);
  
  // State para apps bloqueados
  const [selectedApps, setSelectedApps] = useState<BlockedApp[]>([]);
  const [showAppSelector, setShowAppSelector] = useState(false);
  
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
  
  // Efeito para ajustar os componentes baseado no tipo de repetição selecionado
  useEffect(() => {
    // Resetar estados quando o tipo de repetição muda
    setFormError(null);
    
    switch (repeatType) {
      case 'none':
        // Para 'Não repetir', permitir edição completa de datas
        setDatePickersDisabled(false);
        setShowRepeatDaysSection(false);
        break;
        
      case 'daily':
        // Para 'Todos os dias', desabilitar seleção de data, manter apenas hora
        setDatePickersDisabled(true);
        setShowRepeatDaysSection(false);
        
        // Ajustar datas para o mesmo dia (hoje) mas manter horários
        const today = new Date();
        const newStartDate = new Date(startDate);
        newStartDate.setFullYear(today.getFullYear());
        newStartDate.setMonth(today.getMonth());
        newStartDate.setDate(today.getDate());
        setStartDate(newStartDate);
        
        const newEndDate = new Date(endDate);
        newEndDate.setFullYear(today.getFullYear());
        newEndDate.setMonth(today.getMonth());
        newEndDate.setDate(today.getDate());
        setEndDate(newEndDate);
        break;
        
      case 'weekdays':
        // Para 'Dias úteis', desabilitar seleção de data, pré-selecionar dias úteis
        setDatePickersDisabled(true);
        setShowRepeatDaysSection(true);
        setSelectedDays([1, 2, 3, 4, 5]); // Segunda a sexta
        break;
        
      case 'weekends':
        // Para 'Fins de semana', desabilitar seleção de data, pré-selecionar fins de semana
        setDatePickersDisabled(true);
        setShowRepeatDaysSection(true);
        setSelectedDays([0, 6]); // Domingo e sábado
        break;
        
      case 'custom':
        // Para 'Personalizado', habilitar seleção de dias específicos
        setDatePickersDisabled(true);
        setShowRepeatDaysSection(true);
        // Não resetar selectedDays para permitir customização
        break;
    }
  }, [repeatType]);
  
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
  
  // Função para alternar a seleção de um app
  const toggleAppSelection = (app: BlockedApp) => {
    setSelectedApps(prevApps => {
      const isSelected = prevApps.some(a => a.packageName === app.packageName);
      if (isSelected) {
        return prevApps.filter(a => a.packageName !== app.packageName);
      } else {
        return [...prevApps, app];
      }
    });
  };
  
  // Valida o formulário e cria a sessão
  const handleCreateSession = async () => {
    // Validar título
    if (!sessionTitle.trim()) {
      showToast('O título da sessão é obrigatório', 'error');
      return;
    }
    
    // Validar dias selecionados para repetição personalizada
    if (repeatType === 'custom' && selectedDays.length === 0) {
      showToast('Selecione pelo menos um dia da semana para repetição personalizada', 'error');
      return;
    }
    
    // Validar se há apps selecionados
    if (selectedApps.length === 0) {
      showToast('Selecione pelo menos um aplicativo para bloquear', 'error');
      return;
    }
    
    // Converter datas para timestamps em segundos
    const startTimestamp = dateToSeconds(startDate);
    const endTimestamp = dateToSeconds(endDate);
    
    // Validar horários
    if (startTimestamp >= endTimestamp) {
      showToast('A hora de término deve ser posterior à hora de início', 'error');
      return;
    }
    
    // Preparar dados de repetição baseado no tipo selecionado
    let repeatDays;
    
    switch (repeatType) {
      case 'none':
        repeatDays = undefined;
        break;
      case 'daily':
        repeatDays = [0, 1, 2, 3, 4, 5, 6]; // Todos os dias
        break;
      case 'weekdays':
        repeatDays = [1, 2, 3, 4, 5]; // Segunda a sexta
        break;
      case 'weekends':
        repeatDays = [0, 6]; // Domingo e sábado
        break;
      case 'custom':
        repeatDays = selectedDays;
        break;
    }
    
    // Criar a sessão usando o serviço
    const result = await createSession({
      figure: selectedEmoji,
      title: sessionTitle,
      startSessionInSec: startTimestamp,
      endSessionInSec: endTimestamp,
      repeatType: repeatType,
      repeatDays: repeatDays,
      blockedApps: selectedApps
    });
    
    if (result.success) {
      showToast('Sessão criada com sucesso!', 'success');
      // Navegar de volta para a tela anterior
      router.back();
    } else {
      showToast(result.error || 'Ocorreu um erro ao criar a sessão', 'error');
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <WRScreenContainer style={styles.container}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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
                  style={[styles.dateTimeButton, datePickersDisabled && styles.disabledButton]}
                  onPress={() => !datePickersDisabled && setShowStartDatePicker(true)}
                  disabled={datePickersDisabled}
                >
                  <UIIcon 
                    name="calendar-outline" 
                    size={20} 
                    color={datePickersDisabled ? theme.colors.muted : theme.colors.primary} 
                  />
                  <WRText 
                    style={{ 
                      marginLeft: 8, 
                      color: datePickersDisabled ? theme.colors.muted : theme.colors.text 
                    }}
                  >
                    {datePickersDisabled ? "Definido pelo padrão de repetição" : formatDate(startDate)}
                  </WRText>
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
                  style={[styles.dateTimeButton, datePickersDisabled && { opacity: 0.6 }]}
                  onPress={() => !datePickersDisabled && setShowEndDatePicker(true)}
                  disabled={datePickersDisabled}
                >
                  <UIIcon 
                    name="calendar-outline" 
                    size={20} 
                    color={datePickersDisabled ? theme.colors.muted : theme.colors.primary} 
                  />
                  <WRText 
                    style={{ 
                      marginLeft: 8, 
                      color: datePickersDisabled ? theme.colors.muted : theme.colors.text 
                    }}
                  >
                    {datePickersDisabled ? "Definido pelo padrão de repetição" : formatDate(endDate)}
                  </WRText>
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
                </View>
              )}
              
              {/* Mostrar seleção de dias quando apropriado */}
              {showRepeatDaysSection && (
                <View style={styles.customDaysContainer}>
                  <WRText style={{ marginBottom: 10 }} bold>
                    {repeatType === 'custom' ? 'Selecione os dias da semana:' : 'Dias selecionados:'}
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
                          if (repeatType === 'custom') {
                            if (selectedDays.includes(day.value)) {
                              setSelectedDays(selectedDays.filter(d => d !== day.value));
                            } else {
                              setSelectedDays([...selectedDays, day.value]);
                            }
                          } else {
                            // Para tipos pré-definidos, mostrar alerta explicando
                            Alert.alert(
                              'Dias pré-definidos',
                              `Para personalizar os dias, selecione a opção "Personalizado" no tipo de repetição.`,
                              [{ text: 'OK' }]
                            );
                          }
                        }}
                        disabled={repeatType !== 'custom'}
                      >
                        <WRText 
                          style={[
                            styles.dayText,
                            selectedDays.includes(day.value) && styles.selectedDayText,
                            repeatType !== 'custom' && selectedDays.includes(day.value) && { opacity: 0.7 }
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
            
            {/* Seção de Seleção de Aplicativos */}
            <View style={styles.section}>
              <WRText bold size={16} style={styles.sectionTitle}>Aplicativos a Bloquear</WRText>
              
              <View style={styles.selectedAppsContainer}>
                {selectedApps.map(app => (
                  <View key={app.packageName} style={styles.selectedAppChip}>
                    {app.icon ? (
                      <Image
                        source={{ uri: `data:image/png;base64,${app.icon}` }}
                        style={styles.selectedAppChipIcon}
                      />
                    ) : (
                      <View style={[styles.selectedAppChipIcon, { backgroundColor: theme.colors.muted }]} />
                    )}
                    <WRText style={styles.selectedAppName}>{app.appName}</WRText>
                    <TouchableOpacity
                      onPress={() => toggleAppSelection(app)}
                      style={styles.removeAppButton}
                    >
                      <UIIcon name="close-circle" size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <UIButton
                text="Selecionar Aplicativos"
                icon="apps-outline"
                size="small"
                style={styles.selectAppsButton}
                onPress={() => setShowAppSelector(true)}
              />
            </View>

            {/* Modal de Seleção de Aplicativos */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showAppSelector}
              onRequestClose={() => setShowAppSelector(false)}
            >
              <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                  <View style={styles.modalHeader}>
                    <WRText bold size={20}>Selecionar Aplicativos</WRText>
                    <TouchableOpacity 
                      onPress={() => setShowAppSelector(false)}
                      style={styles.closeButton}
                    >
                      <UIIcon name="close-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.appList}>
                    {installedApps.map(app => (
                      <TouchableOpacity
                        key={app.packageName}
                        style={[
                          styles.appItem,
                          selectedApps.some(a => a.packageName === app.packageName) && styles.selectedAppItem
                        ]}
                        onPress={() => toggleAppSelection(app)}
                      >
                        {app.icon ? (
                          <Image
                            source={{ uri: `data:image/png;base64,${app.icon}` }}
                            style={styles.appIcon}
                          />
                        ) : (
                          <View style={[styles.appIcon, { backgroundColor: theme.colors.muted }]} />
                        )}
                        <WRText style={styles.appName}>{app.appName}</WRText>
                        {selectedApps.some(a => a.packageName === app.packageName) && (
                          <UIIcon name="checkmark-circle" size={24} color={theme.colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <UIButton
                    text="Confirmar Seleção"
                    size="large"
                    style={styles.confirmButton}
                    onPress={() => setShowAppSelector(false)}
                  />
                </View>
              </View>
            </Modal>
          </ScrollView>
          
          <View style={[
            styles.bottomButtonContainer, 
            { backgroundColor: theme.colors.background }
          ]}>
            <UIButton
              text="Agendar sessão"
              icon="calendar-outline"
              size="large"
              style={styles.createButton}
              onPress={handleCreateSession}
            />
          </View>
        </WRScreenContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
