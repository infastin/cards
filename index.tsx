import '@react-native-anywhere/polyfill-base64';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import 'expo-dev-client';
import { registerRootComponent } from 'expo';
import Database from './src/app/models/Database';
import App from './App';

const Main = () => {
	return (
		<Database.Provider>
			<App />
		</Database.Provider>
	);
}

registerRootComponent(Main)

export default Main;
