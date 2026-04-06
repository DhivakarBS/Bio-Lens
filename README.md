# BioLens - Diatom Detection & Classification

A scientific mobile application for diatom detection and classification using machine learning. Built with React Native + Expo for the frontend and Node.js + Express for the backend.

## 📋 Quick Links

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation--setup)
- [Running the App](#-running-the-application)
- [API Documentation](#-api-documentation)
- [ML Model Integration](#-ml-model-integration)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### User Features

- **Image Upload**: Capture or upload microscopic diatom images from device gallery or camera
- **AI Classification**: Instant diatom species identification with confidence scores
- **Detailed Analysis**: Scientific descriptions, environmental significance, and ecological impacts
- **Classification History**: Track and review all past classifications
- **User Profile**: Manage account information

### Admin Features

- **Dashboard**: View application statistics and analytics
- **Diatom Management**: Create, read, update, and delete diatom classes
- **Classification Logs**: Monitor all user classifications
- **Water Quality Indicators**: Understand ecological implications

## 🛠 Technology Stack

### Frontend

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Image**: Expo Image Picker
- **Icons**: Expo Vector Icons

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js (v4.18.2)
- **Database**: MongoDB with Mongoose (v7.5.0)
- **Authentication**: JWT
- **Password Hashing**: bcryptjs (v2.4.3)

## 📁 Project Structure

```
biolens/
├── frontend/
│   ├── App.tsx
│   ├── src/
│   │   ├── navigation/
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── UploadScreen.tsx
│   │   │   ├── ResultScreen.tsx
│   │   │   ├── HistoryScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── admin/
│   │   │       ├── AdminLoginScreen.tsx
│   │   │       └── AdminDashboardScreen.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── app.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── DiatomClass.js
│   │   └── ClassificationRecord.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── classification.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   └── classificationController.js
│   ├── middleware/
│   │   └── authenticate.js
│   ├── config/
│   │   └── database.js
│   ├── utils/
│   │   └── mockClassifier.js
│   ├── seed.js
│   └── package.json
│
└── README.md
```

## 📦 Prerequisites

- **Node.js** v16+
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Expo CLI**

## 🚀 Installation & Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure .env
# MONGO_URI=mongodb://localhost:27017/biolens
# JWT_SECRET=your-secret-key
# PORT=5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend .env

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/biolens
JWT_SECRET=your-super-secret-key-minimum-32-chars
```

### Frontend API Configuration

Update `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.100:5000/api";
```

## 🎯 Running the Application

### Database Seeding (First Time)

```bash
cd backend
npm run seed

# Creates:
# - Default admin (username: admin, password: admin123)
# - 8 diatom classes with descriptions
```

### Start Backend

```bash
cd backend

# Development
npm run dev

# Production
npm start
```

Backend runs on `http://localhost:5000`

### Start Frontend

```bash
cd frontend

# Development
npm start

# Android emulator
npm run android

# iOS simulator
npm run ios

# Web browser
npm run web
```

## 📚 API Documentation

### Authentication

#### Signup

```
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login

```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Classification

#### Classify Image

```
POST /api/classification/classify
Authorization: Bearer <token>
{
  "imageBase64": "base64_image_data"
}
```

#### Get History

```
GET /api/classification/history
Authorization: Bearer <token>
```

### Admin

#### Admin Login

```
POST /api/admin/login
{
  "username": "admin",
  "password": "admin123"
}
```

#### Get Stats

```
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

## 🤖 ML Model Integration

### Current Status

The app uses a **mock classifier** for demonstration.

### Placeholder Location

`backend/utils/mockClassifier.js` contains:

```javascript
// TODO: Load and run .h5 TensorFlow model here
```

### Integration Steps

1. Install TensorFlow

   ```bash
   npm install @tensorflow/tfjs @tensorflow/tfjs-node
   ```

2. Update `mockClassifier.js`:

   ```javascript
   const tf = require('@tensorflow/tfjs');

   async loadModel(modelPath) {
     this.model = await tf.loadLayersModel(`file://${modelPath}`);
   }

   async classifyImage(imageBase64) {
     // Preprocess and classify
     // Return results
   }
   ```

3. Place `.h5` model in `backend/models/`

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "test123",
    "confirmPassword": "test123"
  }'
```

## 🔧 Troubleshooting

### MongoDB Connection Error

```
Solution:
- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify connection string
```

### Frontend Cannot Connect

```
Solution:
- Update API_BASE_URL with backend IP
- Check firewall settings
- Verify backend is running
```

### Image Upload Fails

```
Solution:
- Grant app permissions
- Check image size
- Verify base64 encoding
```

## 📋 Test Credentials

**Admin Account**

- Username: `admin`
- Password: `admin123`

**User Account**

- Create via signup screen

⚠️ Change admin password in production!

## 🔐 Security Notes

- Use strong JWT secret in production
- Enable HTTPS in production
- Configure CORS properly
- Implement rate limiting
- Hash passwords with bcryptjs
- Validate all inputs

## 📞 Support

For issues and documentation, check:

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [ML_INTEGRATION_GUIDE.md](./ML_INTEGRATION_GUIDE.md)
- [CODE_INDEX.md](./CODE_INDEX.md)

## 📄 License

MIT License

---

**Version**: 1.0.0  
**Last Updated**: January 2, 2026

- Secure user registration and login
- JWT-based authentication
- 7-day token expiration
- Persistent login with AsyncStorage

#### 📱 Home Screen

- Welcome message with user name
- App overview and instructions
- Quick access to upload functionality
- Scientific accuracy information

#### 📸 Image Upload

- Camera capture integration
- Gallery selection
- Image preview
- Real-time classification
- Image quality requirements guide

#### 📊 Classification Results

- Diatom class name with confidence score
- Visual confidence indicator
- Expandable information sections:
  - Scientific Overview
  - Environmental Significance
  - Impacts & Indicators
- Record ID for tracking

#### 📋 Classification History

- Complete history of all classifications
- Sorted by date (newest first)
- Confidence scores displayed
- Tap to view full details
- Refresh functionality

#### 👤 User Profile

- User information display
- Account details
- App information
- Feature list
- Logout functionality

### Admin Features

#### 📊 Dashboard Statistics

- Total users count
- Total classifications count
- Total diatom classes
- Most detected diatom classes
- Real-time data updates

#### 🧬 Diatom Class Management

- View all diatom classes
- Add new diatom classes
- Edit existing classes
- Delete classes
- Manage class information:
  - Class name
  - Scientific description
  - Environmental significance
  - Impacts & indicators

#### 📈 Classification Logs

- View all user classifications
- User information
- Predicted class
- Confidence scores
- Timestamps
- Pagination support

## 🛠️ Tech Stack

### Frontend

- **Framework**: React Native 0.71.8
- **Build Tool**: Expo 48.0.0
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Icons**: React Native Vector Icons

### Backend

- **Runtime**: Node.js 16+
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 9.1.1
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **Middleware**: CORS, body-parser

### ML/AI

- **Framework**: TensorFlow/Keras (`.h5` model)
- **Integration**: TensorFlow.js (planned)
- **Current**: Mock classifier for testing

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Expo CLI: `npm install -g expo-cli`

### 5-Minute Setup

```bash
# 1. Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed
npm run dev

# 2. Frontend Setup (new terminal)
cd frontend
npm install
npm start

# 3. Open app
# Scan QR code with Expo Go or press i/a for simulator
```

**Default Credentials:**

- User: `test@example.com` / `password123`
- Admin: `admin` / `admin123`

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

## 📁 Project Structure

```
BioLens/
├── frontend/                          # React Native Expo App
│   ├── components/
│   │   └── Auth/
│   │       ├── LoginScreen.tsx        # User login
│   │       └── SignupScreen.tsx       # User registration
│   ├── screens/
│   │   ├── HomeScreen.tsx             # Home & overview
│   │   ├── UploadScreen.tsx           # Image upload
│   │   ├── ResultScreen.tsx           # Classification results
│   │   ├── HistoryScreen.tsx          # Classification history
│   │   ├── ProfileScreen.tsx          # User profile
│   │   └── AdminPanel.tsx             # Admin dashboard
│   ├── navigation/
│   │   ├── AuthNavigator.tsx          # Auth flow
│   │   └── AppNavigator.tsx           # Main app navigation
│   ├── App.tsx                        # Root component
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                           # Express.js Server
│   ├── models/
│   │   ├── User.js                    # User schema
│   │   ├── Admin.js                   # Admin schema
│   │   ├── DiatomClass.js             # Diatom class schema
│   │   └── ClassificationRecord.js    # Classification record schema
│   ├── routes/
│   │   ├── auth.js                    # Auth endpoints
│   │   ├── admin.js                   # Admin endpoints
│   │   └── classification.js          # Classification endpoints
│   ├── middleware/
│   │   └── authMiddleware.js          # Auth verification
│   ├── utils/
│   │   └── mockClassifier.js          # Mock ML classifier
│   ├── app.js                         # Express app setup
│   ├── server.js                      # Server entry point
│   ├── seed.js                        # Database seeding
│   ├── package.json
│   └── .env.example
│
├── QUICK_START.md                     # 5-minute setup guide
├── SETUP_GUIDE.md                     # Detailed setup
├── API_DOCUMENTATION.md               # API reference
└── README.md                          # This file
```

## 🏗️ Architecture

### Frontend Architecture

```
App.tsx (Root)
├── AuthNavigator (Unauthenticated)
│   ├── LoginScreen
│   └── SignupScreen
└── AppNavigator (Authenticated)
    ├── Home (Stack)
    ├── Upload (Stack)
    │   ├── UploadScreen
    │   └── ResultScreen
    ├── History
    ├── Profile
    └── Admin
```

### Backend Architecture

```
Express Server
├── Auth Routes
│   ├── POST /signup
│   ├── POST /login
│   └── GET /profile
├── Classification Routes
│   ├── POST /classify
│   ├── GET /history
│   └── GET /classes/all
└── Admin Routes
    ├── POST /login
    ├── GET /stats
    ���── CRUD /diatom-classes
    └── GET /logs
```

### Database Schema

```
Users
├── name: String
├── email: String (unique)
├── password: String (hashed)
└── createdAt: Date

Admins
├── username: String (unique)
├── password: String (hashed)
└── createdAt: Date

DiatomClasses
├── name: String
├── scientificDescription: String
├── environmentalSignificance: String
└── impacts: String

ClassificationRecords
├── userId: ObjectId (ref: User)
├── imageUrl: String
├── predictedClass: String
├── confidence: Number
└── createdAt: Date
```

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

- `POST /auth/signup` - Create user account
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Classification Endpoints

- `POST /classification/classify` - Classify image
- `GET /classification/history` - Get classification history
- `GET /classification/:recordId` - Get specific record
- `GET /classification/classes/all` - Get all diatom classes

### Admin Endpoints

- `POST /admin/login` - Admin login
- `GET /admin/stats` - Get statistics
- `GET /admin/logs` - Get classification logs
- `POST /admin/diatom-classes` - Create diatom class
- `GET /admin/diatom-classes` - Get all classes
- `PUT /admin/diatom-classes/:id` - Update class
- `DELETE /admin/diatom-classes/:id` - Delete class

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

## 🛡️ Admin Dashboard

### Features

- **Statistics Dashboard**: Real-time metrics
- **Diatom Class Management**: CRUD operations
- **Classification Logs**: View all user classifications
- **User Analytics**: Track usage patterns

### Admin Login

```
Username: admin
Password: admin123
```

## 🤖 ML Integration

### Current State

- Mock classifier for testing
- Returns random diatom classes
- Simulated confidence scores (0.7 - 0.99)

### Integration Steps

1. **Prepare Model**

   ```bash
   # Convert Keras .h5 to TensorFlow.js
   tensorflowjs_converter --input_format keras model.h5 ./model_web
   ```

2. **Update Mock Classifier** (`backend/utils/mockClassifier.js`)

   ```javascript
   async loadModel(modelPath) {
     this.model = await tf.loadLayersModel(modelPath);
   }

   async classifyImage(imageTensor) {
     const predictions = this.model.predict(imageTensor);
     // Extract class and confidence
   }
   ```

3. **Update Classification Route**
   - Load model on startup
   - Preprocess image
   - Run inference
   - Return predictions

## 🎨 Design System

### Color Palette

| Color           | Hex       | Usage                 |
| --------------- | --------- | --------------------- |
| Primary Green   | `#2d5a3d` | Main actions, headers |
| Secondary Green | `#4a7c5e` | Secondary actions     |
| Accent Tan      | `#d4a574` | Highlights, warnings  |
| Background      | `#f8f9fa` | Main background       |
| Text Dark       | `#1a1a1a` | Primary text          |
| Border          | `#e0e0e0` | Dividers              |

### Typography

- **Headers**: 24-28px, Bold (700)
- **Titles**: 16-18px, Semi-bold (600)
- **Body**: 14px, Regular (400)
- **Small**: 12-13px, Regular (400)

## 🔐 Security

### Authentication

- JWT tokens with 7-day expiration
- Passwords hashed with bcrypt (10 salt rounds)
- Token stored in AsyncStorage
- Automatic logout on token expiration

### API Security

- CORS enabled for frontend
- Admin routes protected with token verification
- Input validation on all endpoints
- Error messages don't leak sensitive info

### Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/biolens
JWT_SECRET=your-super-secret-key
FRONTEND_URL=http://localhost:3000
```

## 📊 Sample Data

### Pre-loaded Diatom Classes

1. **Navicula** - Boat-shaped, freshwater indicator
2. **Nitzschia** - Sigmoid shape, pollution tolerant
3. **Gomphonema** - Wedge-shaped, clean water indicator
4. **Cymbella** - Helmet-shaped, sensitive to pollution
5. **Amphora** - Vase-shaped, moderate pollution tolerance
6. **Pinnularia** - Linear shape, acidic water indicator
7. **Fragilaria** - Chain-forming, seasonal indicator
8. **Achnanthes** - Small, asymmetrical, clean water indicator

## 🧪 Testing

### Test Accounts

```
User Email: test@example.com
User Password: password123

Admin Username: admin
Admin Password: admin123
```

### Test Workflow

1. Create account or login
2. Upload image from gallery
3. View classification results
4. Check classification history
5. Access admin dashboard
6. Manage diatom classes

## 📈 Performance

### Optimization

- Image compression before upload
- Lazy loading of screens
- Efficient database queries
- Pagination for logs
- Caching of user data

### Scalability

- Modular route structure
- Reusable components
- Database indexing ready
- API versioning ready
- Horizontal scaling support

## 🚀 Deployment

### Backend Deployment (Heroku)

```bash
# Create Heroku app
heroku create biolens-backend

# Set environment variables
heroku config:set MONGO_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>

# Deploy
git push heroku main
```

### Frontend Deployment (Expo)

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

## 🐛 Troubleshooting

### Backend Issues

- **Port 5000 in use**: `lsof -i :5000` and kill process
- **MongoDB connection**: Check `MONGO_URI` in `.env`
- **Seed failed**: Ensure MongoDB is running

### Frontend Issues

- **Can't connect to backend**: Update API_URL in screens
- **Image upload fails**: Grant camera/gallery permissions
- **Blank screen**: Check console for errors

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

## 📚 Documentation

- [QUICK_START.md](./QUICK_START.md) - 5-minute setup
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **BioLens Team** - Initial development

## 🙏 Acknowledgments

- React Native and Expo communities
- MongoDB documentation
- TensorFlow team
- Environmental science researchers

## 📞 Support

For issues, questions, or suggestions:

1. Check existing documentation
2. Review troubleshooting section
3. Create an issue in the repository
4. Contact the development team

---

## 🎯 Roadmap

### v1.1.0 (Planned)

- [ ] Real ML model integration
- [ ] Batch classification
- [ ] Export reports
- [ ] Data visualization

### v1.2.0 (Planned)

- [ ] Offline mode
- [ ] Multi-language support
- [ ] Advanced filtering
- [ ] User analytics

### v2.0.0 (Future)

- [ ] Web dashboard
- [ ] API rate limiting
- [ ] Advanced admin features
- [ ] Mobile app store release

---

**BioLens** - Advancing environmental science through intelligent diatom analysis. 🔬

Made with ❤️ for researchers and environmental professionals.
#   B i o - L e n s  
 #   B i o L e n s  
 