# BioLens - Diatom Detection & Classification Application

A production-ready mobile application for detecting and classifying diatoms from microscopic images using machine learning. Built with React Native (Expo) frontend and Node.js/Express backend.

## 🎯 Overview

BioLens is a research-grade application designed for:
- **Diatom Classification**: AI-powered identification of diatom species from microscopic images
- **Environmental Analysis**: Provides ecological significance and water quality indicators
- **Scientific Documentation**: Detailed classification records with confidence scores
- **Admin Management**: Dashboard for managing diatom classes and monitoring usage

## 🏗️ Architecture

### Frontend (React Native + Expo)
- **Authentication**: JWT-based user login/signup
- **Image Upload**: Camera and gallery integration
- **Classification Results**: Expandable cards with detailed information
- **History Tracking**: View previous classifications
- **Admin Dashboard**: Manage diatom classes and view statistics

### Backend (Node.js + Express)
- **REST APIs**: Complete authentication and classification endpoints
- **Database**: MongoDB with Mongoose ODM
- **Admin Routes**: CRUD operations for diatom classes
- **Mock Classifier**: Placeholder for ML model integration

### ML Integration
- **Placeholder Architecture**: Ready for `.h5` Keras/TensorFlow model
- **Mock Classifier**: Returns random classifications for testing
- **Easy Integration**: Clear comments marking where model will be plugged in

## 📋 Project Structure

```
BioLens/
├── frontend/                    # React Native Expo app
│   ├── components/
│   │   └── Auth/
│   │       ├── LoginScreen.tsx
│   │       └── SignupScreen.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── UploadScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── AdminPanel.tsx
│   ├── navigation/
│   │   ├── AuthNavigator.tsx
│   │   └── AppNavigator.tsx
│   ├── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # Express.js server
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── DiatomClass.js
│   │   └── ClassificationRecord.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── classification.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── mockClassifier.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or physical device)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/biolens
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Expo development server**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## 🔐 Authentication

### User Authentication
- **Signup**: Create account with name, email, password
- **Login**: Email and password authentication
- **JWT Tokens**: 7-day expiration
- **Token Storage**: Stored in AsyncStorage on device

### Admin Authentication
- **Admin Login**: Username and password
- **Admin Token**: Stored in AsyncStorage
- **Protected Routes**: All admin endpoints require valid token

## 📱 User Features

### Home Screen
- Welcome message with user name
- App overview and instructions
- Quick access to upload functionality

### Upload Screen
- Camera capture or gallery selection
- Image preview
- Classification button
- Image requirements guide

### Result Screen
- Diatom class name
- Confidence score with visual indicator
- Expandable sections:
  - Scientific Overview
  - Environmental Significance
  - Impacts & Indicators
- Record ID for tracking

### History Screen
- List of all previous classifications
- Sorted by date (newest first)
- Confidence scores displayed
- Tap to view full details

### Profile Screen
- User information display
- Account details
- App information
- Feature list
- Logout functionality

## 🛠️ Admin Dashboard

### Statistics Tab
- Total users count
- Total classifications count
- Total diatom classes
- Most detected diatom classes

### Diatom Classes Tab
- View all diatom classes
- Add new diatom class
- Edit existing classes
- Delete classes
- Fields:
  - Class name
  - Scientific description
  - Environmental significance
  - Impacts & indicators

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Classification
- `POST /api/classification/classify` - Classify image
- `GET /api/classification/history` - Get user's classification history
- `GET /api/classification/:recordId` - Get specific classification
- `GET /api/classification/classes/all` - Get all diatom classes

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/logs` - Get classification logs
- `POST /api/admin/diatom-classes` - Create diatom class
- `GET /api/admin/diatom-classes` - Get all diatom classes
- `GET /api/admin/diatom-classes/:id` - Get specific class
- `PUT /api/admin/diatom-classes/:id` - Update diatom class
- `DELETE /api/admin/diatom-classes/:id` - Delete diatom class

## 🤖 ML Model Integration

### Current State
- Mock classifier returns random diatom classes
- Confidence scores simulated (0.7 - 0.99)
- Ready for production model integration

### Integration Steps

1. **Prepare Model**
   - Convert Keras `.h5` model to TensorFlow.js format
   - Or use TensorFlow Lite for mobile

2. **Update Mock Classifier** (`backend/utils/mockClassifier.js`)
   ```javascript
   // Replace mock implementation with:
   async loadModel(modelPath) {
     this.model = await tf.loadLayersModel(modelPath);
   }
   
   async classifyImage(imageTensor) {
     const predictions = this.model.predict(imageTensor);
     // Extract class and confidence
   }
   ```

3. **Update Classification Route** (`backend/routes/classification.js`)
   - Load model on server startup
   - Preprocess image
   - Run inference
   - Return predictions

## 🎨 Design System

### Color Palette
- **Primary**: `#2d5a3d` (Forest Green) - Main actions, headers
- **Secondary**: `#4a7c5e` (Sage Green) - Secondary actions
- **Accent**: `#d4a574` (Warm Tan) - Highlights, warnings
- **Background**: `#f8f9fa` (Off-white) - Main background
- **Text**: `#1a1a1a` (Dark Gray) - Primary text
- **Border**: `#e0e0e0` (Light Gray) - Dividers

### Typography
- **Headers**: 24-28px, Bold (700)
- **Titles**: 16-18px, Semi-bold (600)
- **Body**: 14px, Regular (400)
- **Small**: 12-13px, Regular (400)

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Admin
```javascript
{
  username: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### DiatomClass
```javascript
{
  name: String,
  scientificDescription: String,
  environmentalSignificance: String,
  impacts: String
}
```

### ClassificationRecord
```javascript
{
  userId: ObjectId (ref: User),
  imageUrl: String,
  predictedClass: String,
  confidence: Number,
  createdAt: Date
}
```

## 🧪 Testing

### Test User Credentials
```
Email: test@example.com
Password: password123
```

### Test Admin Credentials
```
Username: admin
Password: admin123
```

### Test Diatom Classes
- Navicula
- Nitzschia
- Gomphonema
- Cymbella
- Amphora
- Pinnularia
- Fragilaria
- Achnanthes

## 🔒 Security Considerations

- JWT tokens expire after 7 days
- Passwords hashed with bcrypt (10 salt rounds)
- CORS enabled for frontend communication
- Admin routes protected with token verification
- Environment variables for sensitive data

## 📝 Development Notes

### Code Quality
- TypeScript for frontend type safety
- Consistent naming conventions
- Clear component separation
- Comprehensive error handling

### Performance
- Image compression before upload
- Lazy loading of screens
- Efficient database queries
- Pagination for logs

### Scalability
- Modular route structure
- Reusable components
- Database indexing ready
- API versioning ready

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify port 5000 is available

### Frontend Connection Issues
- Update API_URL in screens if backend URL changes
- Ensure backend is running before starting frontend
- Check network connectivity

### Image Upload Issues
- Grant camera/gallery permissions
- Ensure image is valid format (JPEG/PNG)
- Check image size (max 50MB)

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**BioLens** - Research-grade diatom detection and classification for environmental monitoring and scientific research.
