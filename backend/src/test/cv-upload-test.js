/**
 * Test script for CV upload functionality
 * 
 * This script tests the uploadToS3CV function in imageUpload.js
 * to ensure that files are correctly uploaded to user-specific folders
 */

const { uploadToS3CV } = require('../middlewares/imageUpload');

// Mock file object
const mockFile = {
  originalname: 'resume.pdf',
  buffer: Buffer.from('test content'),
  mimetype: 'application/pdf'
};

// Test function
async function testCvUpload() {
  try {
    console.log('Testing CV upload with user ID...');
    
    // Test with userId = 123
    const fileInfo = await uploadToS3CV(mockFile, 123);
    
    console.log('Upload result:', fileInfo);
    
    // Verify the path contains the user ID
    if (fileInfo.key.includes('/cv/123/')) {
      console.log('SUCCESS: File uploaded to user-specific folder');
    } else {
      console.error('ERROR: File not uploaded to user-specific folder');
    }
    
    return fileInfo;
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testCvUpload();
