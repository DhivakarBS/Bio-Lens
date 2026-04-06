# BioLens - Quick Start Guide

Get BioLens up and running in 5 minutes!

## Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account
- Expo CLI: `npm install -g expo-cli`

## 🚀 Quick Start (5 minutes)

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGO_URI=mongodb://localhost:27017/biolens
# JWT_SECRET=your-secret-key

# Seed database with initial data
npm run seed

# Start backend server
npm run dev
```

✅ Backend running on `http://localhost:5000`

### Step 2: Frontend Setup (2 minutes)

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Expo development server
npm start
```

✅ Expo running - scan QR code with Expo Go app or press `i`/`a` for simulator

### Step 3: Test the App (1 minute)

**Create Test Account:**
1. Open app and tap "Register"
2. Enter: 
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Tap "Create Account"

**Test Classification:**
1. Tap "Upload" tab
2. Select "Choose from Gallery" or "Take Photo"
3. Tap "Classify Image"
4. View results with confidence score

**Test Admin Dashboard:**
1. Tap "Admin" tab
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. View statistics and manage diatom classes

---

## 📁 Project Structure

```
BioLens/
├── backend/          # Express.js server
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── utils/        # Helper functions
│   ├── app.js        # Express app
│   ├── server.js     # Server entry point
│   ├── seed.js       # Database seeding
│   └── package.json
│
├── frontend/         # React Native app
│   ├── components/   # Reusable components
│   ├── screens/      # App screens
│   ├── navigation/   # Navigation setup
│   ├── App.tsx       # Main app component
│   └── package.json
│
├── SETUP_GUIDE.md    # Detailed setup
├── API_DOCUMENTATION.md  # API reference
└── README.md         # Project overview
```

---

## 🔑 Default Credentials

### User Account
```
Email: test@example.com
Password: password123
```

### Admin Account
```
Username: admin
Password: admin123
```

---

## 🎯 Key Features to Try

### 1. User Authentication
- Sign up with email
- Login with credentials
- JWT token stored locally
- Auto-login on app restart

### 2. Image Classification
- Upload from camera or gallery
- View classification results
- See confidence scores
- Expandable information cards

### 3. Classification History
- View all previous classifications
- Sorted by date
- Tap to view full details
- Timestamped records

### 4. Admin Dashboard
- View statistics
- Manage diatom classes
- Add new classes
- Delete classes

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

### Classification
- `POST /api/classification/classify` - Classify image
- `GET /api/classification/history` - Get history
- `GET /api/classification/classes/all` - Get all classes

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get statistics
- `POST /api/admin/diatom-classes` - Create class
- `GET /api/admin/diatom-classes` - Get all classes
- `DELETE /api/admin/diatom-classes/:id` - Delete class

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check MongoDB connection
# Ensure MONGO_URI is correct in .env
```

### Frontend won't connect to backend
```bash
# Update API_URL in screens if needed
# Default: http://localhost:5000/api

# On physical device, use your machine's IP:
# http://192.168.x.x:5000/api
```

### Image upload fails
```bash
# Grant permissions:
# iOS: Settings > BioLens > Camera/Photos
# Android: Settings > Apps > BioLens > Permissions
```

### Database seeding failed
```bash
# Ensure MongoDB is running
mongod

# Check connection string in .env
# Try seeding again
npm run seed
```

---

## 📊 Database

### Collections Created
- `users` - User accounts
- `admins` - Admin accounts
- `diatomclasses` - Diatom species data
- `classificationrecords` - Classification history

### Sample Data
8 diatom classes pre-loaded:
- Navicula
- Nitzschia
- Gomphonema
- Cymbella
- Amphora
- Pinnularia
- Fragilaria
- Achnanthes

---

## 🎨 UI/UX

### Color Scheme
- **Primary Green**: `#2d5a3d` - Main actions
- **Secondary Green**: `#4a7c5e` - Secondary actions
- **Background**: `#f8f9fa` - Light background
- **Text**: `#1a1a1a` - Dark text

### Screens
1. **Login/Signup** - Authentication
2. **Home** - Welcome & overview
3. **Upload** - Image selection & classification
4. **Result** - Classification details
5. **History** - Previous classifications
6. **Profile** - User info & logout
7. **Admin** - Dashboard & management

---

## 🚀 Next Steps

### For Development
1. Explore the codebase
2. Modify diatom class data
3. Add more test users
4. Test all features

### For Production
1. Replace mock classifier with real ML model
2. Set up production MongoDB
3. Configure environment variables
4. Enable HTTPS
5. Set up CI/CD pipeline
6. Deploy backend (Heroku, AWS, etc.)
7. Build and deploy mobile app

### For ML Integration
1. Prepare `.h5` Keras model
2. Convert to TensorFlow.js format
3. Update `mockClassifier.js`
4. Test with real images
5. Optimize for mobile

---

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - Complete API reference
- **README.md** - Project overview

---

## 💡 Tips

### Development
- Use `npm run dev` for auto-restart on changes
- Check browser console for frontend errors
- Use Postman for API testing
- Monitor MongoDB with MongoDB Compass

### Testing
- Create multiple test accounts
- Test with different image sizes
- Try admin features
- Check error handling

### Performance
- Images are compressed before upload
- Lazy loading on screens
- Efficient database queries
- Pagination for logs

---

## 🆘 Need Help?

1. Check **SETUP_GUIDE.md** for detailed instructions
2. Review **API_DOCUMENTATION.md** for endpoint details
3. Check terminal output for error messages
4. Verify all prerequisites are installed
5. Ensure MongoDB is running
6. Check network connectivity

---

## ✅ Verification Checklist

- [ ] Node.js 16+ installed
- [ ] MongoDB running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] `.env` file created with correct values
- [ ] Database seeded successfully
- [ ] Backend server running on port 5000
- [ ] Frontend Expo server running
- [ ] Can create user account
- [ ] Can login successfully
- [ ] Can upload and classify image
- [ ] Can view classification history
- [ ] Can access admin dashboard

---

**You're all set! 🎉 Start exploring BioLens!**
