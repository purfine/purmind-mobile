import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, TextInput, ScrollView, Dimensions } from 'react-native';
import WRText from '@/components/wrappers/Text';
import { useAppTheme } from '@/context/ThemeContext';

// Categorias de emojis
const CATEGORIES = {
  SMILEYS: 'Sorrisos',
  ACTIVITIES: 'Atividades',
  ANIMALS: 'Animais',
  FOODS: 'Comidas',
  OBJECTS: 'Objetos',
  SYMBOLS: 'Símbolos',
};

// Emojis por categoria
const EMOJI_DATA = {
  [CATEGORIES.SMILEYS]: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘'],
  [CATEGORIES.ACTIVITIES]: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳'],
  [CATEGORIES.ANIMALS]: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧'],
  [CATEGORIES.FOODS]: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅'],
  [CATEGORIES.OBJECTS]: ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠'],
  [CATEGORIES.SYMBOLS]: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️'],
};

// Lista de todas as categorias
const CATEGORY_LIST = Object.values(CATEGORIES);

interface EmojiSelectorProps {
  onEmojiSelected: (emoji: string) => void;
  showSearchBar?: boolean;
  showTabs?: boolean;
  theme?: 'light' | 'dark';
}

export default function CustomEmojiSelector({ 
  onEmojiSelected,
  showSearchBar = true,
  showTabs = true,
  theme: propTheme = 'light'
}: EmojiSelectorProps) {
  const { theme } = useAppTheme();
  const currentTheme = propTheme === 'dark' || theme.type === 'dark' ? 'dark' : 'light';
  
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.SMILEYS);
  const [searchQuery, setSearchQuery] = useState('');
  const [numColumns, setNumColumns] = useState(6);
  
  // Ajusta o número de colunas com base na largura da tela
  useEffect(() => {
    const { width } = Dimensions.get('window');
    const calculatedColumns = Math.floor(width / 60); // 60px por emoji com padding
    setNumColumns(Math.min(Math.max(calculatedColumns, 4), 8)); // Entre 4 e 8 colunas
  }, []);
  
  // Filtra emojis baseado na busca
  const getFilteredEmojis = () => {
    if (!searchQuery.trim()) {
      return EMOJI_DATA[selectedCategory];
    }
    
    // Busca em todas as categorias
    const allEmojis = Object.values(EMOJI_DATA).flat();
    return allEmojis.filter(emoji => emoji.includes(searchQuery.toLowerCase()));
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    },
    searchContainer: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme === 'dark' ? '#333333' : '#e0e0e0',
    },
    searchInput: {
      backgroundColor: currentTheme === 'dark' ? '#333333' : '#f0f0f0',
      borderRadius: 8,
      padding: 12,
      color: currentTheme === 'dark' ? '#ffffff' : '#000000',
      fontSize: 16,
    },
    categoryTabs: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: currentTheme === 'dark' ? '#333333' : '#e0e0e0',
      paddingVertical: 4,
    },
    categoryTab: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginRight: 4,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    categoryText: {
      color: currentTheme === 'dark' ? '#ffffff' : '#000000',
      fontSize: 15,
    },
    activeCategoryText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    emojiGrid: {
      padding: 12,
      alignItems: 'center',
    },
    emojiItem: {
      fontSize: 28,
      padding: 8,
      textAlign: 'center',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emojiContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 2,
    },
  });
  
  return (
    <View style={styles.container}>
      {showSearchBar && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar emoji..."
            placeholderTextColor={currentTheme === 'dark' ? '#999999' : '#999999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}
      
      {showTabs && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryTabs}>
            {CATEGORY_LIST.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.activeTab
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setSearchQuery('');
                }}
              >
                <WRText
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeCategoryText
                  ]}
                >
                  {category}
                </WRText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      
      <FlatList
        data={getFilteredEmojis()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.emojiContainer} 
            onPress={() => onEmojiSelected(item)}
          >
            <WRText style={styles.emojiItem}>{item}</WRText>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `emoji-${index}`}
        numColumns={numColumns}
        contentContainerStyle={styles.emojiGrid}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-around' }}
      />
    </View>
  );
}
