# BioLens ML Model Integration Guide

## Overview

This guide explains how to integrate a real Keras/TensorFlow `.h5` model into BioLens to replace the mock classifier.

## Current Architecture

### Mock Classifier (Current)
```
User uploads image
    ↓
Frontend converts to Base64
    ↓
Backend receives Base64
    ↓
Mock classifier returns random class
    ↓
Results displayed to user
```

### Real Classifier (Target)
```
User uploads image
    ↓
Frontend converts to Base64
    ↓
Backend receives Base64
    ↓
Image preprocessing
    ↓
TensorFlow model inference
    ↓
Extract predictions
    ↓
Results displayed to user
```

## Step 1: Prepare Your Model

### Option A: Convert Keras .h5 to TensorFlow.js

If you have a Keras model and want to run it in Node.js:

```bash
# Install TensorFlow.js converter
pip install tensorflowjs

# Convert .h5 to TensorFlow.js format
tensorflowjs_converter \
  --input_format keras \
  your_model.h5 \
  ./model_web

# This creates:
# - model_web/model.json
# - model_web/weights.bin (or multiple weight files)
```

### Option B: Use TensorFlow Lite for Mobile

For better mobile performance:

```bash
# Convert .h5 to TFLite
python -c "
import tensorflow as tf
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
"
```

### Option C: Use ONNX Format

For cross-platform compatibility:

```bash
# Convert Keras to ONNX
pip install keras2onnx onnx

python -c "
import keras2onnx
import onnx
model = keras.models.load_model('model.h5')
onnx_model = keras2onnx.convert_model(model)
onnx.save_model(onnx_model, 'model.onnx')
"
```

## Step 2: Update Backend Mock Classifier

### File: `backend/utils/mockClassifier.js`

Replace the mock implementation with real model loading:

```javascript
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

const DIATOM_CLASSES = [
  'Navicula',
  'Nitzschia',
  'Gomphonema',
  'Cymbella',
  'Amphora',
  'Pinnularia',
  'Fragilaria',
  'Achnanthes',
];

class DiatomClassifier {
  constructor() {
    this.model = null;
    this.isLoaded = false;
  }

  /**
   * Load the TensorFlow model
   * Call this once on server startup
   */
  async loadModel() {
    try {
      // Option 1: Load from TensorFlow.js format
      const modelPath = 'file://./models/diatom_model/model.json';
      this.model = await tf.loadLayersModel(modelPath);
      
      // Option 2: Load from SavedModel format
      // this.model = await tf.loadSavedModel('./models/diatom_model');
      
      // Option 3: Load from ONNX
      // const onnx = require('onnxjs');
      // this.model = new onnx.InferenceSession({...});
      
      this.isLoaded = true;
      console.log('✓ Diatom classification model loaded successfully');
      return true;
    } catch (error) {
      console.error('✗ Failed to load model:', error.message);
      return false;
    }
  }

  /**
   * Preprocess image for model input
   * Adjust dimensions based on your model's input shape
   */
  async preprocessImage(imageBase64) {
    try {
      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      
      // Decode image
      const imageTensor = tf.node.decodeImage(imageBuffer, 3);
      
      // Resize to model input size (e.g., 224x224)
      const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
      
      // Normalize pixel values (0-1 or -1 to 1 depending on model)
      const normalized = resized.div(tf.scalar(255.0));
      
      // Add batch dimension
      const batched = normalized.expandDims(0);
      
      // Clean up intermediate tensors
      imageTensor.dispose();
      resized.dispose();
      normalized.dispose();
      
      return batched;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw error;
    }
  }

  /**
   * Classify a diatom image
   */
  async classify(imageBase64) {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded. Call loadModel() first.');
    }

    let imageTensor = null;
    try {
      // Preprocess image
      imageTensor = await this.preprocessImage(imageBase64);
      
      // Run inference
      const predictions = this.model.predict(imageTensor);
      
      // Get predictions as array
      const predictionsArray = await predictions.data();
      
      // Find class with highest confidence
      let maxConfidence = 0;
      let classIndex = 0;
      
      for (let i = 0; i < predictionsArray.length; i++) {
        if (predictionsArray[i] > maxConfidence) {
          maxConfidence = predictionsArray[i];
          classIndex = i;
        }
      }
      
      // Get class name
      const className = DIATOM_CLASSES[classIndex] || 'Unknown';
      
      // Clean up tensors
      predictions.dispose();
      
      return {
        className,
        confidence: parseFloat(maxConfidence.toFixed(4)),
        allPredictions: Array.from(predictionsArray).map((conf, idx) => ({
          class: DIATOM_CLASSES[idx],
          confidence: parseFloat(conf.toFixed(4)),
        })),
      };
    } catch (error) {
      console.error('Classification error:', error);
      throw error;
    } finally {
      // Clean up tensor
      if (imageTensor) {
        imageTensor.dispose();
      }
    }
  }

  /**
   * Batch classify multiple images
   */
  async classifyBatch(imageBase64Array) {
    const results = [];
    for (const imageBase64 of imageBase64Array) {
      try {
        const result = await this.classify(imageBase64);
        results.push({ success: true, ...result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }
    return results;
  }

  /**
   * Get model information
   */
  getModelInfo() {
    if (!this.model) {
      return null;
    }
    return {
      inputShape: this.model.inputs[0].shape,
      outputShape: this.model.outputs[0].shape,
      layers: this.model.layers.length,
      parameters: this.model.countParams(),
    };
  }
}

// Export singleton instance
module.exports = new DiatomClassifier();
```

