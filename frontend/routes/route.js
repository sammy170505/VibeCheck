// Set up routes between Home, circle and moodCalender
import { NavigationContainer } from '@react-navigation/native';
import { creatStackNavigator } from '@react-navigation/stack';
import Home from '/pages/home';
import MoodCalendar from '/pages/moodCalendar';
import Login from '/pages/login';

const Stack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initalRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="MoodCalendar" components={MoodCalendar} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;
