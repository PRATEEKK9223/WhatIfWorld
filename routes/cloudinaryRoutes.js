import express from 'express';
const router= express.Router();
import cloudinary from "../cloudinaryConfig.js";
import multer from 'multer';
import Result from "../Models/result.js";
import { v2 as cloudinaryV2 } from 'cloudinary';
const upload = multer({ storage: multer.memoryStorage()});



router.post('/upload-chart', upload.fields([{ name: 'barChart' }, { name: 'pieChart' }]), async (req, res) => {
  try {
    const bar = req.files['barChart'][0];
    const pie = req.files['pieChart'][0];

    const uploadToCloudinary = (fileBuffer, fileName) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinaryV2.uploader.upload_stream(
          { folder: 'WhatIfWorld-Charts', public_id: fileName, resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(fileBuffer); // ✅ send the image data
      });
    };

    const [barUpload, pieUpload] = await Promise.all([
      uploadToCloudinary(bar.buffer, 'barChart'),
      uploadToCloudinary(pie.buffer, 'pieChart')
    ]);

    // ✅ Read resultId from the incoming form fields and validate
    const resultId = req.body && req.body.resultId;
    if (!resultId) {
      console.error('upload-chart: missing resultId in request body');
      return res.status(400).json({ error: 'Missing resultId' });
    }

    // Update the same document with image URLs
    await Result.findByIdAndUpdate(resultId, {
      $set: {
        chartImages: {
          barChart: barUpload.secure_url,
          pieChart: pieUpload.secure_url
        }
      }
    });

    res.json({
      message: 'Charts uploaded successfully!',
      barChartUrl: barUpload.secure_url,
      pieChartUrl: pieUpload.secure_url
    });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});


export default router;