### Install TensorFlow.js

```bash
cd backend
npm install @tensorflow/tfjs @tensorflow/tfjs-node
```

## Step 3: Update Backend Server Startup

### File: `backend/server.js`

Load the model on server startup:

```javascript
const app = require('./app');
const classifier = require('./utils/mockClassifier');

const PORT = process.env.PORT || 5000;

// Load ML model on startup
async function startServer() {
  try {
    // Load the diatom classification model
    const modelLoaded = await classifier.loadModel();
    
    if (!modelLoaded) {
      console.warn('⚠️  Warning: Model failed to load. Using mock classifier.');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      if (modelLoaded) {
        const info = classifier.getModelInfo();
        console.log(`✓ Model info:`, info);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

## Step 4: Update Classification Route

### File: `backend/routes/classification.js`

Update to use real classifier:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const ClassificationRecord = require('../models/ClassificationRecord');
const DiatomClass = require('../models/DiatomClass');
const classifier = require('../utils/mockClassifier');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// Upload and classify image
router.post('/classify', verifyToken, async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ message: 'Image data is required' });
  }

  try {
    // Use real classifier instead of mock
    const classification = await classifier.classify(imageBase64);

    // Fetch diatom class details from database
    const diatomClass = await DiatomClass.findOne({ 
      name: classification.className 
    });

    // Create classification record
    const record = new ClassificationRecord({
      userId: req.userId,
      imageUrl: `data:image/jpeg;base64,${imageBase64.substring(0, 100)}...`,
      predictedClass: classification.className,
      confidence: classification.confidence,
    });

    await record.save();

    res.json({
      success: true,
      classification: {
        className: classification.className,
        confidence: classification.confidence,
        description: diatomClass?.scientificDescription || 'No description available',
        environmentalSignificance: diatomClass?.environmentalSignificance || 'No data available',
        impacts: diatomClass?.impacts || 'No data available',
        recordId: record._id,
        allPredictions: classification.allPredictions, // Include all predictions
      },
    });
  } catch (err) {
    console.error('Classification error:', err);
    res.status(500).json({ 
      message: 'Classification error', 
      error: err.message 
    });
  }
});

// ... rest of routes
module.exports = router;
```

## Step 5: Model File Organization

Create a models directory structure:

```
backend/
├── models/
│   ├── diatom_model/
│   │   ├── model.json
│   │   ├── weights.bin
│   │   └── weights.bin.1
│   └── README.md
├── utils/
│   └── mockClassifier.js
└── ...
```

