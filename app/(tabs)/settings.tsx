import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type definitions
type Language = {
  code: string;
  name: string;
};

type AppSettings = {
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  selectedLanguage: string;
};


const SettingsScreen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [storageUsage, setStorageUsage] = useState<string>('0 MB');

  const saveSettings = async () => {
    try {
      const settings: AppSettings = {
        isDarkMode,
        notificationsEnabled,
        selectedLanguage,
      };
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-4`}>
      {/* Appearance Section */}
      <View className={`mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow`}>
        <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Appearance
        </Text>
        
        <View className={`flex-row justify-beeen items-center py-3 border-b border-gray-200`}>
          <View className={`flex-row items-center`}>
            <MaterialIcons 
              name="dark-mode" 
              size={24} 
              className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} 
            />
            <Text className={ `ml-3 mr-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={(value) => {
              setIsDarkMode(value);
              saveSettings();
            }}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
        </View>
      </View>

      {/* Notifications Section */}
      <View className={`mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow`}>
        <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Notifications
        </Text>
        
        <View className={`flex-row justify-beeen items-center py-3 border-b border-gray-200`}>
          <View className={`flex-row items-center`}>
            <MaterialIcons 
              name="notifications" 
              size={24} 
              className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} 
            />
            <Text className={`ml-3 mr-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Enable Notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => {
              setNotificationsEnabled(value);
              saveSettings();
            }}
          />
        </View>
      </View>

      {/* Language Section */}
      <View className={`mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow`}>
        <Text className={`text-lg  font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Language
        </Text>
        <TouchableOpacity 
          className={`flex-row justify-beeen items-center py-3 border-b border-gray-200`}
          onPress={() => console.log('Open Language Modal')
          }
        >
          <View className={`flex-row items-center`}>
            <MaterialIcons 
              name="language" 
              size={24} 
              className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} 
            />
            <Text className={`ml-3 mr-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              App Language
            </Text>
          </View>
          <View className={`flex-row items-center`}>
            <Text className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedLanguage}
            </Text>
            <MaterialIcons 
              name="chevron-right" 
              size={20} 
              className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} 
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Storage Section */}
      <View className={`mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow`}>
        <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Storage
        </Text>
        
        <View className={`flex-row justify-beeen items-center py-3 border-b border-gray-200`}>
          <View className={`flex-row items-center`}>
            <MaterialIcons 
              name="storage" 
              size={24} 
              className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} 
            />
            <Text className={`ml-3 mr-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Storage Used
            </Text>
          </View>
          <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {storageUsage}
          </Text>
        </View>
        
        <TouchableOpacity 
          className={`flex-row items-center py-3 mt-2`}
          onPress={() => {
            console.log('Clear Cache pressed');
            
          }}
        >
          <MaterialIcons name="delete" size={24} className={`text-red-500`} />
          <Text className={`ml-3 text-red-500`}>
            Clear Cache
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;