import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type RootStackParamList = {
  ProjectInfo: undefined;
  Upload: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProjectInfo"
>;

const ProjectInfoScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Banner */}
      <Image
        source={require("../../assets/1.png")}
        style={styles.banner}
      />

      {/* Title */}
      <Text style={styles.title}>BioLens Project</Text>
      <Text style={styles.subtitle}>AI Powered Diatom Monitoring</Text>

      {/* Overview Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.text}>
         BioLens is an AI-based environmental monitoring system that uses
Convolutional Neural Networks (CNN) and YOLO object detection to
identify and analyze diatom species from microscopic images. The
system automatically detects diatoms and analyzes their patterns
to provide insights about water quality and potential ecological risks.
        </Text>
      </View>

      {/* How It Works */}
      <View style={styles.card}>
  <Text style={styles.sectionTitle}>How It Works</Text>

  <View style={styles.row}>
    <Icon name="camera-outline" size={20} color="#2d5a3d" />
    <Text style={styles.text}> Capture microscope images of diatoms</Text>
  </View>

  <View style={styles.row}>
    <Icon name="target" size={20} color="#2d5a3d" />
    <Text style={styles.text}> YOLO detects diatom objects in the image</Text>
  </View>

  <View style={styles.row}>
    <Icon name="brain" size={20} color="#2d5a3d" />
    <Text style={styles.text}> CNN extracts visual features for classification</Text>
  </View>

  <View style={styles.row}>
    <Icon name="chart-line" size={20} color="#2d5a3d" />
    <Text style={styles.text}> System predicts environmental conditions</Text>
  </View>
</View>
      {/* Applications */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Applications</Text>

        <View style={styles.featureBox}>
          <Text style={styles.feature}>🌊 Water Quality Monitoring</Text>
          <Text style={styles.feature}>🌍 Climate Change Analysis</Text>
          <Text style={styles.feature}>⚠ Disaster Prediction</Text>
          <Text style={styles.feature}>🧬 Public Health Early Warning</Text>
        </View>
      </View>

      {/* Progress */}
      
      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Upload")}
      >
        <Text style={styles.buttonText}>Continue to Upload →</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default ProjectInfoScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f7fb",
  },

  banner: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#6c7a89",
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#34495e",
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  featureBox: {
    backgroundColor: "#eaf5ee",
    padding: 12,
    borderRadius: 10,
  },

  feature: {
    fontSize: 15,
    marginBottom: 6,
  },

  progress: {
    textAlign: "center",
    color: "#7f8c8d",
    marginTop: 10,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#2d5a3d",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});