### File: `backend/models/README.md`

```markdown
# Diatom Classification Models

## Model Information

- **Name**: Diatom Species Classifier
- **Format**: TensorFlow.js
- **Input Shape**: [1, 224, 224, 3]
- **Output Shape**: [1, 8]
- **Classes**: 8 diatom species
- **Accuracy**: XX%

## Model Files

- `model.json` - Model architecture
- `weights.bin` - Model weights

## Training Data

- Dataset: [Your dataset name]
- Training samples: [Number]
- Validation accuracy: [Percentage]

## Usage

The model is automatically loaded on server startup.
See `backend/utils/mockClassifier.js` for implementation.
```

## Step 6: Environment Configuration

### File: `.env`

Add model path configuration:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/biolens
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
MODEL_PATH=./models/diatom_model/model.json
MODEL_TYPE=tfjs  # Options: tfjs, tflite, onnx
```

## Step 7: Error Handling

Add fallback to mock classifier if model fails:

```javascript
// In classification route
let classification;
try {
  classification = await classifier.classify(imageBase64);
} catch (error) {
  console.error('Real classifier failed:', error);
  // Fallback to mock classifier
  classification = mockClassifier.classify(imageBase64);
}
```

## Step 8: Testing

### Test with Real Model

```bash
# Start server
npm run dev

# Test classification endpoint
curl -X POST http://localhost:5000/api/classification/classify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "<base64_image>"
  }'
```

### Performance Testing

```javascript
// Measure inference time
const startTime = Date.now();
const result = await classifier.classify(imageBase64);
const inferenceTime = Date.now() - startTime;
console.log(`Inference time: ${inferenceTime}ms`);
```

## Step 9: Optimization

### Model Quantization

Reduce model size for faster inference:

```bash
# Quantize model
tensorflowjs_converter \
  --input_format keras \
  --quantization_bytes 1 \
  your_model.h5 \
  ./model_web_quantized
```

### Batch Processing

For multiple images:

```javascript
const results = await classifier.classifyBatch([
  imageBase64_1,
  imageBase64_2,
  imageBase64_3,
]);
```

## Step 10: Monitoring

Add logging for model performance:

```javascript
// Log classification metrics
const metrics = {
  timestamp: new Date(),
  className: classification.className,
  confidence: classification.confidence,
  inferenceTime: inferenceTime,
  userId: req.userId,
};

console.log('Classification metrics:', metrics);
// Store in database for analytics
```

## Troubleshooting

### Model Loading Issues

```javascript
// Check if model files exist
const fs = require('fs');
const modelPath = './models/diatom_model/model.json';
if (!fs.existsSync(modelPath)) {
  console.error('Model file not found:', modelPath);
}
```

### Memory Issues

```javascript
// Dispose tensors properly
imageTensor.dispose();
predictions.dispose();

// Monitor memory usage
console.log('Memory usage:', tf.memory());
```

### Inference Errors

```javascript
// Validate input shape
const expectedShape = [1, 224, 224, 3];
if (imageTensor.shape !== expectedShape) {
  console.error('Input shape mismatch');
}
```

## Performance Benchmarks

### Expected Performance

| Metric | Value |
|--------|-------|
| Model Size | ~50-100 MB |
| Inference Time | 100-500 ms |
| Memory Usage | 200-500 MB |
| Accuracy | 85-95% |

## Next Steps

1. Prepare your trained model
2. Convert to appropriate format
3. Place in `backend/models/` directory
4. Update `mockClassifier.js`
5. Test with real images
6. Monitor performance
7. Optimize if needed
8. Deploy to production

## Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [TensorFlow Lite Guide](https://www.tensorflow.org/lite)
- [Model Conversion Guide](https://www.tensorflow.org/js/guide/conversion)
- [Performance Optimization](https://www.tensorflow.org/lite/performance)

---

**Ready to integrate your model! 🚀**
