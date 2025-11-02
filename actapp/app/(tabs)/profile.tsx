import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
    const { logout } = useAuth();
    return (
        <View>
            <Text>My Profile</Text>
            <View>
                <TouchableOpacity onPress={logout}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}