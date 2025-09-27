import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
    try {
        const s = JSON.stringify(value);
        await AsyncStorage.setItem(key, s);
        return true;
    } catch (e) {
        console.error('Storage save error', e);
        return false;
    }
};

export const loadData = async (key) => {
    try {
        const s = await AsyncStorage.getItem(key);
        return s ? JSON.parse(s) : null;
    } catch (e) {
        console.error('Storage load error', e);
        return null;
    }
};

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Storage remove error', e);
        return false;
    }
};
