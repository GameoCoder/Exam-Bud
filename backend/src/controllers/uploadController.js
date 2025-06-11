// uploadController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

//TODO :- Fetch File list using cloudinary api
const fetchUploads = asyncHandler(async (req, res, next) => {
  const uploads = await prisma.upload.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true }
  });
  res.json(new ApiResponse(200, uploads, "fetched uploads successfully"));
});

const uploadMaterial = asyncHandler(async (req, res, next) => {
    // Now expecting 'title' and 'url' directly in the request body (JSON payload from frontend)
    const { title, url } = req.body; // Destructure both title and url

    // Validate that both are present
    if (!title || !url) {
      return next(new ApiError(400, "Title and Cloudinary URL are required"));
    }

    // No need for req.file or constructing local file paths anymore

    const upload = await prisma.upload.create({
      data: {
        title,
        url, // Directly use the 'url' received from the frontend (Cloudinary URL)
        subjectId: +req.params.sid,
        userId: req.user.id
      }
    });
    res.status(201).json(new ApiResponse(201, upload, "material uploaded successfully"))
});

const deleteUpload = asyncHandler(async (req, res, next) => {
  // Potentially, if you want to delete from Cloudinary too, you'd add Cloudinary API call here
  // You would need to store Cloudinary's public_id along with the URL in your DB to do this easily.
  const deleted = await prisma.upload.delete({
    where: { id: +req.params.id }
  });
  res.status(200).json(new ApiResponse(200, deleted, "upload deleted successfully"));
});

module.exports = { fetchUploads, uploadMaterial, deleteUpload };