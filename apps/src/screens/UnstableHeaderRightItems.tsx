import React, { useLayoutEffect } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button } from '../shared';

type StackParamList = {
  Main: undefined;
  BottomSheet: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

interface BottomSheetScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'BottomSheet'>;
}

const MainScreen = ({ navigation }: MainScreenProps): React.JSX.Element => {
  useLayoutEffect(() => {
    const options: Parameters<typeof navigation.setOptions>[0] & {
      unstable_headerRightItems: () => unknown[];
    } = {
      title: 'Header right items',
      unstable_headerRightItems: () => [
        {
          type: 'menu',
          label: 'More',
          icon: {
            type: 'sfSymbol',
            name: 'ellipsis.circle',
          },
          menu: {
            title: 'Header menu repro',
            items: [
              {
                type: 'action',
                label: 'Open form sheet',
                onPress: () => navigation.navigate('BottomSheet'),
              },
              {
                type: 'action',
                label: 'Archive',
                onPress: () => Alert.alert('Archive pressed'),
              },
              {
                type: 'action',
                label: 'Mute',
                onPress: () => Alert.alert('Mute pressed'),
              },
            ],
          },
        },
      ],
    };

    navigation.setOptions(options);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>unstable_headerRightItems repro</Text>
      <Text style={styles.text}>1. Open the header menu in the top-right corner.</Text>
      <Text style={styles.text}>2. Tap "Open form sheet".</Text>
      <Text style={styles.text}>3. Close the sheet and open the header menu again.</Text>
      <Text style={styles.text}>
        4. None of the menu actions define a selected state, so any checkmark
        shown after the sheet transition is unintended.
      </Text>
      <Text style={styles.note}>
        This repro is intended for iOS, where `unstable_headerRightItems` and
        `formSheet` presentation are both available.
      </Text>
      <Button
        title="Open form sheet from content"
        onPress={() => navigation.navigate('BottomSheet')}
      />
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </View>
  );
};

const BottomSheetScreen = ({
  navigation,
}: BottomSheetScreenProps): React.JSX.Element => (
  <View style={styles.bottomSheet}>
    <Text style={styles.heading}>Bottom screen</Text>
    <Text style={styles.text}>
      Dismiss this screen and reopen the header menu on the previous screen to
      verify whether menu items pick up a stale checkmark.
    </Text>
    <Button title="Dismiss" onPress={() => navigation.goBack()} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainScreen} />
    <Stack.Screen
      name="BottomSheet"
      component={BottomSheetScreen}
      options={{
        title: 'Bottom screen',
        presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
        sheetAllowedDetents: [0.5, 1.0],
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  bottomSheet: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: '#666666',
  },
});

export default App;
